# Screen-Inventar — Notella (Arbeitstitel)

> **Version:** V0.1 · 2026-08-07
> **Vorgänger:** `01-Problem-Framing.md`, `02-PRD.md` (V0.3), `03-SRD.md` (V0.2)
> **Nachfolger:** Klickbares Low-Fi-Mockup
> **Zweck:** Vollständige Liste aller Bildschirme mit Zweck, Zugriff, Kernelementen,
> den vier Pflichtzuständen und der Phasenzuordnung. Vorstufe zum Mockup und zugleich
> Arbeitsvorlage für Umsetzungsaufträge.

---

## Legende

| Kürzel | Bedeutung |
|--------|-----------|
| **L / K / M** | Lead / Kurator / Member — wer diesen Bildschirm sieht |
| **V1.0 / V1.1** | Phasenzuordnung nach SRD §5.4 |
| 🎨 | Der Bildschirm rendert vollständig oder teilweise aus dem Preset-Schema |
| ⚡ | Kernbildschirm — hier entscheidet sich das Produkterlebnis |

**Vier Pflichtzustände je Bildschirm** (SRD §10): Laden · Leer · Fehler · Keine Berechtigung.
Sie sind nur dort einzeln ausgeführt, wo sie inhaltlich vom Standard abweichen.

**Standardverhalten der vier Zustände:**

