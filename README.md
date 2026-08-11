# DigitaleLeute AI Software Engineer Bootcamp

This repository gathers files created and used during the **DigitaleLeute AI Software Engineer Bootcamp**. It serves as a central workspace for product ideas, project specifications, Claude Skills, course tasks, and a personal daily log of the bootcamp journey.

## Repository Structure

```
├── Claude-Skills/   # Custom Claude Skills (requirement writer, teach mode)
├── Ideas/           # Product outlines and project specifications
├── Log/             # Daily learning log
└── Tasks/           # Bootcamp exercises and assignments
```

## Claude Skills

The `Claude-Skills/` folder contains custom Claude Skills developed during the bootcamp. Each skill lives in its own subfolder with a `SKILL.md` definition.

- **[requirement-writer](Claude-Skills/requirement-writer/)** — Guides users through structured requirements gathering via interactive dialogue to generate Problem Framing, SRD, and PRD documents in a progressive chain: *Problem Framing (Why do this?) → SRD (What direction?) → PRD (How exactly?)*
- **[teach](Claude-Skills/teach/)** — Activate a Socratic teaching loop that diagnoses the learner's understanding, explains via *Why → What → How → What-If*, verifies understanding through active recall, and confirms the learner can apply the concept to a new case.

## Ideas

The `Ideas/` folder contains product outlines gathered throughout the bootcamp. Each project lives in its own subfolder, where the specific outlines are **iteratively created, improved, and specified** for later implementation.

A typical project folder contains documents such as:

- **Problem Framing** — the problem statement, target users, scope, risks, and regulatory environment
- **PRD (Product Requirements Document)** — product requirements, user flows, acceptance criteria, and non-functional requirements
- **SRD (Software Requirements Document)** — customer analysis, job-to-be-done, solution scope, phasing, and success metrics
- **Additional notes** — name ideas, research, and other supporting material

### Current Ideas

| Project | Description | Documents |
|---------|-------------|-----------|
| [DoctorCrawler](Ideas/DoctorCrawler/) | Non-profit middleware platform to simplify finding and contacting specialist doctors (Fachärzte) in Germany | Problem Framing, PRD, SRD |
| [Notella](Ideas/Notella/) | Domain-agnostic note-taking engine for collaborative groups — converts session notes into a persistent, shared knowledge graph. Evolved from the original TableTop-WorldBuilder concept (see its `Legacy (TableTop-Worldbuilder)/` subfolder); now includes a working, modular HTML/JS mockup | Problem Framing, PRD, SRD, Screen Inventory, Mockup |

## Tasks

The `Tasks/` folder contains exercises and assignments completed during the bootcamp. Each topic lives in its own subfolder, containing the original code snippets, optimized versions, and detailed write-ups explaining the optimizations.

Currently includes:

- **Engineering Foundations I — Principles, Patterns & Practices** — code optimization exercises, including original and optimized code snippets, test files, and documentation of the optimization reasoning.

## Log

The `Log/` folder contains a daily log of the bootcamp journey. Each day is logged in a separate file named like `Day 5 - 05.08.2026.md`.

Each entry follows a consistent structure:

- **Reflection on the last day** — what was accomplished, what was learned
- **Goals for today** — a checklist of what should be achieved today
- **Difficulties / Blockers** — challenges, open questions, and obstacles
- **Additional TODOs and Notes** — extra tasks, links, and anything else worth remembering