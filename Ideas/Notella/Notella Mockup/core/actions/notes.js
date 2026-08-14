/**
 * Notizblock-Aktionen (C1) — abschicken, bearbeiten, Sichtbarkeit, Schublade.
 *
 * Anders als der frühere Dokument-Editor laufen diese Aktionen **über**
 * setState(): eine abgeschickte Notiz gehört in den State, nicht ins DOM.
 * Flüchtig bleibt nur der Verfasser selbst — was dort halb getippt steht,
 * ist noch keine Notiz. Damit ein Re-Render (Sichtbarkeit umstellen,
 * Dev-Leiste, Rollenwechsel) den angefangenen Text nicht wegwirft, wird er
 * bei jedem Tastendruck zwischengespeichert und nach dem Zeichnen
 * zurückgeschrieben — siehe restoreComposer(), aufgerufen aus core/app.js.
 *
 * Wird per Object.assign in NotellaMockupApp.prototype gemischt (core/app.js).
 */
import { composerVis } from '../../utils/noteText.js';

/** Uhrzeit für eine neue Notiz — das Mockup hat keine echte Zeitachse. */
function stamp() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

/**
 * Inhalt eines Eingabefelds in `parts` übersetzen.
 *
 * Erwähnungen stehen als `contenteditable="false"`-Chip im Markup (siehe
 * utils/editorLogic.js:insertMention) und werden zu `{ ref }`; alles andere
 * ist Text. Zeilenumbrüche aus Shift+Enter werden zu Leerzeichen — der
 * Strom setzt Notizen als Fließtext.
 *
 * @param {HTMLElement} el
 * @returns {Array<{t?: string, ref?: string}>}
 */
function parseParts(el) {
  const parts = [];

  const pushText = (text) => {
    if (!text) return;
    const last = parts[parts.length - 1];
    if (last && last.t !== undefined) last.t += text;
    else parts.push({ t: text });
  };

  const walk = (node) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        pushText(child.textContent.replace(/ /g, ' '));
        return;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) return;

      if (child.getAttribute && child.getAttribute('contenteditable') === 'false') {
        parts.push({ ref: child.textContent.trim() });
        return;
      }
      if (child.tagName === 'BR') {
        pushText(' ');
        return;
      }
      // Absätze, die der Browser beim Umbruch erzeugt
      if (parts.length && /^(DIV|P)$/.test(child.tagName)) pushText(' ');
      walk(child);
    });
  };

  walk(el);

  // Randleerraum weg, leere Stücke raus — sonst entsteht aus einem
  // versehentlichen Leerzeichen eine Notiz.
  return parts
    .map((p) => (p.t !== undefined ? { t: p.t.replace(/\s+/g, ' ') } : p))
    .filter((p) => p.ref || p.t.trim() || parts.length > 1);
}

/** Trägt eine Notiz im State fort, ohne die anderen anzufassen. */
function patchNote(notes, id, changes) {
  return notes.map((note) => (note.id === id ? { ...note, ...changes } : note));
}

