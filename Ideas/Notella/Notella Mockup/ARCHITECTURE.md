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
  state.js                    createInitialState() — eine State-Definition
  keyboard.js                 Globale Tasten (Escape-Kette)
  actions/
    editor.js                 C1: @-Erwähnung, Notiz-Schublade
    review.js                 E1: Entscheiden, Undo, Tastenkürzel
    wiki.js                   D2: Baum-Modus, Herkunfts-Panel
    graph.js                  D5: Filter, Fokus, Zoom, Knoten ziehen

components/
  appHeader.js                Kopfzeile + Dev-Leisten-Status (nur Textknoten)
  navSidebar.js               Sidebar-Markup, chrome-Verhalten
  devBar.js                   Verdrahtung der 3 Umschaltergruppen
  screenStage.js              Screen-Registry: Container + Umschaltung
  mentionPopup.js             Popover-Markup der @-Erwähnung
  screenB1.js … screenE1.js   Ein Screen = eine Datei

utils/
  index.js                    Sammelexport (reine Weiterleitung)
  renderHelpers.js            tint, chipSt, markSt, avSt, segSt, createIcon, shapePath
  editorLogic.js              checkMention, analyzeAi, insertMention, acceptAi, …
  stateManager.js             ReviewManager, NavBuilder, ScreenManager
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
```

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
| @-Erwähnung im Editor | Re-Render würde den (nicht persistierten) Editor-Inhalt bei jedem Tastendruck leeren | `core/actions/editor.js` |
| Knoten im Graph ziehen | Re-Render pro Pixel wäre unbrauchbar; Commit erst beim Loslassen | `core/actions/graph.js` |

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
| `focus` | eingeklappt, öffnet bei Hover | Arbeitsseiten (C1, D2, D5, E1, F3) |

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
| Meeting-Raum (C1) | `mention`, `mentionIdx`, `aiSug`, `drawer`, `hintOpen` |
| Review-Inbox (E1) | `reviewIdx`, `rf`, `log`, `undo` |
| Wiki (D2) | `treeMode`, `origin`, `originTab` |
| Graph (D5) | `zoom`, `focus`, `edgeFocus`, `expand`, `hidden`, `onlyCanon`, `graphPanel`, `graphLayout`, `nodePos` |

---

## Testbarkeit

Alles in `utils/` ist ohne DOM prüfbar:

```javascript
// utils/renderHelpers.js
tint('#5340c4', 0.14)                      // → 'rgba(83,64,196,0.14)'

// utils/stateManager.js
new ReviewManager(PRESETS).decide(0, cards, state, 'primary').reviewIdx   // → 1
NavBuilder.buildNavGroups(preset, state, true).length                     // → 5 (Lead)
```

DOM brauchen `utils/editorLogic.js` (Selection-API), `core/actions/*` und
`components/*` (Markup-Ausgabe prüfbar per String-Vergleich).

---

## Ausstehend

- **B2** und **F3** stehen im Screen-Register, haben aber noch keinen
  Renderer — sie zeigen den Platzhalter aus `screenStage.js`
- `#breadcrumbs` und `#ai-popup` sind im Gerüst angelegt, aber unbefüllt
- `#user-initials` wird nicht auf die Rolle aktualisiert (zeigt immer „SR")
- `utils/editorLogic.js` `analyzeAi`/`acceptAi` sind implementiert, aber
  noch nicht an C1 angebunden
