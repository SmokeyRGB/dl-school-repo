/**
 * Snippet_B_Optimized.js
 * ------------------------------------------------------------------
 * Clean Code refactoring of Snippet_B.js
 *
 * Key improvements:
 *   1. Single Responsibility Principle  - each class/method does one thing
 *   2. Dependency Injection             - db, ai, slack, logger injected
 *   3. AI-specific failure handling     - timeout, retry w/ backoff, output validation
 *   4. Idempotency                      - safe retries without duplicates
 *   5. Graceful degradation             - fallback when AI is unavailable
 *   6. Partial-failure isolation        - Slack failure doesn't lose the summary
 *   7. Typed errors                     - catchable, descriptive failures
 *   8. No magic strings/numbers         - constants for channel, retry, timeout
 *   9. Observability                    - structured logging at every stage
 *  10. Prompt versioning                - template is a named, testable constant
 * ------------------------------------------------------------------
 */

// ------------------------------------------------------------------
// 1. Configuration & Constants
// ------------------------------------------------------------------
const SLACK_CHANNEL = "#support";

const AI_CONFIG = Object.freeze({
  TIMEOUT_MS: 10_000,
  MAX_RETRIES: 3,
  BASE_BACKOFF_MS: 500,
  MAX_BACKOFF_MS: 4_000,
});

const SUMMARY_LIMITS = Object.freeze({
  MIN_LENGTH: 10,
  MAX_LENGTH: 2_000,
});

const PROMPT_TEMPLATE = Object.freeze({
  VERSION: "v1",
  build: (message, customerTier) =>
    `Summarize this ticket:\n\n${message}\nCustomer tier: ${customerTier}`,
});

// ------------------------------------------------------------------
// 2. Typed Errors
// ------------------------------------------------------------------
class TicketNotFoundError extends Error {
  constructor(ticketId) {
    super(`Ticket not found: ${ticketId}`);
    this.name = "TicketNotFoundError";
  }
}

class AiUnavailableError extends Error {
  constructor(cause) {
    super(`AI service unavailable after ${AI_CONFIG.MAX_RETRIES} attempts: ${cause.message}`);
    this.name = "AiUnavailableError";
    this.cause = cause;
  }
}

class AiInvalidOutputError extends Error {
  constructor(reason) {
    super(`AI returned invalid output: ${reason}`);
    this.name = "AiInvalidOutputError";
  }
}

class NotificationError extends Error {
  constructor(channel, cause) {
    super(`Failed to post notification to ${channel}: ${cause.message}`);
    this.name = "NotificationError";
    this.cause = cause;
  }
}

// ------------------------------------------------------------------
// 3. Repositories (Dependency Inversion)
// ------------------------------------------------------------------
class TicketRepository {
  constructor(db) {
    this.db = db;
  }

  async findById(ticketId) {
    const ticket = await this.db.tickets.findById(ticketId);
    if (!ticket) {
      throw new TicketNotFoundError(ticketId);
    }
    return ticket;
  }
}

class SummaryRepository {
  constructor(db) {
    this.db = db;
  }

  async exists(ticketId) {
    const existing = await this.db.summaries.findOne({ ticketId });
    return Boolean(existing);
  }

  async save({ ticketId, summary, source }) {
    await this.db.summaries.insert({
      ticketId,
      summary,
      source, // "ai" | "fallback"
      createdAt: new Date(),
    });
  }
}

// ------------------------------------------------------------------
// 4. AI Service — timeout, retry with backoff, output validation
// ------------------------------------------------------------------
class AiSummaryService {
  constructor(aiClient, logger = console) {
    this.aiClient = aiClient;
    this.logger = logger;
  }

  /**
   * Generates a summary with bounded retries and exponential backoff.
   * Returns null if AI is unavailable after all attempts (caller decides fallback).
   */
  async generateSummary(prompt) {
    let lastError;

    for (let attempt = 1; attempt <= AI_CONFIG.MAX_RETRIES; attempt++) {
      try {
        const summary = await this._callWithTimeout(prompt);
        this._validateOutput(summary);
        return summary;
      } catch (error) {
        lastError = error;
        this.logger.warn(`AI attempt ${attempt}/${AI_CONFIG.MAX_RETRIES} failed`, {
          error: error.message,
        });

        if (attempt < AI_CONFIG.MAX_RETRIES) {
          await this._backoff(attempt);
        }
      }
    }

    throw new AiUnavailableError(lastError);
  }

