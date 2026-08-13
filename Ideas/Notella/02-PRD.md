# PRD — Notella (Arbeitstitel)

### Domain-agnostische Note-Taking-Engine für gemeinsam arbeitende Gruppen

> **Version:** V0.9
> **Datum:** 2026-08-13
> **Autor:** Sam (Digitale Leute School — AI Software Engineering)
> **Vorgänger:** `01-Problem-Framing.md` (v0.3)
> **Nachfolger:** `03-SRD.md` → `04-Screen-Inventar.md` → Mockup
> **Projekttyp:** Cross-Page-Flow · Rollen-Differenzierung · phasiertes Rollout
>
> ⚠️ **V0.9 ist eine grundlegende Überarbeitung.** Mehrere in V0.1–V0.8 festgeschriebene
> Entscheidungen wurden zurückgenommen. Maßgeblich ist ab hier das Leitbild
> **„Versionskontrolle für Wissen"** aus `01-Problem-Framing.md` sowie die Festlegungen
> E-14…E-30 ebendort. Wo dieses Dokument und das Problem Framing sich widersprechen, gilt
> das Problem Framing.

---

## 1. Revisionshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| **V0.9** | **2026-08-13** | **Sam** | **Grundüberarbeitung nach der Architektur-Reflexion (E-14…E-30).** §3 um das Leitbild „Versionskontrolle für Wissen" ergänzt · §4.0 Domänenmodell: `NoteVersion` neu, `PresetBinding` entfällt, Meeting-Zeitstempel ergänzt · §4.1 Presets werden ausgeliefert statt importiert, Feldtypen reduziert, einsprachig · §4.2 Kurator-Rolle gestrichen, zwei Sichtbarkeiten statt drei · **§4.4.1 und §4.4.2 vollständig neu geschrieben** (Notizblock, zweiphasige Kuration) · §4.5 Historie dauerhaft statt befristet · §7 Stufenschnitt bis V1.3 |
| V0.2 | 2026-08-07 | Sam | O-01 geklärt (E-12: mehrere Teilnehmerprofile je Account und Projekt) · O-03 und O-06 geklärt und in §4.5 als Datenregeln aufgenommen · `participant_scope` aus beiden Presets entfernt |
| V0.3 | 2026-08-07 | Sam | §4.4.5 Onboarding-Fluss ergänzt (Review-Lücke geschlossen) · nachfolgende Abschnitte umnummeriert |
| V0.4 | 2026-08-07 | Sam | **Beziehungs-Graph** als §4.4.5 aufgenommen und aus dem V2-Backlog in eine eigene Phase **V1.2** gehoben · Preset um `graph.shape`/`graph.color`/`graph.style` erweitert (§4.1.2b) · responsives Verhalten und Screen-Liste ergänzt |
| V0.8 | 2026-08-07 | Sam | **§4.4.1 Meeting-Raum auf eine zentrierte Spalte reduziert.** Kontextpanel (Team, „Gehört zu", „Frühere") gestrichen — jedes Element war entweder Dopplung zu Breadcrumb und Symbolleiste oder Nebeninformation. Der Live-Feed wird zur **Schublade** mit demselben Muster wie die Herkunftsansicht im Wiki; Anwesenheit und ungelesene Beiträge stecken im Umschalter |
| V0.7 | 2026-08-07 | Sam | **§4.4.0 auf drei Chrome-Stufen reduziert.** Die vierte Stufe („Immersion“ ohne Rahmenwerk) wurde verworfen — sie erzeugte je Bildschirm einen anderen Rückweg. Konsistenz vor Reduktion: alle Fokus-Bildschirme teilen dieselbe Symbolleiste. Neue Regeln zu Layoutstabilität und Übergangsverhalten beim Ausfahren |
| V0.6 | 2026-08-07 | Sam | §4.4.0 Navigationsmodell mit Chrome-Stufen neu · **§4.4.3 zum Wiki umgebaut**: zweispaltig mit Wissensbaum, zwei Gliederungen (nach Eintrag / nach Zeitpunkt), Herkunft als einfahrendes Panel mit den Reitern Herkunft und Verlauf · Chrome-Stufe je Screen in §4.4.4 ergänzt |
| V0.5 | 2026-08-07 | Sam | **§4.4.2 Kuration vollständig neu geschrieben.** Schnelldurchlauf statt Liste+Detail · drei Kartenarten mit je einer binären Frage · Pflichtfelder als Chip-Reihe · Kontextanforderungen explizit · kein Stapelweg (bewusste Entscheidung) · Reihenfolge chronologisch nach Meeting · Tastaturbedienung als Kernanforderung mit Zielmarke < 6 s je Vorschlag |

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
| **Zugehörige Anforderung** | `01-Problem-Framing.md` v0.3, Entscheidungen E-01…E-30 |
| **Design** | `04-Screen-Inventar.md` · Mockup als Vorarbeit vorhanden (Requirements-Werkzeug, keine Codebasis) |
| **Plattform** | Web (Desktop-first, responsive bis Tablet). Mobile App: nicht in V1 |
| **Sprache** | **V1 einsprachig Deutsch** (E-30). Fachterminologie kommt vollständig aus dem Preset |
| **Betriebsmodell** | Self-hosted / Open Source (Docker Compose). SaaS-Freemium als spätere Option, Datenmodell mandantenfähig vorbereitet |
| **Kernfunktion** | Teilnehmende schreiben in Treffen einzelne Notizen mit zwei Sichtbarkeiten und typisieren Inhalte im Schreibfluss zu Entitäten und Beziehungen. Der Lead geht die Notizen anschließend in einem zweiphasigen Durchgang durch und überführt Vorschläge in den verbindlichen Projektstand. Alle Typen, Felder und Bezeichnungen stammen aus einem **ausgelieferten** Domain-Preset |
| **Screens (V1)** | Anmeldung · Beitritt per Einladung mit Profilwahl · Dashboard · Projektübersicht · Arbeitsgruppen-Übersicht · Meeting-Raum (Notizblock) · Entitäten-Liste · Entitäten-Detail / Wiki · **Beziehungs-Graph** · Kuration · Teilnehmerprofil · Projekteinstellungen |

### 3.1 Das Erklärmodell: Versionskontrolle für Wissen

Notellas Kernverantwortung ist **ein** Zustandsübergang: eine Beobachtung aus einem Moment
in verbindliches Gruppenwissen überführen, ohne zu verlieren, woher sie stammt. Dieser
Übergang wird durchgehend nach dem Vorbild von Versionskontrolle modelliert — das ist die
gemeinsame Sprache, in der dieses Dokument geschrieben ist.

| Git | Notella | In diesem Dokument |
|-----|---------|--------------------|
| Commit | **Notiz-Version** — unveränderlich, datiert, mit Autor | §4.4.1, §4.5 |
| Änderung auf einem Branch | **Vorschlag** — Entität oder Beziehung, noch nicht kanonisch | §4.5 |
| Pull Request | **Kuration** — der Lead geht die Notizen eines Treffens durch | §4.4.2 |
| Merge | **Kanonisierung** | §4.4.2, §4.5 |
| Log | **Historie** — dauerhaft, zurückspulbar | §4.5, §4.4.3 |
| Revert | eine **neue Änderung**, die einen alten Stand wiederherstellt | §4.5 |
| Auto-Merge | **V1.3:** die KI kanonisiert, der Mensch entscheidet bei Unsicherheit | §7.1 |

Zwei Begriffe, die dabei sauber getrennt bleiben müssen:

- **Sichtbarkeit** ist eine Eigenschaft der **Notiz** und beantwortet: *wer sieht diesen Text?*
  Zwei Werte, „Für mich" und „Für Team".
- **Kanonisch** ist eine Eigenschaft der **Entität** und beantwortet: *gilt das für die Gruppe?*

In früheren Fassungen war „kanonisch" eine dritte Sichtbarkeitsstufe der Notiz. Das
vermischte beide Fragen und war die Ursache mehrerer Widersprüche im Dokument.

---

## 4. Produktanforderungen

### 4.0 Domänenmodell & Terminologie

Der Kern kennt **zwölf** Objekte. Alles Fachliche ist Preset-Konfiguration.

> Bis V0.8 stand hier „neun", während die Tabelle darunter zehn Zeilen hatte. In V0.9 sind
> `NoteVersion` und `ChangeEntry` hinzugekommen und `PresetBinding` entfallen; die Zahl ist
> jetzt gegen die Tabelle geprüft.

```text
Account                        (Person, systemweit, passwortgeschützt)
  └── Membership                (Account ↔ Projekt, trägt Systemrolle)

Project           «Welt»            / «Projekt»       ← trägt preset_key (unveränderlich)
  ├── Participant «Charakter»       / «Teammitglied»  ← Entität, an Account gebunden
  ├── Entity      «NPC/POI/Item…»   / «Component/Decision…»
  │     └── Relation  (gerichtet, typisiert)
  ├── ChangeEntry (Historieneintrag: Schnappschuss + Auslöser + Herkunft)
  └── WorkGroup   «Kampagne»        / «Sprint / Teilgruppe»
        └── Meeting «Session»       / «Meeting»   (geplant → laufend → beendet)
              └── Note              (Autor, Sichtbarkeit, Kurationszustand)
                    └── NoteVersion (unveränderlich, datiert — die aktuellste gilt)
                          └── Mention (Textstelle → Entität oder Vorschlag)
```

> **Geändert in V0.9:** `PresetBinding` ist entfallen — das Preset wird ausgeliefert und am
> Projekt nur noch per Schlüssel referenziert (E-01). Neu sind `NoteVersion` (E-15) und
> `ChangeEntry` als eigenständiges Objekt, weil die Historie ein Lesepfad ist und keine
> Nebenaufzeichnung (§4.4.3 gliedert das Wiki nach Zeitpunkt).

**Terminologie-Regel:** Die Anwendung zeigt Endnutzenden **niemals** generische Begriffe
wie „Entität", „Container" oder „Arbeitsgruppe". Jedes sichtbare Label wird zur Laufzeit
aus dem Preset aufgelöst. Generische Begriffe erscheinen ausschließlich in der
Preset-Verwaltung und in der Dokumentation.

**Kernobjekte im Detail:**

| Objekt | Beschreibung | Gültigkeitsbereich |
|--------|--------------|--------------------|
| **Account** | Person mit Benutzername und Passwort. Systemweit eindeutig. Kann in mehreren Projekten Mitglied sein und wechselt zwischen ihnen **ohne Neuanmeldung**. Entsteht ausschließlich durch Einlösen eines Einladungslinks (E-29). | global |
| **Membership** | Verbindet Account und Projekt, trägt die Systemrolle (Lead / Member). | pro Projekt |
| **Project** | Oberster fachlicher Container. Trägt den **Schlüssel** des gewählten Presets; nach der Anlage unveränderlich. | — |
| **Participant** | Das fachliche Profil einer Person im Projekt (Charakter / Teammitglied). Ein ganz normaler Entitätstyp aus dem Preset, zusätzlich an genau einen Account gebunden. Kann Ziel und Quelle von Beziehungen sein. **Ein Account darf mehrere Profile im selben Projekt besitzen** und ordnet jedes einer oder mehreren Arbeitsgruppen zu. | pro Projekt, zugeordnet zu Arbeitsgruppen |
| **WorkGroup** | Parallele Arbeitsstränge innerhalb eines Projekts. Mehrere gleichzeitig aktiv (Breakout-Gruppen, parallele Sprints, parallele Kampagnen). | pro Projekt |
| **Meeting** | Ein Treffen mit Zustandsmaschine (geplant → laufend → beendet). Trägt geplantes Datum sowie `started_at` und `ended_at`, aus denen die Laufzeitanzeige und die Markierung „nachträglich ergänzt" abgeleitet werden. | pro WorkGroup |
| **Note** | **Ein einzelner Notizeintrag** eines Autors in einem Treffen (E-14) — nicht das gesamte Protokoll dieser Person. Trägt Autor, Sichtbarkeit („Für mich" / „Für Team") und Kurationszustand (offen / abgeschlossen). Der Text selbst liegt in den Versionen. | pro Meeting + Autor |
| **NoteVersion** | Der unveränderliche Textstand einer Notiz zu einem Zeitpunkt (E-15). Bearbeiten erzeugt eine neue Version; angezeigt wird überall die neueste. Ältere Versionen sind nur in Kuration und Herkunftsansicht einsehbar (E-17). | pro Note |
| **Mention** | Verknüpfung einer Textstelle **in einer Notiz-Version** mit einer bestehenden Entität *oder* einem Vorschlag. Weil die Version unveränderlich ist, kann eine Erwähnung nicht verrutschen. | pro NoteVersion |
| **Entity** | Ein typisierter Wissenseintrag im Projekt. Basisfelder + preset-definierte Felder. Zustand `suggested` oder `canonical`. | pro Project |
| **Relation** | Gerichtete, typisierte Verbindung zweier Entitäten. Ebenfalls mit Zustand — auch eine Beziehung kann Vorschlag sein. | pro Project |
| **ChangeEntry** | Ein Punkt auf dem Zeitstrahl des Projektwissens: vollständiger Schnappschuss der geänderten Entität oder Beziehung, mit Zeitpunkt, handelnder Person, Auslöser und Verweis auf Notiz-Version, Treffen und Arbeitsgruppe. Dauerhaft, nie gelöscht (E-25). | pro Project |

> **Geklärt (E-12, E-29) — Identität in drei Ebenen**
>
> | Ebene | Fachlich | Entsteht durch |
> |-------|----------|----------------|
> | **Betreiberkonto** | Lead / DM / Administration | Anlage beim Aufsetzen der Instanz |
> | **Teilnehmerkonto** | Teilnehmer / Spieler / Angestellte | Einlösen eines Einladungslinks |
> | **Profil (Participant)** | Charakter / Teammitglied / Rolle | Im Projekt angelegt und beim Beitritt gewählt |
>
> Das Teilnehmerprofil lebt auf **Projektebene** und ist eine vollwertige Entität im
> Projektwissen. Ein Account darf im selben Projekt **mehrere** Profile besitzen.
> Der Mechanismus dafür ist der Einladungslink: *ein Link führt zu einem Profil*. Soll eine
> Person zwei Charaktere in derselben Welt spielen, verschickt der Lead eine zweite Einladung.
> Für die Anwendung ist es unerheblich, ob hinter zwei Profilen ein Mensch oder zwei stehen —
> es braucht also weder ein Preset-Flag noch eine eigene Profilverwaltung.
>
> **Konsequenz für die UI:** Beim Beitritt zu einer Arbeitsgruppe fragt die Anwendung,
> ob ein bestehendes Profil verwendet oder ein neues angelegt werden soll — *„Kampagne als
> Thalia Windmar beitreten"* oder *„Neuen Charakter erstellen"*. Existiert noch keines, wird
> der Anlage-Schritt ohne Rückfrage gezeigt.
>
> **Offen (O-12):** Das Anlegen eines Profils ist der einzige Vorgang, bei dem ein Member
> eine Entität in kanonischer Qualität erzeugt, ohne dass ein Lead kuratiert. Für V1 gilt:
> Profile sind vom Kurationsweg ausgenommen und sofort gültig — sie beschreiben die
> schreibende Person selbst, nicht das gemeinsame Wissen. Ihre **Beziehungen** zu anderen
> Entitäten durchlaufen dagegen die normale Kuration.

---

