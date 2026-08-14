/**
 * Notiztext und Sichtbarkeit — die Regeln, die C1 und E2 teilen.
 *
 * Beide Bildschirme zeigen dieselben Notizen in unterschiedlicher Absicht:
 * C1 den eigenen Strom beim Schreiben, E2 die Durchsicht durch die Leitung.
 * Die Auflösung der Erwähnungen zu Chips und die Benennung der Sichtbarkeit
 * dürfen deshalb nicht zweimal geschrieben werden — sonst driften sie.
 *
 * Ohne DOM prüfbar; die Funktionen liefern Strings.
 *
 * Importiert bewusst aus den Quellmodulen statt aus './index.js': der
 * Sammelexport reicht diese Datei selbst weiter, ein Rückimport wäre ein
 * Zyklus (ARCHITECTURE.md, „keine Rückwege").
 */
import { tint } from './renderHelpers.js';
import { typeOf } from './editorLogic.js';

/**
 * Die zwei Sichtbarkeiten aus E-04, ausgeschrieben.
 *
 * Bewusst als Wort und nie nur als Farbe oder Symbol (PRD §4.4.1):
 * die Bedeutung ist zu wichtig, um erraten zu werden.
 */
export const VISIBILITIES = [
  { key: 'mine', label: 'Für mich', icon: '🔒' },
  { key: 'team', label: 'Für Team', icon: '👥' }
];

/** @returns {string} „Für mich" | „Für Team" */
export function visLabel(key) {
  const found = VISIBILITIES.find((v) => v.key === key);
  return (found || VISIBILITIES[0]).label;
}

/**
 * Sichtbarkeit der entstehenden Notiz.
 *
 * `state.composerVis === null` heißt „noch nicht angefasst" und fällt auf
 * `default_note_visibility` des Presets zurück (PRD §4.1.3/§4.1.4). Genau
 * dieser Rückfall macht den Presetwechsel im Umschalter sichtbar.
 */
export function composerVis(preset, state) {
  return state.composerVis || preset.d.defaultVisibility || 'team';
}

/**
 * Chip in der Farbe des Entitätstyps — dieselbe Form wie eine @-Erwähnung
 * im Verfasser, damit „geschrieben" und „abgeschickt" gleich aussehen.
 *
 * @param {string}  label     Titel der Entität
 * @param {object}  preset
 * @param {boolean} [outline] Umriss statt Fläche — offener Vorschlag (E2)
 */
export function entityChip(label, preset, outline = false) {
  const entity = (preset.entities || []).find((e) => e.label === label);
  const type = typeOf(entity ? entity.key : preset.types[0].key, preset);
  const skin = outline
    ? `background:transparent;border:1px dashed ${tint(type.color, 0.55)}`
    : `background:${tint(type.color, 0.14)};border:1px solid transparent`;

  return `<span contenteditable="false" style="display:inline-flex;align-items:center;gap:5px;padding:1px 8px 2px;border-radius:999px;${skin};color:${type.color};font-size:14px;font-weight:500;white-space:nowrap"><span style="width:5px;height:5px;border-radius:50%;background:${type.color};display:inline-block"></span>${label}</span>`;
}

/**
 * Notiztext mit aufgelösten Erwähnungen.
 *
 * Auszeichnungssyntax ist nie sichtbar (PRD §4.4.1, Akzeptanzkriterium) —
 * eine Erwähnung ist immer ein Chip, im Verfasser wie im Strom.
 *
 * @param {Array<{t?: string, ref?: string}>} parts
 * @param {object}  preset
 * @param {boolean} [outline] Chips als Umriss zeichnen (offene Vorschläge)
 */
export function renderNoteText(parts, preset, outline = false) {
  return (parts || [])
    .map((part) => (part.ref ? entityChip(part.ref, preset, outline) : part.t))
    .join('');
}

/** Anzahl der Erwähnungen einer Notiz — abgeleitet, nie mitgepflegt. */
export function markCount(note) {
  return (note.parts || []).filter((part) => part.ref).length;
}

/**
 * Bilanz des Treffens für den Kopf von C1 und den Abschluss von E2.
 *
 * „12 Notizen · 7 markiert" ist die Zahl, die Live-Taggen sichtbar
 * auszahlt (E-23) — und in E2 dieselbe Zahl, die die Vorarbeit anerkennt.
 */
export function noteBalance(notes) {
  const list = notes || [];
  return { total: list.length, marked: list.filter((n) => markCount(n) > 0).length };
}

/** Reintext einer Notiz — für Suchen, Titel und Vorschauzeilen. */
export function notePlain(note) {
  return (note.parts || []).map((part) => part.ref || part.t || '').join('');
}
