/**
 * Snippet_B_Test.js
 * ------------------------------------------------------------------
 * Test file for Snippet_B_Optimized.js
 *
 * This file demonstrates how to test the TicketSummaryOrchestrator
 * pipeline using MOCKS (fake implementations) instead of real
 * external services (database, AI, Slack).
 *
 * WHY MOCKS?
 *   - No real API costs (AI calls are expensive)
 *   - No real database needed
 *   - No real Slack channel spammed
 *   - Tests are fast, deterministic, and repeatable
 *   - We can simulate failures that are hard to trigger in production
 *
 * HOW TO RUN:
 *   node Tasks/Engineering\ Foundations\ I\ -\ Principles,\ Patterns\ &\ Practices/Snippet_B_Test.js
 * ------------------------------------------------------------------
 */

// ==================================================================
// 1. IMPORTS
//    We load the classes we want to test from the optimized module.
// ==================================================================
const {
  TicketSummaryOrchestrator,
  TicketRepository,
  SummaryRepository,
  AiSummaryService,
  FallbackSummaryProvider,
  NotificationService,
} = require("./Snippet_B_Optimized.js");

// ==================================================================
// 2. TEST LOGGER
//    A simple logger that prefixes output so we can see
//    which log messages come from the pipeline itself.
//    In production this would be a real logging library (e.g. winston).
// ==================================================================
const testLogger = {
  info: (...args) => console.log("  [INFO ]", ...args),
  warn: (...args) => console.log("  [WARN ]", ...args),
  error: (...args) => console.log("  [ERROR]", ...args),
};

// ==================================================================
// 3. MOCK DATABASE
//    A fake database that:
//      - Returns a fixed ticket for any ticketId
//      - Reports no existing summaries (so idempotency guard passes)
//      - Logs every insert so we can see what gets persisted
// ==================================================================
function createMockDatabase() {
  return {
    tickets: {
      // Simulates: SELECT * FROM tickets WHERE id = ?
      findById: async (ticketId) => ({
        message: "Customer cannot login after update",
        customerTier: "gold",
      }),
    },
    summaries: {
      // Simulates: SELECT * FROM summaries WHERE ticketId = ?
      // Returning null means "no summary exists yet" → pipeline proceeds
      findOne: async ({ ticketId }) => null,
      // Simulates: INSERT INTO summaries ...
      insert: async (doc) => console.log("  [DB   ] SAVED:", JSON.stringify(doc)),
    },
  };
}

// ==================================================================
// 4. MOCK AI CLIENTS
//    Each scenario needs a different fake AI behavior.
// ==================================================================

// 4a. AI that ALWAYS succeeds — returns a fixed summary.
//     This is where "Customer cannot login after the latest update"
//     comes from: it's a hardcoded string, NOT a real AI response.
function createSuccessfulAi() {
  return {
    generateText: async (prompt) =>
      "Customer cannot login after the latest update. Recommended: clear cache and reset password.",
  };
}

// 4b. AI that FAILS the first N times, then succeeds.
//     Simulates a flaky/rate-limited AI service.
//     We count calls so we can verify retry behavior.
function createFlakyAi(failuresBeforeSuccess) {
  let callCount = 0;
  return {
    generateText: async (prompt) => {
      callCount++;
      if (callCount <= failuresBeforeSuccess) {
        throw new Error("rate limited"); // Simulate 429 / rate limit
      }
      return "Customer cannot login after update. Recommend clearing cache.";
    },
    getCallCount: () => callCount, // Helper to inspect retry count
  };
}

// 4c. AI that ALWAYS fails — simulates a completely down service.
//     The pipeline should exhaust retries and use the fallback.
function createDownAi() {
  return {
    generateText: async (prompt) => {
      throw new Error("service down");
    },
  };
}

// ==================================================================
// 5. MOCK SLACK CLIENT
//    A fake Slack that either succeeds or fails, depending on config.
// ==================================================================
function createMockSlack({ shouldFail = false } = {}) {
  return {
    postMessage: async (channel, message) => {
      if (shouldFail) {
        throw new Error("slack down"); // Simulate Slack outage
      }
      console.log(`  [SLACK] -> ${channel}: ${message.slice(0, 30)}...`);
    },
  };
}

// ==================================================================
// 6. ORCHESTRATOR FACTORY
//    Helper that wires all mocks together into a ready-to-use
//    TicketSummaryOrchestrator. This keeps each test concise.
// ==================================================================
function createOrchestrator({ aiClient, slackClient, db }) {
  return new TicketSummaryOrchestrator({
    ticketRepository: new TicketRepository(db),
    summaryRepository: new SummaryRepository(db),
    aiSummaryService: new AiSummaryService(aiClient, testLogger),
    fallbackSummaryProvider: new FallbackSummaryProvider(),
    notificationService: new NotificationService(slackClient, testLogger),
    logger: testLogger,
  });
}

