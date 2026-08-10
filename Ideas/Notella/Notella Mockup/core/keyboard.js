/**
 * Globale Tastaturbedienung.
 *
 * Escape ist bewusst hier gebündelt, weil es mehrere Ebenen schließt und
 * die Reihenfolge dabei eine Rolle spielt. Screen-eigene Kürzel bleiben in
 * den jeweiligen Aktionen (z. B. handleReviewKey in actions/review.js).
 */

/** Schließt die oberste offene Ebene — Popover, Schublade, Panel, Fokus. */
function handleEscape(app) {
  const state = app.state;

  if (state.mention) app.closeMention();
  if (state.drawer) app.toggleDrawer();
  if (state.origin) app.closeOrigin();
  if (state.screen === 'D5' && (state.focus || state.edgeFocus)) app.clearGraphFocus();
}

/** @param {object} app App-Instanz */
export function bindKeyboard(app) {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      handleEscape(app);
      return;
    }
    app.handleReviewKey(event);
  });
}
