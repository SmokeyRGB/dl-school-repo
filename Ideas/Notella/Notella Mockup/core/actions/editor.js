/**
 * Erwähnungs-Auswahl und KI-Vorschlag (C1, C2).
 *
 * Zuständig nur noch für die beiden Popover; Notizen selbst liegen in
 * ./notes.js. Diese Trennung folgt der Sache: eine Auswahl an der
 * Cursorposition ist etwas anderes als eine abgeschickte Notiz.
 *
 * WICHTIG: Diese Aktionen laufen absichtlich NICHT über setState()/render().
 * Die Popover hängen an festen Elementen außerhalb der Screen-Bühne, und ein
 * Re-Render pro Tastendruck würde die Cursorposition zerstören. Stattdessen
 * wird nur das betroffene Element aktualisiert.
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
    // Halb getippten Text sichern, bevor irgendetwas neu zeichnet.
    this.cacheComposer();

    this.state.mention = checkMention(this.state, this.preset);
    this.state.mentionIdx = 0;
    this.refreshMentionPopup();

    // Erst danach: analyzeAi() hält sich zurück, solange eine Erwähnung offen ist.
    this.state.aiSug = analyzeAi(this.state, this.preset);
    this.refreshAiPopup();
  },

  /**
   * Tastatur der beiden Popover.
   *
   * @returns {boolean} true, wenn die Taste verbraucht wurde. Verfasser und
   *   Notiz-Bearbeitung fragen das ab, bevor sie Enter als „abschicken"
   *   deuten — solange eine Auswahl offen steht, gehört Enter ihr.
   */
  onEditorKeyDown(event) {
    // Tab gehört dem KI-Vorschlag und muss vor der Erwähnung geprüft werden —
    // sonst käme man bei geschlossenem Popover nie hierher.
    if (event.key === 'Tab' && this.state.aiSug) {
      event.preventDefault();
      this.acceptAiSuggestion();
      return true;
    }

    if (!this.state.mention) {
      if (event.key === 'Escape' && this.state.aiSug) {
        event.preventDefault();
        this.dismissAi();
        return true;
      }
      return false;
    }
    const items = this._mentionItems || [];

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.state.mentionIdx = Math.min(items.length - 1, (this.state.mentionIdx || 0) + 1);
        this.refreshMentionPopup();
        return true;
      case 'ArrowUp':
        event.preventDefault();
        this.state.mentionIdx = Math.max(0, (this.state.mentionIdx || 0) - 1);
        this.refreshMentionPopup();
        return true;
      case 'Enter':
        event.preventDefault();
        this.selectMention(this.state.mentionIdx || 0);
        return true;
      case 'Escape':
        event.preventDefault();
        this.closeMention();
        return true;
      default:
        return false;
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
    this.cacheComposer();
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
    this.cacheComposer();
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
  }
};
