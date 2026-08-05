# Product Requirements Specification (PRS)

# DnD WorldBuilder
### AI-powered World Management & Consistency Tracker for Tabletop RPGs

---

# Vision

**DnD WorldBuilder** is a web application that enables Dungeon Masters to build, maintain and explore persistent tabletop RPG worlds.

Unlike traditional wiki software, the application is **not** intended to manually document every aspect of a world. Instead, the world continuously grows from actual gameplay.

Players and Dungeon Masters write notes during sessions. After each session, AI extracts structured knowledge from these notes. The Dungeon Master reviews the generated suggestions and approves what becomes permanent world knowledge.

The result is a living, interconnected knowledge graph that grows naturally over multiple campaigns and years of play.

---

# Core Philosophy

> **Write once. Organize forever.**

The user should never have to manually organize large amounts of notes.

Instead:

- write notes naturally
- AI understands the content
- AI proposes structured knowledge
- DM reviews proposals
- world grows automatically

The AI assists the Dungeon Master—it never replaces their decisions.

---

# Problem Statement

Long-running tabletop campaigns generate an enormous amount of information.

Examples include:

- locations
- NPCs
- factions
- items
- historical events
- player actions
- rumors
- relationships
- world lore
- consequences

Today these are typically managed manually using tools like:

- Obsidian
- Notion
- OneNote
- handwritten notes

This causes several problems:

- duplicated information
- forgotten events
- inconsistent lore
- poor discoverability
- manual cross-referencing
- difficult long-term maintenance

There is currently no workflow that automatically converts gameplay into a structured world database.

---

# Goals

The application should:

- manage multiple worlds
- support multiple campaigns per world
- automatically extract knowledge from session notes
- build a persistent world database
- visualize relationships between world entities
- minimize manual organization
- provide fast lookup of historical information

---

# Target Users

## Dungeon Master

Responsible for

- creating worlds
- managing campaigns
- reviewing AI suggestions
- approving persistent knowledge

Only the DM can modify world knowledge.

---

## Player

Responsible for

- writing session notes
- marking possible entities during gameplay
- reviewing their own notes

Players cannot directly modify world knowledge.

Their marked content only becomes world knowledge after DM approval.

---

# Platform Hierarchy

```text
Platform
│
├── Account
│
├── Subscription
│
└── Worlds
      │
      ├── World
      │     │
      │     ├── Lore
      │     ├── NPCs
      │     ├── POIs
      │     ├── Items
      │     ├── Factions
      │     ├── Maps
      │     ├── Timeline
      │     ├── Relationships
      │     │
      │     └── Campaigns
      │             │
      │             ├── Characters
      │             ├── Sessions
      │             ├── Session Notes
      │             └── Campaign Timeline
      │
      └── ...
```

---

# Domain Model

## World

Top-level organizational unit.

Contains persistent information shared across all campaigns.

Examples

- Eldoria
- The Lost Lands

Contains

- lore
- NPCs
- POIs
- factions
- items
- maps
- timeline
- relationships
- campaigns

---

## Campaign

Represents one story taking place inside a world.

Contains

- player characters
- sessions
- campaign notes
- campaign timeline

Campaigns modify the world.

---

## Session

Contains

- date
- participants
- session notes
- AI suggestions

---

## Character

Campaign-specific.

Never exists globally.

---

## NPC

World-level entity.

Can appear in multiple campaigns.

---

## POI

Persistent world location.

---

## Event

Represents historical happenings.

Can originate from sessions.

---

## Lore

Persistent world information.

---

## Relationship

Generic connection between entities.

Examples

- NPC knows NPC
- NPC lives in POI
- Player offended NPC
- Item belongs to NPC
- POI belongs to faction
- Event happened at POI

Relationships should remain generic and extensible.

---

# Core Workflow

## 1. Create World

DM creates a new world.

Only minimal information is required.

Examples

- name
- description
- genre
- optional starting lore

---

## 2. Create Campaign

Campaigns belong to a world.

Example

World

> Eldoria

Campaigns

- Shadows of Falkenstein
- Mines of Kar'Dur
- Dragon Awakening

---

## 3. Play Session

During gameplay

Players and DM write notes.

The editor should be lightweight.

Users may optionally mark text as

- NPC
- POI
- Event
- Lore
- Item
- Relationship

These remain suggestions only.

---

## 4. AI Extraction

After the session AI analyzes all notes.

Generated suggestions may include

- new NPC
- new POI
- updated NPC
- new relationship
- lore update
- event
- faction
- item

