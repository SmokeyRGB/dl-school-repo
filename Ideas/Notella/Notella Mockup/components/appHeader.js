/**
 * Kopfzeile und Statusanzeige der Entwickler-Leiste.
 *
 * Beides sind reine Textaktualisierungen an feststehenden Elementen — kein
 * Neuaufbau von Markup, damit nichts flackert.
 */

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/**
 * Spiegelt Rolle und Screen-Status in Kopfzeile und Dev-Leiste.
 *
 * @param {object} preset  Aktuelles Preset (liefert die Namen)
 * @param {object} state   App-State
 */
export function renderAppHeader(preset, state) {
  const isLead = state.role === 'lead';

  setText('screen-id', state.screen);
  setText('mode-id', state.mode);
  setText(
    'user-label',
    isLead ? `${preset.d.leadFull} · Lead` : `${preset.d.me} · Member`
  );
}
