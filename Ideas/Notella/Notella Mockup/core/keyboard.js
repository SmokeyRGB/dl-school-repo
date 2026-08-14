/**
 * Globale Tastaturbedienung.
 *
 * Escape ist bewusst hier gebündelt, weil es mehrere Ebenen schließt und
 * die Reihenfolge dabei eine Rolle spielt. Screen-eigene Kürzel bleiben in
 * den jeweiligen Aktionen (handleReviewKey in actions/review.js,
 * handleCurationKey in actions/curation.js).
 */

/**
 * Schließt die oberste offene Ebene — Popover, Bearbeitung, Schublade,
 * Panel, Fokus. Die Reihenfolge geht von innen nach außen: wer eine Notiz
 * bearbeitet und Esc drückt, will die Bearbeitung abbrechen, nicht die
 * Schublade schließen.
 */
function handleEscape(app) {
  const state = app.state;

  if (state.mention) return app.closeMention();
  if (state.aiSug) return app.dismissAi();
  if (state.editingId) return app.cancelEdit();
  if (state.drawer) return app.toggleDrawer();
  if (state.origin) return app.closeOrigin();
  if (state.screen === 'D5' && (state.focus || state.edgeFocus)) app.clearGraphFocus();
}

/** @param {object} app App-Instanz */
export function bindKeyboard(app) {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      handleEscape(app);
      return;
    }

    // Die Kurationskürzel dürfen nicht greifen, während irgendwo getippt
    // wird — sonst schließt ein „a" im Verfasser einen Vorschlag ab.
    const target = event.target;
    if (target && (target.isContentEditable || /^(INPUT|TEXTAREA)$/.test(target.tagName))) return;

    if (app.handleReviewKey(event)) return;
    app.handleCurationKey(event);
  });
}
