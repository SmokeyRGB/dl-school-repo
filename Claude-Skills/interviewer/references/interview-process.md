# Interview Process

Combines the IREB CPRE Handbook's elicitation-interview procedure with
Kvale's craft guidance on staging and scripting.

## Roles (IREB)

A real interview has three roles; in this chat, Claude is interviewer *and*
note-taker (avoid actually splitting attention between them the way a human
would — the point of the warning in the source is about a *human* switching
cognitive modes, not relevant to an LLM, but the note-taking obligation is:
capture information faithfully, not just impressionistically).

- **Interviewer**: prepares and conducts the interview, processes the results.
- **Interviewee**: the user, expressing their requirements/knowledge by
  answering.
- **Note-taker**: filters and records what's relevant. Needs to know the
  elicitation objective and guide well enough to judge what matters.

## Preparation (IREB, adapted for a chat-based interview)

1. **Define the elicitation objective(s).** What do we actually need to learn
   from this interview? Default objective for a product idea/topic: the real
   problem, who has it, current workarounds, desired outcome, scope
   boundaries, and how success would be recognized. State the objective in
   one line and let the user adjust it before starting.
2. **Read the context first.** If given a repo, product outline, or existing
   docs, skim them briefly (README, existing requirement docs) to avoid
   asking questions already answered on paper — but don't over-invest; the
   interview is for what isn't written down yet.
3. **Prepare an interview guide** — an internal topic list with a rough order
   and a kickoff question. It does not need exact wording for every question
   (only the qualitative interview needs looseness here); think through
   phrasing for the opener and any structuring transitions.
4. **Decide the register.** Confirm whether the objective needs mostly
   qualitative depth (open questions, the default) or includes something that
   needs quantitative confirmation (closed questions, used sparingly).

## Staging (Kvale)

- **Briefing**: one short paragraph before the first real question — state
  the purpose, roughly how many topics/how long, and invite the user to ask
  anything before starting. This is also where you set expectations for the
  chat medium: one question per turn.
- The first exchanges matter most for rapport — open with something concrete
  and low-pressure, not abstract.
- **Debriefing**: ask if there's anything else to add before closing. People
  sometimes surface their most useful information right after they think the
  interview is "over" — leave room for that rather than closing abruptly.
- After debriefing, summarize what was captured and ask the interviewee to
  confirm or correct it — mirrors sending interview notes back for review.

## Conducting

- **One question per turn.** Never stack multiple questions in one message —
  in a chat medium this is worse than in person, because there's no
  nonverbal cue for which one to answer.
- Lead with introductory (open) questions; use follow-up/probing/specifying
  to deepen; hold direct questions until the interviewee has given their own
  framing (see `question-taxonomy.md`).
- **Structure visibly.** When a topic is exhausted, say so and name the next
  one, rather than silently jumping ("That's clear on the chores side — next
  I want to ask about how you'd split costs.").
- **Be critical, not just receptive.** If something the user says is
  inconsistent with an earlier statement, name the inconsistency and ask
  about it rather than letting it slide.
- **Track satisfiers, dissatisfiers, and delighters** as you go: conscious
  stated wants (satisfiers) are the easiest to elicit via direct questions;
  dissatisfiers and delighters usually surface through observation of
  reaction and follow-up on emotionally loaded language, not through asking
  for them directly.
- Funnel-shaped interviewing (narrowing from general to specific, revealing
  the real focus late) is a legitimate technique but raises an informed-consent
  question — for this skill, default to being upfront about the interview's
  purpose rather than concealing it.

## Result processing

- Close with a structured summary organized by topic, preserving the
  interviewee's own phrasing where it carries meaning, and explicitly listing
  open threads or gaps rather than papering over them.
- Offer to hand the notes to the `requirement-writer` skill as the seed for a
  Problem Framing doc, if the user wants to take this further.

## Source

Adapted from `Tasks/User Centricity & Product Discovery/Conducting an
Interview.md` (IREB CPRE Requirements Elicitation Handbook, §3.1.1.1) and
`Tasks/User Centricity & Product Discovery/Interview-Extract-Notes.md`
(condensed notes on Steinar Kvale, *Doing Interviews*, SAGE 2007, ch. 5).