Every suggestion contains

- entity type
- description
- originating notes
- confidence score
- related entities

---

## 5. Review

This is the application's primary workflow.

The DM processes an inbox of AI suggestions.

Each suggestion contains

- source notes
- highlighted evidence
- AI summary
- existing related entities
- duplicate detection

Possible decisions

✅ Add to world

🔗 Merge with existing entity

❌ Reject

The workflow should resemble reviewing Pull Requests rather than editing database entries.

---

## 6. Persist

Approved suggestions become permanent world knowledge.

Future campaigns immediately benefit from this information.

---

# AI Architecture

The AI should consist of specialized independent components.

```text
Session Notes

↓

Entity Extraction

↓

Relationship Detection

↓

Duplicate Detection

↓

Context Retrieval

↓

Suggestion Builder

↓

DM Review

↓

Persist World
```

---

## Entity Extraction

Recognizes

- NPCs
- POIs
- Lore
- Events
- Items
- Factions
- Relationships

---

## Relationship Detection

Discovers relationships between entities.

---

## Duplicate Detection

Searches for similar entities.

Example

"Tänzelndes Pony"

↓

"The Dancing Pony"

↓

Possible duplicate

---

## Context Retrieval

Collects relevant information.

Examples

- previous appearances
- existing relationships
- historical events
- related sessions

---

## Suggestion Builder

Builds complete review proposals for the DM.

---

# Frontend Structure

The application consists of five navigation levels.

## Dashboard

Displays

- all worlds
- recently opened worlds
- open reviews
- recent campaigns

---

## World

Contains

- Overview
- Lore
- NPCs
- POIs
- Items
- Factions
- Maps
- Timeline
- Relationships
- Campaigns

---

## Campaign

Contains

- Overview
- Sessions
- Characters
- Notes
- Timeline

---

## Session

Contains

- Live Notes
- Player Notes
- Session Overview

---

## Review

Standalone workflow.

No standard navigation.

Focus solely on reviewing suggestions.

---

# UI Principles

## Minimalism

Show only relevant information.

Avoid complex administration interfaces.

---

## Progressive Disclosure

Reveal complexity only when needed.

---

## Inbox Workflow

Review should feel like

- GitHub Pull Requests
- Gmail Inbox
- Linear Issues

Not like a CRUD interface.

---

## Single Decision

Each review screen should ask only one question.

This minimizes cognitive load.

---

## Consistency

All entity pages share the same structure.

- title
- description
- relationships
- timeline
- references
- edit history

---

# Graph View (Future Feature)

In addition to the traditional wiki interface, the application should provide an interactive **Knowledge Graph** visualization.

The graph represents the world as interconnected entities and relationships.

Each entity (e.g. NPC, POI, Item, Faction, Event) is displayed as a node.

Relationships are displayed as edges.

Example

```
NPC
 │
knows
 │
NPC
 │
lives in
 │
POI
 │
belongs to
 │
Faction
```

## Features

- infinite canvas
- zoom
- pan
- drag nodes
- dynamic layout
- clustering
- filtering
- search
- highlight shortest paths
- relationship coloring
- node grouping
- minimap
- expand/collapse neighborhoods

Possible filters

- NPCs only
- Locations only
- Campaign-specific events
- Historical timeline
- Relationship type
- Session origin

Selecting an entity opens its wiki page.

Selecting a relationship reveals the notes from which it originated.

The graph is intended to become the primary visualization of world knowledge rather than replacing the wiki.

The wiki answers

> "What is this?"

The graph answers

> "How is everything connected?"

---

# Database Philosophy

Although the backend may use a relational database, the conceptual model is a **Knowledge Graph**.

Everything is an entity connected by relationships.

This philosophy should influence

- backend design
- API design
- AI pipeline
- UI
- Graph visualization

---

# Subscription Model

The platform follows a **Freemium SaaS** model.

## Free

Allows users to evaluate the platform.

Limits (subject to change)

- limited worlds
- limited campaigns
- limited AI usage
- limited storage

---

## Pro

Designed for long-running campaigns.

Potential features

- multiple worlds
- larger AI quotas
- advanced search
- unlimited campaigns
- exports
- backups
- collaboration
- priority AI processing

Exact limits will be determined after observing real-world usage.

---

# Long-Term Vision

After years of gameplay, the Dungeon Master owns a complete, searchable, interconnected representation of their world.

The application evolves from a note-taking tool into a living memory of the world, continuously maintained through AI-assisted curation and visualized both as a traditional wiki and as an interactive knowledge graph.