| Zustand | Standard |
|---------|----------|
| **Laden** | Skeleton in der Form des erwarteten Inhalts. Nie Vollbild-Spinner, nie Layoutsprung |
| **Leer** | Ein Satz, was hier normalerweise steht, plus die eine sinnvolle Handlung — oder die Erklärung, warum es noch nichts gibt |
| **Fehler** | Was schiefging in einem Satz ohne Fachjargon, „Erneut versuchen", und die Zusicherung, dass nichts verloren ging |
| **Keine Berechtigung** | Erklärung **warum** plus wer helfen kann („Nur die Projektleitung kann das — frag Sam") statt einer bloßen Sperre |

---

## Übersicht

| # | Bildschirm | Rollen | Phase | Preset |
|---|-----------|:------:|:-----:|:------:|
| **A — Zugang** |
| A1 | Registrierung | alle | V1.0 | — |
| A2 | Login | alle | V1.0 | — |
| A3 | Passwort zurücksetzen | alle | V1.0 | — |
| A4 | Einladung annehmen | alle | V1.0 | 🎨 |
| A5 | Teilnehmerprofil anlegen | alle | V1.0 | 🎨 |
| **B — Navigation** |
| B1 | Dashboard | alle | V1.0 | 🎨 |
| B2 | Projekt anlegen (Preset-Auswahl) | L | V1.0 | 🎨 |
| B3 | Projektübersicht | alle | V1.0 | 🎨 |
| B4 | Arbeitsgruppen-Übersicht | alle | V1.0 | 🎨 |
| B5 | Arbeitsgruppe anlegen / bearbeiten | L, K | V1.0 | 🎨 |
| B6 | Meeting anlegen / planen | L, K | V1.0 | 🎨 |
| **C — Kern** |
| C1 | ⚡ Meeting-Raum | alle | V1.0 | 🎨 |
| C2 | ⚡ Erwähnungs-Auswahl (Overlay) | alle | V1.1 | 🎨 |
| C3 | Entität schnell anlegen (Overlay) | alle | V1.1 | 🎨 |
| **D — Wissen** |
| D1 | Entitäten-Liste | alle | V1.1 | 🎨 |
| D2 | ⚡ Entitäten-Detail | alle | V1.1 | 🎨 |
| D3 | Beziehung hinzufügen (Overlay) | L, K | V1.1 | 🎨 |
| D4 | Teilnehmerprofil-Detail | alle | V1.0 | 🎨 |
| D5 | ⚡ Beziehungs-Graph | alle | V1.2 | 🎨 |
| **E — Kuration** |
| E1 | ⚡ Review-Inbox | L, K (M lesend) | V1.1 | 🎨 |
| E2 | Zusammenführen | L, K | V1.1 | 🎨 |
| E3 | Änderungshistorie (Overlay) | alle | V1.1 | 🎨 |
| **F — Verwaltung** |
| F1 | Projekteinstellungen — Allgemein | L | V1.0 | 🎨 |
| F2 | Projekteinstellungen — Mitglieder & Rollen | L | V1.0 | — |
| F3 | Projekteinstellungen — Preset-Ansicht | L | V1.0 | 🎨 |
| F4 | Preset erweitern (additiv) | L | V1.1 | 🎨 |
| F5 | Preset-Verwaltung / Import | L | V1.0 | 🎨 |
| F6 | Kontoeinstellungen | alle | V1.0 | — |

**27 Bildschirme, davon 18 preset-abhängig und 5 Kernbildschirme.**
V1.0 umfasst 17, V1.1 weitere 9, V1.2 einen.

---

## A — Zugang

### A4 · Einladung annehmen

| | |
|---|---|
| **Zweck** | Erster Kontakt mit dem Produkt. Vertrauen herstellen und die Domäne in einem Satz erklären |
| **Zugang** | Signierter Link, ohne Anmeldung erreichbar |
| **Phase** | V1.0 |

**Kernelemente**

- Projektname und Name der einladenden Person
- **Terminologie-Satz aus dem Preset:** „Du wirst Teil von *Produktteam Nord*. Ihr arbeitet in **Sprints** und haltet **Meetings** ab."
- Anzahl bereits beigetretener Mitglieder
- Primärhandlung „Beitreten" · Sekundär „Ich habe schon ein Konto"

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Fehler — Link abgelaufen | „Diese Einladung ist am 3. August abgelaufen. Bitte den Ersteller um einen neuen Link." Mit Namen der einladenden Person |
| Fehler — Link widerrufen | Gleiche Form, anderer Grund. Kein Hinweis auf Projektinhalte |
| Sonderfall — bereits Mitglied | Direkter Sprung ins Projekt statt Beitrittsablauf |

---

### A5 · Teilnehmerprofil anlegen 🎨

| | |
|---|---|
| **Zweck** | Das fachliche Profil im Projekt anlegen (Teammitglied / Charakter) |
| **Zugang** | Nach Beitritt, oder aus der Arbeitsgruppen-Übersicht bei einem zweiten Profil |
| **Phase** | V1.0 |

**Kernelemente**

- Überschrift in Preset-Sprache: „Leg dein **Teammitglied** an" / „Erstell deinen **Charakter**"
- **Nur Pflichtfelder** des Participant-Typs sichtbar, gerendert vom `SchemaForm`-Baustein
- Optionale Felder eingeklappt hinter „Mehr Angaben"
- Bei vorhandenen Profilen (E-12): Auswahl „Bestehendes Profil verwenden" mit Kartenliste, darunter „Neues anlegen"
- Zuordnung zu Arbeitsgruppen, wenn mehr als eine existiert

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer | Entfällt — es gibt immer mindestens den Anlage-Weg |
| Fehler — Validierung | Fehler am Feld, nicht in einem Sammelbanner. Erstes fehlerhaftes Feld wird fokussiert |

> **Testfall für die Abstraktion:** Dieser Bildschirm muss für das TableTop-Preset
> Klasse/Stufe/Hintergrund zeigen und für das Software-Preset Rolle/Schwerpunkt —
> aus derselben Komponente, ohne Fallunterscheidung.

---

## B — Navigation

### B1 · Dashboard 🎨

| | |
|---|---|
| **Zweck** | Einstiegspunkt. Die Frage beantworten: „Wo geht es gerade weiter?" |
| **Phase** | V1.0 |

**Kernelemente**

- **Laufende Meetings** ganz oben, visuell hervorgehoben, mit Direkteinstieg
- Projektkarten mit Preset-Kennzeichnung, Anzahl Arbeitsgruppen, letzte Aktivität
- Offene Vorschläge mit Zähler — **nur für Lead und Kurator** (V1.1)
- Zuletzt geöffnet
- „Projekt anlegen"

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer | Zwei gleichwertige Wege: „Projekt anlegen" und „Auf eine Einladung warten — schick deiner Projektleitung deine E-Mail-Adresse" |

---

### B2 · Projekt anlegen (Preset-Auswahl) 🎨

| | |
|---|---|
| **Zweck** | Die einzige Konfigurationsentscheidung, die ein Lead treffen muss — und die weitreichendste |
| **Phase** | V1.0 |

**Kernelemente**

- Projektname und Beschreibung
- **Preset-Auswahl als Karten**, nie als Auswahlliste. Je Karte:
  - Name und ein Satz Beschreibung
  - **Ebenenkette** als Kette dargestellt: `Projekt → Sprint → Meeting`
  - Die drei häufigsten Entitätstypen als Chips
  - Verhaltenshinweise als Symbolzeile: Standard-Sichtbarkeit, Leseeinsicht der Leitung, Delegation
- Warnhinweis unter der Auswahl: „Das Preset lässt sich später erweitern, aber nicht wechseln."
- Verweis auf Preset-Import (F5) für eigene Presets

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer | Kann nicht auftreten — zwei Presets sind immer ausgeliefert |
| Fehler — Preset ungültig | Karte ausgegraut mit „Diese Preset-Datei enthält Fehler" und Verweis auf F5 |

---

### B3 · Projektübersicht 🎨

| | |
|---|---|
| **Zweck** | Zustand des Projekts erfassen und in eine Arbeitsgruppe einsteigen |
| **Phase** | V1.0 |

**Kernelemente**

- Projektkopf mit Namen, Preset-Kennzeichnung und Vorschlagszähler (V1.1)
- **Arbeitsgruppen als Karten** — parallele Gruppen gleichrangig nebeneinander (E-03): Name, Anzahl Meetings, letzte Aktivität, Mitglieder als Avatarstapel, laufendes Meeting hervorgehoben
- Kurzstatistik des Projektwissens nach Entitätstyp (V1.1) — zugleich Einstieg in D1
- Aktionen für den Lead: Arbeitsgruppe anlegen, Einladen, Einstellungen

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer (Lead) | „Noch keine **Sprints**. Der erste ist schnell angelegt." mit Primärhandlung |
| Leer (Member) | „Deine Projektleitung hat noch keinen **Sprint** angelegt." — kein toter Knopf |

---

### B4 · Arbeitsgruppen-Übersicht 🎨

| | |
|---|---|
| **Zweck** | Meetings der Gruppe überblicken und ins aktuelle einsteigen |
| **Phase** | V1.0 |

**Kernelemente**

- Meeting-Liste chronologisch absteigend mit deutlicher Zustandskennzeichnung: `geplant` · `läuft` (animiert) · `beendet`
- Je Meeting: Titel, Datum, Teilnehmerzahl, Anzahl Notizen, Anzahl offener Vorschläge (V1.1)
- Teilnehmerprofile der Gruppe als Kartenreihe → D4
- Aktionen für Lead/Kurator: Meeting anlegen, laufendes starten oder beenden

---

## C — Kern

### C1 · Meeting-Raum ⚡ 🎨

| | |
|---|---|
| **Zweck** | **Der wichtigste Bildschirm des Produkts.** Schreiben, ohne im Schreiben unterbrochen zu werden |
| **Phase** | V1.0 (Editor, Sichtbarkeit, Feed) · V1.1 (Erwähnungen) |

**Aufbau — drei Spalten**

| Spalte | Breite | Inhalt |
|--------|--------|--------|
| **Links** (einklappbar) | ~240 px | Meeting-Titel und -Zustand · Teilnehmerliste mit Anwesenheitspunkt · Sprung zu früheren Meetings der Gruppe · bei `beendet`: Verweis in die Review-Inbox |
| **Mitte** | flexibel, max. ~760 px | Eigenes Notizfeld: Markdown mit Live-Vorschau · Sichtbarkeits-Umschalter oben rechts · Speicherstatus · Erwähnungen als farbige Chips inline |
| **Rechts** (einklappbar) | ~320 px | Live-Feed geteilter Notizen, chronologisch absteigend, mit Autor und Zeit · für den Lead bei `lead_can_read_private: true` zusätzlich der Filter „auch private anzeigen" mit Warnfarbe |

**Kernelemente im Detail**

- **Sichtbarkeits-Umschalter:** drei Segmente mit Symbol **und** Text (nie nur Farbe).
  Beim Überfahren je ein Einzeiler. Vorbelegt aus `default_note_visibility`
- **Speicherstatus:** `gespeichert` / `speichert…` / `offline — lokal zwischengespeichert`.
  Der Offline-Zustand ist deutlich, aber nicht alarmierend
- **Zustandsabhängigkeit:** bei `geplant` ist das Notizfeld gesperrt mit Begründung;
  bei `beendet` erscheint über dem Feld „Dieses Meeting ist beendet — Ergänzungen werden markiert"
- **Einmalige Hinweise:** `@`-Hinweis und Transparenzhinweis gemeinsam beim ersten Besuch (PRD §4.4.5)

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Laden | Editor-Rahmen und Feed-Skeleton sofort sichtbar; der Editor ist bedienbar, **bevor** der Feed geladen ist |
| Leer (Feed) | „Noch hat niemand etwas geteilt. Was du auf *geteilt* stellst, erscheint hier bei allen." |
| Fehler (Feed) | Feed zeigt „Aktualisierung unterbrochen · Erneut verbinden" — **der Editor bleibt voll funktionsfähig** |
| Fehler (Speichern) | Deutlicher Hinweis mit Zusicherung: „Nicht gespeichert — dein Text ist lokal gesichert und wird automatisch übertragen" |
| Keine Berechtigung | Kann nicht auftreten; Nichtmitglieder erreichen den Bildschirm nicht |

---

### C2 · Erwähnungs-Auswahl (Overlay) ⚡ 🎨

| | |
|---|---|
| **Zweck** | Typisierung im Schreibfluss, ohne die Hände von der Tastatur zu nehmen |
| **Auslöser** | `@` (alle Typen) · `#` (auf einen Typ eingeschränkt) · Textmarkierung + Leiste |
| **Phase** | V1.1 |

**Kernelemente**

- Erscheint direkt an der Cursorposition, maximal 8 Treffer
- **Reihenfolge:** bestehende Entitäten (unscharfe Suche über Titel und Aliasse) zuerst,
  darunter abgetrennt „Neu anlegen als …" je Entitätstyp aus dem Preset
- Je Treffer: Typ-Symbol, Titel, ein Feld mit `show_in_list: true` als Unterzeile,
  bei Alias-Treffern „Alias von *Kanonischer Name*"
- Vollständige Tastaturbedienung: ↑ ↓ Enter Esc, Tab wechselt in die Typ-Einschränkung
- ARIA-Combobox mit `aria-activedescendant`

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Laden | Kommt bei < 150 ms nicht vor; darüber eine Zeile Skeleton — die Liste springt nicht |
| Leer | „Kein Treffer für *Falkenstein*" plus direkt die Anlage-Optionen. **Nie eine Sackgasse** |
| Fehler | Auswahl schließt lautlos, der getippte Text bleibt als Klartext stehen. Ein Suchfehler darf niemals den Schreibfluss unterbrechen |

---

### C3 · Entität schnell anlegen (Overlay) 🎨

| | |
|---|---|
| **Zweck** | Neue Entität anlegen, ohne den Meeting-Raum zu verlassen |
| **Phase** | V1.1 |

**Kernelemente**

- Titel vorbelegt aus dem markierten oder getippten Text
- **Nur Pflichtfelder** des gewählten Typs, gerendert vom `SchemaForm`-Baustein
- **Duplikathinweis** oberhalb der Felder, wenn Ähnlichkeit ≥ 80 %: „Es gibt schon
  *The Dancing Pony* — meintest du den?" mit den beiden Wegen „Diesen verwenden" und
  „Trotzdem neu anlegen"
- Hinweis auf den Zustand: „Wird als Vorschlag angelegt — deine Projektleitung entscheidet über die Übernahme". Für Lead/Kurator stattdessen die zusätzliche Option „Direkt übernehmen"

---

## D — Wissen

### D1 · Entitäten-Liste 🎨

| | |
|---|---|
| **Zweck** | Das Projektwissen durchsuchen und filtern |
| **Phase** | V1.1 |

**Kernelemente**

- Typ-Reiter aus dem Preset (`Alle` · `Komponenten` · `Entscheidungen` · …)
- Tabelle mit **dynamischen Spalten**: Titel, Typ, plus alle Felder mit `show_in_list: true`
- Filter je `select`-Feld als Chip-Leiste
- Suche über Titel und Aliasse mit Tippfehlertoleranz
- Umschalter „nur kanonisch" / „auch Vorschläge" — Vorschläge visuell abgesetzt
- Sortierung nach jeder Spalte

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer (Projekt neu) | „Hier entsteht euer **Projektwissen** — aus dem, was ihr in **Meetings** schreibt." mit Verweis ins nächste Meeting |
| Leer (Filter) | „Kein Treffer mit diesen Filtern" plus „Filter zurücksetzen" |

---

### D2 · Entitäten-Detail ⚡ 🎨

| | |
|---|---|
| **Zweck** | Beantwortet „Was ist das?" **und** „Woher wissen wir das?" — der zweite Teil ist das Alleinstellungsmerkmal |
| **Phase** | V1.1 |

**Aufbau — für jeden Typ identisch (Konsistenzprinzip)**

| # | Abschnitt | Inhalt |
|---|-----------|--------|
| 1 | Kopf | Titel, Typ-Kennzeichnung, Zustand (kanonisch / Vorschlag), Aliasse als Chips |
| 2 | Felder | Preset-Felder über den `SchemaForm`-Baustein. Für Member schreibgeschützt, für Lead/Kurator direkt bearbeitbar |
| 3 | Beziehungen | Nach Beziehungstyp gruppiert, mit richtungsrichtigem Label (`lebt in` vs. `Bewohner`). Je Beziehung ein Sprung zur Gegenseite |
| 4 | **Herkunft** | Liste aller Notizen, aus denen dieser Eintrag stammt: Meeting, Arbeitsgruppe, Autor, Datum und der Textausschnitt als Momentaufnahme. Klick öffnet die Notiz an der markierten Stelle. Bei nachträglich geänderten Quellen die Kennzeichnung „Quelle nachträglich geändert" |
| 5 | Historie | Zusammengeklappt. Je Eintrag: Zeit, Person, Feld vorher/nachher, **Auslöser** (Kanonisierung / manuelle Bearbeitung / Zusammenführung) und der Verweis auf Notiz und Meeting |

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer (Beziehungen) | „Noch keine Verbindungen" — für Lead/Kurator mit „Beziehung hinzufügen" |
| Leer (Herkunft) | Nur bei direkt angelegten Entitäten: „Direkt angelegt, nicht aus einer Notiz" |
| Keine Berechtigung (Bearbeiten) | Felder schreibgeschützt mit einmaligem Hinweis: „Nur die Projektleitung kann das **Projektwissen** ändern" |

---

### D3 · Beziehung hinzufügen (Overlay) 🎨

| | |
|---|---|
| **Zweck** | Zwei Entitäten typkonform verbinden |
| **Phase** | V1.1 |

**Kernelemente**

- Quelle ist vorbelegt (die Entität, von der aus geöffnet wurde)
- **Beziehungstyp-Auswahl zeigt nur passende Typen** — gefiltert über `source`/`target`
  des Presets. Das ist der Mechanismus, der Generizität intuitiv macht
- Ziel-Auswahl entsprechend eingeschränkt auf erlaubte Zieltypen
- Vorschau des Ergebnissatzes in natürlicher Sprache: „*Gorm* **lebt in** *Falkenstein*"
- Hinweis auf die Gegenrichtung: „Bei *Falkenstein* erscheint das als **Bewohner**"

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer (keine passenden Typen) | „Für **Risiken** sind mit diesem Typ keine Verbindungen vorgesehen." Für den Lead mit Verweis auf F4 |

---

### D5 · Beziehungs-Graph ⚡ 🎨

| | |
|---|---|
| **Zweck** | Die Liste beantwortet „Was ist das?", der Graph „Wie hängt alles zusammen?" — zweite Projektion derselben Daten, keine eigene Datenhaltung |
| **Zugang** | Aus der Projektübersicht und aus der Entitäten-Liste per Umschalter `Liste / Karte` |
| **Phase** | V1.2 |

**Aufbau**

| Bereich | Inhalt |
|---------|--------|
| **Links** (einklappbar, ~230 px) | Suche · **Typ-Filter aus dem Preset** mit Anzahl und Form-/Farbmarke je Typ · Kennzahl „18 Einträge · 24 Verbindungen" · Zeit-/Gruppenfilter („Alle **Sprints**") · Umschalter „nur kanonisch / auch Vorschläge" |
| **Leinwand** | Unendliche Fläche, Zoom, Verschieben, Knoten ziehbar, kräftebasiertes Layout mit stabiler Anordnung |
| **Unten rechts** | Zoom + / − · Ansicht zurücksetzen · Layout-Umschalter |
| **Rechts im Fokusmodus** | Kurzfassung des gewählten Knotens: Typ, Felder mit `show_in_list: true`, Anzahl Herkünfte, „Detailseite öffnen" → D2, „Nachbarschaft erweitern" |

