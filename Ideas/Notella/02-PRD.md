# PRD — Notella (Arbeitstitel)

### Domain-agnostische Note-Taking-Engine für gemeinsam arbeitende Gruppen

> **Version:** V0.1
> **Datum:** 2026-08-07
> **Autor:** Sam (Digitale Leute School — AI Software Engineering)
> **Vorgänger:** `01-Problem-Framing.md`
> **Nachfolger:** `03-SRD.md` → Screen-Inventar / Mockup
> **Projekttyp:** Cross-Page-Flow · Rollen-Differenzierung · phasiertes Rollout

---

## 1. Revisionshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| V0.1 | 2026-08-07 | Sam | Erstfassung auf Basis Problem Framing + Entscheidungen E-01…E-11 |
| V0.2 | 2026-08-07 | Sam | O-01 geklärt (E-12: mehrere Teilnehmerprofile je Account und Projekt) · O-03 und O-06 geklärt und in §4.5 als Datenregeln aufgenommen · `participant_scope` aus beiden Presets entfernt |
| V0.3 | 2026-08-07 | Sam | §4.4.5 Onboarding-Fluss ergänzt (Review-Lücke geschlossen) · nachfolgende Abschnitte umnummeriert |
| V0.4 | 2026-08-07 | Sam | **Beziehungs-Graph** als §4.4.5 aufgenommen und aus dem V2-Backlog in eine eigene Phase **V1.2** gehoben · Preset um `graph.shape`/`graph.color`/`graph.style` erweitert (§4.1.2b) · responsives Verhalten und Screen-Liste ergänzt |
| V0.5 | 2026-08-07 | Sam | **§4.4.2 Review-Inbox vollständig neu geschrieben.** Schnelldurchlauf statt Liste+Detail · drei Kartenarten mit je einer binären Frage · Pflichtfelder als Chip-Reihe · Kontextanforderungen explizit · kein Stapelweg (bewusste Entscheidung) · Reihenfolge chronologisch nach Meeting · Tastaturbedienung als Kernanforderung mit Zielmarke < 6 s je Vorschlag |

---

## 2. Hintergrund

Gruppen, die sich wiederholt treffen — Produktteams wie Pen-and-Paper-Runden — erzeugen
in jedem Treffen Wissen, das danach zerfällt, weil Struktur nur durch Nacharbeit entstehen
kann und Nacharbeit nicht stattfindet. Notella lässt Struktur **während** des Treffens
entstehen: frei schreiben, im Schreibfluss typisieren, danach vom Lead kanonisieren lassen.

Der entscheidende technische Zug: Der Anwendungskern kennt nur **Entität** und **Beziehung**.
Welche Typen es gibt (`NPC`/`POI` vs. `Component`/`Decision`), welche Felder sie haben und
wie die Hierarchieebenen heißen, kommt aus einem austauschbaren **Domain-Preset**. Die
Domäne ist Konfiguration, nicht Code. V1 liefert zwei Presets aus; der Erfolgsnachweis ist,
dass das zweite ohne eine Zeile Codeänderung läuft.

Vollständige Begründung, Zielgruppen, Erfolgsmaße und Risiken: siehe `01-Problem-Framing.md`.

---

## 3. Überblick

| Punkt | Inhalt |
|-------|--------|
| **Zugehörige Anforderung** | `01-Problem-Framing.md`, Entscheidungen E-01…E-11 |
| **Design** | > ⚠️ TBD — Screen-Inventar und Mockup folgen nach diesem PRD |
| **Plattform** | Web (Desktop-first, responsive bis Tablet). Mobile App: nicht in V1 |
| **Sprache** | Deutsch + Englisch als UI-Sprachen; Fachterminologie kommt vollständig aus dem Preset |
| **Betriebsmodell** | Self-hosted / Open Source (Docker Compose). SaaS-Freemium als spätere Option, Datenmodell mandantenfähig vorbereitet |
| **Kernfunktion** | Teilnehmende schreiben in Meetings Notizen mit drei Sichtbarkeitsstufen, typisieren Inhalte im Schreibfluss zu Entitäten und Beziehungen; der Lead überführt Vorschläge über eine Review-Inbox in den verbindlichen Projektstand. Alle Typen, Felder und Bezeichnungen stammen aus einem importierbaren Domain-Preset |
| **Screens (V1)** | Login/Registrierung · Beitritt per Einladung · Dashboard · Projektübersicht · Arbeitsgruppen-Übersicht · Meeting-Raum (Notizen) · Entitäten-Liste · Entitäten-Detail · **Beziehungs-Graph** · Review-Inbox · Teilnehmerprofil · Projekteinstellungen · Preset-Verwaltung |

---

## 4. Produktanforderungen

### 4.0 Domänenmodell & Terminologie

Der Kern kennt neun Objekte. Alles Fachliche ist Preset-Konfiguration.

```text
Account                        (Person, systemweit, passwortgeschützt)
  └── Membership                (Account ↔ Projekt, trägt Systemrolle)

Project           «Welt»            / «Projekt»
  ├── Participant «Charakter»       / «Teammitglied»      ← Entität, an Account gebunden
  ├── Entity      «NPC/POI/Item…»   / «Component/Decision…»
  │     └── Relation  (gerichtet, typisiert)
  ├── PresetBinding (Kopie des Schemas zum Zeitpunkt der Projektanlage, versioniert)
  └── WorkGroup   «Kampagne»        / «Sprint / Teilgruppe»
        └── Meeting «Session»       / «Meeting»
              └── Note              (Markdown, Autor, Sichtbarkeit)
                    └── Mention     (Textstelle → Entität oder Entitätsvorschlag)
```

**Terminologie-Regel:** Die Anwendung zeigt Endnutzenden **niemals** generische Begriffe
wie „Entität", „Container" oder „Arbeitsgruppe". Jedes sichtbare Label wird zur Laufzeit
aus dem Preset aufgelöst. Generische Begriffe erscheinen ausschließlich in der
Preset-Verwaltung und in der Dokumentation.

**Kernobjekte im Detail:**

| Objekt | Beschreibung | Gültigkeitsbereich |
|--------|--------------|--------------------|
| **Account** | Person mit E-Mail und Passwort. Systemweit eindeutig. Kann in mehreren Projekten Mitglied sein. | global |
| **Membership** | Verbindet Account und Projekt, trägt die Systemrolle (Lead / Kurator / Member). | pro Projekt |
| **Project** | Oberster fachlicher Container. Trägt genau eine Preset-Bindung. | — |
| **Participant** | Das fachliche Profil einer Person im Projekt (Charakter / Teammitglied). Ein ganz normaler Entitätstyp aus dem Preset, zusätzlich an genau einen Account gebunden. Kann Ziel und Quelle von Beziehungen sein. **Ein Account darf mehrere Profile im selben Projekt besitzen** und ordnet jedes einer oder mehreren Arbeitsgruppen zu. | pro Projekt, zugeordnet zu Arbeitsgruppen |
| **WorkGroup** | Parallele Arbeitsstränge innerhalb eines Projekts. Mehrere gleichzeitig aktiv (Breakout-Gruppen, parallele Sprints, parallele Kampagnen). | pro Projekt |
| **Meeting** | Ein Treffen mit Zustandsmaschine (geplant → laufend → beendet). Trägt Datum, Teilnehmerliste, Notizen. | pro WorkGroup |
| **Note** | Markdown-Text eines Autors in einem Meeting, mit Sichtbarkeitsstufe. | pro Meeting + Autor |
| **Mention** | Verknüpfung einer Textstelle in einer Notiz mit einer bestehenden Entität *oder* einem Entitätsvorschlag. | pro Note |
| **Entity** | Ein typisierter Wissenseintrag im Projekt. Basisfelder + preset-definierte Felder. | pro Project |
| **Relation** | Gerichtete, typisierte Verbindung zweier Entitäten. | pro Project |

> **Geklärt (E-12) — Gültigkeitsbereich des Participants**
> Das Teilnehmerprofil lebt auf **Projektebene** und ist eine vollwertige Entität im
> Projektwissen. Ein Account darf im selben Projekt **mehrere** Profile besitzen und ordnet
> jedes einer oder mehreren Arbeitsgruppen zu.
> Damit sind beide Muster ohne Sonderlogik abgedeckt: Im Software-Projekt legt eine Person
> genau ein Profil an und nimmt damit an allen Sprints teil. In der TableTop-Welt kann
> dieselbe Spielerin einen Charakter über mehrere Kampagnen hinweg weiterspielen *oder*
> für eine neue Kampagne ein zweites Profil anlegen — beide bleiben dauerhaft als
> Entitäten der Welt bestehen, samt ihrer Beziehungen. Kein Preset-Flag nötig.
>
> **Konsequenz für die UI:** Beim Beitritt zu einer Arbeitsgruppe fragt die Anwendung,
> ob ein bestehendes Profil verwendet oder ein neues angelegt werden soll. Existiert noch
> keines, wird der Anlage-Schritt ohne Rückfrage gezeigt.

---

### 4.1 Preset-System (Herzstück)

#### 4.1.1 Was ein Preset definiert

Ein Preset ist eine deklarative Datei (YAML), die vier Dinge festlegt:

1. **Terminologie** der drei Hierarchieebenen und des Participants
2. **Entitätstypen** mit Feldern (Typ, Pflichtfeld ja/nein, Optionen)
3. **Beziehungstypen** mit erlaubter Quelle und erlaubtem Ziel
4. **Verhaltens-Flags** (Sichtbarkeits-Default, Lead-Einsicht in Private, Delegation erlaubt)

#### 4.1.2 Unterstützte Feldtypen (V1)

