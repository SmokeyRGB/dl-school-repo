/**
 * utils — Sammelexport.
 *
 * Nur Weiterleitung, kein eigener Code: Komponenten importieren aus
 * '../utils/index.js', ohne wissen zu müssen, in welcher Datei ein Helfer
 * genau liegt. Anwendungsbeispiele stehen in ARCHITECTURE.md, nicht hier —
 * Beispielcode in einem Laufzeitmodul wird sonst mitgeladen und veraltet.
 *
 * Daten liegen nicht in utils: Presets in data/presets/, Screen-Register in
 * data/screens.js.
 */

// Styling-Helfer (pure Funktionen, liefern CSS-Strings)
export {
  tint,
  markSt,
  chipSt,
  avSt,
  segSt,
  createIcon,
  shapePath
} from './renderHelpers.js';

// Editor-Logik (@-Erwähnung, KI-Vorschlag; nutzt DOM-Selection-APIs)
export {
  checkMention,
  analyzeAi,
  insertMention,
  acceptAi,
  flipY,
  typeOf,
  tintColor
} from './editorLogic.js';

// Artikel-Auflösung des Wikis (D2)
export { resolveArticle } from './wikiArticle.js';

// Notizen: Erwähnungs-Chips, Sichtbarkeit, Bilanz (C1 und E2 gemeinsam)
export {
  VISIBILITIES,
  visLabel,
  composerVis,
  entityChip,
  renderNoteText,
  markCount,
  noteBalance,
  notePlain
} from './noteText.js';

// Ablauf- und Strukturlogik
export {
  ReviewManager,
  CurationManager,
  NavBuilder,
  ScreenManager
} from './stateManager.js';

// Navigations-Icons
export { navIcon } from './icons.js';
