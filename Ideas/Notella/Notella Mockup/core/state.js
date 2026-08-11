/**
 * App-State — eine Definition, ein Ort.
 *
 * Gruppiert nach Zuständigkeit, damit erkennbar bleibt, welcher Screen
 * welches Feld benutzt. Bewusst ein flaches Objekt: die Screens lesen
 * state.x direkt, verschachtelte Bereiche würden jeden Zugriff verlängern.
 */
export function createInitialState() {
  return {
    // Rahmen: welcher Screen, welches Preset, welche Rolle, welcher Demo-Modus
    screen: 'B1',
    presetId: 'software',
    role: 'lead',
    mode: 'normal',

    // Navigation
    navOpen: false,
    railOpen: false,
    navExp: {},

    // Meeting-Raum (C1): @-Erwähnung, KI-Vorschlag, Notiz-Schublade
    mention: null,
    mentionIdx: 0,
    aiMode: true,
    aiSug: null,
    drawer: false,
    hintOpen: true,

    // Review-Inbox (E1): Position, Pflichtfelder, Entscheidungs-Log, Undo
    reviewIdx: 0,
    rf: {},
    log: [],
    undo: null,

    // Wiki-Artikel (D2): ausgewählter Eintrag, Baum-Modus, Herkunfts-Panel
    // entry: null = der ausgeschriebene Artikel des Presets
    entry: null,
    treeMode: 'entry',
    origin: false,
    originTab: 'origin',

    // Beziehungs-Graph (D5): Ansicht, Filter, Fokus, Knotenpositionen
    zoom: 1,
    focus: null,
    edgeFocus: null,
    expand: false,
    hidden: [],
    onlyCanon: false,
    graphPanel: true,
    graphLayout: 'force',
    nodePos: {},

    // Sonstiges
    vis: null
  };
}