**Preset-Abhängigkeit** — der Punkt, an dem sich die Abstraktion visuell beweist:

| Element | Quelle |
|---------|--------|
| Knotenform | `entity_types[].graph.shape` |
| Knotenfarbe | `entity_types[].graph.color` |
| Kantenstil und -stärke | `relation_types[].graph.style` / `.weight` |
| Kantenbeschriftung | `relation_types[].label` bzw. `.inverse_label` je Richtung |
| Filterliste | `entity_types[]` — vollständig, ohne feste Verdrahtung |

Fehlt der `graph`-Block, leitet die Anwendung Form und Farbe deterministisch aus dem
Typschlüssel ab. Ein Preset ohne Grafikangaben bleibt voll funktionsfähig.

**Fokusmodus** — Klick auf einen Knoten: gewählter Knoten und direkte Nachbarn bleiben
hervorgehoben, alles Übrige wird stark abgedunkelt, **aber nicht entfernt** — der Kontext
tritt zurück, statt zu verschwinden. Kantenbeschriftungen der sichtbaren Verbindungen
werden eingeblendet. Doppelklick öffnet D2. Esc verlässt den Modus.

**Kante auswählen** → zeigt die Notiz(en), aus denen die Verbindung stammt. Dieselbe
Herkunftslogik wie in D2. Das macht den Graph belegbar statt dekorativ.

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Laden | Filterleiste sofort bedienbar, Leinwand mit dezenter Aufbauanimation — nie ein leeres Rechteck |
| Leer (kein Wissen) | „Hier entsteht die Karte eures **Projektwissens**, sobald ihr in **Meetings** Einträge markiert." |
| Leer (keine Verbindungen) | Knoten verstreut sichtbar plus Hinweis: „Noch keine Verbindungen — Beziehungen entstehen beim Übernehmen oder auf den Detailseiten." |
| Leer (Filter) | „Kein Eintrag mit diesen Filtern" plus Zurücksetzen |
| **Zu groß** | Über 1 500 sichtbare Knoten: Aufforderung zum Filtern **bevor** das Layout gerechnet wird. Kein stiller Abbruch, keine hängende Oberfläche |
| Fehler | Rückfall auf D1 mit Hinweis „Die Karte konnte nicht geladen werden — die Liste zeigt dieselben Daten" |