| Typ | Beschreibung | Zusatzparameter |
|-----|--------------|-----------------|
| `text` | Einzeiliger Text | `max_length` |
| `longtext` | Markdown-Mehrzeiler | — |
| `select` | Auswahl aus fester Liste | `options[]`, `multiple: false` |
| `number` | Ganzzahl oder Dezimal | `min`, `max` |
| `date` | Datum | — |
| `reference` | Verweis auf eine andere Entität | `target_type` (Entitätstyp oder `any`) |

Jedes Feld kennt zusätzlich: `key`, `label`, `required: true|false`, `help` (Hilfetext),
`show_in_list: true|false` (erscheint in der Listenansicht).

#### 4.1.2b Grafische Darstellung im Preset

Damit der Beziehungs-Graph (§4.4.5) ohne typspezifischen Code auskommt, trägt jeder
Entitätstyp und jeder Beziehungstyp seine Darstellung im Preset:

| Schlüssel | Ort | Werte | Zweck |
|-----------|-----|-------|-------|
| `graph.shape` | Entitätstyp | `circle` · `roundrect` · `hexagon` · `pentagon` · `star` · `diamond` | Die Form macht den Typ auf einen Blick unterscheidbar — auch für Menschen, die Farben schlecht trennen |
| `graph.color` | Entitätstyp | Hex-Farbe | Zusätzliche Kodierung, nie die alleinige |
| `graph.style` | Beziehungstyp | `solid` · `dashed` · `dotted` | Unterscheidet z.B. belegte von vermuteten Verbindungen |
| `graph.weight` | Beziehungstyp | 1–3 | Kantenstärke, steuert zugleich die Anziehung im Layout |

Fehlen die Angaben, vergibt die Anwendung Form und Farbe deterministisch aus dem
Typschlüssel — ein Preset ohne `graph`-Block bleibt also voll funktionsfähig.

> Bewusst **nicht** in V1: Mehrfachauswahl, Checkbox, URL, Datei-Upload, Formeln.
> Jeder dieser Typen kostet Validierung, Rendering, Filterlogik und Formularkomponente.

#### 4.1.3 Beispiel-Preset A — Software-Projekt (Beachhead)

```yaml
preset:
  id: software-project
  version: 1
  name: "Software-Projekt"
  description: "Produkt- und Entwicklungsteams mit Sprints und Meetings"

terminology:
  project:      { singular: "Projekt",     plural: "Projekte" }
  workgroup:    { singular: "Sprint",      plural: "Sprints" }
  meeting:      { singular: "Meeting",     plural: "Meetings" }
  participant:  { singular: "Teammitglied", plural: "Team" }
  canon:        { verb: "übernehmen", noun: "Projektwissen" }

behavior:
  default_note_visibility: shared        # privat | shared | -
  lead_can_read_private: false           # DSGVO-konform: Lead sieht keine privaten Notizen
  curator_delegation: true               # Lead darf Kuratoren-Rolle vergeben

entity_types:
  - key: teammember
    label: "Teammitglied"
    is_participant: true                 # dieser Typ wird beim Beitritt angelegt
    icon: user
    fields:
      - { key: role,   label: "Rolle",       type: select, required: true,
          options: ["Product", "UI/UX", "Frontend", "Backend", "Data", "QA", "Sonstige"],
          show_in_list: true }
      - { key: focus,  label: "Schwerpunkt", type: text,   required: false }

  - key: component
    label: "Komponente"
    icon: box
    graph: { shape: roundrect, color: "#2fb8a0" }   # Darstellung im Beziehungs-Graph
    fields:
      - { key: layer,  label: "Ebene", type: select, required: true,
          options: ["UI/UX", "Frontend", "Backend", "Logic", "Database", "Infra"],
          show_in_list: true }
      - { key: status, label: "Status", type: select, required: true,
          options: ["Idee", "In Arbeit", "Fertig", "Verworfen"], show_in_list: true }
      - { key: owner,  label: "Verantwortlich", type: reference, target_type: teammember,
          required: false, show_in_list: true }

  - key: decision
    label: "Entscheidung"
    icon: gavel
    fields:
      - { key: decided_on, label: "Entschieden am", type: date,     required: true }
      - { key: rationale,  label: "Begründung",     type: longtext, required: true }
      - { key: status,     label: "Status",         type: select,   required: true,
          options: ["Gültig", "Überholt", "Zurückgenommen"], show_in_list: true }

  - key: risk
    label: "Risiko"
    fields:
      - { key: severity, label: "Schwere", type: select, required: true,
          options: ["Niedrig", "Mittel", "Hoch"], show_in_list: true }
      - { key: mitigation, label: "Gegenmaßnahme", type: longtext, required: false }

  - key: task
    label: "Aufgabe"
    fields:
      - { key: assignee, label: "Zuständig", type: reference, target_type: teammember,
          required: false, show_in_list: true }
      - { key: due,      label: "Fällig",    type: date, required: false }
      - { key: status,   label: "Status",    type: select, required: true,
          options: ["Offen", "In Arbeit", "Erledigt"], show_in_list: true }

relation_types:
  - { key: depends_on, label: "hängt ab von", inverse_label: "wird benötigt von",
      source: component, target: component }
  - { key: owns,       label: "verantwortet", inverse_label: "verantwortet von",
      source: teammember, target: component }
  - { key: affects,    label: "betrifft",     inverse_label: "betroffen von",
      source: decision,  target: any }
  - { key: threatens,  label: "gefährdet",    inverse_label: "gefährdet durch",
      source: risk,      target: any }
  - { key: implements, label: "setzt um",     inverse_label: "umgesetzt durch",
      source: task,      target: component }
```

#### 4.1.4 Beispiel-Preset B — TableTop (Machbarkeitsnachweis)

```yaml
preset:
  id: tabletop-rpg
  version: 1
  name: "TableTop / Pen & Paper"
  description: "Rollenspielrunden mit Welten, Kampagnen und Sessions"

terminology:
  project:      { singular: "Welt",      plural: "Welten" }
  workgroup:    { singular: "Kampagne",  plural: "Kampagnen" }
  meeting:      { singular: "Session",   plural: "Sessions" }
  participant:  { singular: "Charakter", plural: "Charaktere" }
  canon:        { verb: "kanonisieren",  noun: "Weltwissen" }

behavior:
  default_note_visibility: private       # im Spiel schreibt man erst mal für sich
  lead_can_read_private: true            # der DM darf mitlesen — mit sichtbarem Hinweis
  curator_delegation: false              # nur der DM entscheidet

entity_types:
  - key: character
    label: "Charakter"
    is_participant: true
    fields:
      - { key: class,      label: "Klasse", type: text,   required: true, show_in_list: true }
      - { key: level,      label: "Stufe",  type: number, required: false, min: 1, max: 20 }
      - { key: background, label: "Hintergrund", type: longtext, required: false }

  - key: npc
    label: "NSC"
    graph: { shape: circle, color: "#f0a24b" }   # Darstellung im Beziehungs-Graph
    fields:
      - { key: alignment, label: "Gesinnung", type: select, required: false,
          options: ["Rechtschaffen", "Neutral", "Chaotisch", "Unbekannt"], show_in_list: true }
      - { key: status,    label: "Status", type: select, required: true,
          options: ["Lebendig", "Verstorben", "Verschollen"], show_in_list: true }

  - key: poi
    label: "Ort"
    fields:
      - { key: region, label: "Region", type: text, required: false, show_in_list: true }
      - { key: kind,   label: "Art",   type: select, required: false,
          options: ["Stadt", "Dorf", "Verlies", "Bauwerk", "Wildnis"], show_in_list: true }

  - key: faction
    label: "Fraktion"
    fields:
      - { key: goal, label: "Ziel", type: longtext, required: false }

  - key: item
    label: "Gegenstand"
    fields:
      - { key: rarity, label: "Seltenheit", type: select, required: false,
          options: ["Gewöhnlich", "Ungewöhnlich", "Selten", "Legendär"], show_in_list: true }

  - key: event
    label: "Ereignis"
    fields:
      - { key: happened_on, label: "Zeitpunkt (Ingame)", type: text, required: false }

relation_types:
  - { key: lives_in,   label: "lebt in",       inverse_label: "Bewohner",
      source: npc,       target: poi }
  - { key: knows,      label: "kennt",          inverse_label: "bekannt mit",
      source: npc,       target: npc }
  - { key: member_of,  label: "Mitglied von",   inverse_label: "Mitglieder",
      source: npc,       target: faction }
  - { key: owns_item,  label: "besitzt",        inverse_label: "im Besitz von",
      source: any,       target: item }
  - { key: happened_at,label: "geschah bei",    inverse_label: "Ereignisse",
      source: event,     target: poi }
  - { key: involved,   label: "beteiligt",      inverse_label: "beteiligt an",
      source: event,     target: any }
```

**Nachweis der Abstraktion:** Beide Dateien nutzen exakt dieselben Schlüssel und
Feldtypen. Zwischen ihnen liegt keine Codezeile Unterschied.

#### 4.1.5 Preset-Lebenszyklus & Schema-Evolution