### 4.1 Preset-System (Herzstück)

#### 4.1.1 Was ein Preset definiert

Ein Preset ist eine deklarative **YAML-Datei, die mit dem Deployment ausgeliefert wird**
(E-01). Es legt fünf Dinge fest:

1. **Formatversion** — die Version der Konfigurationssprache, nicht des Inhalts
2. **Terminologie** der drei Hierarchieebenen und des Participants, inklusive der
   Textbausteine, die sich nicht generisch zusammensetzen lassen (§4.7)
3. **Entitätstypen** mit Feldern (Typ, Pflichtfeld ja/nein, Optionen)
4. **Beziehungstypen** mit erlaubter Quelle und erlaubtem Ziel
5. **Verhaltens-Flags** — in V1 nur noch der Sichtbarkeits-Default je Notiz

> **Geändert in V0.9:** Die Flags „Lead-Einsicht in Private" und „Delegation erlaubt" sind
> entfallen (E-05 gestrichen, E-24). Es gibt keine Preset-Verwaltung, keinen Import und keine
> Erweiterung zur Laufzeit — wer ein Preset ändern will, ändert die Datei und liefert neu aus.
> Eine **Formatversion** ist neu und notwendig: sie erlaubt, die Konfigurationssprache später
> weiterzuentwickeln, ohne bestehende Projekte zu brechen. Sie ist ausdrücklich etwas anderes
> als eine Inhaltsrevision des einzelnen Presets.

#### 4.1.2 Unterstützte Feldtypen (V1)

Maßstab für die Auswahl ist die **Kuration**: Ein Pflichtfeld muss dort in Sekunden
beantwortbar sein (E-26). Alles, was zum Nachdenken zwingt, verlangsamt genau den Schritt,
an dem das Produkt steht oder fällt.

| Typ | Beschreibung | Zusatzparameter | Als Pflichtfeld |
|-----|--------------|-----------------|-----------------|
| `text` | Einzeiliger Text | `max_length` | ✅ |
| `select` | Auswahl aus fester Liste | `options[]` | ✅ |
| `date` | Kalenderdatum (ohne Uhrzeit, ohne Zeitzone) | — | ✅ |
| `reference` | Verweis auf eine andere Entität | `target_type` (Entitätstyp oder `any`) | ✅ |
| `longtext` | Mehrzeiliger Freitext | — | ❌ **nie** |

Jedes Feld kennt zusätzlich: `key`, `label`, `required: true|false`, `help` (Hilfetext),
`show_in_list: true|false` (erscheint in der Listenansicht).

> **Geändert in V0.9:** `number` ist entfallen — kein ausgeliefertes Preset braucht es, und
> jeder Typ kostet Validierung, Eingabeelement, Anzeige, Listenzelle und Filterlogik. Kommt
> zurück, sobald ein Preset ihn belegbar benötigt. `longtext` bleibt, darf aber **nie**
> `required: true` tragen: Ein Pflicht-Freitext wie „Begründung" ist mit der Zielmarke von
> unter sechs Sekunden je Vorschlag (§4.4.2) unvereinbar. Das ist eine Regel des
> Preset-Formats und wird beim Laden geprüft, nicht dem Preset-Autor überlassen.
>
> Bewusst **nicht** in V1: Mehrfachauswahl, Checkbox, URL, Datei-Upload, Formeln.
> Der Parameter `multiple: false` bei `select` ist ersatzlos gestrichen — ein Schlüssel, der
> nur einen Wert annehmen darf, lädt lediglich dazu ein, den anderen zu implementieren.

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

> **Anforderung an die ausgelieferten Presets (V0.9):** Der Fallback ist eine Absicherung,
> kein Auslieferungszustand. **Beide** mitgelieferten Presets müssen `graph`-Angaben für
> **jeden** Entitätstyp *und* **jeden** Beziehungstyp tragen. Andernfalls zeigt ausgerechnet
> der Bildschirm, der die Domänenneutralität beweisen soll, überwiegend automatisch vergebene
> Formen — und der Nachweis „dieselbe Karte, anderes Preset, kein Codeunterschied" verpufft.
>
> **Wertebereiche sind geschlossen.** `graph.shape` und `graph.style` sind Aufzählungen,
> `graph.color` ist eine Hex-Farbe nach festem Muster, `graph.weight` liegt zwischen 1 und 3.
> Das wird beim Laden geprüft (§4.1.5) — nicht, weil Presets fremde Eingaben wären, sondern
> weil ein Tippfehler sonst als undefinierter Wert in die Darstellung durchschlägt.

#### 4.1.3 Beispiel-Preset A — Software-Projekt (Beachhead)

```yaml
# yaml-language-server: $schema=../schema/preset.schema.json
preset:
  key: software-project
  format_version: 1            # Version der Konfigurationssprache (siehe §4.1.1)
  content_version: 2           # Revision dieses Presets — rein informativ
  name: "Software-Projekt"
  description: "Produkt- und Entwicklungsteams mit Sprints und Meetings"

terminology:
  project:      { singular: "Projekt",      plural: "Projekte" }
  workgroup:    { singular: "Sprint",       plural: "Sprints" }
  meeting:      { singular: "Meeting",      plural: "Meetings" }
  participant:  { singular: "Teammitglied", plural: "Team" }
  canon:        { verb: "übernehmen", noun: "Projektwissen" }

# Sätze, die sich nicht aus Bausteinen zusammensetzen lassen (§4.7).
# Ausgeschrieben statt grammatisch komponiert — bei zwei kuratierten Presets
# ist das billiger und lesbarer als ein Genus-System.
texts:
  empty_workgroups:  "Noch keine Sprints. Der erste ist schnell angelegt."
  empty_meetings:    "In diesem Sprint gibt es noch kein Meeting."
  empty_knowledge:   "Hier entsteht euer Projektwissen, sobald die ersten Notizen kuratiert sind."
  join_new_profile:  "Neues Teammitglied anlegen"
  join_existing:     "Als {name} beitreten"

behavior:
  default_note_visibility: team          # mine | team

entity_types:
  - key: teammember
    label: "Teammitglied"
    is_participant: true                 # dieser Typ wird beim Beitritt angelegt
    icon: user
    graph: { shape: circle, color: "#7a7f8c" }
    fields:
      - { key: role,   label: "Rolle",       type: select, required: true,
          options: ["Product", "UI/UX", "Frontend", "Backend", "Data", "QA", "Sonstige"],
          show_in_list: true }
      - { key: focus,  label: "Schwerpunkt", type: text,   required: false }

  - key: component
    label: "Komponente"
    icon: box
    graph: { shape: roundrect, color: "#2fb8a0" }
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
    graph: { shape: diamond, color: "#5340c4" }
    fields:
      - { key: decided_on, label: "Entschieden am", type: date,   required: true }
      - { key: status,     label: "Status",         type: select, required: true,
          options: ["Gültig", "Überholt", "Zurückgenommen"], show_in_list: true }
      # Begründung ist bewusst optional: ein Pflicht-Freitext ist in der Kuration
      # nicht in Sekunden zu beantworten (E-26). Nachtragen im Wiki bleibt möglich.
      - { key: rationale,  label: "Begründung",     type: longtext, required: false }

  - key: risk
    label: "Risiko"
    graph: { shape: star, color: "#c8553d" }
    fields:
      - { key: severity, label: "Schwere", type: select, required: true,
          options: ["Niedrig", "Mittel", "Hoch"], show_in_list: true }
      - { key: mitigation, label: "Gegenmaßnahme", type: longtext, required: false }

  - key: task
    label: "Aufgabe"
    graph: { shape: pentagon, color: "#3f7fd0" }
    fields:
      - { key: assignee, label: "Zuständig", type: reference, target_type: teammember,
          required: false, show_in_list: true }
      - { key: due,      label: "Fällig",    type: date, required: false }
      - { key: status,   label: "Status",    type: select, required: true,
          options: ["Offen", "In Arbeit", "Erledigt"], show_in_list: true }

relation_types:
  - { key: depends_on, label: "hängt ab von", inverse_label: "wird benötigt von",
      source: component, target: component, graph: { style: solid,  weight: 3 } }
  - { key: owns,       label: "verantwortet", inverse_label: "verantwortet von",
      source: teammember, target: component, graph: { style: solid,  weight: 1 } }
  - { key: affects,    label: "betrifft",     inverse_label: "betroffen von",
      source: decision,  target: any,        graph: { style: dashed, weight: 2 } }
  - { key: threatens,  label: "gefährdet",    inverse_label: "gefährdet durch",
      source: risk,      target: any,        graph: { style: dotted, weight: 2 } }
  - { key: implements, label: "setzt um",     inverse_label: "umgesetzt durch",
      source: task,      target: component,  graph: { style: solid,  weight: 2 } }
```

> **Hinweis zur doppelten Modellierung:** `component.owner` (Referenzfeld) und `owns`
> (Beziehungstyp) beschreiben dieselbe Tatsache auf zwei Wegen. Das ist ein Fehler in der
> Preset-Gestaltung, kein Fehler des Formats — er würde im Graph zwei Kanten für eine
> Zuständigkeit erzeugen. Vor Auslieferung ist einer der beiden Wege zu streichen; Vorschlag:
> das Referenzfeld behalten (es gehört in den Steckbrief) und `owns` entfernen.

#### 4.1.4 Beispiel-Preset B — TableTop (Machbarkeitsnachweis)

```yaml
# yaml-language-server: $schema=../schema/preset.schema.json
preset:
  key: tabletop-rpg
  format_version: 1
  content_version: 2
  name: "TableTop / Pen & Paper"
  description: "Rollenspielrunden mit Welten, Kampagnen und Sessions"

terminology:
  project:      { singular: "Welt",      plural: "Welten" }
  workgroup:    { singular: "Kampagne",  plural: "Kampagnen" }
  meeting:      { singular: "Session",   plural: "Sessions" }
  participant:  { singular: "Charakter", plural: "Charaktere" }
  canon:        { verb: "kanonisieren",  noun: "Weltwissen" }

texts:
  empty_workgroups:  "Noch keine Kampagne. Die erste ist schnell angelegt."
  empty_meetings:    "In dieser Kampagne gab es noch keine Session."
  empty_knowledge:   "Hier wächst euer Weltwissen, sobald die ersten Notizen kuratiert sind."
  join_new_profile:  "Neuen Charakter erstellen"
  join_existing:     "Als {name} beitreten"

behavior:
  default_note_visibility: mine          # im Spiel schreibt man erst mal für sich

entity_types:
  - key: character
    label: "Charakter"
    is_participant: true
    graph: { shape: hexagon, color: "#c9a227" }
    fields:
      - { key: class,      label: "Klasse", type: text,   required: true, show_in_list: true }
      - { key: background, label: "Hintergrund", type: longtext, required: false }

  - key: npc
    label: "NSC"
    graph: { shape: circle, color: "#f0a24b" }
    fields:
      - { key: alignment, label: "Gesinnung", type: select, required: false,
          options: ["Rechtschaffen", "Neutral", "Chaotisch", "Unbekannt"], show_in_list: true }
      - { key: status,    label: "Status", type: select, required: true,
          options: ["Lebendig", "Verstorben", "Verschollen"], show_in_list: true }

  - key: poi
    label: "Ort"
    graph: { shape: roundrect, color: "#4f9d69" }
    fields:
      - { key: region, label: "Region", type: text, required: false, show_in_list: true }
      - { key: kind,   label: "Art",   type: select, required: false,
          options: ["Stadt", "Dorf", "Verlies", "Bauwerk", "Wildnis"], show_in_list: true }

  - key: faction
    label: "Fraktion"
    graph: { shape: pentagon, color: "#8e5ea2" }
    fields:
      - { key: goal, label: "Ziel", type: longtext, required: false }

  - key: item
    label: "Gegenstand"
    graph: { shape: diamond, color: "#d06b8c" }
    fields:
      - { key: rarity, label: "Seltenheit", type: select, required: false,
          options: ["Gewöhnlich", "Ungewöhnlich", "Selten", "Legendär"], show_in_list: true }

  - key: event
    label: "Ereignis"
    graph: { shape: star, color: "#b8493a" }
    fields:
      - { key: happened_on, label: "Zeitpunkt (Ingame)", type: text, required: false }

relation_types:
  - { key: lives_in,   label: "lebt in",       inverse_label: "Bewohner",
      source: npc,       target: poi,     graph: { style: solid,  weight: 2 } }
  - { key: knows,      label: "kennt",          inverse_label: "bekannt mit",
      source: npc,       target: npc,     graph: { style: dashed, weight: 1 } }
  - { key: member_of,  label: "Mitglied von",   inverse_label: "Mitglieder",
      source: npc,       target: faction, graph: { style: solid,  weight: 3 } }
  - { key: owns_item,  label: "besitzt",        inverse_label: "im Besitz von",
      source: any,       target: item,    graph: { style: solid,  weight: 1 } }
  - { key: happened_at,label: "geschah bei",    inverse_label: "Ereignisse",
      source: event,     target: poi,     graph: { style: dotted, weight: 2 } }
  - { key: involved,   label: "beteiligt",      inverse_label: "beteiligt an",
      source: event,     target: any,     graph: { style: dotted, weight: 1 } }
```

**Nachweis der Abstraktion:** Beide Dateien nutzen exakt dieselben Schlüssel und
Feldtypen. Zwischen ihnen liegt keine Codezeile Unterschied.

> **Geändert in V0.9:** `level` (Typ `number`) ist entfallen — es war die einzige Verwendung
> dieses Feldtyps in beiden Presets, und eine Charakterstufe lässt sich als `select` oder
> `text` ebenso führen. Damit trägt V1 vier Feldtypen statt sechs (E-26). Beide Presets tragen
> jetzt vollständige `graph`-Angaben, auch an den Beziehungstypen — sonst wäre ausgerechnet
> der Nachweisbildschirm auf automatisch vergebene Formen angewiesen.

#### 4.1.5 Preset-Lebenszyklus & Schema-Evolution

| Vorgang | Verhalten |
|---------|-----------|
| **Auslieferung** | Presets liegen als YAML-Dateien im Repository und gehen mit dem Deployment. **Es gibt keinen Import zur Laufzeit und keine Preset-Verwaltung in der Anwendung.** |
| **Prüfung** | Beim Build **und** beim Start werden alle Presets gegen ein einziges Schema geprüft. Schlägt die Prüfung fehl, startet die Anwendung nicht — fail fast statt Fehlverhalten im Betrieb. Geprüft werden mindestens: bekannte `format_version`, geschlossene Wertebereiche für `graph.*`, gültige Feldtypen, `longtext` nie `required`, genau ein Typ mit `is_participant: true`, Quelle und Ziel jedes Beziehungstyps existieren, Obergrenzen für Textlängen und Optionslisten. |
| **Werkzeugunterstützung** | Aus demselben Schema wird ein JSON Schema erzeugt und in der Preset-Datei referenziert. Damit gibt es beim Schreiben eines Presets Autovervollständigung, Feldbeschreibungen und sofortige Fehlermarkierung im Editor — statt einer Fehleranzeige im Produkt. |
| **Projektanlage** | Der Lead wählt genau **eines** der ausgelieferten Presets. Am Projekt wird nur der **Schlüssel** gespeichert; nach der Anlage ist er unveränderlich. |
| **Aktualisierung über ein Release** | Preset-Änderungen zwischen zwei Releases müssen **rein additiv** sein: neue Entitätstypen, neue Beziehungstypen, neue optionale Felder, neue `select`-Optionen. |
| **Nicht erlaubt** | Typ löschen, Feld löschen, Feld von optional auf `required` heben, `select`-Option entfernen, Feldtyp ändern, `key` umbenennen. Solche Vorgänge erfordern eine ausdrückliche Migration (nicht in V1). |
| **Formatentwicklung** | Ändert sich die Konfigurationssprache selbst, steigt `format_version`. Die Anwendung lehnt unbekannte Formatversionen ab, statt sie zu raten. |

