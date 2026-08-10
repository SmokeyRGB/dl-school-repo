/**
 * Aktionen des Wiki-Artikels (D2): Baum-Modus und Herkunfts-Panel.
 * Wird per Object.assign in NotellaMockupApp.prototype gemischt (core/app.js).
 */
export const wikiActions = {
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