**Barrierefreiheit** — der schwierigste Punkt dieses Bildschirms: Tab wandert zwischen
Knoten in stabiler Reihenfolge, Enter fokussiert, Esc verlässt. Typunterscheidung immer
über **Form und** Farbe, nie über Farbe allein. Zusätzlich ist D1 die vollwertige,
gleichwertige Alternative für alle Inhalte des Graphen.

---

## E — Kuration

### E1 · Review-Inbox ⚡ 🎨

| | |
|---|---|
| **Zweck** | Vorschläge in Projektwissen überführen — als Abarbeitung, nicht als Datenpflege |
| **Zugang** | Lead und Kurator mit Aktionen · Member schreibgeschützt (Transparenz) |
| **Phase** | V1.1 |

**Aufbau — zwei Spalten**

| Spalte | Inhalt |
|--------|--------|
| **Links** — Warteschlange | Vorschläge, gruppierbar nach Meeting / Typ / Autor. Je Eintrag: Titel, Typ-Symbol, Autor, Herkunfts-Meeting. Mehrfachauswahl für Stapelaktionen |
| **Rechts** — Entscheidungskarte | **Eine Entscheidung, ein Bildschirm** |

**Inhalt der Entscheidungskarte**

1. Vorgeschlagener Titel und Typ — beide vor der Übernahme änderbar
2. **Belegstelle**: der Ursprungssatz mit hervorgehobener Textstelle, zwei Zeilen Kontext davor und danach
3. Herkunft: Autor, Meeting, Arbeitsgruppe, Zeitpunkt
4. **Duplikatkandidaten** mit Ähnlichkeitswert und Direktvergleich
5. Pflichtfelder des Typs — **Übernahme bleibt gesperrt, solange eines leer ist**, mit Benennung des fehlenden Feldes
6. Vorgeschlagene Beziehungen aus derselben Notiz, einzeln abwählbar

