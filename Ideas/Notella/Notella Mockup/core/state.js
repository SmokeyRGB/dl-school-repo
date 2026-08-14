/**
 * App-State — eine Definition, ein Ort.
 *
 * Gruppiert nach Zuständigkeit, damit erkennbar bleibt, welcher Screen
 * welches Feld benutzt. Bewusst ein flaches Objekt: die Screens lesen
 * state.x direkt, verschachtelte Bereiche würden jeden Zugriff verlängern.
 */
import { getPreset } from '../data/presets/index.js';

/**
 * Notizen des Presets in den State kopieren.
 *
 * Der Notizblock (C1) verändert Notizen — abschicken, bearbeiten,
 * Sichtbarkeit umstellen. Das Preset ist ein Modul und bleibt deshalb
 * unangetastet; der State bekommt eine eigene Kopie. Ohne sie würde ein
 * Presetwechsel und zurück die Änderungen der ersten Runde mitschleppen.
 *
 * @param {string} presetId
 * @returns {Array<object>} flache Kopien der Preset-Notizen
 */
export function seedNotes(presetId) {
  return (getPreset(presetId).d.notes || []).map((note) => ({ ...note }));
}

export function createInitialState() {
  const presetId = 'software';

  return {
    // Rahmen: welcher Screen, welches Preset, welche Rolle, welcher Demo-Modus
    screen: 'B1',
    presetId,
    role: 'lead',
    mode: 'normal',

    // Navigation
    navOpen: false,
    railOpen: false,
    navExp: {},

    // Meeting-Raum (C1): Notizstrom, Verfasser, Schublade, Editor-Popover
    // notes    — eigene Notizen, älteste zuerst (E-14)
    // composerVis — Sichtbarkeit der entstehenden Notiz; null = Preset-Default
    // editingId   — Notiz, die gerade an Ort und Stelle bearbeitet wird
    // meeting: null = das Treffen aus d.meetingTitle. Die Sidebar setzt es
    // um; nur so sind die Zustände `geplant` und `beendet` erreichbar.
    notes: seedNotes(presetId),
    meeting: null,
    composerVis: null,
    editingId: null,
    drawer: false,
    hintOpen: true,
    mention: null,
    mentionIdx: 0,
    aiMode: true,
    aiSug: null,

    // Kuration Phase 1 (E1): Position, Pflichtfelder, Entscheidungs-Log, Undo
    reviewIdx: 0,
    rf: {},
    log: [],
    undo: null,

    // Kuration Phase 2 (E2): Position, abgeschlossene Notizen, Undo
    // closed — IDs, nicht Zähler: der Abschluss hängt an der Notiz (E-21)
    noteIdx: 0,
    closed: [],
    curationUndo: null,

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
    nodePos: {}
  };
}