> **Geändert in V0.9 (E-01):** Import, Preset-Verwaltung und additive Erweiterung zur
> Laufzeit sind entfallen — ebenso die versionierte Preset-Kopie am Projekt. Ein Preset zu
> entwerfen ist eine hochrangige Aufgabe, keine Endnutzer-Funktion. Das streicht eine ganze
> Bildschirmfamilie, die zeilengenaue Fehlerausgabe und die gesamte Sicherheitsfläche
> fremder Konfigurationsdateien.
>
> Damit adressiert dieser Abschnitt Risiko **R-04** aus dem Problem Framing sogar stärker als
> zuvor: Es gibt im laufenden Betrieb schlicht keinen Weg mehr, ein Preset kaputtzuändern.
>
> **Später (Backlog):** Ein kuratierter Community-Prozess soll Presets von außen zulassen —
> eingereicht, geprüft, dann ausgeliefert. Das bringt fremde Eingabedateien zurück und ist
> deshalb eine eigene Ausbaustufe mit eigenem Bedrohungsmodell, kein Nachziehen dieses
> Abschnitts. Ein eigenständiger Preset-Editor, der YAML erzeugt, gehört in dieselbe Stufe:
> Er senkt die Einstiegshürde, ohne dass Presets zu Code werden.

---

### 4.2 Rollen & Rechte

#### 4.2.1 Rollen

| Rolle | Vergabe | Beschreibung |
|-------|---------|--------------|
| **Lead** | Ersteller des Projekts; übertragbar | Projektleitung / DM. Verwaltet Projekt, Mitglieder und Treffen, kuratiert und kanonisiert. |
| **Member** | Standard beim Beitritt | Schreibt Notizen, legt Vorschläge an, verwaltet die eigenen Profile. |

> **Geändert in V0.9 (E-24):** Die **Kurator**-Rolle ist entfallen und steht im Backlog.
> Sie war als Gegenmaßnahme gegen R-03 gedacht, aber nirgends vollständig durchgezogen.
> Damit liegt die gesamte Kurationslast beim Lead — siehe die neu bewertete Fassung von R-03
> im Problem Framing und die daraus folgenden Anforderungen E-22 und E-23.
>
> **Wichtig für die Umsetzung:** Berechtigungen werden als **Fähigkeiten** geprüft
> („darf kanonisieren"), nicht als Rollenvergleiche („ist Lead"). Dann kostet das Nachrüsten
> einer dritten Rolle eine Zeile statt einer Durchsicht aller Prüfstellen.

#### 4.2.2 Rechtematrix

| Aktion | Lead | Member |
|--------|:----:|:------:|
| Projekt anlegen / löschen | ✅ | ❌ |
| Preset bei der Projektanlage wählen | ✅ | ❌ |
| Einladungslink erzeugen / widerrufen | ✅ | ❌ |
| Passwort-Rücksetzlink ausstellen | ✅ | ❌ |
| Arbeitsgruppe anlegen / archivieren | ✅ | ❌ |
| Treffen anlegen / starten / beenden | ✅ | ❌ |
| Eigene Notiz schreiben / bearbeiten / löschen | ✅ | ✅ |
| Eigene Notiz-Sichtbarkeit ändern („Für mich" ↔ „Für Team") | ✅ | ✅ |
| Team-Notizen anderer lesen | ✅ | ✅ |
| **Alle** Notizen eines Treffens in der Kuration lesen | ✅ | ❌ |
| Vorschlag erzeugen (Erwähnung oder Markierung) | ✅ | ✅ |
| **Kanonisieren** (Vorschlag → Projektwissen) | ✅ | ❌ |
| Kanonische Entität bearbeiten / zusammenführen / löschen | ✅ | ❌ |
| Beziehungen im Wiki pflegen | ✅ | ❌ |
| Eigenes Profil anlegen / bearbeiten | ✅ | ✅ |
| Fremdes Profil bearbeiten | ✅ | ❌ |
| Projekt verlassen | ❌ (erst Lead übertragen) | ✅ |

> **Durchsetzung:** Dass eine Schaltfläche für eine Rolle nicht sichtbar ist, ist **keine**
> Berechtigungsprüfung. Jede Aktion ist ein serverseitig adressierbarer Endpunkt und prüft
> die Fähigkeit selbst. Die Negativtests dazu gehören in die Definition of Done (`03-SRD.md`
> §11.8).

#### 4.2.3 Sichtbarkeitsmodell

Zwei getrennte Fragen, die in früheren Fassungen vermischt waren:

**(a) Sichtbarkeit — eine Eigenschaft der Notiz.** *Wer sieht diesen Text?*

| Stufe | Wer sieht sie | Wer setzt sie |
|-------|---------------|---------------|
| **Für mich** | der Autor — sowie der Lead während der Kuration | Autor, je Notiz |
| **Für Team** | zusätzlich alle Mitglieder der Arbeitsgruppe, erscheint im Feed | Autor, je Notiz |

**(b) Kanonisch — eine Eigenschaft der Entität.** *Gilt das für die Gruppe?* Wird
ausschließlich in der Kuration gesetzt (E-20), niemals an der Notiz. Die Notiz bleibt beim
Autor und behält ihre Sichtbarkeit; die kanonisierte Entität verweist auf die **Notiz-Version**
als Herkunft.

> **Geändert in V0.9 (E-04, E-16):** Statt drei Stufen gibt es zwei — und „kanonisch" ist
> keine davon. Die Benennung ist bewusst „Für mich" statt „privat".

**Ehrlichkeitsregel (E-16) — ersetzt den Transparenzhinweis aus E-05:**

> Notella verspricht **keine** Vertraulichkeit. „Für mich" steuert, was **andere Teilnehmende**
> im Feed sehen — die Projektleitung sieht in der Kuration alle Notizen eines Treffens.

Das wird **einmal** gesagt: beim Onboarding, an der Stelle, an der die erste Notiz entsteht
(§4.4.6). Danach genügt ein zurückhaltendes Symbol am Sichtbarkeits-Umschalter. Kein
Dauerbanner, kein Preset-Flag, keine Ausnahme.

**Warum so:** Ein Werkzeug, dessen Zweck es ist, aus Notizen Gruppenwissen zu machen, kann
Vertraulichkeit nicht glaubhaft zusichern — spätestens beim Kanonisieren wäre sie ohnehin
aufgehoben. Ein Schalter, der Privatsphäre nur *manchmal* verspricht, ist schlechter als eine
klare Aussage: Er erzeugt genau die falsche Erwartung, die im Firmenkontext teuer wird. Wer
echte private Notizen braucht, soll ein Werkzeug benutzen, das darauf spezialisiert ist.

---

### 4.3 Nutzerflüsse (Cross-Page)

#### 4.3.1 Hauptfluss — vom Beitritt bis zum Projektwissen

| # | Screen | Nutzerhandlung | Ergebnis | Verzweigung |
|---|--------|----------------|----------|-------------|
| 1 | Einladung öffnen | Einladungslink aufrufen | Konto anlegen (Benutzername + Passwort) oder mit bestehendem Konto anmelden | Link abgelaufen oder widerrufen → Fehlerzustand mit Kontakt zum Lead |
| 2 | Beitritt | Profil wählen oder anlegen — *„Als Thalia beitreten"* / *„Neuen Charakter erstellen"* | Membership (Rolle: Member) + Participant-Entität | Noch kein Profil vorhanden → Anlage ohne Rückfrage |
| 3 | Dashboard | Projekt wählen | Projektkontext geladen, Terminologie aus dem Preset aufgelöst | Nur ein Projekt → direkt dorthin |
| 4 | Projektübersicht | Arbeitsgruppe wählen | Liste der Treffen | Keine Arbeitsgruppe → Leerzustand (Lead sieht Anlegen-Schaltfläche) |
| 5 | Arbeitsgruppen-Übersicht | Treffen öffnen / Lead startet Treffen | Meeting-Raum, Zustand *laufend* | Treffen *geplant* → Nur-Lese-Vorschau |
| 6 | **Meeting-Raum** | Notiz schreiben, `@` tippen **oder** Text markieren → typisieren | Notiz-Version + Erwähnungen gespeichert | Entität existiert noch nicht → Anlage an Ort und Stelle als *Vorschlag* |
| 7 | Meeting-Raum | Notiz abschicken | Notiz erscheint im eigenen Block; bei „Für Team" auch im Feed der anderen | Sichtbarkeit vor **und** nach dem Abschicken änderbar |
| 8 | Meeting-Raum | Abgeschickte Notiz nachbearbeiten | Neue Notiz-Version; angezeigt wird die neueste | Historie bleibt, ist hier aber nicht sichtbar (E-17) |
| 9 | Treffen beenden (Lead) | Treffen schließen | Zustand *beendet*; die Notizen stehen zur Kuration bereit | Nachträge bleiben unbegrenzt möglich |
| 10 | **Kuration, Phase 1** | Vorgetaggte Vorschläge abarbeiten: Übernehmen / Zusammenführen / Verwerfen | Entität wird kanonisch, Herkunft auf die Notiz-Version verknüpft | Duplikatverdacht → Zusammenführen |
| 11 | **Kuration, Phase 2** | Notizen durchgehen, Übersehenes markieren und typisieren, Beziehungen ergänzen | Weitere Entitäten und Beziehungen; Notiz wird als abgeschlossen markiert | Nichts zu ergänzen → Notiz mit einer Geste abschließen |
| 12 | Wissensliste / Wiki | Filtern, Beziehungen pflegen, Herkunft und Verlauf aufrufen | Übersicht und Sprung zurück zur Ursprungs-Notizversion | Leer → Text aus dem Preset (`texts.empty_knowledge`) |

**Datenübergabe zwischen Screens:**

- Projektübersicht → alle Unterseiten: `projectId` + aufgelöstes Preset-Schema (einmal
  geladen, im Client zwischengespeichert; jedes Label wird daraus aufgelöst)
- Meeting-Raum → Kuration: `meetingId`
- Kuration → Zusammenführen: `entityId` + Liste der Duplikatkandidaten
- Wiki → Notiz: `noteVersionId` + `mentionId` zum Anspringen und Hervorheben der Stelle

> **Geändert in V0.9:** Der Fluss hat einen Schritt weniger am Anfang (keine getrennte
> Registrierung, E-29) und einen mehr in der Mitte (Notiz abschicken, E-14). Die Kuration ist
> von einem auf zwei Schritte gewachsen (E-18) — das ist der bewusste Preis dafür, dass auch
> ungetaggtes Wissen das Projektwissen erreicht.

#### 4.3.2 Meeting-Zustandsmaschine

```text
   [geplant] ──Lead startet──▶ [laufend] ──Lead beendet──▶ [beendet]
       │                            │                          │
       │ Titel/Datum/Teilnehmer     │ Notizen schreiben        │ Notizen ergänzen
       │ bearbeitbar                │ Feed abrufbar            │ (nachträglich, kein Feed)
       │ keine Notizen              │ keine Kuration           │ Kuration möglich
       │                            │                          │
       └──────── Lead löscht ───────┴──────────────────────────┘
```

| Zustand | Notizen schreiben | Feed | Kuration | Sichtbar für |
|---------|-------------------|------|----------|--------------|
| geplant | nein | nein | nein | alle Mitglieder der Arbeitsgruppe |
| laufend | ja | ja (abrufbar) | nein | alle Mitglieder der Arbeitsgruppe |
| beendet | ja (nachträglich, unbegrenzt) | nein | ja | alle Mitglieder der Arbeitsgruppe |

Nachträge nach dem Beenden werden mit „nachträglich ergänzt" und Zeitstempel gekennzeichnet.

**Der Kurationszustand hängt an der Notiz, nicht am Treffen (E-21).** Ein Treffen ist
gemeinsames Brainstorming, kein abschließbarer Vorgang — es gibt keinen Zustand „durchkuriert".
Eine nachgereichte Notiz ist schlicht eine weitere offene Notiz; das Treffen zeigt nur an,
wie viele davon noch offen sind. Damit kann keine Warteschlange entstehen, die als erledigt
gilt und trotzdem weiterwächst.

---

### 4.4 Frontend-Anforderungen

#### 4.4.0 Navigationsmodell und Chrome-Stufen

> **Zwei Leitsätze, in dieser Rangfolge:**
> 1. **Der Weg zurück ist überall derselbe.** Konsistenz schlägt Reduktion. Ein Bildschirm,
>    der einen eigenen Ausweg erfindet, kostet mehr Aufmerksamkeit, als das eingesparte
>    Rahmenwerk zurückgibt.
> 2. **Was der aktuelle Task nicht braucht, wird nicht gezeigt** — innerhalb von Regel 1.

Daraus folgen **drei** Chrome-Stufen. Jeder Bildschirm gehört genau einer an.

| Stufe | Rahmenwerk | Bildschirme | Begründung |
|:-----:|-----------|-------------|------------|
| **Start** | Nur Kopfzeile mit Logo und Konto. **Keine Seitenleiste** | Alle Projekte (Startseite), Login, Einladung, Preset-Verwaltung | Hier ist noch **kein** Projekt gewählt. Eine Leiste mit projektspezifischen Punkten wäre widersprüchlich |
| **Orientierung** | Ebenenband + Breadcrumb + **ausgeklappte Seitenleiste** | Projekt-Dashboard, Arbeitsgruppen-Übersicht, Teilnehmerprofile | Wer hier steht, will fast immer *woandershin*. Navigation **ist** die Aufgabe |
| **Fokus** | Breadcrumb + Seitenleiste als **Symbolleiste (52 px)**, fährt beim Überfahren aus | Meeting-Raum, Projektwissen, Beziehungs-Graph, Kuration, Projekteinstellungen | Die Aufgabe ist Arbeiten oder Erkunden. Wege bleiben erreichbar, ziehen aber keine Aufmerksamkeit |

> **Verworfene vierte Stufe.** Ein früherer Entwurf gab Graph und Kuration eine
> rahmenlose „Immersions"-Stufe mit schwebender Rückweg-Pille und `Esc` als Ausweg. Das
> wurde verworfen: Es entstand für jeden Fokus-Bildschirm ein *anderer* Rückweg, und `Esc`
> als einziger sichtbarer Ausweg ist nicht auffindbar. **Immersion ist eine Eigenschaft der
> Inhaltsfläche, nicht der Navigation.** Graph und Inbox bekommen deshalb eine randlose,
> vollflächige Inhaltsfläche — aber dieselbe Symbolleiste wie jeder andere Fokus-Bildschirm.

**Regeln**

1. **Die Stufe ist eine Eigenschaft des Bildschirms**, nicht eine Nutzereinstellung. Es gibt
   keinen „Fokusmodus"-Schalter, den man finden muss.
2. **Es gibt genau einen Rückweg**, und der ist auf allen Fokus-Bildschirmen identisch: die
   Symbolleiste. `Esc` schließt Overlays, ist aber nie der einzige Weg irgendwohin.