**Aktionen:** `✅ Übernehmen` · `🔗 Zusammenführen mit …` → E2 · `❌ Ablehnen` (mit optionalem Grund) · `⏭ Später`

**Gegen den Flaschenhals (R-03):** Stapelaktionen für Vorschläge ohne offene Pflichtfelder ·
Gruppierung nach Typ für Serienbearbeitung · Zähler im Projektkopf · Tastenkürzel
(`J`/`K` navigieren, `A` übernehmen, `X` ablehnen)

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer | „Alles abgearbeitet." Bewusst als Belohnung gestaltet, nicht als kahler Bildschirm |
| Leer (Member) | „Hier arbeitet die Projektleitung Vorschläge ab. Deine Vorschläge aus **Meeting 12** stehen in der Warteschlange." |
| Keine Berechtigung | Für Member: Liste sichtbar, Aktionen fehlen (nicht ausgegraut — gar nicht vorhanden) |

---

### E2 · Zusammenführen 🎨

| | |
|---|---|
| **Zweck** | Duplikate zusammenführen, ohne Informationsverlust |
| **Phase** | V1.1 |

**Kernelemente**

- Zwei Spalten nebeneinander: Vorschlag und Zielentität
- Feldweise Vorschau des Ergebnisses. Regel sichtbar gemacht: **leere Zielfelder werden
  gefüllt, gefüllte nie überschrieben**; abweichende Werte werden markiert und sind manuell auflösbar