  async _callWithTimeout(prompt) {
    return Promise.race([
      this.aiClient.generateText(prompt),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`AI call timed out after ${AI_CONFIG.TIMEOUT_MS}ms`)),
          AI_CONFIG.TIMEOUT_MS
        )
      ),
    ]);
  }

  _validateOutput(summary) {
    if (!summary || typeof summary !== "string") {
      throw new AiInvalidOutputError("summary is empty or not a string");
    }
    if (summary.trim().length < SUMMARY_LIMITS.MIN_LENGTH) {
      throw new AiInvalidOutputError(
        `summary too short (${summary.trim().length} chars, min ${SUMMARY_LIMITS.MIN_LENGTH})`
      );
    }
    if (summary.length > SUMMARY_LIMITS.MAX_LENGTH) {
      throw new AiInvalidOutputError(
        `summary too long (${summary.length} chars, max ${SUMMARY_LIMITS.MAX_LENGTH})`
      );
    }
  }

  async _backoff(attempt) {
    const delay = Math.min(
      AI_CONFIG.BASE_BACKOFF_MS * 2 ** (attempt - 1),
      AI_CONFIG.MAX_BACKOFF_MS
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

// ------------------------------------------------------------------
// 5. Fallback Strategy — graceful degradation when AI is down
// ------------------------------------------------------------------
class FallbackSummaryProvider {
  /**
   * Produces a degraded summary from the raw ticket message.
   * Clearly marked as fallback so consumers know it's not AI-generated.
   */
  generateFallback(ticket) {
    const raw = ticket.message.trim();
    const truncated =
      raw.length > SUMMARY_LIMITS.MAX_LENGTH
        ? `${raw.slice(0, SUMMARY_LIMITS.MAX_LENGTH)}…`
        : raw;
    return truncated;
  }
}

// ------------------------------------------------------------------
// 6. Notification Service — isolated failure handling
// ------------------------------------------------------------------
class NotificationService {
  constructor(slackClient, logger = console) {
    this.slackClient = slackClient;
    this.logger = logger;
  }

  /**
   * Posts to Slack. On failure, logs and rethrows a typed error.
   * The caller decides whether a Slack failure should fail the whole pipeline.
   */
  async postSummary(summary) {
    try {
      await this.slackClient.postMessage(SLACK_CHANNEL, summary);
    } catch (error) {
      this.logger.error("Slack notification failed", { channel: SLACK_CHANNEL, error: error.message });
      throw new NotificationError(SLACK_CHANNEL, error);
    }
  }
}

// ------------------------------------------------------------------
// 7. Orchestrator — coordinates the pipeline with idempotency & isolation
// ------------------------------------------------------------------
class TicketSummaryOrchestrator {
  constructor({
    ticketRepository,
    summaryRepository,
    aiSummaryService,
    fallbackSummaryProvider,
    notificationService,
    logger = console,
  }) {
    this.ticketRepository = ticketRepository;
    this.summaryRepository = summaryRepository;
    this.aiSummaryService = aiSummaryService;
    this.fallbackSummaryProvider = fallbackSummaryProvider;
    this.notificationService = notificationService;
    this.logger = logger;
  }

  async getTicketSummary(ticketId) {
    // 1. Idempotency guard — if a summary already exists, return it (no duplicates).
    if (await this.summaryRepository.exists(ticketId)) {
      this.logger.info("Summary already exists, skipping pipeline", { ticketId });
      const existing = await this.summaryRepository.db.summaries.findOne({ ticketId });
      return existing.summary;
    }

    // 2. Fetch ticket (throws TicketNotFoundError if missing).
    const ticket = await this.ticketRepository.findById(ticketId);

    // 3. Build prompt (versioned template).
    const prompt = PROMPT_TEMPLATE.build(ticket.message, ticket.customerTier);

    // 4. Try AI with retries; fall back to degraded mode if AI is unavailable.
    let summary;
    let source = "ai";

    try {
      summary = await this.aiSummaryService.generateSummary(prompt);
    } catch (error) {
      if (error instanceof AiUnavailableError) {
        this.logger.warn("AI unavailable, using fallback summary", { ticketId });
        summary = this.fallbackSummaryProvider.generateFallback(ticket);
        source = "fallback";
      } else {
        throw error; // Invalid output is a real bug — don't mask it.
      }
    }

    // 5. Persist summary (idempotent — guarded above).
    await this.summaryRepository.save({ ticketId, summary, source });

    // 6. Notify Slack — isolated: a Slack failure logs loudly but doesn't
    //    lose the persisted summary. Caller can decide to retry notification later.
    try {
      await this.notificationService.postSummary(summary);
    } catch (error) {
      this.logger.error("Pipeline completed but notification failed", {
        ticketId,
        error: error.message,
      });
      // Re-throw so the caller knows the notification didn't go out,
      // but the summary IS persisted — no data loss.
      throw error;
    }

    this.logger.info("Ticket summary pipeline completed", { ticketId, source });
    return summary;
  }
}

// ------------------------------------------------------------------
// 8. Example usage — composition root
// ------------------------------------------------------------------
// const db = {
//   tickets: { findById: async (id) => ({ message: "...", customerTier: "gold" }) },
//   summaries: {
//     findOne: async ({ ticketId }) => null,
//     insert: async (doc) => { /* ... */ },
//   },
// };
// const aiClient = { generateText: async (prompt) => "..." };
// const slackClient = { postMessage: async (channel, text) => { /* ... */ } };
//
// const orchestrator = new TicketSummaryOrchestrator({
//   ticketRepository: new TicketRepository(db),
//   summaryRepository: new SummaryRepository(db),
//   aiSummaryService: new AiSummaryService(aiClient),
//   fallbackSummaryProvider: new FallbackSummaryProvider(),
//   notificationService: new NotificationService(slackClient),
//   logger: console,
// });
//
// const summary = await orchestrator.getTicketSummary("ticket-123");

// ------------------------------------------------------------------
// 9. Export for testing / module usage
// ------------------------------------------------------------------
module.exports = {
  TicketSummaryOrchestrator,
  TicketRepository,
  SummaryRepository,
  AiSummaryService,
  FallbackSummaryProvider,
  NotificationService,
  TicketNotFoundError,
  AiUnavailableError,
  AiInvalidOutputError,
  NotificationError,
  PROMPT_TEMPLATE,
  AI_CONFIG,
  SUMMARY_LIMITS,
  SLACK_CHANNEL,
};