3. **Das Ausfahren der Symbolleiste darf das Layout nicht verschieben.** Sie liegt absolut
   positioniert **über** dem Inhalt; die 52-px-Spur bleibt reserviert. Ein Umbruch des
   Inhalts beim Überfahren ist ein Fehler, kein Verhalten.
4. **Der Übergang ist weich:** rund 260 ms mit weicher Beschleunigung. Beschriftungen
   blenden sich ein, statt zu erscheinen. Ein ruckartiger Sprung liest sich als Fehlfunktion.
5. **Lokale Navigation ersetzt globale, sie ergänzt sie nicht.** Wo ein Bildschirm eine
   eigene Navigation mitbringt (der Wissensbaum im Wiki), bleibt die globale reduziert.
6. **`Strg`/`⌘ + K` öffnet die Befehlspalette** auf jeder Stufe — als Abkürzung für Geübte,
   nie als einziger Weg.

**Akzeptanzkriterien**

- [ ] Alle Fokus-Bildschirme zeigen dasselbe Navigationselement an derselben Stelle — es gibt keinen bildschirmspezifischen Rückweg
- [ ] Auf der Startseite „Alle Projekte" existiert keine Seitenleiste, weder ausgeklappt noch als Symbolleiste
- [ ] Beim Ausfahren der Symbolleiste ändert sich **keine** Position eines Inhaltselements — prüfbar über gleichbleibende Bounding-Boxen vor und nach dem Überfahren
- [ ] Der Übergang läuft über mindestens 200 ms mit weicher Beschleunigung; Beschriftungen wechseln über Deckkraft, nicht über Sichtbarkeit
- [ ] Graph und Kuration nutzen die volle Inhaltsfläche ohne Rahmen, behalten aber die Symbolleiste
- [ ] Inhalt, der schmaler als die Fläche ist (Kuration), wird zentriert und klebt nicht am Rand der Symbolleiste
- [ ] `Esc` ist auf keinem Bildschirm der einzige sichtbare Weg zurück
- [ ] Kein Bildschirm zeigt gleichzeitig eine globale und eine lokale Navigationsliste

#### 4.4.1 Meeting-Raum — der Notizblock

> **In V0.9 vollständig neu geschrieben (E-14, E-15, E-23).**
> Dieser Abschnitt und §4.4.2 sind zwei Seiten desselben Vorgangs und werden in gleicher
> Tiefe geführt: **Was hier gut gelöst ist, muss dort nicht nachgeholt werden.** Der
> Meeting-Raum ist die Nutzerseite der Kuration.

**Warum kein Dokument mehr.** Bis V0.8 hatte jede Person je Treffen *ein* Notizfeld. Das war
mit der Sichtbarkeit je Notiz unvereinbar: „Ich muss an die Kaffeepause denken" und „Wir
haben Postgres beschlossen" landeten im selben Text und hätten nur gemeinsam geteilt werden
können. Es war außerdem mit der Kuration unvereinbar — man kann ein durchgehendes Dokument
nicht Stück für Stück als erledigt markieren.

**Der Notizblock.** Eine Notiz ist ein einzelner Eintrag, meist ein bis drei Sätze:

```text
  Notiz schreiben  →  abschicken  →  nächste Notiz  →  …
```

**Aufbau: eine Spalte. Der Bildschirm ist die Schreibfläche.**

Eine **zentrierte Spalte von maximal ~840 px**. Die Randspalten früherer Entwürfe
(Teilnehmerliste, „Gehört zu Sprint 14", „Frühere Meetings") bleiben gestrichen — sie waren
Dopplungen zu Breadcrumb und Symbolleiste. Chrome-Stufe *Fokus*: Seitenleiste als
Symbolleiste, Feed nur auf ausdrückliche Anwahl.

| Element | Ort |
|---------|-----|
| Titel des Treffens + Zustandspille (`geplant` · `läuft · 24 min` · `beendet`) | Kopf der Spalte |
| **Feed-Umschalter** | rechts in derselben Zeile |
| **Notizstrom** — die eigenen Notizen, chronologisch, älteste oben | Mittlerer Bereich, scrollt |
| **Verfasser** — Eingabefeld, Sichtbarkeits-Umschalter, Kürzel-Fußzeile | fest am unteren Rand |

Der Verfasser bleibt an derselben Stelle stehen, während der Strom darüber wächst. Das ist
das Muster, das aus Nachrichtenwerkzeugen bekannt ist — und es hält die Schreibfläche an
einem festen Ort, statt sie mit jedem Eintrag wandern zu lassen.

**Abschicken.** `Enter` schickt ab, `Shift+Enter` erzeugt eine neue Zeile.

> Das ist bewusst herum: Wenn Abschicken die leichtere Geste ist, entstehen kurze Notizen mit
> je einem Gedanken — genau die Granularität, die Sichtbarkeit je Notiz und Kuration je Notiz
> überhaupt erst sinnvoll macht. Ein versehentlich zu früh abgeschickter Eintrag ist billig,
> weil Bearbeiten jederzeit möglich ist.

**Bearbeiten fühlt sich normal an, ist aber eine neue Version (E-15).**
Ein Klick auf die eigene Notiz macht sie an Ort und Stelle bearbeitbar; Abschicken ersetzt
die Anzeige. Technisch entsteht eine neue Version, die alte bleibt erhalten.

Für die schreibende Person ist davon **nichts** zu sehen außer einer zurückhaltenden
Markierung „bearbeitet". Kein Versionswähler, kein Verlauf, keine Warnung. Der Nutzen bleibt
erhalten: aus *„Tom macht Datenbank, 1 Woche"* darf später *„Wir haben gemeinsam besprochen,
dass Tom die Datenbank innerhalb der nächsten Woche übernimmt"* werden, ohne dass man beim
ersten Tippen schon druckreif formulieren muss.

**Sichtbarkeit je Notiz (E-04).** Der Umschalter im Verfasser gilt für die Notiz, die gerade
entsteht, und steht beim Betreten auf `default_note_visibility` aus dem Preset. An einer
bereits abgeschickten Notiz ist die Sichtbarkeit weiterhin änderbar. Zwei Werte, ausgeschrieben:
**„Für mich"** und **„Für Team"** — nie als Symbol allein, weil die Bedeutung zu wichtig ist,
um erraten zu werden.

**Typisierung — zwei gleichwertige Wege (E-07), beide beim Schreiben verfügbar:**

*Weg A — Tastatur:* `@` öffnet eine Auswahl direkt an der Cursorposition. Die Liste zeigt
zuerst passende bestehende Entitäten (Suche über Titel und Aliasse), darunter „Neu anlegen
als …" je Entitätstyp aus dem Preset. Bedienung per Pfeiltasten und Enter, ohne Maus.

*Weg B — Maus:* Text markieren → eine kontextuelle Leiste erscheint über der Auswahl mit den
Entitätstypen des Presets → Klick öffnet dieselbe Auswahl wie Weg A, mit dem markierten Text
als Vorbelegung.

Beide Wege stehen **allen Rollen** offen und erzeugen dieselbe Datenstruktur (`Mention`).
Weg B ist für Menschen der wichtigere: Beim Schreiben weiß man selten schon, dass ein Satz
strukturrelevant ist — man erkennt es einen Halbsatz später.

**Erwähnungen werden immer aufgelöst dargestellt.** Im Verfasser wie im Strom erscheint eine
Erwähnung als **Chip in der Farbe ihres Typs**, nie als Rohtext oder Auszeichnungssyntax. Wie
die Verknüpfung gespeichert wird, ist eine Frage des SRD und bleibt für Nutzende unsichtbar.

**Live-Taggen muss sich sichtbar auszahlen (E-23).**
Der Fokus während eines Treffens liegt beim eigenen Schreiben — Taggen darf sich nicht wie
eine zusätzliche Pflicht anfühlen, sondern muss erkennbar Arbeit sparen:

