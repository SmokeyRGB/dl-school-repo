# Notella Mockup — Architektur

## Leitgedanke

`index.html` ist nur die Hülle: Markup-Gerüst, vier Stylesheets, ein
Modul-Einstieg. Kein CSS, kein JavaScript, keine Daten im HTML. Alles
andere hat genau einen Platz:

| Ordner | Enthält | Enthält *nicht* |
|---|---|---|
| `data/` | Presets, Screen-Register | Logik, Markup |
| `utils/` | Pure Helfer, Regeln (Review, Nav) | DOM-Zugriff auf feste IDs, Daten |
| `components/` | Markup-Erzeugung je Baustein | State-Änderungen |
| `core/` | State, Render-Takt, Aktionen | Markup, Daten |
| `styles/` | CSS | — |

---

## Dateibaum

```
index.html                    Hülle: Gerüst + 4 Stylesheets + <script src="app.js">
app.js                        Einstieg: App starten, Ladefehler anzeigen

core/
  app.js                      NotellaMockupApp — State halten, 3 Bereiche zeichnen
  state.js                    createInitialState(), seedNotes()
  keyboard.js                 Globale Tasten (Escape-Kette, Screen-Kürzel)
  actions/
    editor.js                 C1/C2: @-Erwähnung und KI-Vorschlag (nur Popover)
    notes.js                  C1: abschicken, bearbeiten, Sichtbarkeit, Schublade
    review.js                 E1: Entscheiden, Undo, Tastenkürzel
    curation.js               E2: Notiz abschließen, blättern, Undo
    wiki.js                   D2: Baum-Modus, Herkunfts-Panel
    graph.js                  D5: Filter, Fokus, Zoom, Knoten ziehen

components/
  appHeader.js                Kopfzeile + Dev-Leisten-Status (nur Textknoten)
  navSidebar.js               Sidebar-Markup, chrome-Verhalten
  devBar.js                   Verdrahtung der 4 Umschaltergruppen
  screenStage.js              Screen-Registry: Container + Umschaltung
  drawer.js                   Schublade — C1 (Team-Notizen) und D2 (Herkunft)
  curationHeader.js           Kopfleiste, Fortschritt, Undo, Kürzelfuß für E1+E2
  mentionPopup.js             Popover-Markup der @-Erwähnung
  aiPopup.js                  Popover-Markup des KI-Vorschlags
  stateViews.js               Laden · Leer · Fehler (gemeinsame Form)
  screenB1.js … screenE2.js   Ein Screen = eine Datei

utils/
  index.js                    Sammelexport (reine Weiterleitung)
  renderHelpers.js            tint, chipSt, markSt, avSt, segSt, createIcon, shapePath
  editorLogic.js              checkMention, analyzeAi, insertMention, acceptAi, …
  noteText.js                 Erwähnungs-Chips, Sichtbarkeit, Bilanz (C1 + E2)
  wikiArticle.js              resolveArticle() — Artikel des gewählten Eintrags
  stateManager.js             ReviewManager, CurationManager, NavBuilder, ScreenManager
  icons.js                    navIcon() — Icon-Set der Navigation

data/
  screens.js                  SCREENS — Name + chrome je Screen
  presets/
    index.js                  PRESETS, getPreset()
    software.js               Preset „Software-Projekt"
    tabletop.js               Preset „TableTop-Projekt"

styles/
  global.css                  Reset, Schrift, @keyframes
  layout.css                  App-Shell, Kopfzeile, Screen-Bühne
  nav.css                     Sidebar (Ein-/Ausklappen rein per CSS)
  devbar.css                  Dev-Leiste, Popover-Rahmen

server.py                     Entwicklungsserver (Python, Port 8000)
support.js                    Fremdbibliothek, unverändert übernommen
Notella Mockup.dc.html        Stand vor dem Refactoring (2013 Zeilen) — Archiv,
                              nicht eingebunden, wird nicht mitgepflegt
```

---

## Starten

Die Dateien laden einander per `import`. Das verlangt HTTP — über `file://`
verweigert der Browser die Module. Deshalb der kleine Server:

```bash
python "Notella Mockup/server.py"
```

Danach `http://localhost:8000/`. Dieselbe Zeile steckt in
`Ideas/Notella/.claude/launch.json` unter dem Namen `notella-mockup`.

---

## Abhängigkeitsrichtung

```
data/ ─────────┐
               ├──▶ core/ ──▶ components/ ──▶ utils/
utils/ ────────┘                                │
                                                ▼
                                          (keine Rückwege)
```

- `utils/` kennt niemanden außerhalb von `utils/`
- `components/` kennt `utils/` und `data/`, nie `core/`
- `core/` kennt alles, wird von niemandem importiert (außer `app.js`)
- keine Zyklen