- Titel des Vorschlags wird als **Alias** übernommen — sichtbar dargestellt
- Beziehungen und Herkünfte werden vereinigt, Duplikate verworfen
- Hinweis: „Umkehrbar innerhalb von 30 Tagen"

---

### E3 · Änderungshistorie (Overlay) 🎨

| | |
|---|---|
| **Zweck** | „Wer hat wann was geändert — und warum?" |
| **Phase** | V1.1 |

**Kernelemente**

- Zeitstrahl absteigend
- Je Eintrag: Zeitpunkt, Person, Feld mit Vorher/Nachher-Vergleich, **Auslöser-Kennzeichnung**
  (Kanonisierung / manuelle Bearbeitung / Zusammenführung) und, sofern vorhanden, Verweis
  auf Notiz, Meeting und Arbeitsgruppe
- Filter nach Auslöser

---

## F — Verwaltung

### F2 · Projekteinstellungen — Mitglieder & Rollen

| | |
|---|---|
| **Zweck** | Mitglieder verwalten, Kuratoren ernennen, Einladungen steuern |
| **Phase** | V1.0 |

**Kernelemente**

- Mitgliederliste mit Rolle, Beitrittsdatum und verknüpften Teilnehmerprofilen
- Rollenwechsel: Kurator ernennen oder entziehen — **nur sichtbar, wenn `curator_delegation: true`**
- Leitung übertragen, mit Bestätigung
- Aktive Einladungslinks mit Ablaufdatum und Widerruf
- Mitglied entfernen, mit Hinweis auf den Verbleib der Notizen (Anonymisierung)

