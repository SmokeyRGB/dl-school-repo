/**
 * Aktionen des Wiki-Artikels (D2): Baum-Modus und Herkunfts-Panel.
 * Wird per Object.assign in NotellaMockupApp.prototype gemischt (core/app.js).
 */
export const wikiActions = {
  /**
   * Öffnet einen Eintrag im Wiki — aus dem Baum, aus einem Beziehungs-Chip
   * oder per Doppelklick im Graphen. Der Artikel wird beim Zeichnen aus dem
   * Titel aufgelöst (utils/wikiArticle.js).
   *
   * @param {string} title Titel des Eintrags
   */
  openEntry(title) {
    this.closeMention();
    this.dismissAi();
    this.setState({ screen: 'D2', entry: title, origin: false, drawer: false });
  },

  /** @param {'entry'|'type'} mode Gliederung des Eintragsbaums */
  setTreeMode(mode) {
    this.setState({ treeMode: mode });
  },

  /** @param {'origin'|'history'} [tab] Herkunft oder Änderungsverlauf */
  openOrigin(tab) {
    this.setState({ origin: true, originTab: tab || 'origin' });
  },

  closeOrigin() {
    this.setState({ origin: false });
  },

  setOriginTab(tab) {
    this.setState({ originTab: tab });
  }
};