export const noteActions = {
  // -------- Verfasser --------

  /**
   * Tastatur im Verfasser. Enter schickt ab, Shift+Enter erzeugt eine neue
   * Zeile (PRD §4.4.1) — bewusst herum, damit kurze Notizen mit je einem
   * Gedanken entstehen. Solange eine Auswahl offen ist, gehört Enter ihr.
   */
  onComposerKeyDown(event) {
    if (this.onEditorKeyDown(event)) return;

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submitNote();
    }
  },

  /**
   * Schickt den Inhalt des Verfassers als eigenständige Notiz ab.
   * Der Verfasser leert sich und behält den Fokus.
   */
  submitNote() {
    const el = document.getElementById('c1-composer');
    if (!el) return;

    const parts = parseParts(el);
    if (!parts.length) return;

    const title = this.state.meeting || this.preset.d.meetingTitle;
    const meetingEnded = (this.preset.wgs || [])
      .flatMap((w) => w.meetings || [])
      .some((m) => m[0] === title && m[1] === 'beendet');

    const note = {
      id: 'u' + (this.state.notes.length + 1) + '-' + stamp().replace(':', ''),
      at: stamp(),
      vis: composerVis(this.preset, this.state),
      parts,
      // Nach dem Ende geschriebene Notizen tragen das sichtbar (PRD §4.4.1)
      late: meetingEnded,
      // Im Demo-Modus „Fehler" bleibt die Notiz stehen und ist gekennzeichnet
      unsent: this.state.mode === 'error'
    };

    this._composerHtml = '';
    this.closeMention();
    this.dismissAi();
    this.setState({ notes: this.state.notes.concat([note]) });

    const fresh = document.getElementById('c1-composer');
    if (fresh) {
      fresh.innerHTML = '';
      fresh.focus();
    }
    this.scrollStreamToEnd();
  },

  /**
   * Öffnet ein bestimmtes Treffen im Meeting-Raum. Der Notizstrom des
   * Mockups gehört zum laufenden Treffen; ein anderes Treffen zeigt seinen
   * Zustand, aber keine fremden Notizen — das ist im Mockup Absicht, denn
   * gezeigt werden soll die Zustandsabhängigkeit des Verfassers.
   */
  openMeeting(title) {
    this.closeMention();
    this.dismissAi();
    this.setState({ screen: 'C1', meeting: title, drawer: false, editingId: null });
  },

  /** Sichtbarkeit der entstehenden Notiz (E-04). */
  setComposerVis(key) {
    this.setState({ composerVis: key });
    const el = document.getElementById('c1-composer');
    if (el) el.focus();
  },

  /**
   * Merkt sich den halb getippten Text vor dem nächsten Zeichnen.
   * Wird aus core/actions/editor.js:onEditorInput() mitgerufen.
   */
  cacheComposer() {
    const el = document.getElementById('c1-composer');
    if (el) this._composerHtml = el.innerHTML;
  },

  /**
   * Schreibt den gemerkten Text nach dem Zeichnen zurück und setzt den
   * Cursor ans Ende. Ohne das würde jeder State-Wechsel den Verfasser leeren.
   */
  restoreComposer() {
    const el = document.getElementById('c1-composer');
    if (!el || !this._composerHtml) return;

    el.innerHTML = this._composerHtml;

    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  },

  /** Hält den zuletzt geschriebenen Eintrag im Blick. */
  scrollStreamToEnd() {
    const el = document.getElementById('c1-composer');
    if (!el) return;
    const scroller = el.closest('.app-screen');
    const stream = scroller && scroller.querySelector('div[style*="overflow:auto"]');
    if (stream) stream.scrollTop = stream.scrollHeight;
  },

  // -------- Bearbeiten (E-15) --------

  /**
   * Macht eine Notiz an Ort und Stelle bearbeitbar. Für Nutzende fühlt sich
   * das wie normales Bearbeiten an; intern entsteht eine neue Version, und
   * sichtbar bleibt davon nur die Markierung „bearbeitet".
   */
  startEdit(id) {
    if (this.state.editingId === id) return;
    this.setState({ editingId: id });

    const el = document.getElementById('c1-edit');
    if (el) {
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const selection = document.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  },

  onNoteEditKeyDown(event, id) {
    if (this.onEditorKeyDown(event)) return;

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.saveEdit(id);
    }
  },

  saveEdit(id) {
    const el = document.getElementById('c1-edit');
    if (!el) return;

    const parts = parseParts(el);
    this.closeMention();
    this.dismissAi();

    // Leer gelöscht heißt „doch nicht" — eine leere Notiz wäre keine.
    if (!parts.length) return this.cancelEdit();

    this.setState({
      notes: patchNote(this.state.notes, id, { parts, edited: true }),
      editingId: null
    });
  },

  cancelEdit() {
    this.closeMention();
    this.dismissAi();
    this.setState({ editingId: null });
  },

  /** Sichtbarkeit einer bereits abgeschickten Notiz umstellen (PRD §4.4.1). */
  cycleNoteVis(id) {
    const note = (this.state.notes || []).find((n) => n.id === id);
    if (!note || this.state.editingId) return;

    this.setState({
      notes: patchNote(this.state.notes, id, { vis: note.vis === 'mine' ? 'team' : 'mine' })
    });
  },

  // -------- Hinweis und Schublade --------

  closeHint() {
    this.setState({ hintOpen: false });
  },

  /**
   * Team-Notizen (C4). Läuft über setState, weil die Schublade Teil des
   * Screens ist — der Verfasser überlebt das dank restoreComposer().
   */
  toggleDrawer() {
    this.setState({ drawer: !this.state.drawer });
  },

  /**
   * Der Feed wird abgerufen, nicht gepusht (E-27). Im Mockup hat das keinen
   * Effekt auf die Daten — es zeigt nur, dass der Abruf eine ausdrückliche
   * Handlung ist und nichts im Hintergrund nachlädt.
   */
  refreshFeed() {
    this.setState({ drawer: true });
  }
};
