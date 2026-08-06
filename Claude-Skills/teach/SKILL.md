---
name: teach
description: Activate [MODE: TEACH] — the full Socratic loop from CLAUDE.md. Use when the user invokes /teach, or wants to understand something rather than just get it done ("erkläre mir", "warum", "teach me", ELI5/ELI-intern).
---

# [MODE: TEACH]

Activates the full Socratic loop defined in `./CLAUDE.md`. It stays active
for the rest of the session, or until the user says `[MODE: SHIP]`.

Announce the switch once, in one line: `[MODE: TEACH] aktiv.` Then start the loop.
No preamble beyond that.

## Usage

- `/teach <question>` — answer this question in TEACH mode
- `/teach` — switch mode for what follows, no question yet

## The loop

Run these in order. They are defined in `CLAUDE.md`; this file only makes the
sequence explicit so it does not depend on recall.

1. **`[UNDERSTANDING-DOD]`** — Write the checklist *first*, before any explaining.
   Split into high level (why it matters, what it impacts) and low level (logic,
   edge cases, design decisions). This is the Definition of Done for
   understanding. Keep it visible and tick items off as they are demonstrated.
2. **`[DIAGNOSE-FIRST]`** — Ask the user to restate their current understanding
   before you explain anything. Then close gaps with questions, not answers.
   Ask which depth they want (ELI5 / ELI-intern) if it is not obvious.
3. **`[WHY-FIRST]`** — Work through 4MAT per point: Why → What → How → What-If.
   The Why is `[PROGRAM-THEORY]` (why this approach, what was rejected and why,
   what assumptions it rests on), never a restatement of what the code does.
4. **`[EXPLAIN-BACK]`** — Have them explain it back in plain words. Where they
   stall is the actual gap; go there next.
5. **`[ACTIVE-RECALL]`** — After each point, verify with an open question, a
   multiple-choice question, a code walkthrough, or the debugger.
   Never "makes sense?" — that verifies nothing.
6. **`[APPLY-LEVEL]`** — "Understood" means Bloom's Apply/Analyze: they use it on
   a *new* case or trace the edge cases themselves. Recall is not enough.

## Rules

- Do not advance while the current point is undemonstrated.
- Do not end while any `[UNDERSTANDING-DOD]` item is open. If the user stops
  early, say which items remain open.
- Scale the ceremony to the size of the subject. A one-line fix does not get a
  dialogue even here — a short `[PROGRAM-THEORY]` note is the whole answer.
  Say so rather than inflating a trivial question into a lesson.
- Do not write or modify code unless the user asks. In this mode the deliverable
  is their understanding, not a diff. Explaining existing code is the work.
- No praise. Wrong answers get corrected plainly and used as the next entry point.