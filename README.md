# DigitaleLeute AI Software Engineer Bootcamp

This repository gathers files created and used during the **DigitaleLeute AI Software Engineer Bootcamp**. It serves as a central workspace for product ideas, project specifications, Claude Skills, course tasks, and a personal daily log of the bootcamp journey.

## Repository Structure

```
├── Claude-Skills/   # Custom Claude Skills (requirements, interviewing, teaching, writing)
├── Ideas/           # Product outlines and project specifications
├── Log/             # Daily learning log
└── Tasks/           # Bootcamp exercises and assignments
```

### Branches

Work happens on sprint branches and lands on `main` afterwards, so `main` does not always show the newest state of a project:

| Branch | Holds |
|--------|-------|
| `main` | This README, the log, the tasks, and the ideas that have already landed |
| `dev/flatmate-sprint-v0.1` | The full **Flatmate.io** specification chain and its exercise folders — see the Flatmate.io section below |
| `dev/notella-sprint-v0.3` | Ongoing Notella work (product audit, compliance checklist drafts) |
| `feat/notella-mockup-refactor` | The Notella mockup refactor |

Links to Flatmate.io files in this README therefore point at `dev/flatmate-sprint-v0.1` on GitHub. To browse them locally:

```bash
git switch dev/flatmate-sprint-v0.1
```

## Claude Skills

The `Claude-Skills/` folder contains Claude Skills used during the bootcamp. Each skill lives in its own subfolder with a `SKILL.md` definition, plus `references/` files it loads on demand.

- **[requirement-writer](Claude-Skills/requirement-writer/)** — Guides users through structured requirements gathering via interactive dialogue to generate Problem Framing, SRD, and PRD documents in a progressive chain: *Problem Framing (Why do this?) → SRD (What direction?) → PRD (How exactly?)*
- **[teach](Claude-Skills/teach/)** — Activate a Socratic teaching loop that diagnoses the learner's understanding, explains via *Why → What → How → What-If*, verifies understanding through active recall, and confirms the learner can apply the concept to a new case.
- **[interviewer](Claude-Skills/interviewer/)** — Runs a requirements-elicitation interview with **the user as the interviewee**, about a topic, product idea, or an existing project. For thinking an idea through by answering questions.
- **[interview-teacher](Claude-Skills/interview-teacher/)** — The mirror image of `interviewer`: Claude plays a realistic persona, **the user practices asking the questions**, and afterwards gets structured feedback on their questioning technique.
- **[avoid-ai-writing](Claude-Skills/avoid-ai-writing/)** — External, MIT-licensed skill (not written for this bootcamp) that audits and rewrites text to remove typical AI writing patterns. Supports detect-only, edit-in-place, and voice profiles.

## Ideas

The `Ideas/` folder contains product outlines gathered throughout the bootcamp. Each project lives in its own subfolder, where the specific outlines are **iteratively created, improved, and specified** for later implementation.

A typical project folder contains documents such as:

- **Problem Framing** — the problem statement, target users, scope, risks, and regulatory environment
- **PRD (Product Requirements Document)** — product requirements, user flows, acceptance criteria, and non-functional requirements
- **SRD (Software Requirements Document)** — customer analysis, job-to-be-done, solution scope, phasing, and success metrics
- **Additional notes** — name ideas, research, and other supporting material

### Current Ideas

