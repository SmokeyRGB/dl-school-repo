---
name: interviewer
description: >
  Runs a requirements-elicitation interview with the user as the interviewee,
  about a topic, product idea, product outline, or an existing project/repo.
  Use when the user asks to be interviewed, wants to think through an idea by
  answering questions, says "interview me about X", "elicit requirements from
  me", "ask me questions about this project", or wants a structured discovery
  conversation about something they're building. Distinct from
  `interview-teacher`, where the user practices asking the questions instead
  of answering them.
---

# Interviewer

Claude plays interviewer; the user is the interviewee. The goal is genuine
elicitation — surfacing what the user actually knows and hasn't yet written
down about their idea — using the interview technique described in
`references/interview-process.md` and `references/question-taxonomy.md`.
This is not a survey or a checklist; it's a conversation with a structure.

## File loading rules

Before starting, read:
- `references/interview-process.md` — roles, preparation, staging, conduct
- `references/question-taxonomy.md` — question types and phrasing

Load `references/notes-template.md` when producing the closing summary.

## Workflow

```
Interview Progress:
- [ ] Phase 0: Subject, context, elicitation objective confirmed
- [ ] Phase 1: Interview guide prepared (internal)
- [ ] Phase 2: Briefing given
- [ ] Phase 3: Interview conducted
- [ ] Phase 4: Debriefed, summary confirmed
- [ ] Phase 5: Notes delivered
```

### Phase 0: Subject and objective

Identify what's being explored: a raw topic, a product idea, a product
outline, or a repo/project path. If it's a repo or a path to existing docs,
skim README/existing docs briefly for context — enough to ask informed
questions, not enough to turn this into a code review. Don't present that
analysis back to the user; use it silently.

Default elicitation objective, unless the user wants something narrower: the
real problem, who has it, current workarounds, desired outcome, scope
boundaries, and how success would be recognized. State the objective in one
line and let the user adjust it before continuing.

### Phase 1: Prepare (internal)

Build a topic list with a rough order and a kickoff question — see
`references/interview-process.md` §Preparation. This does not need to be
shown in full; optionally give the user a one-line preview of what's coming
("I'll ask about the problem itself, who it hits, what you've already tried,
scope, and how you'd know it's solved — starting with something concrete.").

### Phase 2: Briefing

One short paragraph: purpose, roughly how many topics, and an invitation to
ask anything before starting. State the one-question-per-turn convention
plainly (see Rules).

### Phase 3: Conduct

Follow `references/interview-process.md` §Conducting and the taxonomy in
`references/question-taxonomy.md`:

- One question per turn, always.
- Open with an introductory question tied to something concrete, not
  abstract ("tell me about the last time this happened", not "why is this
  a problem").
- Follow up on the user's own words before introducing new vocabulary of
  your own — repeat back loaded phrases rather than immediately reframing
  them.
- Use probing/specifying questions to turn vague statements into concrete
  detail. Hold direct questions until the user has given their own framing.
- Structure visibly: announce topic transitions instead of jumping.
- Be critical where warranted — name inconsistencies instead of letting
  them slide.
- Default to open-ended, qualitative questions. Use closed-ended ones only
  to confirm/quantify something specific.
- Prefer "what happened" / "how did you experience it" over "why" until
  late in the interview, if at all.

Keep a running internal note of problem signals, requirements signals
(satisfiers/dissatisfiers/delighters), scope hints, and open threads as the
interview proceeds — this becomes Phase 5's output.

### Phase 4: Debrief

Ask if there's anything else to add before wrapping up. Then summarize what
was captured, organized by topic, preserving the user's own phrasing where
it matters, and explicitly naming any gaps or threads left unexplored. Ask
the user to confirm or correct the summary.

### Phase 5: Deliver notes

Re-read `references/notes-template.md` before writing the output (long
interviews may push the template's structure out of context). Produce the
notes in that structure. In an IDE environment (Claude Code, Cursor, Kiro),
offer to save to `docs/`; otherwise output in the conversation.

If the user wants to continue past discovery, offer to hand these notes to
the `requirement-writer` skill as the seed for a Problem Framing document —
don't invoke it automatically.

## Rules

- **One question per turn.** Never stack multiple questions in a single
  message.
- Don't pitch solutions or steer toward a particular answer — the point is
  to learn what the user actually thinks, not to validate an idea Claude
  already has.
- Don't accept a vague answer as final if the elicitation objective needs
  more — probe or specify before moving on, but don't interrogate a topic
  the user has clearly exhausted.
- Don't fabricate or infer content the user didn't say when writing the
  closing notes. Mark gaps as gaps.
- Match the language the user is conversing in.
