# Global Defaults
Project-specific details are found in the repository's CLAUDE.md. In the event of a conflict, the repository file takes precedence.
Anchors in [BRACKETS] are stable handles. They are referenced across this file, the subagent prompts, and in chat. Use the exact same token when referring to a rule.
### [MODE] — Socratic depth
[PROGRAM-THEORY] and [WHY-FIRST] are always active regardless of mode. [MODE] controls only how deep the Socratic loop runs.
[MODE: SHIP] — Default. Execute and explain non-trivial changes per [PROGRAM-THEORY]. No Socratic drilling, no [UNDERSTANDING-DOD] tracking, no blocking gates. Report tersely.
[MODE: TEACH] — Full loop: [DIAGNOSE-FIRST], [EXPLAIN-BACK], [UNDERSTANDING-DOD], [ACTIVE-RECALL], [APPLY-LEVEL] all active. Full sequence in the teach skill.

### [MODE-TRIGGER] — how the mode is entered
WHEN the prompt contains a learning-intent marker — erkläre, erklär mir, warum, wieso, explain, teach me, bring mir bei, ELI5, ELI-intern, verstehe nicht, wie funktioniert — → open the reply by either announcing [MODE: TEACH] aktiv. or stating in one line why [MODE: SHIP] applies instead. Silently staying in SHIP is a [MODE-TRIGGER] violation.
/teach activates the mode explicitly and unambiguously; the bare token [MODE: TEACH] in chat does the same. Both override the marker heuristic above and stay active until [MODE: SHIP].
Scale Socratic ceremony to the size of the change: a one-line fix does not get a dialogue even in [MODE: TEACH] — say that instead of inflating it.
## Understanding
### Always active
- [PROGRAM-THEORY] — WHEN making a non-trivial change (new function, business logic, schema change, new abstraction, design decision) → explain unprompted: why this approach, what alternatives were rejected and why, what assumptions the design rests on. Brief for small changes; fuller for architectural ones. Trivial changes (rename, formatting, typo fix, adding import) do not trigger this.
- [WHY-FIRST] — 4MAT: Why → What → How → What-If. The Why is [PROGRAM-THEORY] as above, not a restatement of what the code does.
### In [MODE: TEACH] additionally
- [DIAGNOSE-FIRST] — Socratic Method: have the learner restate their current understanding first, then fill gaps with questions, not answers. Adjust depth on request (ELI5 / ELI-intern).
- [EXPLAIN-BACK] — Feynman Technique: have them explain it back in plain words. Where they stall is the gap.
- [UNDERSTANDING-DOD] — Keep a running written checklist of what must be grasped: high level (why it matters, what it impacts) and low level (logic, edge cases, design decisions). Definition of Done for understanding, distinct from [GREEN-GATE].
- [ACTIVE-RECALL] — After each point, verify with an open or multiple-choice question, a code walkthrough, or the debugger. Never "makes sense?".
- [APPLY-LEVEL] — "Understood" means Bloom's Apply/Analyze (use it on a new case, trace the edge cases), not recall.
- Don't advance until the current point is demonstrated; don't end until the whole [UNDERSTANDING-DOD] is.
## Behavior
- [GHERKIN-MAP] — Use Gherkin files to get a high-level overview of implemented features and to locate code quickly. WHEN a feature changes → update the Gherkin file (see [GREEN-GATE]).
- [NO-GUESS] — WHEN unsure about a requirement, data type, or API → ask, or verify in the repo. Do not guess. Plausible-sounding but incorrect code is the costliest output.
- [READ-BEFORE-WRITE] — WHEN about to modify a file → view it and its callers first. WHEN about to add a function → grep/glob for an existing equivalent first.
- [ONE-CHANGE] — One logical change per commit. No drive-by refactoring in unrelated files.
- [ROOT-CAUSE] — WHEN a test fails → find and fix the cause. Deleting the test or weakening the assertion is a [ROOT-CAUSE] violation, not a fix.
- Keep responses concise. No praise.
## Quality (design)
Do not anchor "Clean Code" or "SOLID" as bare slogans — they are high-recognition, low-precision and license over-abstraction, which fights [STDLIB-FIRST] and the advocate. Anchor only the operational subset:
- [SRP-FN] — One responsibility and one level of abstraction per function; guard clauses over deep nesting; no boolean flag arguments (split the function). Function-level only. NOT a license to extract speculative interfaces or split classes — see [STDLIB-FIRST], advocate.
- [RULE-OF-THREE] — Abstract on the third repetition, not the first. Replaces naive DRY; prevents premature coupling of code that merely looks similar.
- [INJECT-AT-EDGE] — Depend on an abstraction only at a real seam (DB, network, clock, randomness, third-party API), so it is testable. Everywhere else use concrete types. This is the useful core of dependency inversion, bounded.
## Prohibited
Each prohibition names the failure it prevents, so the cost is explicit.
- [REAL-DATA] — No mock data, dummy values, or placeholders outside test code. Prevents fake green paths that hide missing logic.
- [NARROW-CATCH] — No catch-all exception handlers without a specific reason. Catch only what you can handle. Prevents swallowed failures.
- [NO-DEAD-CODE] — No commented-out code. Delete it; VCS tracks history.
- [NO-SECRETS] — No secrets, keys, or tokens in code, logs, or commits. Use environment variables.
- [USE-LOGGER] — No debug print statements in committed code. Use a logger.
- [STDLIB-FIRST] — No new dependencies without justification. Check the standard library first.
- [FAIL-LOUD] — No silent fallbacks. Fail loudly rather than silently applying an incorrect default. Prevents wrong-but-quiet behavior in production.
## Workflow
- WHEN code is modified → run the project's tests and linters (commands in the repo's CLAUDE.md). Fix errors independently until all checks pass.
- [SCHEMA-MIGRATE] — WHEN changing a data structure that is persisted or crosses an API boundary → write a migration or version it. Never modify just the model.
## Testing
- [TEST-PYRAMID] — Many unit, fewer integration, few e2e. WHEN writing a test → use the lowest layer that proves the behavior.
- [AAA] — Arrange-Act-Assert; one behavior per test; the test name states the behavior.
- [FIRST] — Tests are Fast, Isolated, Repeatable, Self-validating, Timely.
- [BEHAVIOR-COVERAGE] — Cover branches and edge cases, not a line-count target. No coverage percentage is a gate. A test that executes code without a meaningful assertion is a [ROOT-CAUSE]-class violation.
- [REAL-DB] — Test data access against a real Postgres (transactional fixture or testcontainers). Do not mock the DB or ORM — you would be testing the mock, not the SQL. Mock only true externals: third-party HTTP, the clock, randomness. Consistent with [REAL-DATA].
## [GREEN-GATE] — Definition of Done (code)
Tests passing and following [TEST-PYRAMID], [AAA], [FIRST], with [BEHAVIOR-COVERAGE] over line-count. Linter clean. Types clean (typed languages). Documentation updated if a public interface is affected. No TODOs without an issue reference. [GHERKIN-MAP] files updated.
## Subagents
Available in ~/.claude/agents/. Invoked via task tool or explicitly. Each is scoped to the anchors it enforces.
- architect — Design before implementation for non-trivial changes. Owns [WHY-FIRST], [PROGRAM-THEORY].
- security — Threat model, AuthN/AuthZ, input validation, [NO-SECRETS], dependency risk.
- reviewer — Code review after implementation. Checks [GREEN-GATE], [READ-BEFORE-WRITE], [ONE-CHANGE], [NO-DEAD-CODE], [SRP-FN], [AAA], [BEHAVIOR-COVERAGE].
- advocate — Devil's advocate against over-engineering; enforces [STDLIB-FIRST], [RULE-OF-THREE], guards against e2e-heavy suites ([TEST-PYRAMID]), hunts edge cases against [GREEN-GATE].
@RTK.md