| Vorgang | Verhalten |
|---------|-----------|
| **Import** | Datei-Upload in der Preset-Verwaltung (Systemadministration bzw. Projektebene). Validierung gegen JSON-Schema; Fehler werden zeilengenau gemeldet. |
| **Projektanlage** | Der Lead wählt genau **ein** Preset. Das Schema wird als **Kopie** an das Projekt gebunden (`PresetBinding`) — spätere Änderungen an der Quelldatei berühren laufende Projekte nicht. |
| **Erweiterung zur Laufzeit** | Der Lead kann im laufenden Projekt **additive** Änderungen vornehmen: neue Entitätstypen, neue Beziehungstypen, neue optionale Felder, neue `select`-Optionen. |
| **Nicht erlaubt zur Laufzeit** | Typ löschen, Feld löschen, Feld von optional auf `required` heben, `select`-Option entfernen, Feldtyp ändern. Diese Vorgänge erfordern eine explizite Migration (nicht in V1). |
| **Versionierung** | Jede Laufzeitänderung erhöht die Binding-Version und wird protokolliert (wer, wann, was). |

> Diese Regel adressiert Risiko **R-04** aus dem Problem Framing: additive Änderungen
> können bestehende Daten nicht ungültig machen.

---

### 4.2 Rollen & Rechte

#### 4.2.1 Rollen

| Rolle | Vergabe | Beschreibung |
|-------|---------|--------------|
| **Lead** | Ersteller des Projekts; übertragbar | Projektleitung / DM. Verwaltet Projekt, Presets, Mitglieder, kanonisiert. |
| **Kurator** | vom Lead vergeben, nur wenn `curator_delegation: true` | Darf zusätzlich kanonisieren. Entschärft R-03. |
| **Member** | Standard beim Beitritt | Schreibt Notizen, legt Vorschläge an, verwaltet das eigene Teilnehmerprofil. |

#### 4.2.2 Rechtematrix

| Aktion | Lead | Kurator | Member |
|--------|:----:|:-------:|:------:|
| Projekt anlegen / löschen | ✅ | ❌ | ❌ |
| Preset wählen / additiv erweitern | ✅ | ❌ | ❌ |
| Einladungslink erzeugen / widerrufen | ✅ | ❌ | ❌ |
| Rollen vergeben (Kurator) | ✅ | ❌ | ❌ |
| Arbeitsgruppe anlegen / archivieren | ✅ | ✅ | ❌ |
| Meeting anlegen / starten / beenden | ✅ | ✅ | ❌ |
| Eigene Notiz schreiben / bearbeiten / löschen | ✅ | ✅ | ✅ |
| Eigene Notiz-Sichtbarkeit ändern (privat ↔ geteilt) | ✅ | ✅ | ✅ |
| Geteilte Notizen anderer lesen | ✅ | ✅ | ✅ |
| Private Notizen anderer lesen | nur bei `lead_can_read_private: true` | ❌ | ❌ |
| Entitätsvorschlag erzeugen (Mention) | ✅ | ✅ | ✅ |
| **Kanonisieren** (Vorschlag → Projektwissen) | ✅ | ✅ | ❌ |
| Kanonische Entität bearbeiten / zusammenführen / löschen | ✅ | ✅ | ❌ |
| Eigenes Teilnehmerprofil bearbeiten | ✅ | ✅ | ✅ |
| Fremdes Teilnehmerprofil bearbeiten | ✅ | ❌ | ❌ |
| Projekt verlassen | ❌ (erst Lead übertragen) | ✅ | ✅ |

#### 4.2.3 Sichtbarkeitsmodell

| Stufe | Wer sieht sie | Wer setzt sie |
|-------|---------------|---------------|
| **privat** | nur der Autor (+ Lead, falls `lead_can_read_private: true`) | Autor |
| **geteilt** | alle Mitglieder der Arbeitsgruppe | Autor |
| **kanonisch** | alle Mitglieder des Projekts, erscheint im Projektwissen | ausschließlich Lead / Kurator |

Wichtig: **kanonisch** ist keine Stufe der Notiz, sondern eine Eigenschaft der aus ihr
abgeleiteten **Entitäten**. Die Notiz bleibt beim Autor und behält ihre Stufe; die
kanonisierte Entität verweist auf sie als Herkunft.

**Transparenzhinweis (E-05):** Ist `lead_can_read_private: true`, zeigt die Anwendung
beim **ersten** Betreten eines Meetings in diesem Projekt einen einmaligen, wegklickbaren
Hinweis: *„In diesem Projekt kann die Leitung auch deine privaten Notizen einsehen.
Andere Teilnehmende können das nicht."* Danach erscheint nur noch ein dezentes Icon am
Sichtbarkeits-Umschalter. Kein Dauerbanner.

---

### 4.3 Nutzerflüsse (Cross-Page)

#### 4.3.1 Hauptfluss — vom Beitritt bis zum Projektwissen

| # | Screen | Nutzerhandlung | Ergebnis | Verzweigung |
|---|--------|----------------|----------|-------------|
| 1 | Registrierung / Login | Account anlegen oder anmelden | Session aktiv | Bereits eingeloggt → Schritt 3 |
| 2 | Einladung annehmen | Einladungslink öffnen | Membership (Rolle: Member) angelegt | Link abgelaufen → Fehlerzustand mit Kontakt zum Lead |
| 3 | Teilnehmerprofil anlegen | Pflichtfelder des Participant-Typs ausfüllen | Participant-Entität erzeugt, an Account gebunden | Bereits vorhanden → überspringen |
| 4 | Dashboard | Projekt wählen | Projektkontext geladen (inkl. Terminologie aus Preset) | Keine Projekte → Leerzustand mit „Projekt anlegen" |
| 5 | Projektübersicht | Arbeitsgruppe wählen | Liste der Meetings | Keine Arbeitsgruppe → Leerzustand (Lead sieht Anlegen-Button) |
| 6 | Arbeitsgruppen-Übersicht | Meeting öffnen / Lead startet Meeting | Meeting-Raum, Zustand *laufend* | Meeting *geplant* → Nur-Lese-Vorschau |
| 7 | **Meeting-Raum** | Notiz schreiben, `@` tippen oder Text markieren → typisieren | Note + Mentions gespeichert; geteilte Notizen im Live-Feed | Entität existiert noch nicht → Inline-Anlage als *Vorschlag* |
| 8 | Meeting-Raum | Sichtbarkeit der eigenen Notiz umschalten | Notiz erscheint/verschwindet im Feed der anderen | — |
| 9 | Meeting beenden (Lead) | Meeting schließen | Zustand *beendet*; Vorschläge sammeln sich in der Review-Inbox | Nachtrag bleibt möglich (siehe 4.4.2) |
| 10 | **Review-Inbox** | Vorschlag prüfen: Übernehmen / Zusammenführen / Ablehnen | Entität wird kanonisch, Herkunft verknüpft | Duplikatverdacht → Zusammenführen-Ansicht |
| 11 | Entitäten-Liste | Filtern nach Typ / Feld | Übersicht des Projektwissens | Leer → Hinweis „entsteht aus euren Meetings" |
| 12 | Entitäten-Detail | Beziehungen ansehen / ergänzen, Herkunft aufrufen | Sprung zurück zur Ursprungsnotiz | — |

**Datenübergabe zwischen Screens:**

- Projektübersicht → alle Unterseiten: `projectId` + aufgelöstes Preset-Schema (einmal
  geladen, im Client zwischengespeichert; jedes Label wird daraus aufgelöst)
- Meeting-Raum → Review-Inbox: `meetingId` als Vorfilter
- Review-Inbox → Zusammenführen-Ansicht: `suggestionId` + Liste der Duplikatkandidaten
- Entitäten-Detail → Notiz: `noteId` + `mentionId` zum Scrollen und Hervorheben der Stelle

#### 4.3.2 Meeting-Zustandsmaschine

```text
   [geplant] ──Lead startet──▶ [laufend] ──Lead beendet──▶ [beendet]
       │                            │                          │
       │ Titel/Datum/Teilnehmer     │ Notizen schreiben        │ Notizen ergänzen
       │ bearbeitbar                │ Live-Feed aktiv          │ (Nachtrag, Feed inaktiv)
       │ keine Notizen              │ Kanonisierung gesperrt   │ Review-Inbox befüllt
       │                            │                          │
       └──────── Lead löscht ───────┴──────────────────────────┘
```

| Zustand | Notizen schreiben | Live-Feed | Kanonisierung | Sichtbar für |
|---------|-------------------|-----------|---------------|--------------|
| geplant | nein | nein | nein | alle Mitglieder der Arbeitsgruppe |
| laufend | ja | ja | nein | alle Mitglieder der Arbeitsgruppe |
| beendet | ja (Nachtrag, unbegrenzt) | nein | ja | alle Mitglieder der Arbeitsgruppe |

Nachträge nach dem Beenden werden mit dem Hinweis „nachträglich ergänzt" und Zeitstempel
gekennzeichnet und erzeugen neue Einträge in der Review-Inbox.

---

### 4.4 Frontend-Anforderungen

#### 4.4.1 Meeting-Raum (wichtigster Screen)

**Aufbau (Desktop, dreispaltig):**

| Bereich | Inhalt |
|---------|--------|
| **Links (schmal, einklappbar)** | Meeting-Kontext: Titel, Zustand, Teilnehmerliste mit Online-Punkt, Sprung zu vorherigen Meetings der Arbeitsgruppe |
| **Mitte (breit)** | Eigenes Notizfeld: Markdown-Editor mit Live-Vorschau, Sichtbarkeits-Umschalter oben rechts, Erwähnungs-Chips inline hervorgehoben |
| **Rechts (mittel, einklappbar)** | Live-Feed der geteilten Notizen anderer, chronologisch absteigend, mit Autor und Zeitstempel. Für Lead zusätzlich (bei `lead_can_read_private: true`) ein Filter „auch private anzeigen" |

**Editor-Verhalten:**