- Eine Notiz mit Erwähnungen trägt im Strom eine ruhige Markierung („2 markiert") — sie zeigt,
  dass hier bereits Vorarbeit geleistet wurde
- Der Kopfbereich zeigt eine unaufdringliche Bilanz des Treffens: *„12 Notizen · 7 markiert"*
- Beim Abschließen des Treffens erscheint dieselbe Bilanz als kurze Rückmeldung, die den
  Bezug herstellt: markierte Notizen sind in der Kuration in Sekunden erledigt, unmarkierte
  müssen gelesen werden

**Team-Notizen als Schublade, abrufbar statt aufgedrängt (E-27).**

Während eines Treffens ist die eigene Notiz die Aufgabe — auch für die Leitung. Ein permanent
sichtbarer Feed konkurriert mit genau der Aufmerksamkeit, die Zuhören und Mitschreiben braucht.

- Ein Umschalter oben rechts öffnet eine **von rechts einfahrende Schublade** mit den
  Team-Notizen — **dasselbe Muster wie die Herkunftsansicht im Wiki** (§4.4.3). Ein Muster,
  zwei Anwendungen, dieselbe Geste
- Die Schublade wird **abgerufen**: sie zeigt den Stand beim Öffnen und trägt ein
  Aktualisieren-Symbol. Kein Server-Push, kein automatisches Nachladen im Hintergrund
- Der Umschalter trägt einen **Avatar-Stapel der Anwesenden**. Eine Zählmarke neuer Beiträge
  ist erwünscht, aber **nicht verpflichtend**: Sie wird nur umgesetzt, wenn sie ohne
  zusätzlichen technischen Aufwand aus der ohnehin nötigen Abfrage abfällt. Der übliche Anlass
  zum Aktualisieren ist Interesse, nicht Dringlichkeit
- Neue Beiträge erzeugen auf dem Hauptbildschirm **keine** Bewegung, kein Aufblitzen, keinen
  Vorschautext
- `Esc` schließt die Schublade

**Duplikatvermeidung an der Quelle (E-28).**

- Die Auswahl gleicht **normalisiert** ab: Groß-/Kleinschreibung, Satzzeichen und Leerraum
  werden vereinheitlicht, gesucht wird über Titel **und** Aliasse
- Treffer über einen Alias werden mit dem kanonischen Namen angezeigt
  („Tänzelndes Pony → *Alias von* The Dancing Pony")
- Bestehende Entitäten stehen **immer** über „Neu anlegen"; das Anlegen kostet einen zweiten
  bewussten Klick
- Stimmt ein neuer Titel normalisiert mit einem bestehenden überein, erscheint vor dem
  Speichern ein Hinweis mit Verweis auf den Kandidaten

> **Geändert in V0.9:** Die unscharfe Ähnlichkeitssuche mit 80-%-Schwelle ist entfallen. Die
> Fälle, die zählen, sind Schreibweise und Zeichensetzung — Tippfehlertoleranz kostet ein
> Zusatzmodul samt Kalibrierung, und die anspruchsvolle Bewertung übernimmt ab V1.3 ohnehin
> die KI.

**Offline und Verbindungsverlust.** Nicht abgeschickte Notizen liegen lokal und werden nach
Rückkehr der Verbindung abgeschickt. Weil eine abgeschickte Notiz unveränderlich ist, kann
dabei nichts überschrieben werden — das Nachspielen erzeugt schlicht Einträge in der
richtigen Reihenfolge. Der Zustand ist sichtbar („nicht gesendet"), nie stillschweigend.

**Akzeptanzkriterien:**

- [ ] Eine Notiz entsteht als eigener Eintrag; der Strom zeigt sie chronologisch mit Zeitstempel
- [ ] `Enter` schickt ab, `Shift+Enter` erzeugt eine neue Zeile; der Verfasser leert sich und behält den Fokus
- [ ] Der Sichtbarkeits-Umschalter steht beim Betreten auf `default_note_visibility` des Presets und ist je Notiz auch nach dem Abschicken änderbar
- [ ] Beide Sichtbarkeiten sind als Wort lesbar, nicht nur als Symbol oder Farbe
- [ ] Eine auf „Für mich" gesetzte Notiz erscheint bei **keinem** anderen Mitglied in der Schublade
- [ ] Bearbeiten einer abgeschickten Notiz ändert die Anzeige und erzeugt intern eine neue Version; im Meeting-Raum ist davon nur die Markierung „bearbeitet" sichtbar
- [ ] Im Meeting-Raum gibt es **keinen** Zugang zu älteren Versionen (E-17)
- [ ] Beim Tippen von `@` öffnet die Auswahl innerhalb von 150 ms und zeigt maximal 8 Treffer
- [ ] Die Auswahl ist vollständig per Tastatur bedienbar (↑ ↓ Enter Esc)
- [ ] Text markieren öffnet dieselbe Auswahl mit dem markierten Text als Vorbelegung
- [ ] Die angebotenen Entitätstypen entsprechen exakt den `entity_types` des Projekt-Presets — kein hartkodierter Typ erscheint
- [ ] Erwähnungen erscheinen im Verfasser **und** im Strom als aufgelöster Chip in Typfarbe; Auszeichnungssyntax ist nie sichtbar
- [ ] Stimmt ein neu angelegter Titel normalisiert mit einer bestehenden Entität desselben Typs überein, erscheint vor dem Speichern ein Duplikathinweis
- [ ] Notizen mit Erwähnungen sind im Strom als vorbereitet erkennbar; der Kopfbereich zeigt die Bilanz „N Notizen · M markiert"
- [ ] Nach Verbindungsverlust und Rückkehr geht keine geschriebene Notiz verloren; nicht gesendete Notizen sind als solche gekennzeichnet
- [ ] Im Zustand *geplant* ist der Verfasser nicht bedienbar und nennt den Grund
- [ ] Nach dem Beenden geschriebene Notizen tragen sichtbar „nachträglich ergänzt"
- [ ] Der Meeting-Raum zeigt außer der zentrierten Spalte keine dauerhaft sichtbaren Nebenbereiche
- [ ] Team-Notizen anderer erscheinen ausschließlich in der Schublade, nie auf dem Hauptbildschirm
- [ ] Die Schublade nutzt dieselbe Komponente und Öffnungsrichtung wie die Herkunftsansicht im Wiki und aktualisiert nur auf ausdrückliche Anforderung

#### 4.4.2 Kuration

> **In V0.9 neu geschrieben (E-18…E-22).** Der Schnelldurchlauf aus V0.5 bleibt erhalten —
> er ist als **Phase 1** die Grundlage. Neu ist **Phase 2**, weil sich nicht darauf verlassen
> lässt, dass Teilnehmende während eines Gesprächs sinnvoll taggen. Ohne sie erreicht alles
> ungetaggte Wissen das Projektwissen nie.

> **Der anstrengendste Bildschirm der gesamten Kette — und damit der, der am stärksten
> optimiert gehört.** Alles davor (schreiben, markieren) passiert im Fluss eines Treffens.
> Die Kanonisierung passiert danach, allein, ohne Gesprächsdruck — und genau deshalb wird
> sie übersprungen, wenn sie sich nach Arbeit anfühlt. **Risiko R-03, verschärft**, weil die
> Kurator-Delegation entfallen ist (E-24) und Phase 2 zusätzliche Arbeit bedeutet.

##### 4.4.2.1 Entwurfsprinzipien

Sechs Regeln, aus denen sich alles Weitere ableitet. Die ersten fünf sind bewusst als Verbote
formuliert, weil die erste Fassung dieses Bildschirms an genau diesen Punkten scheiterte.

| # | Prinzip | Was daraus folgt |
|---|---------|------------------|
| **P-1** | **Eine Frage pro Karte — wörtlich.** | Es gibt nicht *eine* Karte mit vier Knöpfen, sondern **drei Kartenarten** mit je einer binären Frage (4.4.2.4). Welche erscheint, entscheidet die Datenlage, nicht der Nutzer. |
| **P-2** | **Entscheiden und Ausfüllen sind getrennte Handlungen.** | Ein Formular mitten in einer Entscheidung ist der Hauptgrund für Überforderung. Pflichtfelder werden zu **antippbaren Chips** — eine zweite Mikro-Entscheidung, kein Eingabefeld (4.4.2.6). |
| **P-3** | **Genau ein gefüllter Knopf auf dem Bildschirm.** | Die Primärhandlung ist farbig und groß. Alles Weitere ist Text ohne Rahmen. Wer nichts liest, klickt trotzdem richtig. |
| **P-4** | **Nichts anbieten, was gerade keine Frage ist.** | „Zusammenführen" erscheint **ausschließlich** bei Duplikatverdacht — dann aber als eigene Kartenart. Leere Abschnitte werden nicht gezeigt, auch nicht ausgegraut. |
| **P-5** | **Kontext ist nicht Beiwerk, sondern der Entscheidungsgrund.** | Der Lead kann nur zustimmen, was er nachvollziehen kann. Die Belegstelle ist deshalb **das größte Element der Karte** — nicht ein Zitatkästchen am Rand (4.4.2.5). |
| **P-6** *(neu)* | **Es muss sich lohnen.** | Fortschritt ist sichtbar, jeder Abschluss wird quittiert, und offene Arbeit wird nie als Mahnung dargestellt. Das ist eine **Anforderung** (E-22), keine Verzierung — siehe 4.4.2.8. |

**Zielmarken:** Median **unter 6 Sekunden** je Vorschlag in Phase 1 und **unter 10 Sekunden**
je Notiz in Phase 2, jeweils bei reiner Tastaturbedienung. Das ist die eigentliche
Anforderung — alles Übrige ist Mittel zum Zweck.

##### 4.4.2.2 Zwei Phasen in einem Fluss

Die Einheit der Kuration ist das **Treffen**; der Zustand „erledigt" hängt an der **Notiz**
(E-21). Der Lead durchläuft ein Treffen in zwei Durchgängen:

```text
   Phase 1 — Durchlauf          Phase 2 — Durchsicht
   ────────────────────         ─────────────────────
   Vorgetaggte Vorschläge       Alle Notizen des Treffens,
   als Karten, binär,           chronologisch. Bestätigte
   schnell abarbeiten.          Stellen sind bereits Chips.
                          →     Übersehenes markieren,
   Ab V1.3 liefert hier               Beziehungen ergänzen,
   die KI die Vorarbeit.        Notiz abschließen.
```

**Phase 1 ist der Normalfall, Phase 2 das Sicherheitsnetz.** Je besser im Treffen getaggt
wurde, desto kürzer wird Phase 2 — genau der Zusammenhang, den §4.4.1 den Schreibenden
sichtbar macht (E-23).

**Der Einstieg ist frei.** Der Lead kann Phase 1 überspringen und direkt in die Durchsicht
gehen; offene Vorschläge erscheinen dann als Chips in der jeweiligen Notiz. Umgekehrt gilt:
Ein Treffen ist erst durchgesehen, wenn **jede** Notiz abgeschlossen wurde — Phase 1 allein
schließt keine Notiz ab, weil sie nichts darüber aussagt, was **nicht** getaggt wurde.

> **Kein Stapelweg (E-13 des Problem Framings, bestätigt).** Jede Übernahme bleibt eine
> Einzelentscheidung, damit sich durch Gewöhnung nichts ins Projektwissen schleicht. Die Last
> je Vorschlag sinkt nicht durch Bündelung, sondern durch Geschwindigkeit — siehe Zielmarken
> und 4.4.2.9.

##### 4.4.2.3 Phase 1 — der Schnelldurchlauf

Kein Listen-plus-Detail-Bildschirm. **Ein Vorschlag füllt die Fläche**, nach der
Entscheidung rückt automatisch der nächste nach.

| Bereich | Inhalt |
|---------|--------|
| **Kopfleiste** | Wo stehe ich: Arbeitsgruppe › Treffen › Datum. Daneben ein **segmentierter Fortschrittsbalken** — ein Segment je Vorschlag, erledigte gefüllt |
| **Hauptspalte** (max. ~720 px) | Belegstelle → Vorschlag → offene Frage → Handlung. In dieser Reihenfolge, immer |
| **Kontextspalte rechts** (~240 px, rahmenlos) | Herkunft, Häufigkeit, verwandte vorhandene Einträge. Bewusst **visuell leise** |
| **Fußleiste** | Tastaturkürzel, dauerhaft sichtbar |

**Reihenfolge:** chronologisch nach Notiz innerhalb des Treffens — der Lead durchlebt den
Ablauf noch einmal und erkennt Zusammenhänge, die eine Sortierung nach Typ zerreißt.

##### 4.4.2.4 Die drei Kartenarten (Phase 1)

Welche Karte erscheint, ergibt sich aus der Datenlage. Der Lead wählt sie nie aus.

**Art A — „Neuer Eintrag?"** (Regelfall)

> Frage: *Gehört das ins Projektwissen?*
> **Übernehmen** (primär, gefüllt) · Ablehnen (Text) · Später (klein)

**Art B — „Ist das dasselbe?"** (bei normalisierter Titel- oder Alias-Übereinstimmung, E-28)

> Frage: *Ist das derselbe Eintrag wie ein bereits vorhandener?*
> Zwei Spalten nebeneinander, Feld für Feld vergleichbar, Belegstellen beider Seiten.
> **Ist dasselbe → zusammenführen** (primär) · **Ist etwas anderes → neu anlegen** (sekundär,
> aber deutlich sichtbar — hier sind beide Antworten gleich legitim) · Ablehnen (Text)
>
> Diese Karte ersetzt Art A vollständig. Ein Duplikatverdacht ist eine **andere Frage**,
> keine Zusatzoption an derselben Frage.
>
> **Geändert in V0.9:** Auslöser ist nicht mehr ein Ähnlichkeitswert über Schwellwert, sondern
> eine Übereinstimmung nach Normalisierung (Groß-/Kleinschreibung, Satzzeichen, Leerraum) über
> Titel und Aliasse. Damit erscheint die Karte seltener, aber ohne Fehlalarme und ohne
> Kalibrierungsaufwand. Unscharfe Erkennung kommt mit V1.3 zurück, dann KI-gestützt.

**Art C — „Ergänzung zu Vorhandenem?"** (Erwähnung zeigt auf eine bereits kanonische Entität
und bringt neue Information mit)

> Frage: *Soll diese Information zum vorhandenen Eintrag hinzukommen?*
> Zeigt den betroffenen Eintrag, die neue Aussage und was sich konkret ändern würde
> (neues Feld gefüllt, neue Beziehung, neue Herkunft).
> **Übernehmen** (primär) · Verwerfen (Text)

##### 4.4.2.4b Phase 2 — die Durchsicht

**Die Notiz ist die Karte.** Chronologisch, eine nach der anderen, wieder bildschirmfüllend
statt als Liste mit Detailbereich.

| Bereich | Inhalt |
|---------|--------|
| **Kopfleiste** | Treffen, Fortschritt in Notizen (*„Notiz 4 von 12"*), Autor der aktuellen Notiz |
| **Hauptfläche** | Der **vollständige Text der neuesten Notiz-Version**, gut lesbar gesetzt. Bereits bestätigte Stellen erscheinen als Chip in Typfarbe; noch offene Vorschläge als Chip mit Umriss |
| **Fußleiste** | Tastaturkürzel und der Abschlussknopf |

**Was der Lead hier tun kann:**

1. **Lesen** — das ist der Hauptzweck. Eine Notiz ohne Handlungsbedarf wird mit einer Taste
   abgeschlossen; das ist der häufigste Fall und muss der schnellste sein
2. **Übersehenes markieren** — Text markieren → Entitätstypen des Presets erscheinen →
   Entität anlegen oder bestehende zuordnen. Dieselbe Geste wie im Meeting-Raum (E-07)
3. **Beziehungen ergänzen** — siehe 4.4.2.7
4. **Offene Vorschläge dieser Notiz entscheiden**, falls Phase 1 übersprungen wurde
5. **Notiz abschließen** — eine bewusste Geste des Leads, kein abgeleitetes Kriterium

**Der Abschluss ist die einzige Stelle, an der eine Notiz „fertig" wird.** Auch wenn alle
Vorschläge einer Notiz in Phase 1 entschieden wurden, bleibt sie offen, bis der Lead sie
gesehen hat — denn Phase 1 kann per Definition nichts darüber aussagen, was **nicht** getaggt
wurde.

**Notizen mit Sichtbarkeit „Für mich" erscheinen hier ebenfalls** (E-16). Sie sind als solche
gekennzeichnet, damit der Lead einordnen kann, dass die schreibende Person sie nicht für die
Gruppe gedacht hatte — was am Umgang mit ihrem Inhalt nichts ändert, wohl aber an dessen
Gewichtung.

##### 4.4.2.5 Kontext — was der Lead zum Verifizieren braucht

Die Belegstelle allein genügt nicht. Vier Angaben, alle **ohne Klick sichtbar**:

| Angabe | Warum sie über die Entscheidung entscheidet | Darstellung |
|--------|---------------------------------------------|-------------|
| **Der Absatz, nicht der Satz** | Ein einzelner Satz ist oft mehrdeutig. Der umgebende Absatz macht klar, ob es sich um eine Festlegung oder eine beiläufige Erwähnung handelt | Hauptelement der Karte, größte Schrift nach dem Titel, markierte Stelle hervorgehoben |
| **Häufigkeit und Streuung** | „3-mal über 2 Meetings" ist fast sicher relevant, „1-mal beiläufig" oft nicht. Das stärkste Einzelsignal überhaupt | Zeile über der Belegstelle: *3 Erwähnungen · 2 Meetings*, aufklappbar zu den anderen Fundstellen im Wortlaut |
| **Wer und wo** | Eine Aussage der Projektleitung wiegt anders als eine Randnotiz | Kontextspalte: Autor mit Avatar, Arbeitsgruppe › Meeting, Zeitpunkt |
| **Was es schon gibt** | Verhindert Doppelanlagen, die unterhalb des Duplikat-Schwellwerts liegen | Kontextspalte: bis zu 5 vorhandene Einträge desselben Typs, alphabetisch, als reine Liste |

Zusätzlich **auf Klick**: die vollständige Ursprungsnotiz im Overlay, mit der Stelle
hervorgehoben — für den seltenen Fall, dass der Absatz nicht reicht.

##### 4.4.2.6 Pflichtfelder als Chips

**Grundregel (E-26):** Ein Pflichtfeld muss hier in Sekunden beantwortbar sein. `longtext`
darf deshalb nie `required` sein, und `number` gibt es in V1 nicht. Übrig bleiben `text`,
`select`, `date` und `reference` — alle vier sind in einer Geste erledigt.

**Pflicht heißt „nötig, um kanonisch zu werden" — nicht „nötig, um zu existieren."**
Ein Vorschlag entsteht im Treffen mit kaum mehr als einem Titel; das ist der Normalfall und
kein Fehlerzustand. Erst die Kanonisierung verlangt vollständige Angaben. Diese Unterscheidung
ist verbindlich für die Umsetzung: Pflichtfelder werden **beim Übergang nach kanonisch**
geprüft, niemals beim Anlegen.

Ein `select`-Pflichtfeld erscheint **nicht** als Auswahlliste mit „— bitte auswählen —",
sondern als Reihe antippbarer Chips:

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
- **Vorbereitung auf V1.3:** Ist die KI aktiv, ist der wahrscheinliche Chip bereits ausgewählt
  und mit einem dezenten Punkt markiert. Der Lead bestätigt oder korrigiert mit einem Klick.
  Das Layout bleibt identisch — der Übergang zur KI-Unterstützung ändert nichts am Bildschirm,
  nur die Menge der offenen Fragen sinkt

##### 4.4.2.7 Beziehungen — in derselben Geste (E-19)

Beziehungen sind das, was eine Wissenssammlung von einer Liste unterscheidet — und zugleich
das, was am seltensten getaggt wird. Sie brauchen deshalb einen Weg **innerhalb** der
Kuration, ohne dass daraus ein zweiter Durchgang je Notiz wird.

**Die Geste:** Entität anklicken → *„Neue Beziehung"* → Beziehungstyp wählen → **Schnellsuche
über das gesamte Projekt**.

```text
   [npc:Tom Hellbringer]  →  Neue Beziehung  →  „ist Wirt in"  →  Tän▊
                                                                   └─ Tänzelndes Pony
                                                                      Zum Goldenen Hirsch
```

- Angeboten werden nur Beziehungstypen, deren `source`/`target` zum gewählten Paar passen —
  die Regelprüfung passiert **vor** der Auswahl, nicht als Fehlermeldung danach
- In der Trefferliste stehen Entitäten **aus derselben Notiz oben**: sie sind der häufigste
  Fall, weil im selben Satz genannt
- Darunter das ganze Projekt, normalisiert durchsucht über Titel und Aliasse
- Kein eigener Bildschirm, kein Overlay über der Notiz, keine zweite Karte

**Wo die Grenze verläuft.** Die Kuration fängt das Offensichtliche im Fluss ab. Wer eine
Entität in Ruhe mit dem gesamten bekannten Wissen verknüpfen will, tut das im **Wiki**
(§4.4.3) und später im **Graph** (§4.4.5). Jede Entität in der Kuration trägt deshalb einen
Verweis auf ihren Wiki-Eintrag — der Ausstieg aus der Kuration ist immer eine Verlinkung, nie
eine Sackgasse.

##### 4.4.2.8 Nach der Entscheidung — und warum es sich lohnen muss (P-6, E-22)

**Sofortiges Verhalten:**

- **Keine Bestätigungsdialoge.** Jede Handlung wird sofort ausgeführt
- **Rückgängig statt Nachfragen:** ein schmaler Hinweis am unteren Rand,
  *„Notification Service übernommen · Rückgängig (Z)"*, für 8 Sekunden
- **Automatisch weiter** zum nächsten Vorschlag bzw. zur nächsten Notiz, ohne Ladeunterbrechung
- **Ablehnen** verlangt keinen Grund. Ein optionales Feld erscheint erst auf Klick

**Belohnung als Anforderung, nicht als Verzierung.** Die Kuration ist die Stelle, an der
Notella steht oder fällt: Wird sie übersprungen, bleibt das Projektwissen leer und das Werkzeug
degradiert zum Notizspeicher. Sie muss sich deshalb gut anfühlen — nachprüfbar, nicht
stimmungsabhängig:

| Anforderung | Konkret |
|-------------|---------|
| **Jeder Abschluss wird quittiert** | Eine abgeschlossene Notiz gleitet sichtbar in einen Erledigt-Zustand; der Fortschrittsbalken füllt ein Segment. Kurz, ruhig, ohne Konfetti — spürbar, nicht albern |
| **Fortschritt ist immer sichtbar** | Notizen und Vorschläge als Segmente, nicht als Zahl allein. Man sieht, wie nah das Ende ist |
| **Offene Arbeit ist keine Mahnung** | Zähler für offene Notizen erscheinen **nie** in Warnfarbe. Ein voller Stapel ist kein Fehler, und ein Alarmzeichen erzeugt Vermeidungsverhalten |
| **Aufhören ist erlaubt** | Zwischen zwei Notizen ist jederzeit ein sauberer Ausstieg möglich; der Stand bleibt erhalten. „Ich mache nur dieses eine Treffen" ist eine legitime Sitzung |
| **Das Ergebnis wird gezeigt** | Der Endzustand bilanziert die Sitzung — *„12 Notizen durchgesehen · 5 neue Einträge · 3 Beziehungen · 2 zusammengeführt"* — und verweist dorthin, wo die Mühe sichtbar wird: Wiki und (ab V1.2) Graph |
| **Vorarbeit wird anerkannt** | Die Bilanz nennt, wie viel bereits im Treffen getaggt war. Das schließt den Kreis zu §4.4.1 und macht Live-Taggen zu einer sichtbar lohnenden Gewohnheit (E-23) |

##### 4.4.2.9 Tastaturbedienung

Da es keinen Stapelweg gibt, ist die Tastatur der einzige Hebel auf die Zielmarken.
Die Kürzel stehen dauerhaft in der Fußleiste, nicht in einer Hilfe.

**Phase 1 — Vorschläge**

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

**Phase 2 — Notizen**

| Taste | Handlung |
|-------|----------|
| `Enter` | Notiz abschließen und weiter |
| `←` / `→` | Eine Notiz zurück / vor |
| `R` | Beziehung zur gewählten Entität anlegen |
| `Z` | Letzte Handlung rückgängig |

Markieren und Typisieren erfolgt in Phase 2 mit der Maus — das ist die Geste, um die es geht.

##### 4.4.2.10 Weitere Maßnahmen gegen R-03

Die Kuratoren-Delegation ist mit E-24 entfallen; an ihre Stelle treten:

- **Gestaltung als Anforderung** (4.4.2.8) statt einer zweiten Person
- **Vorarbeit im Treffen** (§4.4.1), die Phase 2 kurz hält
- **Natürliche Ausstiegspunkte** an jeder Notizgrenze
- **Messung** über `note_curated` und `suggestion_resolved` inklusive Bearbeitungsdauer —
  werden die Zielmarken gerissen, ist das ein Gestaltungsproblem, kein Nutzerproblem
- **Ab V1.3 die eigentliche Entlastung:** die KI übernimmt die Vorarbeit für Phase 1 und
  schlägt in Phase 2 vor, was zu markieren wäre (E-09)

**Bewusste Annahme bis dahin:** Bei 3–12 Personen und wöchentlichen Treffen ist die Last für
eine Person tragbar. Diese Annahme wird an der eigenen Gruppe gemessen; hält sie nicht, wird
die Kurator-Rolle aus dem Backlog vorgezogen.

##### 4.4.2.11 Member-Sicht

Ein Member sieht denselben Durchlauf **ohne jede Handlungsschaltfläche** — nicht ausgegraut,
sondern schlicht nicht vorhanden. Zweck ist Transparenz: nachvollziehen können, was aus den
eigenen Notizen wird. Zusätzlich eine Filterung „nur meine Vorschläge". Ein Member sieht
in dieser Ansicht **nur die eigenen Notizen und Team-Notizen**, nie die „Für mich"-Notizen
anderer — der erweiterte Einblick aus E-16 gilt ausschließlich für den Lead.

> **Achtung bei der Umsetzung:** Dass die Schaltflächen fehlen, ist **keine**
> Berechtigungsprüfung. Jede Kanonisierung ist ein serverseitig adressierbarer Endpunkt und
> prüft die Fähigkeit selbst (§4.2.2).

##### 4.4.2.12 Akzeptanzkriterien

**Phase 1**

- [ ] Auf der Karte ist zu jedem Zeitpunkt **genau ein** gefüllter, farbiger Knopf sichtbar
- [ ] „Zusammenführen" erscheint ausschließlich auf Kartenart B; ohne Duplikatverdacht existiert die Schaltfläche nicht
- [ ] Kartenart B wird durch normalisierte Übereinstimmung ausgelöst, nicht durch einen Ähnlichkeitswert
- [ ] Ein Abschnitt ohne Inhalt wird nicht gerendert — auch nicht leer oder ausgegraut
- [ ] Optionale Preset-Felder erscheinen nicht auf der Karte
- [ ] Ein `select`-Pflichtfeld erscheint als Chip-Reihe und ist mit den Zifferntasten 1–9 bedienbar
- [ ] Ist ein Pflichtfeld offen, steht die Begründung unmittelbar am Primärknopf
- [ ] Die Belegstelle zeigt den umgebenden Absatz, nicht nur den Satz mit der Markierung
- [ ] Häufigkeit und Streuung („3 Erwähnungen · 2 Treffen") sind ohne Klick sichtbar
- [ ] Eine vollständige Entscheidung ist ohne Maus möglich; der Median über 20 aufeinanderfolgende Vorschläge liegt unter 6 Sekunden
- [ ] Ein Vorschlag lässt sich anlegen und speichern, **ohne** dass Pflichtfelder gefüllt sind; die Prüfung greift ausschließlich beim Übergang nach kanonisch
- [ ] Kein Preset-Feld vom Typ `longtext` ist als Pflichtfeld ladbar — die Prüfung schlägt beim Start fehl

**Phase 2**

- [ ] Jede Notiz des Treffens erscheint einzeln mit dem vollständigen Text ihrer neuesten Version
- [ ] Bereits bestätigte Stellen sind als Chip in Typfarbe sichtbar, offene Vorschläge als Chip mit Umriss
- [ ] Text markieren öffnet dieselbe Typisierungs-Auswahl wie im Meeting-Raum
- [ ] Eine Notiz ohne Handlungsbedarf ist mit **einer** Taste abgeschlossen; der Median über 20 Notizen liegt unter 10 Sekunden
- [ ] Eine Notiz gilt erst als kuriert, wenn der Lead sie ausdrücklich abschließt — auch wenn alle ihre Vorschläge bereits in Phase 1 entschieden wurden
- [ ] Notizen mit Sichtbarkeit „Für mich" erscheinen für den Lead und sind als solche gekennzeichnet
- [ ] Nachträglich geschriebene Notizen erscheinen als weitere offene Notizen; es gibt keinen Zustand „Treffen durchkuriert", der dadurch ungültig würde

**Beziehungen**

- [ ] Eine Beziehung entsteht ohne zweiten Durchgang und ohne eigenen Bildschirm
- [ ] Angeboten werden nur Beziehungstypen, deren Quell-/Zieltyp zum Paar passt
- [ ] Die Schnellsuche durchsucht das gesamte Projekt; Entitäten aus derselben Notiz stehen oben
- [ ] Jede Entität in der Kuration verweist auf ihren Wiki-Eintrag

**Übergreifend**

- [ ] Nach jeder Handlung erscheint 8 Sekunden lang ein Rückgängig-Hinweis; es gibt keinen Bestätigungsdialog
- [ ] Abgelehnte Vorschläge bleiben in der Notiz markiert, erzeugen keine Entität und erscheinen nicht erneut
- [ ] Zähler offener Notizen erscheinen nirgends in Warnfarbe
- [ ] Jeder Abschluss erzeugt eine sichtbare, ruhige Quittung und füllt ein Segment des Fortschritts
- [ ] Der Endzustand bilanziert die Sitzung **inklusive** des Anteils, der bereits im Treffen getaggt war, und verweist ins Wiki (ab V1.2 zusätzlich in den Graph)
- [ ] Ein Member sieht keine Handlungsschaltflächen — weder aktiv noch ausgegraut — und keine „Für mich"-Notizen anderer
- [ ] Eine Kanonisierung schlägt serverseitig fehl, wenn sie von einem Account ohne die Fähigkeit „kanonisieren" aufgerufen wird — unabhängig davon, ob die Schaltfläche sichtbar war

#### 4.4.3 Projektwissen — das Wiki

Chrome-Stufe **Fokus**: Die globale Seitenleiste ist auf die Symbolleiste reduziert, weil der
Wissensbaum die Navigation übernimmt (Regel 6 aus §4.4.0).

**Zweispaltiger Aufbau**

| Spalte | Inhalt |
|--------|--------|
| **Links — Wissensbaum** (~250 px) | Suchfeld · darunter der Bestand, gegliedert nach Entitätstyp aus dem Preset, je Typ alphabetisch. Zähler je Typ. Vorschläge separat am Ende, gedämpft |
| **Rechts — Artikel** (Lesebreite max. ~740 px) | Der Eintrag als **Dokument**, nicht als Formular |

**Zwei Gliederungen desselben Bestands** — Umschalter über dem Baum:

- **Nach Eintrag** (Standard): nach Entitätstyp, alphabetisch. Beantwortet *„Was gibt es?"*
- **Nach Zeitpunkt**: chronologisch nach Meeting gegliedert — je Meeting die Einträge, die
  daraus entstanden oder dort geändert wurden. Beantwortet *„Was haben wir wann besprochen
  und beschlossen?"* Damit wird die Herkunft zu einer **abfragbaren Dimension** statt zu
  einer Fußnote im Artikel

**Der Artikel — einheitlicher Aufbau für jeden Typ (Konsistenzprinzip)**

1. **Kopf:** Titel, Typ-Kennzeichnung, Aliasse, Zustand (kanonisch / Vorschlag)
2. **Herkunftszeile** direkt unter dem Titel, eine Zeile:
   *„Aus 2 Notizen · zuletzt geändert heute von Sam"* — anklickbar, öffnet die Herkunftsansicht
3. **Steckbrief:** die Preset-Felder als kompakte Definitionsliste. **Kein Formular** —
   Bearbeiten öffnet sich erst auf Klick am jeweiligen Feld
4. **Beschreibung:** das `longtext`-Feld als Fließtext, in Lesebreite
5. **Beziehungen** als lesbare Abschnitte, nach Beziehungstyp gruppiert, mit
   richtungsrichtigem Label (`lebt in` vs. `Bewohner`)
6. **Verweist hierher:** Einträge, die auf diesen verweisen — der klassische Wiki-Rückverweis.
   Erscheint nur, wenn es welche gibt

**Herkunftsansicht — die Abfrage „woher und wann?"**

Statt einer dauerhaften dritten Spalte (die den Artikel schmal machen würde) öffnet der
Klick auf die Herkunftszeile ein **Panel, das von rechts einfährt** und den Artikel nicht
verschiebt. Zwei Reiter:

| Reiter | Inhalt |
|--------|--------|
| **Herkunft** | Jede Ursprungsnotiz mit Meeting, Arbeitsgruppe, Autor, Datum und dem Textausschnitt als Momentaufnahme. Sprung an die Textstelle. Nachträglich geänderte Quellen sind gekennzeichnet |
| **Verlauf** | Jede Änderung mit Zeitpunkt, Person, Feld vorher/nachher, **Auslöser** (Kanonisierung / Bearbeitung / Zusammenführung) und dem Verweis auf Notiz und Meeting. Filterbar nach Auslöser |

Damit sind beide Fragen beantwortbar, ohne den Lesefluss dauerhaft zu belasten:
*„Woher wissen wir das?"* und *„Wann wurde das besprochen und beschlossen?"*

**Akzeptanzkriterien**

- [ ] Der Artikel rendert für jeden Entitätstyp beider Presets korrekt, ohne typ-spezifischen Code
- [ ] Der Wissensbaum zeigt exakt die `entity_types` des Projekt-Presets mit Zählern
- [ ] Die Umschaltung „Nach Eintrag / Nach Zeitpunkt" zeigt denselben Bestand in zwei Gliederungen, ohne Nachladen des Artikels
- [ ] Die Gliederung „Nach Zeitpunkt" listet je Meeting alle Einträge, die daraus entstanden **oder** dort geändert wurden
- [ ] Die Herkunftsansicht fährt über den Inhalt, ohne den Artikel umzubrechen
- [ ] Ein Klick auf einen Herkunftseintrag öffnet die Notiz mit hervorgehobener Textstelle
- [ ] Die Preset-Felder erscheinen als Definitionsliste; ein Eingabefeld entsteht erst nach Klick
- [ ] „Verweist hierher" wird nicht gerendert, wenn es keine Rückverweise gibt
- [ ] Ein `reference`-Feld bietet nur Einträge des in `target_type` erlaubten Typs an
- [ ] Beim Anlegen einer Beziehung erscheinen nur `relation_types`, deren `source`/`target` passen (`any` erlaubt alle)
- [ ] Neben dem Wissensbaum ist keine globale Navigationsliste sichtbar (§4.4.0, Regel 6)

#### 4.4.4 Weitere Screens (V1)

| Screen | Chrome | Kerninhalt | Leerzustand |
|--------|:------:|------------|-------------|
| **Alle Projekte** (Startseite) | Start | Projekte des Kontos als Karten, laufende Treffen hervorgehoben, zuletzt geöffnet. **Keine Seitenleiste** — hier ist noch kein Projekt gewählt, projektspezifische Navigationspunkte wären widersprüchlich | „Noch kein Projekt — anlegen oder auf eine Einladung warten" |
| **Projekt-Dashboard** | Orientierung | Arbeitsgruppen als Karten mit Anzahl Treffen und letzter Aktivität; Kurzstatistik des Projektwissens; offene Notizen zur Kuration (nur Lead, **ohne Warnfarbe**) | `texts.empty_workgroups` aus dem Preset |
| **Arbeitsgruppen-Übersicht** | Orientierung | Treffen chronologisch, Zustandskennzeichnung, Kurationsfortschritt je Treffen, Profile der Gruppe | `texts.empty_meetings` aus dem Preset |
| **Teilnehmerprofil** | Orientierung | Participant-Entität mit Preset-Feldern, verknüpftes Konto, eigene Beziehungen. Bei mehreren Profilen im selben Projekt: Umschalter | — |
| **Projekteinstellungen** | Fokus | Name, Beschreibung, Mitglieder + Rollen, Einladungslinks, Passwort-Rücksetzlinks, **schreibgeschützte Ansicht des gewählten Presets** (Typen, Felder, Beziehungen), sowie die Ehrlichkeitsaussage aus §4.2.3 im Wortlaut | — |

> **Entfallen in V0.9:** Der Screen **Preset-Verwaltung** ist gestrichen — es gibt keinen
> Import mehr (E-01). Was bleibt, ist eine schreibgeschützte Preset-Ansicht innerhalb der
> Projekteinstellungen, damit nachvollziehbar ist, welche Typen und Regeln gelten.

**Zustände.** Die Anwendung soll solide sein: Jeder Bildschirm behandelt Laden, Leere,
Fehler und fehlende Berechtigung. Die Ausgestaltung ist **einmal zentral** festgelegt
(`04-Screen-Inventar.md`) und wird je Screen nur dort beschrieben, wo sie vom Standard
abweicht — etwa beim Leerzustand, dessen Text aus dem Preset kommt.

- **Laden:** Platzhalter in der Form des erwarteten Inhalts, kein Vollbild-Ladezeichen
- **Leer:** Text aus dem Preset, wo die Domäne den Begriff bestimmt; sonst eine
  Handlungsaufforderung
- **Fehler:** ein Satz ohne Fachjargon, „Erneut versuchen", und die Zusicherung, dass nichts
  verloren ging
- **Keine Berechtigung:** erklären, *warum* und wer helfen kann — nicht bloß sperren

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
> erst nach V1.1 baubar. Er ist bewusst **nach** der Kuration eingeordnet: ein schöner
> Graph über einem leeren Wissensstand beweist nichts.

#### 4.4.6 Onboarding — vom ersten Login bis zur ersten strukturierten Notiz

Die Kernkennzahl „< 3 Minuten bis zur ersten strukturierten Notiz" wird hier gewonnen oder
verloren. Leitgedanke: **nichts erklären, was man auch zeigen kann** — und nichts zeigen,
was gerade nicht gebraucht wird.

**Fall A — eingeladenes Mitglied (der häufige Fall)**

| Schritt | Bildschirm | Was passiert | Zeitbudget |
|---------|-----------|--------------|-----------:|
| 1 | Einladungslink | Zeigt sofort Projektname, wer eingeladen hat und die **Preset-Terminologie in einem Satz**: „Du wirst Teil von *Produktteam Nord*. Ihr arbeitet in **Sprints** und haltet **Meetings** ab." | 10 s |
| 2 | Konto anlegen | Nur Benutzername, Passwort, Anzeigename. Keine E-Mail-Verifikation, keine Profilbilder, keine optionalen Felder (E-29). Hat die Person bereits ein Konto, genügt die Anmeldung | 30 s |
| 3 | Profil wählen oder anlegen | Bestehende Profile in diesem Projekt zur Auswahl (`texts.join_existing`), darunter der Anlage-Weg (`texts.join_new_profile`). Beim Anlegen nur die **Pflichtfelder** des Participant-Typs; optionale hinter „Mehr Angaben" eingeklappt | 45 s |
| 4 | Direkt ins Ziel | Kein Dashboard-Umweg: Läuft das Treffen bereits, landet die Person **direkt im Meeting-Raum**. Sonst in der Arbeitsgruppen-Übersicht | 5 s |
| 5 | Meeting-Raum, erster Besuch | Cursor steht im Verfasser. **Zwei** Hinweise, gemeinsam und einmalig: „Tipp `@` oder markiere Text, um etwas festzuhalten." Und die Ehrlichkeitsregel aus §4.2.3: „Die Projektleitung sieht alle Notizen. »Für mich« bestimmt, was im Team-Feed erscheint." | 20 s |
| 6 | Erste Erwähnung | Beim ersten `@` zeigt die Auswahl einen einzeiligen Kopf: „Wähle einen bestehenden Eintrag oder leg einen neuen an." Erscheint nur beim allerersten Mal | 30 s |

**Summe: ≈ 2:20 min** — mit Puffer unter der Zielmarke.

**Fall B — Lead legt ein neues Projekt an**

| Schritt | Bildschirm | Was passiert |
|---------|-----------|--------------|
| 1 | Anmeldung | Betreiberkonto, beim Aufsetzen der Instanz angelegt |
| 2 | Projekt anlegen | Name + **Preset-Auswahl als Karten**, nicht als Auswahlliste. Jede Karte zeigt: Preset-Name, ein Satz Beschreibung, die Ebenenbezeichnungen („Projekt → Sprint → Meeting") und die drei häufigsten Entitätstypen als Chips. Zur Auswahl stehen die **ausgelieferten** Presets; die Wahl ist danach unveränderlich, was auf der Karte steht |
| 3 | Erste Arbeitsgruppe | Vorbelegt mit einem Namensvorschlag aus dem Preset („Sprint 1" / „Kampagne 1"), mit einem Klick übernehmbar |
| 4 | Einladen | Einladungslink sofort sichtbar und kopierbar, mit dem Hinweis, wie viele Personen typischerweise sinnvoll sind |
| 5 | Erstes Meeting | „Jetzt starten" oder „Für später planen" — beides ein Klick |

**Was bewusst NICHT stattfindet:**

- Keine mehrseitige Produkttour und keine Overlay-Serie mit „Weiter"-Schaltflächen
- Keine Beispieldaten im echten Projekt (verschmutzen den Wissensstand von Anfang an)
- Keine Vorab-Erklärung der Sichtbarkeiten über die eine Ehrlichkeitsaussage hinaus — der
  Umschalter steht sichtbar am Verfasser und zeigt beim Überfahren einen Einzeiler je Wert
- Keine Aufforderung, das Profil zu vervollständigen

**Akzeptanzkriterien:**

- [ ] Ein eingeladenes Mitglied erreicht vom Einladungslink bis zur ersten gespeicherten Notiz höchstens vier Bildschirme
- [ ] Beim Anlegen des Profils sind ausschließlich Felder mit `required: true` sichtbar; optionale sind eingeklappt
- [ ] Existieren bereits Profile in diesem Projekt, werden sie zur Auswahl angeboten, bevor der Anlage-Weg erscheint
- [ ] Läuft das Treffen bereits, wird nach dem Profil direkt der Meeting-Raum geöffnet, nicht das Dashboard
- [ ] Der Markierungs-Hinweis und die Ehrlichkeitsaussage erscheinen **gemeinsam** und **einmalig** je Account und Projekt
- [ ] Die Preset-Auswahl beim Projektanlegen zeigt je Preset die Ebenenbezeichnungen und mindestens drei Entitätstypen, ohne dass ein Dialog geöffnet werden muss
- [ ] Ein neu beigetretenes Mitglied sieht auf dem Weg zur ersten Notiz zu keinem Zeitpunkt einen generischen Begriff („Entität", „Arbeitsgruppe", „Container") — mit der einen in §4.7 beschriebenen Ausnahme des ausdrücklich gekennzeichneten Fehlerzustands

#### 4.4.7 Responsives Verhalten

| Bereich | Desktop (≥ 1280 px) | Tablet (768–1279 px) | Mobil (< 768 px) |
|---------|---------------------|----------------------|------------------|
| Meeting-Raum | eine zentrierte Spalte, Feed als Schublade | identisch; Schublade nimmt mehr Breite ein | Verfasser und Strom vollflächig, Feed als Vollbild-Blatt; Typisierungs-Auswahl als Vollbild-Blatt |
| Kuration | ein Vorschlag bzw. eine Notiz füllt die Fläche, Kontextspalte rechts | identisch, Kontext klappt unter den Hauptbereich | nur Lesezugriff, Hinweis „Kuration am Desktop" |
| Entitäten-Liste | volle Tabelle | reduzierte Spalten | Kartenansicht |
| Beziehungs-Graph | volle Leinwand + Filterleiste | Filterleiste als Overlay | nur Lesen, Filter vorab gesetzt; Hinweis „Karte am Desktop bearbeiten" |

> **Korrigiert in V0.9 (W-11):** Die Tabelle beschrieb bis V0.8 Layouts, die im selben Dokument
> längst gestrichen waren — „drei Spalten nebeneinander" für den Meeting-Raum (§4.4.1 hat eine)
> und „Warteschlange + Detail nebeneinander" für die Kuration (§4.4.2 hat kein Listen-Detail-
> Layout). Beide Zeilen sind jetzt nachgezogen.

> Mobil ist in V1 ausdrücklich **Nutzbarkeit, nicht Optimierung**. Die Kuration ist auf
> Mobilgeräten bewusst nicht vorgesehen — sie verlangt Lesen, Markieren und Tastatur.

---

### 4.5 Daten- und Geschäftslogik

| Regel | Festlegung |
|-------|------------|
| **Auflösung der Terminologie** | Jedes UI-Label wird aus dem Preset des Projekts aufgelöst — nie ein hartkodierter Fachbegriff. Fehlt ein Label, siehe die Fehlerregel in §4.7. |
| **Vorschlag vs. kanonisch** | Entitäten **und Beziehungen** haben den Zustand `suggested` oder `canonical`. Erwähnungen dürfen auf beide zeigen; nur `canonical` erscheint standardmäßig in Listen und Auswertungen. |
| **Pflichtfelder** | `required` heißt **„nötig, um kanonisch zu werden"**, nicht „nötig, um zu existieren". Ein Vorschlag darf mit unbefüllten Pflichtfeldern gespeichert werden; geprüft wird ausschließlich beim Übergang nach `canonical`. |
| **Herkunft** | Jede Entität hält eine n:m-Verknüpfung zu allen `Mention`s, aus denen sie hervorging — und damit auf die **Notiz-Version**, in der die Erwähnung stand. Weil Versionen unveränderlich sind, zeigt der Beleg dauerhaft auf denselben Wortlaut. Wird eine Notiz gelöscht, bleibt die Entität bestehen, die Herkunft wird als „Quelle entfernt" markiert. |
| **Bearbeitung nach Kanonisierung** | Der Autor darf seine Notiz weiterhin bearbeiten. Es entsteht eine **neue Notiz-Version**; die abgeleitete Entität und ihr Herkunftsbeleg bleiben unverändert, weil beide auf die *alte* Version zeigen. Die Herkunftsansicht kennzeichnet, dass eine neuere Version existiert, und verlinkt sie. **Vereinfacht in V0.9:** Eine gesonderte Momentaufnahme des Textausschnitts entfällt — die Version *ist* die Momentaufnahme. |
| **Zusammenführen** | Beim Merge übernimmt die Zielentität: alle Herkünfte, alle Beziehungen (Duplikate verworfen), den Titel der Quelle als Alias. Leere Zielfelder werden aus der Quelle gefüllt, gefüllte nie überschrieben. Der Vorgang erzeugt einen Historieneintrag mit vollständigem Vorzustand beider Seiten. |
| **Rücknahme** | **Es gibt kein Umkehrfenster.** Eine Rücknahme ist eine neue Änderung, die einen früheren Zustand wiederherstellt — sie erzeugt einen weiteren Historieneintrag, statt einen bestehenden zu entfernen. Damit bleibt jede Bewegung auf dem Zeitstrahl nachvollziehbar, auch nach Jahren (E-25). |
| **Beziehungsrichtung** | Beziehungen werden einmal gerichtet gespeichert und beidseitig angezeigt (`label` / `inverse_label`). |
| **Löschen einer Entität** | Nur der Lead. Beziehungen werden mitgelöscht. **Notizen werden dabei nicht verändert:** Eine Erwähnung, deren Ziel nicht mehr existiert, wird beim Anzeigen als einfacher Text dargestellt. Der Server schreibt keine fremden Notizen um — das wäre ein Eingriff in unveränderliche Versionen und würde mit dem Schreiben anderer Personen kollidieren. |
| **Sichtbarkeitsdurchsetzung** | Ausschließlich serverseitig. Der Client erhält „Für mich"-Notizen anderer gar nicht erst — kein reines UI-Ausblenden. Ausnahme ist die Kuration, in der der Lead alle Notizen des Treffens erhält (E-16). |
| **Vererbung** | Mitgliedschaft gilt projektweit; Arbeitsgruppen erben sie. Eine Einschränkung des Zugriffs auf einzelne Arbeitsgruppen ist in V1 **nicht** vorgesehen. |
| **Nachvollziehbarkeit jeder Änderung** | Jede Änderung an einer kanonischen Entität oder Beziehung erzeugt einen `ChangeEntry` mit: Zeitpunkt, handelnder Person, **vollständigem Zustand nach der Änderung**, Auslöser (`Kanonisierung` / `Bearbeitung` / `Zusammenführung` / `Rücknahme`) und, sofern vorhanden, Verweis auf Notiz-Version, Treffen und Arbeitsgruppe. Unterschiede zwischen zwei Ständen werden beim Lesen berechnet. **Warum Schnappschüsse statt Feld-Differenzen:** Nur so lässt sich „Zustand zum Zeitpunkt T" ohne Nachrechnen beantworten — die Voraussetzung für die Verlaufsansicht (§4.4.3) und für die spätere verschiebbare Zeitleiste. |
| **Aufbewahrung** | Historieneinträge und Notiz-Versionen werden **nie** gelöscht und **nie** durch eine Frist entwertet. Es gibt keinen Hintergrundprozess, der aufräumt. |
| **Löschen eines Accounts** | Notizen werden anonymisiert (Autor → „Ehemaliges Mitglied"), kanonisierte Entitäten bleiben bestehen. Das an den Account gebundene **Profil** ist personenbezogen und wird auf Verlangen ebenfalls anonymisiert; seine Beziehungen bleiben erhalten und zeigen dann auf „Ehemaliges Mitglied". |
| **Zeit** | Zeitpunkte (angelegt, geändert, Treffensbeginn) werden als Zeitstempel gespeichert. **Kalenderdaten aus `date`-Feldern werden als Datum gespeichert und ohne Umrechnung angezeigt** — sonst verschiebt sich „Entschieden am 5. August" je nach Betrachter um einen Tag. V1 zeigt alles in CET; Zeitzonenbehandlung ist Backlog (E-30). |

---

### 4.6 Backend- und Schnittstellenbedarf

**Fachliche Ebene (Produkt):**

- Authentifizierung: Anmeldung, Session, Passwort ändern. **Kein Mailversand** — ein
  vergessenes Passwort wird über einen vom Lead ausgestellten signierten Link zurückgesetzt
  (E-29). Kein freier Registrierungsweg
- Einladungen: signierte Links mit Ablaufdatum und Widerrufsmöglichkeit. Eine Einladung führt
  zu genau einem Profil
- Projekt-, Arbeitsgruppen-, Treffensverwaltung inklusive Zustandsübergängen
- Notizen: anlegen (unveränderliche Version), neue Version erzeugen, Sichtbarkeit ändern,
  Kurationszustand setzen
- Feed der Team-Notizen — **auf Abruf**, kein Server-Push (E-27)
- Erwähnungen und Vorschläge — über **einen** Dienst, der die Quelle mitführt (`manual`
  heute, `ai` ab V1.3). Der Erwähnungs-Pfad benutzt denselben Dienst, den die KI später
  benutzt; es entsteht keine zweite Pipeline
- Entitäten: CRUD, normalisierte Suche über Titel und Aliasse, Zusammenführen, Beziehungen
- Preset: Laden und Prüfen beim Start, Auswahl bei der Projektanlage. **Kein Import, keine
  Laufzeit-Erweiterung**
- Historie: Schnappschuss je Änderung, Abfrage „Zustand zum Zeitpunkt T"

> ⚠️ **Technische Ausgestaltung folgt im SRD** — Endpunkte, Ablage der dynamischen Felder,
> Speicherformat der Notiz und ihrer Erwähnungen, Suchimplementierung, Autorisierungsschicht.

---

### 4.7 Terminologie und Sprache

Zwei getrennte Ebenen, die nicht vermischt werden dürfen:

| Ebene | Quelle | Beispiel |
|-------|--------|----------|
| **UI-Sprache** | Sprachdateien der Anwendung | „Speichern", „Einstellungen", „Abbrechen" |
| **Fachterminologie** | Preset des Projekts | „Sprint", „Session", „NSC", „Komponente" |

**V1 ist einsprachig Deutsch (E-30).** Die Aufteilung in `terminology.de` / `terminology.en`
entfällt; ein Preset hinterlegt seine Begriffe einmal. Mehrsprachigkeit ist Backlog.

**Zusammengesetzte Sätze kommen als ganze Sätze aus dem Preset.**
Deutsche Oberflächentexte lassen sich nicht zuverlässig aus Bausteinen bilden, weil das
Geschlecht des eingesetzten Begriffs die Umgebung verändert: *„Noch keine **Sprints** — **der
erste** ist schnell angelegt"* gegen *„Noch keine **Kampagne** — **die erste** ist schnell
angelegt"*. Ein Genus-System im Preset wäre die saubere Lösung, kostet aber Grammatiklogik an
jeder Textstelle. Bei zwei kuratierten Presets ist der billigere und lesbarere Weg, die
betroffene Handvoll Sätze **ausgeschrieben** im `texts`-Block zu hinterlegen (§4.1.3).
Platzhalter wie `{name}` bleiben erlaubt, solange sie die Grammatik nicht verändern.

**Fehlerregel bei fehlender Terminologie.**
Fehlt ein Label, zeigt die Anwendung den generischen Schlüssel an, kennzeichnet ihn sichtbar
als Fehler und protokolliert ihn. Das ist ein **ausdrücklich markierter Fehlerzustand**, keine
stille Rückfallebene.

> **Aufgelöst in V0.9:** §4.4.6 verlangt, dass ein neues Mitglied „zu keinem Zeitpunkt einen
> generischen Begriff sieht", während §4.5 und §6.2 genau das als Rückfall vorsahen. Beide
> haben recht — die Regel gilt absolut auf dem Normalweg, und der Rückfall ist ein sichtbarer
> Defekt, der auffallen *soll*. Vorher stand es als Widerspruch im Dokument.

---

## 5. Datenerfassung (Telemetrie)

Bewusst minimal und self-hosted-freundlich — keine externen Analysedienste, alles lokal
in der eigenen Datenbank, standardmäßig aktiviert und abschaltbar.

| Ereignis | Zweck | Bezug zum Erfolgsmaß |
|----------|-------|----------------------|
| `meeting_completed` | Anzahl Treffen je Arbeitsgruppe | „5 aufeinanderfolgende Treffen" |
| `note_created` mit Sichtbarkeit und Anzahl Erwähnungen | Wird beim Schreiben getaggt? Werden beide Sichtbarkeiten genutzt? | Kernmechanik-Validierung, E-23 |
| `note_version_created` | Wie oft wird nachbearbeitet? | Trägt das Versionsmodell, oder stört es? |
| `mention_created` mit `method: keyboard\|selection` | Welcher Weg wird genutzt? | E-07 rechtfertigt zwei Wege oder nicht |
| `suggestion_resolved` mit Entscheidung und Latenz | Wie schnell geht Phase 1? | Zielmarke < 6 s, Risiko R-03 |
| `note_curated` mit Latenz und Anzahl neuer Markierungen | Wie schnell geht Phase 2, und wie viel wurde im Treffen übersehen? | Zielmarke < 10 s; belegt, ob Phase 2 ihren Aufwand wert ist |
| `curation_session_ended` mit Anzahl bearbeiteter Notizen | Wird in einem Zug durchkuratiert oder abgebrochen? | Risiko R-03, Wirksamkeit von E-22 |
| `entity_merged` | Wie oft entstehen Duplikate? | Wirksamkeit der Duplikatvermeidung |
| `time_to_first_structured_note` | Zeit vom Beitritt bis zur ersten Erwähnung | Zielmarke < 3 Minuten |
| `preset_key` bei Projektanlage | Nutzung je Preset | Nachweis Domänenneutralität |

> **Die beiden wichtigsten Kennzahlen sind `note_curated` und `curation_session_ended`.**
> Sie beantworten die Frage, an der das Produkt hängt: Wird kuratiert, oder wird es
> übersprungen? Reißen sie ihre Marken, ist das ein Gestaltungsproblem — nicht ein
> Nutzerproblem.

Kein A/B-Testing in V1 — die Nutzerbasis ist dafür zu klein.

---

## 6. Nichtfunktionale Anforderungen

### 6.1 Leistung

- Meeting-Raum interaktiv in < 1,5 s bei 200 vorhandenen Notizen
- Erwähnungs-Auswahl < 150 ms bei 5 000 Entitäten im Projekt
- Abschicken einer Notiz < 300 ms serverseitig
- Feed-Abruf < 500 ms
- Kuration: Median < 6 s je Vorschlag (Phase 1), < 10 s je Notiz (Phase 2)
- Zielgröße: 50 Projekte, 5 000 Entitäten und 20 000 Notizen je Instanz ohne spürbaren Abfall

### 6.2 Ausfallsicherheit und Rückfallverhalten

- **Verbindungsverlust beim Schreiben:** nicht abgeschickte Notizen liegen lokal, sichtbarer Hinweis, Abschicken nach Rückkehr. Notizen gehen nie verloren — höchste Priorität. Weil abgeschickte Notizen unveränderlich sind, kann das Nachspielen nichts überschreiben
- **Feed nicht abrufbar:** Meeting-Raum bleibt voll nutzbar; die Schublade zeigt „Aktualisierung fehlgeschlagen, erneut versuchen" und den zuletzt geladenen Stand
- **Preset-Auflösung schlägt fehl:** generischer Schlüssel **sichtbar als Fehler markiert** statt Absturz (§4.7); Projekt bleibt lesbar
- **KI-Schnittstelle nicht erreichbar (ab V1.3):** die Aktion verschwindet, statt deaktiviert zu erscheinen; alle manuellen Wege unberührt

### 6.3 Barrierefreiheit

- Vollständige Tastaturbedienbarkeit von Meeting-Raum und Kuration inklusive Erwähnungs-Auswahl
- Erwähnungs-Auswahl als korrekte ARIA-Combobox mit `aria-activedescendant`
- Sichtbarkeiten nie allein über Farbe oder Symbol kommuniziert — der Wert ist immer als Wort lesbar
- Kontrastverhältnis ≥ 4,5:1; sichtbarer Fokusindikator durchgängig
- Die Feed-Schublade meldet ihren Inhalt beim Öffnen an assistive Technik; es gibt **keine** `aria-live`-Meldungen für Inhalte in einer geschlossenen Schublade

### 6.4 Sicherheit und Datenschutz

- Autorisierung **ausschließlich serverseitig**; jede Abfrage prüft Mitgliedschaft, Fähigkeit und Sichtbarkeit. Eine nicht gerenderte Schaltfläche ist keine Prüfung
- Notiz-Rendering mit strikter Bereinigung (kein rohes HTML, kein `javascript:`)
- **Preset-Werte werden wie Anzeigeinhalte behandelt:** Labels, Hilfetexte und `texts` werden beim Rendern maskiert, `graph.color` gegen ein Hex-Muster geprüft, `graph.shape`/`graph.style` gegen geschlossene Aufzählungen, Textlängen und Optionslisten gegen Obergrenzen. Presets sind zwar eigene Dateien und keine fremde Eingabe — aber ein Tippfehler soll als Prüffehler auffallen und nicht als undefinierter Wert in der Darstellung landen
- Einladungs- und Rücksetzlinks: signiert, ablaufend, einzeln widerrufbar. **Kein freier Registrierungsweg** — ein Konto entsteht nur über eine Einladung (E-29)
- Passwörter mit Argon2id gehasht; Ratenbegrenzung beim Anmelden, Zählerstand in der Datenbank statt im Arbeitsspeicher, damit ein Neustart sie nicht zurücksetzt
- **Ratenbegrenzung für Notizen und Feed-Abrufe** je Account und Treffen, damit ein hängender Client eine Instanz nicht ausbremst
- Datenexport und -löschung je Account (DSGVO-Auskunft und -Löschung), einschließlich der an den Account gebundenen Profile
- **Es wird keine Vertraulichkeit zugesichert** (§4.2.3). Die Aussage steht im Onboarding und in den Projekteinstellungen — sie ist eine Produkteigenschaft, kein Kleingedrucktes

### 6.5 SEO

Nicht anwendbar — die Anwendung liegt vollständig hinter der Anmeldung. Nur die
öffentliche Projektseite (Repository/Landingpage) ist indexierbar.

---

## 7. Auslieferungsstrategie

### 7.1 Phasenschnitt

Der V1-Umfang ist für ein Solo-Vorhaben groß (siehe Problem Framing, R-06). Schnitt in vier
lauffähige Stufen:

| Stufe | Inhalt | Demonstrierbar als |
|-------|--------|--------------------|
| **V1.0 — Die Schleife** | Konten per Einladung mit Profilwahl, Projekt/Arbeitsgruppe/Treffen, **Notizblock mit versionierten Einzelnotizen**, zwei Sichtbarkeiten, abrufbarer Feed, beide Presets, Terminologie-Auflösung | „Die Gruppe kann damit ein echtes Treffen protokollieren" |
| **V1.1 — Die Wissensschicht** | Erwähnung per `@` **und** Textmarkierung, generische Entitätsformulare, Entitätenliste und Wiki, Beziehungen, **zweiphasige Kuration**, Duplikatprüfung, Herkunft und Historie | „Aus Treffen entsteht nachvollziehbares Projektwissen" — **das ist der Nachweis** |
| **V1.2 — Beziehungs-Graph** | Graph-Leinwand mit preset-gesteuerten Formen und Farben, Typ- und Zeitfilter, Fokusmodus, Kanten-Herkunft | „Man *sieht*, wie das Wissen zusammenhängt" |
| **V1.3 — KI übernimmt das Unbequeme** | KI-Extraktion als zweiter Vorschlagslieferant für Phase 1, Markierungsvorschläge in Phase 2, automatisches Kanonisieren mit Rückfrage nur bei Unsicherheit, Zusammenführen mit Ähnlichkeitsbewertung | „Taggen und Nachkurieren werden leichter, nicht mehr" |
| **Backlog** | Community-Presets mit Einreichung und Kuratierung, Preset-Editor als eigenes Werkzeug, Kurator-Rolle, Stapelaktionen, Mehrsprachigkeit und Zeitzonen, Mailversand, Server-Push für den Feed, verschiebbare Zeitleiste, Karten, Suche über Projekte, Export/Backup, SaaS, Live-Co-Editing, mobile App | — |

**Warum dieser Schnitt — und was sich gegenüber V0.8 geändert hat:**

- **V1.1 ist der Nachweis, nicht V1.0.** Bis V0.8 galt V1.0 als Sicherheitsnetz: „ohne
  Wissensschicht immer noch ein benutzbares Werkzeug". Das stimmt — beweist aber nichts, was
  es nicht schon gäbe. Wenn die Zeit knapp wird, wird **innerhalb** von V1.1 gekürzt, nicht
  V1.1 als Ganzes.
- **Das Preset-System liegt vollständig in V1.0**, weil es die Datenstruktur bestimmt und
  nachträglich nicht einziehbar wäre. Das gilt unverändert.
- **V1.2 kommt nach der Kuration**, nicht davor. Ein Graph über einem leeren Wissensstand
  wäre eine Demo, kein Produkt (E-13).
- **V1.3 ist keine Backlog-Position.** Die zwei unbequemsten Stellen des Produkts — beim
  Schreiben ans Taggen denken, und danach nachkurieren — soll die KI übernehmen. Sie auf
  unbestimmte Zeit zu verschieben hieße, die Schwäche zu konservieren (E-09).

### 7.2 Abhängigkeiten und Reihenfolge

1. Preset-Format, Schema und Prüfung (blockiert alles Weitere)
2. Datenmodell inklusive Ablage der dynamischen Felder und Notiz-Versionen → **SRD-Entscheidung**
3. Authentifizierung und Autorisierung als **eine** Schicht (Sichtbarkeit hängt daran)
4. Meeting-Raum: Notizblock, Versionen, Sichtbarkeit
5. Feed (Abruf)
6. Erwähnungen und Vorschläge — über **einen** Dienst mit Quellenangabe
7. Entitätsformulare (generisches Rendering)
8. **Kanonisierungs-Dienst** — die gemeinsame Grundlage von Kuration und späterer KI. Kommt
   vor beiden Oberflächen, damit V1.3 ein zweiter Aufrufer wird und keine zweite Pipeline
9. Kuration Phase 1, dann Phase 2
10. Beziehungen, Zusammenführen, Herkunft und Historie

### 7.3 Freigabe

Selbstgehostete Anwendung ohne Stufenrollout. Freigabe per versioniertem Docker-Image;
Rücknahme durch Zurücksetzen auf das vorherige Image. Datenbankmigrationen ausschließlich
additiv und rückwärtskompatibel, damit ein Zurückspringen ohne Datenverlust möglich bleibt.

---

## 8. Offene Punkte

| # | Punkt | Warum wichtig | Stand |
|---|-------|---------------|-------|
| ~~O-01~~ | ~~Gültigkeitsbereich des Participants~~ | — | **Geklärt (E-12, E-29):** Projektebene, mehrere Profile je Konto; der Einladungslink ist der Mechanismus |
| ~~O-02~~ | ~~Ablage der dynamischen Felder~~ | — | **Geklärt im SRD §11.3:** JSONB je Entität, **ohne** Ausdrucksindizes |
| ~~O-03~~ | ~~Bearbeitung nach Kanonisierung~~ | — | **Geklärt (E-15):** Bearbeiten erzeugt eine neue Notiz-Version; Entität und Herkunftsbeleg zeigen weiter auf die alte Version (§4.5) |
| **O-04** | Endgültiger Produktname | „Notella" ist Arbeitstitel | Weiterhin offen. Entscheidung vor der ersten öffentlichen Auslieferung |
| ~~O-05~~ | ~~Preset-Wechsel eines bestehenden Projekts~~ | — | **Geklärt (E-01):** dauerhaft ausgeschlossen. Presets werden ausgeliefert; Aktualisierungen sind rein additiv und abwärtskompatibel |
| ~~O-06~~ | ~~Umfang der Änderungshistorie~~ | — | **Geklärt (E-25):** Schnappschuss je Änderung, dauerhaft, keine Frist. Notiztexte sind über `NoteVersion` ebenfalls versioniert |
| **O-12** | Profile umgehen die Kuration (§4.0) | Ein Member erzeugt damit als Einziger eine sofort gültige Entität | Für V1 festgelegt: Profile sind ausgenommen, ihre **Beziehungen** nicht. Bei Missbrauch nachschärfen |
| **O-13** | Ausgestaltung der Belohnung in der Kuration (§4.4.2.8) | E-22 macht sie zur Anforderung, aber „belohnend" ist kein prüfbares Kriterium | Im Mockup gestalten und an der eigenen Gruppe prüfen; ersatzweise über `curation_session_ended` messen |
| **O-14** | Doppelte Modellierung im Software-Preset | `component.owner` und `owns` beschreiben dieselbe Tatsache und erzeugen zwei Graphkanten | Vor Auslieferung einen der beiden Wege streichen — Vorschlag: `owns` entfernen |
| **O-15** | Trägt der Notizblock das Schreibgefühl? (R-07) | Einzelnotizen statt Fließtext sind ein Wagnis | Früh an der eigenen Gruppe prüfen. Rückfallweg wäre ein „Mehrzeilen-Modus", nicht die Rückkehr zum Dokument |

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

→ **`03-SRD.md`** — technische Lösungsrichtung: Stack, Schichtenschnitt und die Regeln, die
ihn durchsetzen, Ablage der dynamischen Felder, **Speicherformat der Notiz und ihrer
Erwähnungen**, Autorisierungsschicht, Suchstrategie, Preset-Prüfung, Aufwandsschätzung je
Stufe und die Andockstelle für V1.3.

→ **`04-Screen-Inventar.md`** — Bildschirme, Zustände und Bauabhängigkeiten, nachgezogen auf
die hier getroffenen Festlegungen.