---

## Render-Takt

Ein State-Wechsel zeichnet immer genau drei Bereiche neu:

```
app.setState({ … })
      ▼
core/app.js render()
      ├─▶ components/appHeader.renderAppHeader()      Textknoten aktualisieren
      ├─▶ components/navSidebar.renderNavSidebar()    Sidebar-Markup ersetzen
      └─▶ components/screenStage.renderActiveScreen() aktiven Screen ersetzen
```

**Zwei bewusste Ausnahmen** — beide umgehen `setState()`, weil ein voller
Re-Render sonst Inhalte zerstören würde:

| Fall | Warum | Wo |
|---|---|---|
| Erwähnungs- und KI-Popover | Sie hängen an festen Elementen außerhalb der Bühne; ein Re-Render pro Tastendruck zerstörte die Cursorposition | `core/actions/editor.js` |
| Knoten im Graph ziehen | Re-Render pro Pixel wäre unbrauchbar; Commit erst beim Loslassen | `core/actions/graph.js` |

**Die Ausnahme ist mit dem Notizblock kleiner geworden.** Bis zum Umbau auf
E-14 war *ganz C1* vom Render-Takt ausgenommen: der Meeting-Raum war ein
Dokument im DOM, und jeder State-Wechsel hätte es geleert. Jetzt ist eine
abgeschickte Notiz Teil des States, und flüchtig bleibt nur der Verfasser —
was dort halb getippt steht, ist noch keine Notiz. Damit ein Re-Render ihn
nicht wegwirft, wird sein Inhalt bei jedem Tastendruck gemerkt
(`cacheComposer`) und nach dem Zeichnen zurückgeschrieben:

```javascript
// core/app.js render(), letzte Zeile
if (this.state.screen === 'C1') this.restoreComposer();
```

Das ist die einzige Stelle, an der `render()` mehr tut als zeichnen — und
sie steht bewusst dort und nicht in den Aktionen, weil sie zum Takt gehört.

---

## Warum `Object.assign` auf den Prototyp

Die Screens verdrahten ihre Knöpfe über Inline-Handler
(`onclick="app.zoomGraph(0.2)"`). Das setzt eine flache API auf einem
globalen `app` voraus. Die Aktionen liegen deshalb nach Zuständigkeit in
`core/actions/*.js` und werden in `core/app.js` in den Prototyp gemischt:

```javascript
Object.assign(NotellaMockupApp.prototype, editorActions, reviewActions, wikiActions, graphActions);
```

Alternative wäre eine Delegationsmethode pro Aktion (~25 Einzeiler ohne
eigene Aussage). Wenn die Screens später Event-Delegation statt Inline-Handler
nutzen, können die Aktionen zu echten Controllern mit eigenem Zustand werden.

---

## Einen Screen hinzufügen

1. `data/screens.js` — Eintrag mit `name` und `chrome`
2. `components/screenXY.js` — `export function renderScreenXY(preset, state)`
3. `components/screenStage.js` — Import + Zeile in `SCREEN_RENDERERS`

Container-`<div>`, Sichtbarkeit, Sidebar-Verhalten und Breadcrumb-Name folgen
automatisch. Ohne Renderer erscheint der Platzhalter aus `screenStage.js`.

## Ein Preset hinzufügen

1. `data/presets/xy.js` — Objekt in der Struktur von `software.js`
2. `data/presets/index.js` — Zeile in `PRESETS`
3. `index.html` — Knopf `<button class="preset-btn" data-preset="xy">` in der Dev-Leiste

## Ein Tastenkürzel hinzufügen

- global → `core/keyboard.js`
- screen-spezifisch → in die Aktionsdatei des Screens (Vorbild:
  `handleReviewKey` in `core/actions/review.js`), von `keyboard.js` aufgerufen

---

## chrome-Typen

`chrome` in `data/screens.js` steuert den Rahmen, nicht der Screen selbst:

| Wert | Sidebar | Verwendung |
|---|---|---|
| `start` | ausgeblendet | Einstiegsseiten (B1, B2) |
| `orient` | dauerhaft offen (`.open`) | Überblicksseiten (B3) |
| `focus` | eingeklappt, öffnet bei Hover | Arbeitsseiten (C1, D2, D5, E1, E2, F3) |

Das Aufklappen bei Hover ist reines CSS (`styles/nav.css`). Deshalb ist jede
Aufklapp-Regel dort für `:hover` **und** `.open` formuliert — und deshalb
braucht die Sidebar keine JS-Hover-Listener.

---

## Zustandsfelder