- Markdown mit Live-Vorschau (Überschriften, Listen, Fett/Kursiv, Code, Zitate)
- Automatisches Speichern nach 2 s Tippstille sowie bei Fokusverlust; sichtbarer
  Speicherstatus („gespeichert" / „speichert…" / „offline — lokal zwischengespeichert")
- Bei Verbindungsverlust: lokaler Zwischenspeicher, automatische Synchronisation bei
  Rückkehr; Konflikt kann nicht entstehen, da jede Notiz genau einen Autor hat

**Typisierung — zwei gleichwertige Wege (E-07):**

*Weg A — Tastatur:* `@` öffnet einen Auswahldialog direkt an der Cursorposition.
Die Liste zeigt zuerst passende bestehende Entitäten (unscharfe Suche über Titel und
Aliasse), darunter „Neu anlegen als …" je Entitätstyp aus dem Preset. Auswahl per
Pfeiltasten und Enter, ohne Maus. `#` ist ein Kurzweg, der die Liste sofort auf einen
Typ einschränkt.

*Weg B — Maus:* Text markieren → kontextuelle Leiste erscheint über der Auswahl mit den
Entitätstypen des Presets als Schaltflächen → Klick öffnet dieselbe Auswahl wie Weg A,
mit dem markierten Text als Vorbelegung.

Beide Wege erzeugen dieselbe Datenstruktur (`Mention`) und sind damit die spätere
Andockstelle der AI-Extraktion (E-09).

**Duplikatvermeidung an der Quelle (adressiert die Sorge aus dem Dialog):**

- Die Auswahl sucht **unscharf** (Tippfehlertoleranz, Groß-/Kleinschreibung, Teilwörter)
- Jede Entität hat ein Alias-Feld; Treffer über Aliasse werden mit dem kanonischen Namen
  angezeigt („Tänzelndes Pony → *Alias von* The Dancing Pony")
- Bestehende Entitäten stehen **immer** über „Neu anlegen"; das Anlegen erfordert einen
  zweiten bewussten Klick
- Bei Ähnlichkeit über Schwellwert erscheint beim Anlegen ein Hinweis: „Meintest du …?"

**Akzeptanzkriterien:**

- [ ] Beim Tippen von `@` öffnet die Auswahl innerhalb von 150 ms und zeigt maximal 8 Treffer
- [ ] Die Auswahl ist vollständig per Tastatur bedienbar (↑ ↓ Enter Esc), ohne Maus
- [ ] Die angebotenen Entitätstypen entsprechen exakt den `entity_types` des Projekt-Presets — kein hartkodierter Typ erscheint
- [ ] Wird eine Entität mit einem Titel angelegt, der zu ≥ 80 % Ähnlichkeit einer bestehenden Entität desselben Typs entspricht, erscheint vor dem Speichern ein Duplikathinweis mit Verweis auf den Kandidaten
- [ ] Der Sichtbarkeits-Umschalter zeigt beim Betreten den Wert aus `default_note_visibility` des Presets
- [ ] Eine auf *privat* gesetzte Notiz erscheint bei keinem anderen Mitglied im Live-Feed — auch nicht beim Lead, wenn `lead_can_read_private: false`
- [ ] Bei `lead_can_read_private: true` erscheint der Transparenzhinweis genau einmal pro Account und Projekt
- [ ] Nach Verbindungsverlust und Rückkehr geht kein getippter Text verloren
- [ ] Im Zustand *geplant* ist das Notizfeld nicht bedienbar und zeigt den Grund an
- [ ] Nach dem Beenden geschriebene Notizen tragen sichtbar die Markierung „nachträglich ergänzt"

#### 4.4.2 Review-Inbox

> **Der anstrengendste Bildschirm der gesamten Kette — und damit der, der am stärksten
> optimiert gehört.** Alles davor (schreiben, markieren) passiert im Fluss eines Treffens.
> Die Kanonisierung passiert danach, allein, ohne Gesprächsdruck — und genau deshalb wird
> sie übersprungen, wenn sie sich nach Arbeit anfühlt. Risiko R-03.

##### 4.4.2.1 Entwurfsprinzipien

Fünf Regeln, aus denen sich alles Weitere ableitet. Sie sind bewusst als Verbote
formuliert, weil die erste Fassung dieses Bildschirms an genau diesen Punkten scheiterte.

| # | Prinzip | Was daraus folgt |
|---|---------|------------------|
| **P-1** | **Eine Frage pro Karte — wörtlich.** | Es gibt nicht *eine* Karte mit vier Knöpfen, sondern **drei Kartenarten** mit je einer binären Frage (4.4.2.3). Welche erscheint, entscheidet die Datenlage, nicht der Nutzer. |
| **P-2** | **Entscheiden und Ausfüllen sind getrennte Handlungen.** | Ein Formular mitten in einer Entscheidung ist der Hauptgrund für Überforderung. Pflichtfelder werden zu **antippbaren Chips** — eine zweite Mikro-Entscheidung, kein Eingabefeld (4.4.2.5). |
| **P-3** | **Genau ein gefüllter Knopf auf dem Bildschirm.** | Die Primärhandlung ist farbig und groß. Alles Weitere ist Text ohne Rahmen. Wer nichts liest, klickt trotzdem richtig. |
| **P-4** | **Nichts anbieten, was gerade keine Frage ist.** | „Zusammenführen" erscheint **ausschließlich**, wenn ein Duplikatverdacht besteht — dann aber als eigene Kartenart. Beziehungsvorschläge erscheinen nur, wenn es welche gibt. Leere Abschnitte werden nicht gezeigt, auch nicht ausgegraut. |
| **P-5** | **Kontext ist nicht Beiwerk, sondern der Entscheidungsgrund.** | Der Reviewer kann nur zustimmen, was er nachvollziehen kann. Die Belegstelle ist deshalb **das größte Element der Karte** — nicht ein Zitatkästchen am Rand. Dazu die Frage „wie oft und wo kam das vor?" (4.4.2.4). |

**Zielmarke:** Median **unter 6 Sekunden** je Vorschlag bei reiner Tastaturbedienung.
Das ist die eigentliche Anforderung — alles Übrige ist Mittel zum Zweck.

##### 4.4.2.2 Grundmodus: Schnelldurchlauf

Kein Listen-plus-Detail-Bildschirm. **Ein Vorschlag füllt die Fläche**, nach der
Entscheidung rückt automatisch der nächste nach.

| Bereich | Inhalt |
|---------|--------|
| **Kopfleiste** | Wo stehe ich: Arbeitsgruppe › Meeting › Datum. Daneben ein **segmentierter Fortschrittsbalken** — ein Segment je Vorschlag, gruppiert je Meeting, erledigte gefüllt. Ersetzt die Warteschlangenliste vollständig |
| **Hauptspalte** (max. ~720 px) | Belegstelle → Vorschlag → offene Frage → Handlung. In dieser Reihenfolge, immer |
| **Kontextspalte rechts** (~240 px, rahmenlos) | Herkunft, Häufigkeit, verwandte vorhandene Einträge. Bewusst **visuell leise**: kleine, gedämpfte Schrift ohne Panelrahmen, damit sie nicht mit der Entscheidung konkurriert |
| **Fußleiste** | Tastaturkürzel, dauerhaft sichtbar |

**Reihenfolge der Vorschläge:** chronologisch **nach Meeting** gruppiert. Alles aus einem
Treffen am Stück — der Reviewer durchlebt den Ablauf noch einmal und erkennt Zusammenhänge,
die bei einer Sortierung nach Typ verlorengingen. Zwischen zwei Meetings erscheint eine
schmale Trennkarte („Sprint-Planung KW 32 — fertig · Als Nächstes: Daily Mi, 3 Vorschläge"),
die zugleich ein natürlicher Ausstiegspunkt ist.

> **Kein Stapelweg.** Bewusste Entscheidung: Jede Übernahme bleibt eine Einzelentscheidung,
> damit sich durch Gewöhnung nichts ins Projektwissen schleicht. Der Preis ist, dass die
> Last je Vorschlag nicht durch Bündelung sinken darf, sondern durch Geschwindigkeit —
> siehe Zielmarke oben und 4.4.2.7.

##### 4.4.2.3 Die drei Kartenarten

Welche Karte erscheint, ergibt sich aus der Datenlage. Der Reviewer wählt sie nie aus.

**Art A — „Neuer Eintrag?"** (Regelfall)

> Frage: *Gehört das ins Projektwissen?*
> **Übernehmen** (primär, gefüllt) · Ablehnen (Text) · Später (klein)

**Art B — „Ist das dasselbe?"** (bei Duplikatverdacht ≥ Schwellwert)

> Frage: *Ist das derselbe Eintrag wie ein bereits vorhandener?*
> Zwei Spalten nebeneinander, Feld für Feld vergleichbar, Belegstellen beider Seiten.
> **Ist dasselbe → zusammenführen** (primär) · **Ist etwas anderes → neu anlegen** (sekundär,
> aber deutlich sichtbar — hier sind beide Antworten gleich legitim) · Ablehnen (Text)
>
> Diese Karte ersetzt Art A vollständig. Ein Duplikatverdacht ist eine **andere Frage**,
> keine Zusatzoption an derselben Frage.

**Art C — „Ergänzung zu Vorhandenem?"** (Erwähnung zeigt auf eine bereits kanonische Entität
und bringt neue Information mit)

> Frage: *Soll diese Information zum vorhandenen Eintrag hinzukommen?*
> Zeigt den betroffenen Eintrag, die neue Aussage und was sich konkret ändern würde
> (neues Feld gefüllt, neue Beziehung, neue Herkunft).
> **Übernehmen** (primär) · Verwerfen (Text)

##### 4.4.2.4 Kontext — was der Reviewer zum Verifizieren braucht

Die Belegstelle allein genügt nicht. Vier Angaben, alle **ohne Klick sichtbar**:

| Angabe | Warum sie über die Entscheidung entscheidet | Darstellung |
|--------|---------------------------------------------|-------------|
| **Der Absatz, nicht der Satz** | Ein einzelner Satz ist oft mehrdeutig. Der umgebende Absatz macht klar, ob es sich um eine Festlegung oder eine beiläufige Erwähnung handelt | Hauptelement der Karte, größte Schrift nach dem Titel, markierte Stelle hervorgehoben |
| **Häufigkeit und Streuung** | „3-mal über 2 Meetings" ist fast sicher relevant, „1-mal beiläufig" oft nicht. Das stärkste Einzelsignal überhaupt | Zeile über der Belegstelle: *3 Erwähnungen · 2 Meetings*, aufklappbar zu den anderen Fundstellen im Wortlaut |
| **Wer und wo** | Eine Aussage der Projektleitung wiegt anders als eine Randnotiz | Kontextspalte: Autor mit Avatar, Arbeitsgruppe › Meeting, Zeitpunkt |
| **Was es schon gibt** | Verhindert Doppelanlagen, die unterhalb des Duplikat-Schwellwerts liegen | Kontextspalte: bis zu 5 vorhandene Einträge desselben Typs, alphabetisch, als reine Liste |

Zusätzlich **auf Klick**: die vollständige Ursprungsnotiz im Overlay, mit der Stelle
hervorgehoben — für den seltenen Fall, dass der Absatz nicht reicht.

##### 4.4.2.5 Pflichtfelder als Chips

Der größte Reibungspunkt der ersten Fassung. Ein `select`-Pflichtfeld erscheint **nicht**
als Auswahlliste mit „— bitte auswählen —", sondern als Reihe antippbarer Chips:

```text
Status *   [ Idee ]  [ In Arbeit ]  [ Fertig ]  [ Verworfen ]
             1          2             3           4
```

- Ein Klick genügt, alternativ die Zifferntaste
- Der Primärknopf ist inaktiv, solange ein Pflichtfeld offen ist — die Begründung steht
  **direkt am Knopf**, nicht am Fuß der Karte: *„Status wählen, dann übernehmen"*
- Optionale Felder erscheinen in der Review-Karte **überhaupt nicht** (P-4). Sie werden
  auf der Detailseite gepflegt, wo sie hingehören
- `text`-Pflichtfelder erscheinen als einzeiliges Feld mit Fokus; `date`-Pflichtfelder mit
  drei Schnellwerten (heute · Meeting-Datum · anderes)
- **AI-Vorbereitung:** Ist die AI aktiv, ist der wahrscheinliche Chip bereits ausgewählt und
  mit einem dezenten Punkt markiert. Der Reviewer bestätigt oder korrigiert mit einem Klick.
  Das Layout bleibt identisch — der Übergang zur AI-Unterstützung ändert nichts am Bildschirm,
  nur die Menge der offenen Fragen sinkt

##### 4.4.2.6 Nach der Entscheidung

- **Keine Bestätigungsdialoge.** Jede Handlung wird sofort ausgeführt
- **Rückgängig statt Nachfragen:** ein schmaler Hinweis am unteren Rand,
  *„Notification Service übernommen · Rückgängig (Z)"*, für 8 Sekunden
- **Automatisch weiter** zum nächsten Vorschlag, ohne Ladeunterbrechung
- **Ablehnen** verlangt keinen Grund. Ein optionales Feld erscheint erst, wenn der Reviewer
  auf den eingeblendeten Hinweis „Grund angeben?" klickt
- **Endzustand** ist bewusst als Belohnung gestaltet: was in dieser Sitzung entstanden ist
  (*„7 Vorschläge bearbeitet · 5 neue Einträge · 2 zusammengeführt"*), mit einem Sprung in
  den Beziehungs-Graph — dorthin, wo das Ergebnis der Mühe sichtbar wird

##### 4.4.2.7 Tastaturbedienung

Da es keinen Stapelweg gibt, ist die Tastatur der einzige Hebel auf die Zielmarke.
Die Kürzel stehen dauerhaft in der Fußleiste, nicht in einer Hilfe.

| Taste | Handlung |
|-------|----------|
| `A` / `Enter` | Übernehmen (bzw. Zusammenführen bei Art B) |
| `X` | Ablehnen |
| `N` | Bei Art B: „Ist etwas anderes → neu anlegen" |
| `S` | Später |
| `1`–`9` | Chip des ersten offenen Pflichtfelds wählen |
| `E` | Titel bearbeiten |
| `C` | Vollständige Ursprungsnotiz öffnen |
| `Z` | Letzte Handlung rückgängig |
| `←` | Einen Vorschlag zurück |

##### 4.4.2.8 Weitere Maßnahmen gegen R-03

- **Kuratoren-Delegation** (4.2.1) — mehrere Schultern statt einer
- **Zähler im Projektkopf** mit offenen Vorschlägen, aber **ohne rote Warnfarbe**: eine
  volle Inbox ist kein Fehler, und ein Alarmzeichen erzeugt Vermeidungsverhalten
- **Natürliche Ausstiegspunkte** an den Meeting-Grenzen, damit „ich mache nur das eine
  Meeting fertig" eine legitime Sitzung ist
- **Messung** über `suggestion_resolved` inklusive Bearbeitungsdauer je Vorschlag —
  reißt die Zielmarke von 6 Sekunden, ist das ein Gestaltungsproblem, kein Nutzerproblem

##### 4.4.2.9 Member-Sicht

Ein Member ohne Kuratorenrechte sieht denselben Schnelldurchlauf **ohne jede
Handlungsschaltfläche** — nicht ausgegraut, sondern schlicht nicht vorhanden. Zweck ist
Transparenz: nachvollziehen können, was aus den eigenen Notizen wird. Zusätzlich eine
Filterung „nur meine Vorschläge".

##### 4.4.2.10 Akzeptanzkriterien

- [ ] Auf der Karte ist zu jedem Zeitpunkt **genau ein** gefüllter, farbiger Knopf sichtbar
- [ ] „Zusammenführen" erscheint ausschließlich auf Kartenart B; ohne Duplikatverdacht existiert die Schaltfläche nicht
- [ ] Ein Abschnitt ohne Inhalt (keine Beziehungsvorschläge, keine weiteren Erwähnungen) wird nicht gerendert — auch nicht leer oder ausgegraut
- [ ] Optionale Preset-Felder erscheinen nicht in der Review-Karte
- [ ] Ein `select`-Pflichtfeld erscheint als Chip-Reihe und ist mit den Zifferntasten 1–9 bedienbar
- [ ] Ist ein Pflichtfeld offen, steht die Begründung unmittelbar am Primärknopf, nicht an anderer Stelle der Karte
- [ ] Die Belegstelle zeigt den umgebenden Absatz, nicht nur den Satz mit der Markierung
- [ ] Häufigkeit und Streuung („3 Erwähnungen · 2 Meetings") sind ohne Klick sichtbar
- [ ] Eine vollständige Entscheidung ist ohne Maus möglich; der Median über 20 aufeinanderfolgende Vorschläge liegt unter 6 Sekunden
- [ ] Nach jeder Handlung erscheint 8 Sekunden lang ein Rückgängig-Hinweis; es gibt keinen Bestätigungsdialog
- [ ] Die Reihenfolge ist chronologisch nach Meeting gruppiert; zwischen Meetings erscheint eine Trennkarte
- [ ] Der Fortschrittsbalken zeigt ein Segment je Vorschlag, gruppiert nach Meeting
- [ ] Abgelehnte Vorschläge bleiben in der Notiz markiert, erzeugen keine Entität und erscheinen nicht erneut
- [ ] Ein Member ohne Kuratorenrechte sieht keine Handlungsschaltflächen — weder aktiv noch ausgegraut
- [ ] Der Endzustand zeigt eine Bilanz der Sitzung und verlinkt in den Beziehungs-Graph

#### 4.4.3 Entitäten-Liste und -Detail

**Liste:** Tabellarisch, Spalten aus den Feldern mit `show_in_list: true` plus Titel und Typ.
Filter je Typ und je `select`-Feld. Suche über Titel und Aliasse. Umschalter „nur kanonisch /
auch Vorschläge".

**Detail — einheitlicher Aufbau für alle Typen (Konsistenzprinzip aus dem PRS):**

1. Titel, Typ-Kennzeichnung, Aliasse
2. Preset-Felder als Formular (schreibgeschützt für Member)
3. Beziehungen, gruppiert nach Beziehungstyp, mit korrektem Label je Richtung
   (`lebt in` vs. `Bewohner`)
4. **Herkunft** — Liste aller Notizen, aus denen dieser Eintrag stammt, mit Meeting, Autor,
   Datum und Sprung an die Textstelle
5. Änderungshistorie (wer hat wann welches Feld geändert)

**Akzeptanzkriterien:**

- [ ] Die Detailseite rendert für jeden Entitätstyp beider Presets korrekt, ohne typ-spezifischen Code
- [ ] Ein `reference`-Feld zeigt nur Entitäten des in `target_type` erlaubten Typs zur Auswahl
- [ ] Beim Anlegen einer Beziehung bietet die Auswahl nur `relation_types` an, deren `source`/`target` zu den beteiligten Typen passen (`any` erlaubt alle)
- [ ] Ein Klick auf einen Herkunftseintrag öffnet die Notiz mit hervorgehobener Textstelle

#### 4.4.4 Weitere Screens (V1)


| Screen | Kerninhalt | Leerzustand |
|--------|------------|-------------|
| **Dashboard** | Projekte des Accounts, laufende Meetings (hervorgehoben), offene Vorschläge (nur Lead/Kurator), zuletzt geöffnet | „Noch kein Projekt — anlegen oder auf Einladung warten" |
| **Projektübersicht** | Arbeitsgruppen als Karten mit Anzahl Meetings und letzter Aktivität; Kurzstatistik des Projektwissens | „Noch keine \<Sprints\> — die erste anlegen" |
| **Arbeitsgruppen-Übersicht** | Meetings chronologisch, Zustandskennzeichnung, Teilnehmerprofile der Gruppe | „Noch kein \<Meeting\> geplant" |
| **Teilnehmerprofil** | Participant-Entität mit Preset-Feldern, verknüpfter Account, eigene Beziehungen | — |
| **Projekteinstellungen** | Name, Beschreibung, Mitglieder + Rollen, Einladungslinks, Preset-Ansicht und additive Erweiterung, Verhaltens-Flags (schreibgeschützt aus dem Preset) | — |
| **Preset-Verwaltung** | Liste importierter Presets, Import per Datei-Upload mit Validierungsausgabe, Vorschau der Typen und Beziehungen | „Nur die mitgelieferten Presets vorhanden" |

**Verpflichtende Zustände für jeden Screen:** Ladezustand (Skeleton, kein Spinner-Vollbild),
Leerzustand mit Handlungsaufforderung, Fehlerzustand mit Wiederholen-Möglichkeit,
Zustand „keine Berechtigung" mit Erklärung statt bloßer Sperre.

#### 4.4.5 Beziehungs-Graph

Das Gegenstück zur Entitäten-Liste. Die Liste beantwortet **„Was ist das?"**, der Graph
beantwortet **„Wie hängt alles zusammen?"**. Beide zeigen dieselben Daten; der Graph ist
keine eigene Datenhaltung, sondern eine zweite Projektion desselben Projektwissens.

**Aufbau — Vollbild-Leinwand mit Filterleiste links**

| Bereich | Inhalt |
|---------|--------|
| **Links** (einklappbar, ~230 px) | Suche über Entitäten · **Typ-Filter aus dem Preset** mit Anzahl je Typ und Farb-/Formmarke · Kennzahl „18 Einträge · 24 Verbindungen" · Zeitfilter „Alle **Meetings**" bzw. Einschränkung auf eine Arbeitsgruppe · Umschalter „nur kanonisch / auch Vorschläge" |
| **Leinwand** | Unendliche Fläche, Zoom, Verschieben, Knoten ziehbar. Kräftebasiertes Layout mit stabiler Anordnung |
| **Unten rechts** | Zoom + / − · „Ansicht zurücksetzen" · Layout-Umschalter |

**Darstellung**

- **Knoten:** Form und Farbe aus `graph.shape` / `graph.color` des Entitätstyps. Beschriftung
  unter dem Knoten. Knotengröße wächst leicht mit der Anzahl Verbindungen — wichtige
  Einträge fallen dadurch von selbst auf.
- **Vorschläge** (noch nicht kanonisch) erscheinen mit gestricheltem Rand und reduzierter
  Deckkraft — der Graph zeigt damit auch, was noch zur Entscheidung ansteht.
- **Kanten:** gerichtet, Stil aus `graph.style`. Beschriftung erst ab einer Zoomstufe oder
  im Fokusmodus, sonst wird die Leinwand unlesbar.

**Fokusmodus — der eigentliche Mehrwert**

Ein Klick auf einen Knoten schaltet in den Fokusmodus:

- Der gewählte Knoten und seine direkten Nachbarn bleiben voll sichtbar und hervorgehoben
- Alle übrigen Knoten und Kanten werden stark abgedunkelt, bleiben aber sichtbar — der
  Kontext geht nicht verloren, er tritt nur zurück
- Die Beziehungsbeschriftungen der sichtbaren Kanten werden eingeblendet
  („kennt", „lebt in", „hängt ab von")
- Ein Seitenpanel zeigt die Kurzfassung: Typ, die Felder mit `show_in_list: true`,
  Anzahl Herkünfte, und zwei Sprünge — „Detailseite öffnen" (→ D2) und
  „Nachbarschaft erweitern" (zieht die Nachbarn zweiten Grades hinzu)
- Doppelklick öffnet direkt die Detailseite

**Kante auswählen:** Zeigt die Notiz(en), aus denen diese Verbindung stammt — dieselbe
Herkunftslogik wie auf der Detailseite. Damit ist der Graph nicht nur hübsch, sondern
belegbar.

**Leistungsgrenzen und ehrlicher Umgang damit**

| Knotenzahl | Verhalten |
|-----------:|-----------|
| bis ~300 | Vollständige Darstellung, flüssiges Layout |
| 300–1 500 | Beschriftungen erst ab Zoomstufe, Layout einmalig berechnet und zwischengespeichert |
| über 1 500 | Die Anwendung fordert aktiv zum Filtern auf: „2 400 Einträge sind zu viel für eine lesbare Karte — schränk auf einen Typ oder eine **Kampagne** ein." Kein stiller Abbruch, keine hängende Oberfläche |

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Laden | Filterleiste sofort sichtbar und bedienbar, Leinwand mit dezenter Aufbauanimation — kein leeres Rechteck |
| Leer (kein Wissen) | „Hier entsteht die Karte eures **Projektwissens**, sobald ihr in **Meetings** Einträge markiert." mit Sprung ins nächste Meeting |
| Leer (Einträge ohne Verbindungen) | Knoten werden verstreut angezeigt mit dem Hinweis: „Noch keine Verbindungen — Beziehungen entstehen beim Übernehmen oder auf den Detailseiten." |
| Leer (Filter) | „Kein Eintrag mit diesen Filtern" plus „Filter zurücksetzen" |
| Fehler | Rückfall auf die Entitäten-Liste mit Hinweis: „Die Karte konnte nicht geladen werden — die Liste zeigt dieselben Daten." |

**Akzeptanzkriterien**

- [ ] Die Typ-Filter zeigen exakt die `entity_types` des Projekt-Presets mit korrekter Anzahl — kein fest verdrahteter Typ
- [ ] Form und Farbe je Knoten stammen aus dem Preset; fehlt der `graph`-Block, wird deterministisch aus dem Typschlüssel abgeleitet und die Ansicht bleibt funktionsfähig
- [ ] Der Fokusmodus dunkelt Nicht-Nachbarn ab, entfernt sie aber nicht aus der Leinwand
- [ ] Kantenbeschriftungen erscheinen im Fokusmodus und ab Zoomstufe 1,4 — sonst nicht
- [ ] Ein Klick auf eine Kante zeigt mindestens eine Herkunftsnotiz oder erklärt, warum keine existiert
- [ ] Vorschläge sind ohne Legende von kanonischen Einträgen unterscheidbar (gestrichelter Rand)
- [ ] Bei über 1 500 sichtbaren Knoten erscheint die Filteraufforderung, bevor das Layout gerechnet wird
- [ ] Die Ansicht ist per Tastatur navigierbar: Tab wandert zwischen Knoten, Enter fokussiert, Esc verlässt den Fokusmodus
- [ ] Der Graph zeigt keine Entität, die der Betrachter nicht auch in der Liste sehen dürfte (Sichtbarkeit serverseitig gefiltert)

> **Phasenzuordnung:** V1.2. Der Graph setzt Entitäten *und* Beziehungen voraus, ist also
> erst nach V1.1 baubar. Er ist bewusst **nach** der Review-Inbox eingeordnet: ein schöner
> Graph über einem leeren Wissensstand beweist nichts.

#### 4.4.6 Onboarding — vom ersten Login bis zur ersten strukturierten Notiz

Die Kernkennzahl „< 3 Minuten bis zur ersten strukturierten Notiz" wird hier gewonnen oder
verloren. Leitgedanke: **nichts erklären, was man auch zeigen kann** — und nichts zeigen,
was gerade nicht gebraucht wird.

**Fall A — eingeladenes Mitglied (der häufige Fall)**

| Schritt | Bildschirm | Was passiert | Zeitbudget |
|---------|-----------|--------------|-----------:|
| 1 | Einladungslink | Zeigt sofort Projektname, wer eingeladen hat und die **Preset-Terminologie in einem Satz**: „Du wirst Teil von *Produktteam Nord*. Ihr arbeitet in **Sprints** und haltet **Meetings** ab." | 10 s |
| 2 | Registrierung | Nur E-Mail, Passwort, Anzeigename. Keine Profilbilder, keine optionalen Felder | 30 s |
| 3 | Profil anlegen | Der Participant-Typ aus dem Preset mit **nur den Pflichtfeldern**. Optionale Felder hinter „Mehr Angaben" eingeklappt. Überschrift in Preset-Sprache: „Leg dein **Teammitglied** an" / „Erstell deinen **Charakter**" | 45 s |
| 4 | Direkt ins Ziel | Kein Dashboard-Umweg: Führt das Meeting bereits, landet die Person **direkt im Meeting-Raum**. Sonst in der Arbeitsgruppen-Übersicht | 5 s |
| 5 | Meeting-Raum, erster Besuch | Cursor steht im Notizfeld. **Ein einziger** kontextueller Hinweis direkt am Feld: „Tipp `@`, um Personen, Orte oder Entscheidungen zu markieren." Dazu, falls zutreffend, der Transparenzhinweis aus §4.2.3 — beide zusammen, nicht nacheinander | 20 s |
| 6 | Erste Erwähnung | Beim ersten `@` zeigt die Auswahl einen einzeiligen Kopf: „Wähle einen bestehenden Eintrag oder leg einen neuen an." Erscheint nur beim allerersten Mal | 30 s |

**Summe: ≈ 2:20 min** — mit Puffer unter der Zielmarke.

**Fall B — Lead legt ein neues Projekt an**

| Schritt | Bildschirm | Was passiert |
|---------|-----------|--------------|
| 1 | Registrierung | wie oben |
| 2 | Projekt anlegen | Name + **Preset-Auswahl als Karten**, nicht als Auswahlliste. Jede Karte zeigt: Preset-Name, ein Satz Beschreibung, die Ebenenbezeichnungen („Projekt → Sprint → Meeting") und die drei häufigsten Entitätstypen als Chips. Damit ist die Tragweite der Entscheidung ohne Vorwissen sichtbar |
| 3 | Erste Arbeitsgruppe | Vorbelegt mit einem Namensvorschlag aus dem Preset („Sprint 1" / „Kampagne 1"), mit einem Klick übernehmbar |
| 4 | Einladen | Einladungslink sofort sichtbar und kopierbar, mit dem Hinweis, wie viele Personen typischerweise sinnvoll sind |
| 5 | Erstes Meeting | „Jetzt starten" oder „Für später planen" — beides ein Klick |

**Was bewusst NICHT stattfindet:**

- Keine mehrseitige Produkttour und keine Overlay-Serie mit „Weiter"-Schaltflächen
- Keine Beispieldaten im echten Projekt (verschmutzen den Wissensstand von Anfang an)
- Keine Erklärung der drei Sichtbarkeitsstufen im Voraus — der Umschalter steht sichtbar
  am Notizfeld und zeigt beim ersten Überfahren einen Einzeiler je Stufe
- Keine Aufforderung, das Profil zu vervollständigen

**Akzeptanzkriterien:**

- [ ] Ein eingeladenes Mitglied erreicht von der Registrierung bis zur ersten gespeicherten Notiz höchstens vier Bildschirme
- [ ] Beim Anlegen des Profils sind ausschließlich Felder mit `required: true` sichtbar; optionale sind eingeklappt
- [ ] Führt das Meeting bereits, wird nach dem Profil direkt der Meeting-Raum geöffnet, nicht das Dashboard
- [ ] Der `@`-Hinweis und der Transparenzhinweis erscheinen **gemeinsam** und **einmalig** je Account und Projekt
- [ ] Die Preset-Auswahl beim Projektanlegen zeigt je Preset die Ebenenbezeichnungen und mindestens drei Entitätstypen, ohne dass ein Dialog geöffnet werden muss
- [ ] Ein neu registriertes Mitglied sieht zu keinem Zeitpunkt einen generischen Begriff („Entität", „Arbeitsgruppe", „Container")

#### 4.4.7 Responsives Verhalten

| Bereich | Desktop (≥ 1280 px) | Tablet (768–1279 px) | Mobil (< 768 px) |
|---------|---------------------|----------------------|------------------|
| Meeting-Raum | drei Spalten nebeneinander | Notizfeld + einklappbarer Feed | Reiter „Meine Notiz / Feed"; `@`-Auswahl als Vollbild-Blatt |
| Review-Inbox | Warteschlange + Detail nebeneinander | Detail als Overlay | nur Lesezugriff, Hinweis „Kanonisierung am Desktop" |
| Entitäten-Liste | volle Tabelle | reduzierte Spalten | Kartenansicht |
| Beziehungs-Graph | volle Leinwand + Filterleiste | Filterleiste als Overlay | nur Lesen, Filter vorab gesetzt; Hinweis „Karte am Desktop bearbeiten" |

> Mobil ist in V1 ausdrücklich **Nutzbarkeit, nicht Optimierung**. Die Kanonisierung ist
> auf Mobilgeräten bewusst nicht vorgesehen.

---

### 4.5 Daten- und Geschäftslogik

| Regel | Festlegung |
|-------|------------|
| **Auflösung der Terminologie** | Jedes UI-Label wird zur Laufzeit aus dem `PresetBinding` des Projekts aufgelöst. Fällt ein Label, wird der generische Schlüssel angezeigt und ein Fehler protokolliert — nie ein hartkodierter Fachbegriff. |
| **Vorschlag vs. kanonisch** | Entitäten haben den Zustand `suggested` oder `canonical`. Erwähnungen dürfen auf beide zeigen; nur `canonical` erscheint standardmäßig in Listen und Auswertungen. |
| **Herkunft** | Jede Entität hält eine n:m-Verknüpfung zu allen `Mention`s, aus denen sie hervorging. Wird eine Notiz gelöscht, bleibt die Entität bestehen, die Herkunft wird als „Quelle entfernt" markiert. |
| **Zusammenführen** | Beim Merge übernimmt die Zielentität: alle Herkünfte, alle Beziehungen (Duplikate verworfen), den Titel der Quelle als Alias. Leere Zielfelder werden aus der Quelle gefüllt, gefüllte nie überschrieben. Der Vorgang ist protokolliert und innerhalb von 30 Tagen umkehrbar. |
| **Beziehungsrichtung** | Beziehungen werden einmal gerichtet gespeichert und beidseitig angezeigt (`label` / `inverse_label`). |
| **Löschen einer Entität** | Nur Lead/Kurator. Beziehungen werden mitgelöscht, Erwähnungen in Notizen werden zu einfachem Text zurückgestuft (Text bleibt erhalten). |
| **Sichtbarkeitsdurchsetzung** | Ausschließlich serverseitig. Der Client erhält private Notizen anderer gar nicht erst — kein reines UI-Ausblenden. |
| **Vererbung** | Mitgliedschaft gilt projektweit; Arbeitsgruppen erben sie. Eine Einschränkung des Zugriffs auf einzelne Arbeitsgruppen ist in V1 **nicht** vorgesehen. |
| **Nachvollziehbarkeit jeder Änderung** | Jede Änderung an einer kanonischen Entität — ob durch Kanonisierung, durch manuelle Bearbeitung oder durch Zusammenführen — wird als Eintrag in der Änderungshistorie festgehalten mit: Zeitpunkt, handelnde Person, geändertes Feld (vorher/nachher), **Auslöser** (`Kanonisierung` / `manuelle Bearbeitung` / `Zusammenführung`) und, sofern vorhanden, der Verweis auf Notiz, Meeting und Arbeitsgruppe. Damit ist zu jedem Zeitpunkt beantwortbar, aus welcher Sitzung ein bestimmter Wissensstand stammt. |
| **Bearbeitung nach Kanonisierung** | Der Autor darf seine Notiz weiterhin bearbeiten, auch wenn daraus bereits kanonisiert wurde. Die abgeleitete Entität bleibt unverändert; die Herkunftsverknüpfung wird als „Quelle nachträglich geändert" markiert und der ursprüngliche Textausschnitt bleibt als Momentaufnahme erhalten. Jede inhaltliche Übernahme ins Projektwissen ist damit ein eigener, datierter Vorgang — unabhängig davon, wann sie erfolgt. |
| **Löschen eines Accounts** | Notizen werden anonymisiert (Autor → „Ehemaliges Mitglied"), kanonisierte Entitäten bleiben unverändert bestehen. |
| **Zeitzonen** | Speicherung in UTC, Anzeige in der lokalen Zeitzone des Betrachters. |

---

### 4.6 Backend- und Schnittstellenbedarf

**Fachliche Ebene (Produkt):**

- Authentifizierung: Registrierung, Login, Passwort zurücksetzen, Session
- Einladungen: signierte Links mit Ablaufdatum und Widerrufsmöglichkeit
- Projekt-, Arbeitsgruppen-, Meeting-Verwaltung inklusive Zustandsübergängen
- Notizen: anlegen, bearbeiten, Sichtbarkeit ändern, automatisches Speichern
- Live-Feed geteilter Notizen — Aktualisierung innerhalb von ca. 2 s ist ausreichend
- Erwähnungen und Vorschläge
- Entitäten: CRUD, unscharfe Suche, Zusammenführen, Beziehungen
- Preset: Import, Validierung, Bindung an Projekt, additive Erweiterung
- Vorbereitung AI (nicht aktiv): Ist in den Einstellungen ein API-Schlüssel hinterlegt,
  erscheint pro Meeting die Aktion „Notizen analysieren", die zusätzliche Vorschläge in
  **dieselbe** Review-Inbox einstellt — mit gekennzeichneter Quelle `ai` statt `manual`

> ⚠️ **Technische Ausgestaltung folgt im SRD** — Endpunkte, Datenbankschema für dynamische
> Felder (Spalten vs. JSONB vs. EAV), Transportweg des Live-Feeds (Polling / SSE / WebSocket),
> Suchimplementierung (Trigram / Volltext), Autorisierungsschicht.

---

### 4.7 Terminologie und Sprachen

Zwei getrennte Ebenen, die nicht vermischt werden dürfen:

| Ebene | Quelle | Beispiel |
|-------|--------|----------|
| **UI-Sprache** | Sprachdateien der Anwendung (de / en) | „Speichern", „Einstellungen", „Abbrechen" |
| **Fachterminologie** | Preset des Projekts | „Sprint", „Session", „NSC", „Komponente" |

Ein Preset kann Terminologie je Sprache hinterlegen (`terminology.de`, `terminology.en`).
Fehlt eine Sprache, greift die Standardsprache des Presets. V1 liefert beide Presets
zweisprachig aus.

---

## 5. Datenerfassung (Telemetrie)

Bewusst minimal und self-hosted-freundlich — keine externen Analysedienste, alles lokal
in der eigenen Datenbank, standardmäßig aktiviert und abschaltbar.

| Ereignis | Zweck | Bezug zum Erfolgsmaß |
|----------|-------|----------------------|
| `meeting_completed` | Anzahl Meetings je Arbeitsgruppe | „5 aufeinanderfolgende Treffen" |
| `note_created` mit Sichtbarkeitsstufe | Werden die drei Stufen tatsächlich genutzt? | Kernmechanik-Validierung |
| `mention_created` mit `method: keyboard\|ui` | Welcher Weg wird genutzt? | E-07 rechtfertigt zwei Wege oder nicht |
| `suggestion_resolved` mit Entscheidung und Latenz | Wie schnell wird kanonisiert? | Risiko R-03 messbar |
| `entity_merged` | Wie oft entstehen Duplikate? | Wirksamkeit der Duplikatvermeidung |
| `time_to_first_structured_note` | Zeit vom Beitritt bis zur ersten Erwähnung | Zielmarke < 3 Minuten |
| `preset_id` bei Projektanlage | Nutzung je Preset | Nachweis Domain-Neutralität |

Kein A/B-Testing in V1 — die Nutzerbasis ist dafür zu klein.

---

## 6. Nichtfunktionale Anforderungen

### 6.1 Leistung

- Meeting-Raum interaktiv in < 1,5 s bei 200 vorhandenen Notizen
- Erwähnungs-Auswahl < 150 ms bei 5 000 Entitäten im Projekt
- Automatisches Speichern < 300 ms serverseitig
- Live-Feed-Verzögerung ≤ 2 s
- Zielgröße: 50 Projekte, 5 000 Entitäten und 20 000 Notizen je Instanz ohne spürbaren Abfall

### 6.2 Ausfallsicherheit und Rückfallverhalten

- **Verbindungsverlust beim Schreiben:** lokaler Zwischenspeicher, sichtbarer Offline-Hinweis, automatische Synchronisation. Notizen gehen nie verloren — höchste Priorität
- **Live-Feed nicht verfügbar:** Meeting-Raum bleibt voll nutzbar; Feed zeigt „Aktualisierung unterbrochen, erneut versuchen"
- **Preset-Auflösung schlägt fehl:** generische Schlüssel anzeigen statt Absturz; Projekt bleibt lesbar
- **AI-Schnittstelle nicht erreichbar (später):** Schaltfläche deaktiviert mit Hinweis; alle manuellen Wege unberührt

### 6.3 Barrierefreiheit

- Vollständige Tastaturbedienbarkeit des Meeting-Raums inklusive Erwähnungs-Auswahl
- Erwähnungs-Auswahl als korrekte ARIA-Combobox mit `aria-activedescendant`
- Sichtbarkeitsstufen nie allein über Farbe kommuniziert (Symbol + Text)
- Kontrastverhältnis ≥ 4,5:1; sichtbarer Fokusindikator durchgängig
- Live-Feed-Aktualisierungen als `aria-live="polite"`

### 6.4 Sicherheit und Datenschutz

- Autorisierung **ausschließlich serverseitig**; jede Abfrage prüft Mitgliedschaft und Sichtbarkeit
- Markdown-Rendering mit strikter Bereinigung (kein rohes HTML, kein `javascript:`)
- Einladungslinks: signiert, ablaufend, einzeln widerrufbar
- Passwörter mit Argon2id gehasht; Ratenbegrenzung beim Login
- Datenexport und -löschung je Account (DSGVO-Auskunft und -Löschung)
- Der Zustand von `lead_can_read_private` ist im Prüfprotokoll nachvollziehbar und für
  Mitglieder in den Projekteinstellungen jederzeit einsehbar

### 6.5 SEO

Nicht anwendbar — die Anwendung liegt vollständig hinter der Anmeldung. Nur die
öffentliche Projektseite (Repository/Landingpage) ist indexierbar.

---

## 7. Auslieferungsstrategie

### 7.1 Phasenschnitt

Der bestätigte V1-Umfang ist für ein Solo-Vorhaben groß (siehe Problem Framing, R-06).
Vorgeschlagener Schnitt in zwei lauffähige Stufen:

| Stufe | Inhalt | Demonstrierbar als |
|-------|--------|--------------------|
| **V1.0 — Nutzbare Schleife** | Accounts, Einladung, Projekt/Arbeitsgruppe/Meeting, Notizen mit drei Sichtbarkeitsstufen, Live-Feed, Preset-Import + beide Presets, Terminologie-Auflösung, Teilnehmerprofile | „Die Gruppe kann damit ein echtes Meeting protokollieren" |
| **V1.1 — Wissensschicht** | Erwähnungen (`@` und UI), Entitäten-Liste und -Detail, Beziehungen, Review-Inbox, Zusammenführen, Herkunftsnachweis, additive Preset-Erweiterung | „Aus Meetings entsteht ein Wissensstand" |
| **V1.2 — Beziehungs-Graph** | Graph-Leinwand mit Preset-gesteuerten Formen und Farben, Typ- und Zeitfilter, Fokusmodus, Kanten-Herkunft | „Man *sieht*, wie das Wissen zusammenhängt" — zugleich das stärkste Bild für die Abschlussdemo |
| **V2 — Backlog** | AI-Extraktion, Timeline, Karten, Suche über Projekte hinweg, Export/Backup, SaaS-Mandantenfähigkeit und Abrechnung, Live-Co-Editing, Preset-Editor im UI, mobile App | — |

**Warum dieser Schnitt:** V1.0 ist bereits ohne Wissensschicht ein benutzbares Werkzeug und
kann mit der eigenen Gruppe getestet werden — die Rückmeldung daraus fließt in V1.1 ein,
bevor der aufwändigste Teil (generische Entitätsformulare, Review-Inbox) gebaut ist.
Wichtig: Das Preset-System liegt **vollständig in V1.0**, weil es die Datenstruktur
bestimmt und nachträglich nicht einziehbar wäre.

### 7.2 Abhängigkeiten und Reihenfolge

1. Preset-Format und Validierung (blockiert alles Weitere)
2. Datenmodell inklusive Ablage der dynamischen Felder → **SRD-Entscheidung**
3. Authentifizierung und Autorisierung (Sichtbarkeit hängt daran)
4. Meeting-Raum und Notizen
5. Live-Feed
6. Erwähnungen und Vorschläge
7. Entitätsformulare (generisches Rendering)
8. Review-Inbox
9. Zusammenführen und Herkunft

### 7.3 Freigabe

Selbstgehostete Anwendung ohne Stufenrollout. Freigabe per versioniertem Docker-Image;
Rücknahme durch Zurücksetzen auf das vorherige Image. Datenbankmigrationen ausschließlich
additiv und rückwärtskompatibel, damit ein Zurückspringen ohne Datenverlust möglich bleibt.

---

## 8. Offene Punkte

| # | Punkt | Warum wichtig | Vorschlag |
|---|-------|---------------|-----------|
| ~~O-01~~ | ~~Gültigkeitsbereich des Participants~~ | — | **Geklärt (E-12):** Projektebene, mehrere Profile je Account möglich, Zuordnung zu Arbeitsgruppen |
| **O-02** | Ablage der dynamischen Felder: JSONB vs. EAV vs. Spalten je Typ | Bestimmt Filterbarkeit, Leistung und Migrationsaufwand | SRD-Entscheidung mit Begründung, Tendenz: JSONB mit Ausdrucksindizes |
| ~~O-03~~ | ~~Bearbeitung nach Kanonisierung~~ | — | **Geklärt:** Bearbeitung bleibt erlaubt, Entität unberührt, Herkunft markiert (siehe §4.5) |
| **O-04** | Endgültiger Produktname | „Notella" ist Arbeitstitel, „Archivium"/„EverLore" sind domänen­gebunden | Nach dem Mockup entscheiden |
| **O-05** | Verhalten bei Preset-Wechsel eines bestehenden Projekts | Ist derzeit ausgeschlossen — genügt das? | Vorschlag: in V1 dauerhaft ausgeschlossen, stattdessen additive Erweiterung |
| ~~O-06~~ | ~~Umfang der Änderungshistorie~~ | — | **Geklärt:** Entitäten werden vollständig historisiert **inklusive Auslöser und Notiz-/Meeting-Herkunft**; Notiztexte selbst werden nicht versioniert (siehe §4.5) |

---

## 9. Verantwortungsmatrix

Bei Solo-Entwicklung trägst du alle Rollen — die Spalten benennen die Perspektive, die
beim Prüfen des jeweiligen Abschnitts einzunehmen ist.

| Abschnitt | Produkt | Design | Entwicklung |
|-----------|:-------:|:------:|:-----------:|
| 2. Hintergrund | R | C | I |
| 3. Überblick | R | C | I |
| 4.0 Domänenmodell | R | I | C |
| 4.1 Preset-System | R | C | **R** |
| 4.2 Rollen & Rechte | R | C | C |
| 4.3 Nutzerflüsse | R | **R** | C |
| 4.4 Frontend | C | **R** | C |
| 4.5 Datenlogik | R | I | C |
| 4.6 Backend | R | I | **R** |
| 4.7 Terminologie | R | C | C |
| 5. Telemetrie | R | I | C |
| 6. Nichtfunktional | C | C | **R** |
| 7. Auslieferung | R | I | C |

R = verantwortlich · C = mitprüfend · I = informiert

---

## 10. Nächster Schritt

→ **`03-SRD.md`** — technische Lösungsrichtung: Stack-Empfehlung mit Begründung,
Datenbankschema für dynamische Felder (O-02), Autorisierungsarchitektur, Live-Feed-Transport,
Suchstrategie, Preset-Validierung, Migrationskonzept, Aufwandsschätzung je Phase.
