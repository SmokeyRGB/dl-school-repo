/**
 * Aktionen der Review-Inbox (E1).
 *
 * Die Entscheidungsregeln selbst liegen in utils/stateManager.js
 * (ReviewManager); hier steht nur die Anbindung an State und Tastatur.
 * Tastaturbedienung nach PRD §4.4.2.
 *
 * Wird per Object.assign in NotellaMockupApp.prototype gemischt (core/app.js).
 */

/** Wie lange der Undo-Hinweis nach einer Entscheidung stehen bleibt. */
const UNDO_TIMEOUT_MS = 8000;

/** Schlüssel eines ausgefüllten Pflichtfelds im State (state.rf). */
function fieldKey(card, field) {
  return card.title + '|' + field.label;
}

export const reviewActions = {
  /** Setzt ein Pflichtfeld über die Chip-Knöpfe der Karte. */
  pickReviewField(button) {
    const card = this.preset.review[+button.dataset.card];
    const field = card.fields[+button.dataset.field];
    const option = field.options[+button.dataset.opt];
    this.setReviewField(card, field, option);
  },

  setReviewField(card, field, option) {
    this.setState({
      rf: Object.assign({}, this.state.rf, { [fieldKey(card, field)]: option })
    });
  },

  /** @param {'primary'|'secondary'|'later'} which */
  reviewDecide(which) {
    const cards = this.preset.review || [];
    const updates = this.reviewMgr.decide(this.state.reviewIdx, cards, this.state, which);
    this.setState(updates);

    if (updates.undo) {
      clearTimeout(this._undoTimer);
      this._undoTimer = setTimeout(() => this.setState({ undo: null }), UNDO_TIMEOUT_MS);
    }
  },

  reviewUndo() {
    clearTimeout(this._undoTimer);
    this.setState(this.reviewMgr.undoLast(this.state.reviewIdx, this.state.log));
  },

  resetReview() {
    this.setState(this.reviewMgr.resetReview());
  },

  /**
   * Tastenkürzel der Inbox: Ziffern wählen Pflichtfeld-Optionen,
   * Enter/A/S entscheiden, U macht die letzte Entscheidung rückgängig.
   *
   * @returns {boolean} true, wenn die Taste verarbeitet wurde
   */
  handleReviewKey(event) {
    const state = this.state;
    if (state.screen !== 'E1' || state.role !== 'lead' || state.mention) return false;

    const card = (this.preset.review || [])[state.reviewIdx];
    if (!card) return false;

    const key = event.key.toLowerCase();

    if (key === 'u' && state.log.length) {
      event.preventDefault();
      this.reviewUndo();
      return true;
    }

    if (/^[1-9]$/.test(event.key)) {
      const fields = card.fields || [];
      // Zuerst das nächste noch leere Feld, sonst das erste.
      const field = fields.find((f) => !state.rf[fieldKey(card, f)]) || fields[0];
      const option = field && field.options[+event.key - 1];
      if (option) {
        event.preventDefault();
        this.setReviewField(card, field, option);
      }
      return true;
    }

    const decision = { enter: 'primary', a: 'secondary', s: 'later' }[key];
    if (decision) {
      event.preventDefault();
      this.reviewDecide(decision);
      return true;
    }

    return false;
  }
};