---

### F3 · Projekteinstellungen — Preset-Ansicht 🎨

| | |
|---|---|
| **Zweck** | Transparenz darüber, wie das Projekt konfiguriert ist |
| **Phase** | V1.0 |

**Kernelemente**

- Preset-Name, Version, Bindungsdatum
- Terminologie-Tabelle (generisch ↔ Anzeigebegriff) — **hier erscheinen generische Begriffe
  bewusst**, es ist der einzige Ort dafür
- Entitätstypen mit ihren Feldern, schreibgeschützt
- Beziehungstypen mit Quelle und Ziel
- Verhaltens-Flags im Klartext, **für alle Mitglieder einsehbar**: „Die Projektleitung kann
  private Notizen einsehen: **Nein**"
- „Erweitern" → F4

---

### F4 · Preset erweitern (additiv) 🎨

| | |
|---|---|
| **Zweck** | Neue Typen, Felder, Beziehungen und Auswahloptionen ergänzen, ohne bestehende Daten zu gefährden |
| **Phase** | V1.1 |

**Kernelemente**

- Vier Wege: neuer Entitätstyp · neues **optionales** Feld an einem Typ · neuer Beziehungstyp · neue `select`-Option
- **Gesperrte Aktionen sind sichtbar, aber erklärt:** „Felder lassen sich nicht löschen,
  weil bestehende Einträge sie nutzen. Du kannst sie aus der Listenansicht ausblenden."