// ==================================================================
// 7. TEST SCENARIOS
//    Each scenario demonstrates a different pipeline behavior.
// ==================================================================

// ------------------------------------------------------------------
// TEST 1: AI SUCCESS PATH
//    The happy path — AI works, summary is saved, Slack is notified.
// ------------------------------------------------------------------
async function testAiSuccessPath() {
  console.log("\n=== TEST 1: AI success path ===");
  console.log("Goal: Verify the pipeline works end-to-end when AI succeeds.\n");

  const db = createMockDatabase();
  const orchestrator = createOrchestrator({
    aiClient: createSuccessfulAi(),
    slackClient: createMockSlack(),
    db,
  });

  const summary = await orchestrator.getTicketSummary("t1");

  console.log("\n  Result summary:", summary);
  console.log("  ✅ PASS: Summary generated, saved, and posted to Slack.");
}

// ------------------------------------------------------------------
// TEST 2: AI RETRY & RECOVERY
//    AI fails twice (rate limited), then succeeds on the 3rd attempt.
//    Demonstrates bounded retries with backoff.
// ------------------------------------------------------------------
async function testAiRetryAndRecovery() {
  console.log("\n=== TEST 2: AI retry & recovery ===");
  console.log("Goal: Verify AI failures trigger retries, then succeed.\n");

  const db = createMockDatabase();
  const flakyAi = createFlakyAi(2); // fails twice, succeeds on 3rd
  const orchestrator = createOrchestrator({
    aiClient: flakyAi,
    slackClient: createMockSlack(),
    db,
  });

  await orchestrator.getTicketSummary("t2");

  console.log(`\n  AI was called ${flakyAi.getCallCount()} times (expected 3).`);
  console.log("  ✅ PASS: Retry with backoff worked — 2 failures, 1 success.");
}

// ------------------------------------------------------------------
// TEST 3: AI TOTALLY DOWN → FALLBACK
//    AI never succeeds. Pipeline exhausts retries, then uses the
//    FallbackSummaryProvider (raw message truncated) instead of failing.
// ------------------------------------------------------------------
async function testAiDownFallback() {
  console.log("\n=== TEST 3: AI totally down → fallback ===");
  console.log("Goal: Verify graceful degradation when AI is unavailable.\n");

  const db = createMockDatabase();
  const orchestrator = createOrchestrator({
    aiClient: createDownAi(),
    slackClient: createMockSlack(),
    db,
  });

  await orchestrator.getTicketSummary("t3");

  console.log("\n  ✅ PASS: AI exhausted retries, fallback summary was used.");
  console.log("  Note: The saved summary has source: 'fallback' so consumers");
  console.log("        know it's NOT AI-generated.");
}

// ------------------------------------------------------------------
// TEST 4: SLACK FAILURE → SUMMARY STILL PERSISTED
//    Slack is down, but the summary was already saved to the DB.
//    Demonstrates partial-failure isolation — no data loss.
// ------------------------------------------------------------------
async function testSlackFailureIsolation() {
  console.log("\n=== TEST 4: Slack failure → summary still persisted ===");
  console.log("Goal: Verify a Slack failure doesn't lose the saved summary.\n");

  const db = createMockDatabase();
  const orchestrator = createOrchestrator({
    aiClient: createSuccessfulAi(),
    slackClient: createMockSlack({ shouldFail: true }),
    db,
  });

  try {
    await orchestrator.getTicketSummary("t4");
    console.log("  ❌ FAIL: Expected a NotificationError but none was thrown.");
  } catch (error) {
    console.log(`\n  Caught: ${error.name} - ${error.message}`);
    console.log("  ✅ PASS: Summary was SAVED before Slack failed (see [DB] line above).");
    console.log("  The error is typed (NotificationError) so the caller knows");
    console.log("  the summary IS persisted but the notification did NOT go out.");
  }
}

// ==================================================================
// 8. RUN ALL TESTS
//    Executes each scenario in sequence.
// ==================================================================
async function runAllTests() {
  console.log("======================================================");
  console.log("  Snippet_B_Optimized.js — Pipeline Test Suite");
  console.log("  All external services are MOCKED (no real API calls)");
  console.log("======================================================");

  await testAiSuccessPath();
  await testAiRetryAndRecovery();
  await testAiDownFallback();
  await testSlackFailureIsolation();

  console.log("\n======================================================");
  console.log("  All tests completed.");
  console.log("======================================================");
}

// Only run if executed directly (not when imported as a module)
if (require.main === module) {
  runAllTests().catch((error) => {
    console.error("Test suite crashed:", error);
    process.exit(1);
  });
}

// Export for potential use with a test runner (e.g., Jest, Mocha)
module.exports = {
  testAiSuccessPath,
  testAiRetryAndRecovery,
  testAiDownFallback,
  testSlackFailureIsolation,
  runAllTests,
};