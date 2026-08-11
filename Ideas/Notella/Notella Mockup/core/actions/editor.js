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
import { checkMention, insertMention, analyzeAi, acceptAi, typeOf } from '../../utils/editorLogic.js';
import { showMentionPopup, hideMentionPopup } from '../../components/mentionPopup.js';
import { showAiPopup, hideAiPopup } from '../../components/aiPopup.js';

/** Screen-Inventar C2: höchstens 8 Treffer, sonst wird die Liste zur Wand. */
const MAX_ENTITY_HITS = 8;

/**
 * Trefferliste der @-Erwähnung — Reihenfolge nach Screen-Inventar C2:
 * vorhandene Einträge zuerst, darunter abgetrennt „Neu anlegen als …".
 *
 * Die Anlage-Optionen bleiben bewusst ungefiltert: wer „@Auth-Gateway"
 * tippt, meint den Namen des Eintrags, nicht den Namen eines Typs — die
 * Liste darf deshalb nie leer sein (keine Sackgasse).
 *
 * @param {object} preset  Aktuelles Preset
 * @param {string} query   Text hinter dem @
 * @returns {Array<{kind: 'entity'|'type', label: string, color: string, meta: string}>}
 */
function buildMentionItems(preset, query) {
  const q = (query || '').trim().toLowerCase();

  const hits = (preset.entities || [])
    .filter((entity) => !q || entity.label.toLowerCase().includes(q))
    .slice(0, MAX_ENTITY_HITS)
    .map((entity) => {
      const type = typeOf(entity.key, preset);
      return {
        kind: 'entity',
        label: entity.label,
        color: type.color,
        meta: entity.tag ? `${type.label} · ${entity.tag}` : type.label
      };
    });

  const creates = preset.types.map((type) => ({
    kind: 'type',
    label: type.label,
    color: type.color,
    meta: ''
  }));

  return hits.concat(creates);
}

export const editorActions = {
  // -------- @-Erwähnung --------

  onEditorInput() {
    this.state.mention = checkMention(this.state, this.preset);
    this.state.mentionIdx = 0;
    this.refreshMentionPopup();

    // Erst danach: analyzeAi() hält sich zurück, solange eine Erwähnung offen ist.
    this.state.aiSug = analyzeAi(this.state, this.preset);
    this.refreshAiPopup();
  },

  onEditorKeyDown(event) {
    // Tab gehört dem KI-Vorschlag und muss vor der Erwähnung geprüft werden —
    // sonst käme man bei geschlossenem Popover nie hierher.
    if (event.key === 'Tab' && this.state.aiSug) {
      event.preventDefault();
      this.acceptAiSuggestion();
      return;
    }

    if (!this.state.mention) {
      if (event.key === 'Escape' && this.state.aiSug) {
        event.preventDefault();
        this.dismissAi();
      }
      return;
    }
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

  /**
   * Übernimmt einen Treffer. Bei einem vorhandenen Eintrag wird dessen Titel
   * eingesetzt, bei „Neu anlegen als …" der getippte Text — sonst stünde im
   * Editor der Typname statt des gemeinten Eintrags.
   */
  selectMention(index) {
    const item = (this._mentionItems || [])[index];
    if (!item) return;

    const typed = ((this.state.mention || {}).q || '').trim();
    const label = item.kind === 'entity' ? item.label : typed || item.label;

    insertMention(label, item.color, this.state);
    this.closeMention();
  },

  closeMention() {
    this.state.mention = null;
    this.refreshMentionPopup();
  },

  // -------- KI-Vorschlag --------

  /** Übernimmt den offenen Vorschlag als Auszeichnung im Text. */
  acceptAiSuggestion() {
    acceptAi(this.state.aiSug);
    this.dismissAi();
  },

  dismissAi() {
    this.state.aiSug = null;
    this.refreshAiPopup();
  },

  /** Zeichnet nur das Vorschlags-Popover neu (kein Screen-Render). */
  refreshAiPopup() {
    const el = document.getElementById('ai-popup');
    if (!el) return;

    if (!this.state.aiSug) {
      hideAiPopup(el);
      return;
    }
    showAiPopup(el, this.state.aiSug);
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

    const items = buildMentionItems(this.preset, mention.q);
    const idx = Math.min(Math.max(0, mentionIdx || 0), Math.max(0, items.length - 1));

    this._mentionItems = items;
    this.state.mentionIdx = idx;
    showMentionPopup(el, mention, items, idx);
  },

  // -------- @-Hinweis --------

  closeHint() {
    this.state.hintOpen = false;
    const hint = document.getElementById('c1-hint');
    if (hint) hint.remove();
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