- Vorschau: „Betrifft 23 bestehende **Komponenten**"
- Änderung erhöht die Bindungsversion und wird protokolliert

---

### F5 · Preset-Verwaltung / Import 🎨

| | |
|---|---|
| **Zweck** | Eigene Presets einbringen |
| **Phase** | V1.0 |

**Kernelemente**

- Liste der verfügbaren Presets (ausgeliefert und importiert) mit Nutzungszähler
- Import per Datei-Ablage
- **Validierungsausgabe zeilengenau:** „Zeile 34: `target_type: teammmber` — unbekannter Typ. Meintest du `teammember`?"
- Vorschau vor der Übernahme: Terminologie, Typen, Felder, Beziehungen
- Herunterladen eines vorhandenen Presets als Ausgangspunkt für eigene

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Fehler — ungültiges YAML | Zeilennummer, Ursache, Korrekturvorschlag. Nie „Ungültige Datei" allein |
| Fehler — Schemaverstoß | Alle Verstöße auf einmal, nicht einer nach dem anderen |

---

## Abhängigkeiten und Baureihenfolge

```text
SchemaForm-Baustein  ─────┬──▶ A5 Profil anlegen
(die härteste Stelle)     ├──▶ C3 Schnellanlage
                          ├──▶ D2 Entitäten-Detail
                          ├──▶ E1 Review-Inbox
                          └──▶ F4 Preset erweitern

Preset-Auflösung  ────────▶ jeder mit 🎨 markierte Bildschirm

Autorisierungsschicht  ───┬──▶ C1 Sichtbarkeitsfilterung
                          ├──▶ E1 Rollenabhängige Aktionen
                          └──▶ F2 Rollenverwaltung

C1 Meeting-Raum  ─────────▶ C2 Erwähnung ──▶ D1/D2 ──▶ E1 ──▶ E2
```

**Der `SchemaForm`-Baustein speist fünf Bildschirme.** Er ist zugleich die schwierigste
und die folgenreichste Stelle — deshalb steht er in SRD §11.7 an erster Position.

---

## Für das Mockup ausgewählte Bildschirme

Drei Bildschirme genügen, um die Produktthese sichtbar zu machen — **jeweils in beiden
Presets nebeneinander**:

| Bildschirm | Was er beweisen soll |
|-----------|----------------------|
| **C1 Meeting-Raum** | Der Schreibfluss funktioniert und die Sichtbarkeitsstufen sind selbsterklärend |
| **E1 Review-Inbox** | Kanonisierung fühlt sich wie eine Entscheidung an, nicht wie Datenpflege |
| **D2 Entitäten-Detail** | Der Herkunftsnachweis ist das Alleinstellungsmerkmal — und für jeden Typ derselbe Aufbau |
| **D5 Beziehungs-Graph** | Preset-Neutralität in einer Sekunde sichtbar: dieselbe Karte, andere Formen, Farben und Beschriftungen |

Dazu ein **Preset-Umschalter** im Mockup, der zwischen Software-Projekt und TableTop
wechselt, ohne dass sich das Layout ändert. Genau dieser Umschalter ist die visuelle
Fassung des Erfolgskriteriums „zweites Preset ohne Codeänderung".
