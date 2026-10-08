# Check-in 2 – Flatmate.io – speaker notes (DRAFT 1)

Target: 5 min max. Demo ~4:00, workflow ~1:00. Speak from bullets, short sentences.
Note: the UI is in German. Say it once at the start.

---

## PART 1 – DEMO (≈ 4:00)

### 0:00–0:25  Who is it for
- Flat-shares (WGs) that pick a new flatmate. Today: WhatsApp chaos, gut feeling, one loud voice wins.
- Flatmate.io: every resident votes, the ranking is fair and explainable.
- (UI is German – I will explain what you see.)

### 0:25–1:10  Entry: login page → join link  [private window]
- Login page: Household or Resident. Household sets up everything; I'm a new resident.
- Audience: bigger households (5+), living projects.
- Prepared join link: my name is already there, I only set a password. Email optional (later: reset password).
- Land on Start: "5 applications waiting for your vote."
- Needs the BOUND join link (Robin's profile in the seed), not the reusable one. Check it is unused.

### 1:10–2:20  Key interaction: screening pass  [Casting → screening]
- One card per applicant. Four ratings: definitely / good / rather not / no.
- Rate fast, don't read the cards. Say while clicking: "everyone does this alone, nobody sees the others' votes".
- Product decision #1: the ranking is hidden until YOU voted. Why: participation is the biggest risk, so the reveal is the reward.

### 2:20–3:20  Value moment: the ranking  [scoreboard]
- Scoreboard appears. Top rows = as many as there are open rooms (2).
- Open "(?)": how the score is calculated, what MY vote counted for, how many votes are needed. Product decision #2: explainable, no hidden formula (P-3).
- Ahmed unscored: too few votes. One "definitely" would show 100 % = misleading. Household sets the threshold.
- Moderator step: make myself moderator (prepare how beforehand!), reload → "invite" button → copy-ready text.
- Optional: add application via Organization (free text; auto-parsing is next).
- Roadmap: scheduling with timetable link, text parsing.

### 3:20–3:45  Other perspective (only if time) [optional]
- Second window, signed in as Alex (moderator): sees "Einladen", rooms, rounds. Plain residents don't.
- Roles = stored permission sets, not role names.

### 3:45–4:00  NOT in this MVP
- Scheduling of visits, notifications, round 2 / veto / move-in.
- Candidate detail page: next slice, in progress.
- Never: AI deciding about people (P-5). AI may only structure text.

---

## PART 2 – WORKFLOW (≈ 1:00)

Pick 3 points, no more:

1. **How:** Spec first, then vertical slices.
   - ~3 weeks of requirements, compliance, guardrails before code (Aug 24 – Sep 15).
   - Then slice by slice with OpenSpec: propose → pre-mortem → apply → review → PR → archive.
   - Claude Code: Opus plans, Sonnet subagents implement. Copilot + code review on every PR.
2. **What worked surprisingly well:** mechanical gates.
   - `npm run verify` before every push: lint, types, 9 own guardrail lints, tests. Tests > source code (~32k vs ~20k lines).
   - Gates caught what I and the AI missed (permissions, data isolation).
3. **Where I lost time / what I'd change:**
   - Process before product: ~146k words of docs, 531 commits, more docs commits than feature commits. Next time: one thin slice demoable in week 1.
   - Review fixes: I fixed the one bug reviewers found, not the whole class. One PR needed 5 rounds. Later fix: `implementation-hazards.md`, loaded by the AI every session. Should have started it on day 1.
   - Frozen specs: I marked old specs (PRD, SRD...) as legacy and wrote newer files on top. The AI still used the old ones as reference, even when newer decisions contradicted them. It tried compromises → rigid, lots of back and forth, decisions tied to what I knew least. Next time: rewrite the specs in place, history lives in git.
   - (Backup, if asked) DB strategy on day 1: separate dev DB, local CI DB. Shared test DB + no foreign keys cost many days.

Closing line: "Rigour was cheap with AI. Scope discipline was the hard part."

---

## FACTS (check before quoting)
- 531 commits, 2026-08-24 → 10-06 (~6 weeks, one author); first code 09-16. 55 merged PRs (PR numbers go up to #59). ~124 fix commits, ~63 feat/refactor, ~162 docs/spec.
- src ≈ 19.8k lines, tests ≈ 32.2k lines; 217 test files / ~1,400 test cases (counts differ by method, say "over 1,000"); 24 archived OpenSpec changes; 35 SQL migrations.
- Docs: ~146k words in docs/ alone (~560k words incl. openspec/).
- Rough time split (estimate from commit subjects): ~10% pre-code spec, ~40% implementation, ~30–35% review/fix rounds, ~10% tooling/process.
- Near-restart on 09-18: wanted to delete src/; measured first: a 3-min script (2m12s Git Bash overhead) → 0.9 s in TS. Kept the code.
- Shared prod/dev DB early on left ~15k append-only audit rows → split dev/prod.

## DEMO PREP CHECKLIST (from exploration)
- `npm run seed:demo` is NOT re-runnable; a re-run needs cleanup SQL (scripts/cleanup-demo-household.sql in Supabase editor). `seed:demo-round` re-creates only the round.
- Password is random per run → save the seed output (links + password) or set DEMO_PASSWORD.
- Reusable join link: 5 uses, 7 days. Every rehearsal burns one. Make a spare from /members as Alex.
- New resident = 5th voter, quorum becomes 3. Seed is built so scores still show. Check Sam still has unrated cards.
- Use a private window (signed-in session refuses join). Second window as Alex ready.
- Seed targets hosted flatmate-io-dev → expect latency, check the project isn't paused.
- Do NOT demo candidate detail (not built on this branch).
- Fallback: screenshots of every step + one window already on the scoreboard.
- Plain resident cannot see capture/invite/rounds → show via Alex or say it.

## TIMING TIPS
- Screening is the time risk: six cards, rate in ~60 s.
- If behind: skip the Alex window.
- Practice 2–3 times aloud in English; ~130 words/min means the workflow part is only ~120 words.
