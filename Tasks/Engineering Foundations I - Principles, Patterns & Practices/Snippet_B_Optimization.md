## Snippet_B.js — Clean Code Analysis & Optimized Implementation

**Original file left untouched.** The optimized version is now in `Tasks/Engineering Foundations I - Principles, Patterns & Practices/Snippet_B_Optimized.js`.

### Violations Found in the Original

| # | Clean Code Principle | Issue in Snippet_B.js |
|---|---------------------|----------------------|
| 1 | **Single Responsibility Principle** | `getTicketSummary` fetches, builds prompt, calls AI, persists, and posts to Slack — 5 responsibilities. |
| 2 | **Zero Error Handling** | Any failure (AI down, Slack down, DB error) propagates with no recovery, logging, or partial-state management. |
| 3 | **AI-Specific Failure Modes Ignored** | No timeout, no retry, no output validation, no cost control, no hallucination guardrails. |
| 4 | **No Idempotency** | A retry after partial failure (summary saved, Slack failed) creates duplicate summaries and duplicate Slack posts. |
| 5 | **No Transactionality / Partial-Failure Isolation** | If Slack fails after the summary is saved, the caller has no way to know the summary *was* persisted — data appears lost. |
| 6 | **No Graceful Degradation** | If AI is down, the entire pipeline fails — even though a degraded summary is better than none. |
| 7 | **Magic Strings** | `"#support"` hardcoded. |
| 8 | **Hidden Globals** | `db`, `ai`, `slack` — impossible to unit test or mock. |
| 9 | **No Input Validation** | `ticketId` unchecked; `ticket` could be `null` → unhandled `TypeError`. |
| 10 | **No Observability** | No logging at any stage — failures are invisible. |
| 11 | **Inline Prompt** | Not versioned, not testable, not reusable. |

### What's Special Because AI Is in the Pipeline

AI introduces failure modes that traditional code doesn't have:

1. **Non-determinism** — Retrying an AI call can produce *different* output each time. A naive retry loop can yield inconsistent summaries for the same ticket.
2. **Cost per call** — Unbounded retries rack up API bills. Retries must be **bounded** (here: max 3) with **exponential backoff**.
3. **Latency variance** — AI calls can hang. A **timeout** (here: 10s) prevents the pipeline from blocking forever.
4. **Invalid output** — AI can return empty strings, garbage, or hallucinated content. **Output validation** (min/max length, type check) is mandatory.
5. **Partial failure** — The pipeline has side effects (DB insert, Slack post). If one step fails after another succeeded, you get **orphaned data** or **duplicates**.
6. **Degradation strategy** — When AI is unavailable, a **fallback** (raw message truncated) keeps the pipeline alive, clearly marked with `source: "fallback"` so consumers know it's not AI-generated.

### How the Optimized Version Handles Each

| Concern | Solution |
|---------|----------|
| **AI timeout** | `Promise.race` with a 10s timeout in `AiSummaryService._callWithTimeout` |
| **AI retries** | Bounded loop (max 3) with exponential backoff (500ms → 1s → 2s, capped at 4s) |
| **AI output validation** | `_validateOutput` rejects empty/non-string/too-short/too-long summaries |
| **AI cost control** | `MAX_RETRIES: 3` constant — no unbounded retry loops |
| **Idempotency** | `SummaryRepository.exists(ticketId)` guard at pipeline start — retries return the existing summary instead of duplicating |
| **Partial-failure isolation** | Summary is persisted *before* Slack is called. If Slack fails, the summary is **not lost** — a typed `NotificationError` is thrown so the caller knows, and the error is logged loudly |
| **Graceful degradation** | `AiUnavailableError` triggers `FallbackSummaryProvider` — the raw message (truncated) is saved with `source: "fallback"` |
| **Typed errors** | `TicketNotFoundError`, `AiUnavailableError`, `AiInvalidOutputError`, `NotificationError` — each catchable and descriptive |
| **Dependency injection** | `db`, `ai`, `slack`, `logger` all injected — fully mockable |
| **Prompt versioning** | `PROMPT_TEMPLATE` with `VERSION: "v1"` — testable and auditable |
| **Observability** | Structured logging at every stage: retry warnings, fallback warnings, completion info, failure errors |

### Verification Results (4 scenarios tested)

1. **AI success path** ✅ — Summary saved with `source: "ai"`, posted to Slack, pipeline completed.
2. **AI fails twice, succeeds on 3rd** ✅ — Retry with backoff worked (3 calls, 2 warnings, success).
3. **AI totally down** ✅ — 3 retries exhausted → fallback used, saved with `source: "fallback"`, still posted to Slack.
4. **Slack fails** ✅ — Summary **still persisted** (SAVED appears before the error), typed `NotificationError` thrown, error logged — no data loss.