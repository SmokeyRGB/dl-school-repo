/**
 * Aktionen der Durchsicht (E2, Kuration Phase 2).
 *
 * Die Regeln liegen in utils/stateManager.js (CurationManager); hier steht
 * nur die Anbindung an State und Tastatur. Tastaturbedienung nach
 * PRD §4.4.2.9 — Markieren und Typisieren erfolgt bewusst mit der Maus,
 * das ist die Geste, um die es in dieser Phase geht.
 *
 * Wird per Object.assign in NotellaMockupApp.prototype gemischt (core/app.js).
 */

/** Wie lange der Rückgängig-Hinweis stehen bleibt (PRD §4.4.2.8). */
const UNDO_TIMEOUT_MS = 8000;

export const curationActions = {
  /**
   * Schließt die aktuelle Notiz ab — die einzige Stelle, an der eine Notiz
   * „fertig" wird (E-19/E-21). Keine Bestätigung, sondern ein
   * Rückgängig-Hinweis für 8 Sekunden.
   */
  closeNote() {
    const updates = this.curationMgr.closeNote(this.state.notes, this.state);
    if (!updates) return;

    this.setState(updates);
    clearTimeout(this._curationTimer);
    this._curationTimer = setTimeout(() => this.setState({ curationUndo: null }), UNDO_TIMEOUT_MS);
  },

  curationUndo() {
    const updates = this.curationMgr.undoLast(this.state);
    if (!updates) return;
    clearTimeout(this._curationTimer);
    this.setState(updates);
  },

  /** Eine Notiz vor oder zurück, ohne zu entscheiden. */
  stepNote(delta) {
    const updates = this.curationMgr.step(this.state.notes, this.state, delta);
    if (updates) this.setState(updates);
  },

  resetCuration() {
    this.setState(this.curationMgr.reset());
  },

  /**
   * Tastenkürzel der Durchsicht (PRD §4.4.2.9).
   *
   * @returns {boolean} true, wenn die Taste verarbeitet wurde
   */
  handleCurationKey(event) {
    const state = this.state;
    if (state.screen !== 'E2' || state.role !== 'lead') return false;

    const key = event.key.toLowerCase();

    if (key === 'z' && (state.closed || []).length) {
      event.preventDefault();
      this.curationUndo();
      return true;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.closeNote();
      return true;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      this.stepNote(event.key === 'ArrowRight' ? 1 : -1);
      return true;
    }

    return false;
  }
};
