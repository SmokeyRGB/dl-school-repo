/**
 * Aktionen im Meeting-Raum (C1): @-Erwähnung und Notiz-Schublade.
 *
 * WICHTIG: Diese Aktionen laufen absichtlich NICHT über setState()/render().
 * Ein voller Re-Render würde den Editor-Inhalt (im Mockup nicht persistiert)
 * bei jedem Tastendruck zurücksetzen. Stattdessen wird nur das betroffene
 * Element aktualisiert.
 *
 * Wird per Object.assign in NotellaMockupApp.prototype gemischt (core/app.js),
 * damit die Inline-Handler der Screens weiter app.<methode>() aufrufen können.
 */
import { checkMention, insertMention } from '../../utils/editorLogic.js';
import { showMentionPopup, hideMentionPopup } from '../../components/mentionPopup.js';

export const editorActions = {
  // -------- @-Erwähnung --------

  onEditorInput() {
    this.state.mention = checkMention(this.state, this.preset);
    this.state.mentionIdx = 0;
    this.refreshMentionPopup();
  },

  onEditorKeyDown(event) {
    if (!this.state.mention) return;
    const items = this._mentionItems || [];

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.state.mentionIdx = Math.min(items.length - 1, (this.state.mentionIdx || 0) + 1);
        this.refreshMentionPopup();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.state.mentionIdx = Math.max(0, (this.state.mentionIdx || 0) - 1);
        this.refreshMentionPopup();
        break;
      case 'Enter':
        event.preventDefault();
        this.selectMention(this.state.mentionIdx || 0);
        break;
      case 'Escape':
        event.preventDefault();
        this.closeMention();
        break;
    }
  },

  selectMention(index) {
    const type = (this._mentionItems || [])[index];
    if (!type) return;
    insertMention(type.label, type.color, this.state);
    this.closeMention();
  },

  closeMention() {
    this.state.mention = null;
    this.refreshMentionPopup();
  },

  /** Berechnet die Trefferliste neu und aktualisiert nur das Popover. */
  refreshMentionPopup() {
    const el = document.getElementById('mention-popup');
    if (!el) return;

    const { mention, mentionIdx } = this.state;
    if (!mention) {
      this._mentionItems = [];
      hideMentionPopup(el);
      return;
    }

    const query = (mention.q || '').trim().toLowerCase();
    const items = this.preset.types.filter(
      (type) => !query || type.label.toLowerCase().includes(query)
    );
    const idx = Math.min(Math.max(0, mentionIdx || 0), Math.max(0, items.length - 1));

    this._mentionItems = items;
    this.state.mentionIdx = idx;
    showMentionPopup(el, mention, items, idx);
  },

  // -------- Geteilte-Notizen-Schublade --------

  toggleDrawer() {
    this.state.drawer = !this.state.drawer;
    const isOpen = this.state.drawer;

    const drawer = document.getElementById('c1-drawer');
    if (drawer) drawer.style.transform = isOpen ? 'translateX(0)' : 'translateX(100%)';

    const button = document.getElementById('c1-drawer-btn');
    if (button) {
      button.style.borderColor = isOpen ? '#c9c3ec' : '#e4e3de';
      button.style.background = isOpen ? '#faf9fd' : '#fff';
    }
  }
};
