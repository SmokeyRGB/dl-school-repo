/**
 * Preset-Registry — einzige Quelle für Preset-Daten.
 *
 * Der Schlüssel ist die `presetId` im App-State (DevBar-Umschalter).
 * Neues Preset hinzufügen = Datei anlegen + hier eintragen; kein anderer
 * Code muss angepasst werden.
 */
import { softwarePreset } from './software.js';
import { tabletopPreset } from './tabletop.js';

export const PRESETS = {
  software: softwarePreset,
  tabletop: tabletopPreset
};

/** @returns {object} Preset zur ID, mit Fallback auf 'software'. */
export function getPreset(presetId) {
  return PRESETS[presetId] || PRESETS.software;
}