`core/state.js` gruppiert die Felder nach Zuständigkeit. Wer ein Feld
hinzufügt, trägt es in die passende Gruppe ein — das hält sichtbar, welcher
Screen wovon abhängt:

| Gruppe | Felder |
|---|---|
| Rahmen | `screen`, `presetId`, `role`, `mode` |
| Navigation | `navOpen`, `railOpen`, `navExp` |
| Notizblock (C1) | `notes`, `meeting`, `composerVis`, `editingId`, `drawer`, `hintOpen`, `mention`, `mentionIdx`, `aiMode`, `aiSug` |
| Kuration Phase 1 (E1) | `reviewIdx`, `rf`, `log`, `undo` |
| Kuration Phase 2 (E2) | `noteIdx`, `closed`, `curationUndo` |
| Wiki (D2) | `entry`, `treeMode`, `origin`, `originTab` |
| Graph (D5) | `zoom`, `focus`, `edgeFocus`, `expand`, `hidden`, `onlyCanon`, `graphPanel`, `graphLayout`, `nodePos` |

Drei Felder verdienen eine Notiz:

- **`notes`** ist eine *Kopie* der Preset-Notizen (`seedNotes`), keine
  Referenz. Der Notizblock verändert sie, das Preset ist ein Modul und
  bleibt unangetastet. Beim Presetwechsel wird neu geseedet
- **`composerVis: null`** heißt „noch nicht angefasst" und fällt auf
  `d.defaultVisibility` des Presets zurück. Genau dieser Rückfall macht den
  Presetwechsel im Sichtbarkeits-Umschalter sichtbar (Software `Für Team`,
  TableTop `Für mich`)
- **`closed`** hält Notiz-IDs, keinen Zähler: der Kurationszustand hängt an
  der Notiz, nicht am Treffen (E-21). Nachgereichte Notizen sind damit
  schlicht weitere offene Notizen

---

## Testbarkeit

Alles in `utils/` ist ohne DOM prüfbar:

```javascript
// utils/renderHelpers.js
tint('#5340c4', 0.14)                      // → 'rgba(83,64,196,0.14)'

// utils/stateManager.js
new ReviewManager(PRESETS).decide(0, cards, state, 'primary').reviewIdx   // → 1
new CurationManager().open(notes, ['n1']).length                          // → notes.length - 1
NavBuilder.buildNavGroups(preset, state, true).length                     // → 5 (Lead)

// utils/noteText.js
noteBalance(preset.d.notes)                                               // → { total: 12, marked: 6 }
composerVis(tabletopPreset, { composerVis: null })                        // → 'mine'
```

DOM brauchen `utils/editorLogic.js` (Selection-API), `core/actions/*` und
`components/*` (Markup-Ausgabe prüfbar per String-Vergleich).

---

## Stand gegenüber der Spezifikation

Das Mockup ist auf `01-Problem-Framing.md` v0.3, `02-PRD.md` V0.9,
`03-SRD.md` V0.4 und `04-Screen-Inventar.md` V0.2 nachgezogen. Die vier dort
fürs Mockup ausgewählten Bildschirme sind gebaut: **C1** Notizblock,
**E1 + E2** Kuration, **D2** Wiki, **D5** Graph.

> **Wichtig:** Das Mockup ist ein Werkzeug zur Anforderungsfindung, **keine
> Codebasis** (Screen-Inventar V0.2, Schlussabsatz). Die Umsetzung beginnt
> spec-getrieben neu. Ein Unterschied zur Spezifikation ist deshalb kein
> Fehler, der behoben werden muss — er gehört nur dann in
> `../spec-sync-log.md`, wenn hier eine **Produktentscheidung** sichtbar
> wurde, die in der Spezifikation fehlt.

---

## Ausstehend

- **B2** und **F3** stehen im Screen-Register, haben aber noch keinen
  Renderer — sie zeigen den Platzhalter aus `screenStage.js`
- `#breadcrumbs` ist im Gerüst angelegt, aber unbefüllt
- `#user-initials` wird nicht auf die Rolle aktualisiert (zeigt immer „SR")
- Der zweite Typisierungsweg (**Text markieren → Leiste**, PRD §4.4.1 Weg B)
  fehlt; nur `@` ist gebaut. Für Menschen ist Weg B der wichtigere —
  beim Schreiben weiß man selten schon, dass ein Satz strukturrelevant ist
- **E2** kann Übersehenes noch nicht typisieren und keine Beziehungen
  ergänzen (`R`); die Notiz lässt sich lesen, blättern und abschließen
- Die Notizen anderer erscheinen in E2 aus den Demodaten (`by`), nicht aus
  einem gemeinsamen Treffensbestand — für die Durchsicht reicht das, für
  einen zweiten Notizstrom nicht