| Project | Description | Documents | Where |
|---------|-------------|-----------|-------|
| [Flatmate.io](https://github.com/SmokeyRGB/dl-school-repo/tree/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io) | **Current portfolio project.** Web app that pulls the whole process of casting a new flatmate for a shared flat (WG) into one shared workflow — today it is spread across a listing site, a WhatsApp group, Doodle and handwritten notes, which leaves all the coordination with one person and everyone else out of the loop. | Problem Framing, SRD, PRD, Domain Model, ADRs, Compliance Appendix, Screen Inventory, Guardrails, Product Audit, Review Log, Sprint Log, four exercise folders | `dev/flatmate-sprint-v0.1` |
| [DoctorCrawler](Ideas/DoctorCrawler/) | Non-profit middleware platform to simplify finding and contacting specialist doctors (Fachärzte) in Germany | Problem Framing, PRD, SRD | `main` |
| [Notella](Ideas/Notella/) | Domain-agnostic note-taking engine for collaborative groups — converts session notes into a persistent, shared knowledge graph. Evolved from the original TableTop-WorldBuilder concept (see its `Legacy (TableTop-Worldbuilder)/` subfolder) | Problem Framing, PRD, SRD, Screen Inventory, Mockup, Review Log, Spec-Sync Log | `main` (+ two branches) |

### Flatmate.io — what is in the folder

Flatmate.io is the current portfolio project and the largest document set in the repo. Specification documents are written in **German** (deliberately, for the author's own understanding), while identifiers, schema, field and state names are **English**, because the code will be English. Every document carries a status/version banner and a "changed vs. previous version" note in its head.

The numbered chain, in reading order:

| File | What it is |
|------|------------|
| [01-Problem-Framing.md](https://github.com/SmokeyRGB/dl-school-repo/blob/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io/01-Problem-Framing.md) | Problem, users, scope, and the decision table `E-01…E-27` — the decisions taken in the requirements session |
| [02-SRD.md](https://github.com/SmokeyRGB/dl-school-repo/blob/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io/02-SRD.md) | Solution requirements: scope lines `S-*`, design principles, and the version-band phase table (`v0.1`, `v1`, `v1.1`, …) |
| [03-PRD.md](https://github.com/SmokeyRGB/dl-school-repo/blob/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io/03-PRD.md) | Product requirements: screens, permissions matrix, and the scoring/ranking/quorum math |
| [04-Domaenenmodell.md](https://github.com/SmokeyRGB/dl-school-repo/blob/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io/04-Domaenenmodell.md) | Entities, state machines, bounded contexts, visibility invariants. Marked **non-binding and challengeable** on purpose — an entry point for planning, not a final constraint |
| [05-ADRs.md](https://github.com/SmokeyRGB/dl-school-repo/blob/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io/05-ADRs.md) | ADR-001 to ADR-012 (modular monolith, explicit state machine, authorization enforced twice, stack, …). Most still carry the status *proposal — challengeable* |
| [06-Compliance-Anhang.md](https://github.com/SmokeyRGB/dl-school-repo/blob/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io/06-Compliance-Anhang.md) | GDPR, EU AI Act and TDDDG assessment of the casting process. Researched and sourced, but **not legal advice** |
| [07-Screen-Inventar.md](https://github.com/SmokeyRGB/dl-school-repo/blob/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io/07-Screen-Inventar.md) | The UX layer: every screen, closing the design gaps the review log had flagged. The deliverable is the document, not a mockup |
| [GUARDRAILS.md](https://github.com/SmokeyRGB/dl-school-repo/blob/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io/GUARDRAILS.md) | Binding rules for any AI agent that implements this project — applies to every automated or semi-automated code change |

Supporting documents:

- [Product-Audit-Hypotheses.md](https://github.com/SmokeyRGB/dl-school-repo/blob/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io/Product-Audit-Hypotheses.md) — 21 hypotheses the product could fail on (8 desirability, 6 feasibility, 7 viability), each with a four-step test block: *we believe → we will test by → we measure → we are right if*.
- [review-log.md](https://github.com/SmokeyRGB/dl-school-repo/blob/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io/review-log.md) — multi-role cross-review of the chain per round, with findings, gaps, and the lessons learned (including the recurring one: version banners do not update themselves).
- [Session-Sprint-Log.md](https://github.com/SmokeyRGB/dl-school-repo/blob/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io/Session-Sprint-Log.md) — coordination log for the UX sprint: who did what, and what to do differently next time.
- `Quotes/` — screenshots kept as evidence for the problem statement.

Bootcamp exercises applied to this project, each in its own folder:

- **[Exercise 3](https://github.com/SmokeyRGB/dl-school-repo/tree/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io/Exercise%203)** — legal and ethical reality check against specs 01–06: a compliance checklist and an operational risk / cost awareness write-up, each in English and German.
- **[Exercise 4](https://github.com/SmokeyRGB/dl-school-repo/tree/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io/Exercise%204)** — prompt engineering: an implementation prompt that makes the agent read the specs instead of relying on summaries, in a full and a refactored version.
- **[Exercise 8](https://github.com/SmokeyRGB/dl-school-repo/tree/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io/Exercise%208)** — a working-backwards press release for the launch.
- **[Exercise 10](https://github.com/SmokeyRGB/dl-school-repo/tree/dev/flatmate-sprint-v0.1/Ideas/Flatmate.io/Exercise%2010)** — from story map to backlog: a user story map plus its review and correction pass against the German source chain, a Now/Next/Later board, an **MVP backlog** of five features (`F1`–`F5`) cut so one household can run the first half of a casting round end to end, and one AI-ready `requirements.md` per feature (what must be built, not how).

### Notella — what is in the folder

Notella shows the same workflow one step further, from spec to running mockup:

- `01-Problem-Framing.md` … `04-Screen-Inventar.md` — the numbered specification chain.
- `05-Mockup.html` — the original single-file mockup.
- `Notella Mockup/` — the current mockup, refactored into a modular HTML/JS app (`core/`, `components/`, `utils/`, `data/presets/`, `styles/`). See its [ARCHITECTURE.md](Ideas/Notella/Notella%20Mockup/ARCHITECTURE.md) for how the pieces fit together, and `server.py` to serve it locally.
- `review-log.md` — multi-role reviews (product, design, engineering, …) of the specification documents, with findings and gaps per round.
- `spec-sync-log.md` — captures the small product and design decisions that come up *while* building the mockup, so they can be worked back into the PRD/SRD in batches instead of getting lost.
- `openspec/` — spec-driven change workflow used locally; not committed.

## Tasks

The `Tasks/` folder contains exercises and assignments completed during the bootcamp. Each topic lives in its own subfolder, containing the original code snippets, optimized versions, and detailed write-ups explaining the optimizations.

Currently includes:

- **Engineering Foundations I — Principles, Patterns & Practices** — code optimization exercises, including original and optimized code snippets, test files, and documentation of the optimization reasoning.
- **User Centricity & Product Discovery** — study notes on requirements elicitation: an overview of gathering techniques (questioning, observation, collaboration, artifact-based) and condensed notes on conducting an interview, based on Kvale, *Doing Interviews*. These notes are the background for the `interviewer` and `interview-teacher` skills.

Exercises tied to a specific product live with that product instead — see the Flatmate.io exercise folders above.

## Log

The `Log/` folder contains a daily log of the bootcamp journey. Each day is logged in a separate file named like `Day 5 - 05.08.2026.md`.

Each entry follows a consistent structure:

- **Reflection on the last day** — what was accomplished, what was learned
- **Goals for today** — a checklist of what should be achieved today
- **Difficulties / Blockers** — challenges, open questions, and obstacles
- **Additional TODOs and Notes** — extra tasks, links, and anything else worth remembering
