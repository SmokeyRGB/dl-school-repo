/**
 * Aktionen der Vorschlagsliste (E1, Kuration Phase 1).
 *
 * Die Entscheidungsregeln selbst liegen in utils/stateManager.js
 * (ReviewManager); hier steht nur die Anbindung an State und Tastatur.
 * Tastaturbedienung nach PRD §4.4.2.9 — da es keinen Stapelweg gibt, ist
 * die Tastatur der einzige Hebel auf die Zielmarke von unter 6 Sekunden
 * je Vorschlag.
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

  /** Eine Karte zurück, ohne die Entscheidung zurückzunehmen (←). */
  reviewBack() {
    if (this.state.reviewIdx > 0) this.setState({ reviewIdx: this.state.reviewIdx - 1 });
  },

  /**
   * Tastenkürzel der Phase 1 (PRD §4.4.2.9):
   *
   *   A · Enter  Übernehmen (bzw. Zusammenführen bei Kartenart B)
   *   X          Ablehnen
   *   N          nur bei Art B: „Ist etwas anderes → neu anlegen"
   *   S          Später
   *   1–9        Chip des ersten offenen Pflichtfelds
   *   Z          Letzte Handlung rückgängig
   *   ←          Einen Vorschlag zurück
   *
   * `X` und `N` liegen beide auf der Sekundärhandlung — bei Art B *ist*
   * „neu anlegen" die sekundäre Antwort, bei A und C ist es „ablehnen".
   * Eine Taste, die auf der aktuellen Karte nichts auslöst, steht auch
   * nicht in der Fußleiste.
   *
   * @returns {boolean} true, wenn die Taste verarbeitet wurde
   */
  handleReviewKey(event) {
    const state = this.state;
    if (state.screen !== 'E1' || state.role !== 'lead' || state.mention) return false;

    const card = (this.preset.review || [])[state.reviewIdx];
    if (!card) return false;

    const key = event.key.toLowerCase();

    if (key === 'z' && state.log.length) {
      event.preventDefault();
      this.reviewUndo();
      return true;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.reviewBack();
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

    if (key === 'n' && card.kind !== 'B') return false;

    const decision = { enter: 'primary', a: 'primary', x: 'secondary', n: 'secondary', s: 'later' }[key];
    if (decision) {
      event.preventDefault();
      this.reviewDecide(decision);
      return true;
    }

    return false;
  }
};
