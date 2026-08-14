/**
 * Ablauf- und Strukturlogik: Kuration (beide Phasen), Navigation, Screens.
 * Ohne DOM prüfbar — die Bildschirme bekommen fertige Werte.
 */

/**
 * Kuration Phase 1 (E1) — Vorschläge entscheiden.
 * Übernehmen, ablehnen oder zurückstellen; PRD §4.4.2.3 f.
 */
export class ReviewManager {
  constructor(presets) {
    this.presets = presets;
  }

  /**
   * Make a decision on a review card
   * @param {number} reviewIdx - Current review index
   * @param {Array} cards - Review cards
   * @param {Object} state - Current state
   * @param {string} which - Decision type: 'primary', 'secondary', 'later'
   * @returns {Object} Updated state
   */
  decide(reviewIdx, cards, state, which) {
    if (reviewIdx >= cards.length) return state;

    const c = cards[reviewIdx];
    if (which === 'primary' && !this.ready(c, state)) return state;

    const txt =
      which === 'later'
        ? 'Später vorgemerkt'
        : which === 'primary'
          ? c.kind === 'B'
            ? 'Zusammengeführt mit ' + c.target
            : 'Übernommen: ' + c.title
          : 'Abgelehnt: ' + c.title;

    return {
      reviewIdx: reviewIdx + 1,
      undo: txt,
      log: state.log.concat([{ which: which, kind: c.kind }]),
    };
  }

  /**
   * Undo the last decision
   * @param {number} reviewIdx - Current review index
   * @param {Array} log - Decision log
   * @returns {Object} Updated state
   */
  undoLast(reviewIdx, log) {
    const newLog = log.slice(0, -1);
    return {
      reviewIdx: Math.max(0, reviewIdx - 1),
      log: newLog,
      undo: null,
    };
  }

  /**
   * Check if a review card is ready for decision
   * @param {Object} card - Review card
   * @param {Object} state - Current state
   * @returns {boolean} Whether all required fields are filled
   */
  ready(card, state) {
    if (!card.fields || !card.fields.length) return true;
    return card.fields.every(
      (f) => state.rf[card.title + '|' + f.label]
    );
  }

  /**
   * Reset review workflow
   * @returns {Object} Reset state
   */
  resetReview() {
    return {
      reviewIdx: 0,
      log: [],
      undo: null,
      rf: {},
    };
  }
}

/**
 * Kuration Phase 2 (E2) — Notizen durchsehen und abschließen.
 *
 * Der Abschluss ist die einzige Stelle, an der eine Notiz „fertig" wird
 * (E-19/E-21): auch wenn alle ihre Vorschläge in Phase 1 entschieden wurden,
 * bleibt sie offen, bis der Lead sie gesehen hat. Phase 1 kann per
 * Definition nichts darüber aussagen, was **nicht** getaggt wurde.
 *
 * Der Zustand hängt deshalb an der Notiz-ID, nicht an einem Zähler und
 * nicht am Treffen — nachgereichte Notizen sind schlicht weitere offene
 * Notizen, ohne dass ein Zustand „Treffen durchkuriert" ungültig würde.
 */
export class CurationManager {
  /** Offene Notizen in der Reihenfolge des Treffens. */
  open(notes, closed) {
    const done = closed || [];
    return (notes || []).filter((note) => done.indexOf(note.id) < 0);
  }

  /**
   * Schließt die Notiz an Position `idx` ab und rückt weiter.
   *
   * @param {Array}  notes   Alle Notizen des Treffens
   * @param {Object} state   App-State (noteIdx, closed)
   * @returns {Object|null}  State-Änderungen, oder null wenn nichts offen ist
   */
  closeNote(notes, state) {
    const open = this.open(notes, state.closed);
    const note = open[state.noteIdx];
    if (!note) return null;

    return {
      closed: (state.closed || []).concat([note.id]),
      // Nicht hochzählen: durch das Schließen rückt die nächste Notiz
      // automatisch an dieselbe Position nach. Nur am Ende der Liste muss
      // der Zeiger zurück, sonst zeigt er ins Leere.
      noteIdx: Math.min(state.noteIdx, Math.max(0, open.length - 2)),
      curationUndo: 'Notiz abgeschlossen',
    };
  }

  /** Macht den letzten Abschluss rückgängig (Z). */
  undoLast(state) {
    const closed = state.closed || [];
    if (!closed.length) return null;
    return { closed: closed.slice(0, -1), curationUndo: null };
  }

  /** Bewegt den Zeiger, ohne etwas zu entscheiden (← / →). */
  step(notes, state, delta) {
    const open = this.open(notes, state.closed);
    if (!open.length) return null;
    return { noteIdx: Math.min(open.length - 1, Math.max(0, state.noteIdx + delta)) };
  }

  /**
   * Bilanz der Sitzung (PRD §4.4.2.8, E-22/E-23).
   *
   * `preTagged` ist die Zahl, die den Kreis zu C1 schließt: sie erkennt an,
   * wie viel schon im Treffen markiert war — und macht Live-Taggen damit zu
   * einer sichtbar lohnenden Gewohnheit.
   */
  stats(notes, state, reviewLog) {
    const list = notes || [];
    const log = reviewLog || [];
    const closed = (state.closed || []).length;

    return {
      reviewed: closed,
      total: list.length,
      created: log.filter((l) => l.which === 'primary' && l.kind !== 'B').length,
      merged: log.filter((l) => l.which === 'primary' && l.kind === 'B').length,
      dismissed: log.filter((l) => l.which === 'secondary' || l.which === 'later').length,
      preTagged: list
        .filter((n) => (state.closed || []).indexOf(n.id) >= 0)
        .filter((n) => (n.parts || []).some((p) => p.ref)).length,
    };
  }

  reset() {
    return { noteIdx: 0, closed: [], curationUndo: null };
  }
}

/**
 * Navigation builder
 * Creates navigation structure from preset data
 */
export class NavBuilder {
  /**
   * Build navigation groups from preset
   * @param {Object} preset - Current preset data
   * @param {Object} state - Current state
   * @param {boolean} isLead - Is user a lead?
   * @returns {Array} Navigation groups
   */
  static buildNavGroups(preset, state, isLead) {
    const t = preset.t;
    const d = preset.d;

    const wgRows = [];
    preset.wgs.forEach((w) => {
      const open =
        state.navExp[w.name] !== undefined
          ? state.navExp[w.name]
          : w.name === d.wgName;

      wgRows.push({
        label: w.name,
        screen: 'B3',
        depth: 0,
        small: true,
        badge: w.live ? 'läuft' : '',
        open: open,
        isCollapsible: true,
      });

      if (open) {
        w.meetings.forEach((m) => {
          wgRows.push({
            label: m[0],
            screen: 'C1',
            depth: 1,
            small: true,
            muted: m[1] === 'beendet',
            state: m[1],
            on: state.screen === 'C1' && m[0] === (state.meeting || d.meetingTitle),
          });
        });
      }
    });

    const groups = [
      {
        label: t.projects,
        items: [
          {
            label: d.projectName,
            screen: 'B3',
            iconName: 'home',
            on: state.screen === 'B3',
          },
        ],
      },
      {
        label: t.wgs + ' & ' + t.meetings,
        items: wgRows,
      },
      {
        label: t.canonNoun,
        items: [
          {
            label: 'Einträge',
            screen: 'D2',
            iconName: 'book',
            badge: String(
              preset.types.reduce((a, x) => a + x.count, 0)
            ),
            on: state.screen === 'D2',
          },
          {
            label: 'Beziehungs-Netz',
            screen: 'D5',
            iconName: 'graph',
            on: state.screen === 'D5',
          },
        ],
      },
    ];

    if (isLead) {
      // Zwei Phasen, ein Fluss (E-18). Die Zähler stehen bewusst in der
      // normalen Nebenfarbe: offene Arbeit ist keine Mahnung, und ein
      // Alarmzeichen erzeugt Vermeidungsverhalten (E-22).
      const openNotes = (state.notes || []).filter(
        (n) => (state.closed || []).indexOf(n.id) < 0
      ).length;

      groups.push({
        label: 'Kuration',
        items: [
          {
            label: 'Vorschläge',
            screen: 'E1',
            iconName: 'inbox',
            badge: String(
              Math.max(0, d.open - state.log.length)
            ),
            on: state.screen === 'E1',
          },
          {
            label: 'Notizen durchsehen',
            screen: 'E2',
            iconName: 'book',
            badge: String(openNotes),
            on: state.screen === 'E2',
          },
        ],
      });
      groups.push({
        label: 'Verwaltung',
        items: [
          {
            label: 'Preset & Einstellungen',
            screen: 'F3',
            iconName: 'gear',
            on: state.screen === 'F3',
          },
        ],
      });
    } else {
      groups.push({
        label: 'Deine Teilnahme',
        items: [
          {
            label: t.part + ': ' + d.me.split(' ')[0],
            screen: 'B3',
            iconName: 'user',
            small: true,
          },
        ],
      });
    }

    return groups;
  }
}

/**
 * Screen configuration manager
 */
export class ScreenManager {
  /**
   * Get screen metadata
   * @param {string} screenId - Screen ID (B1, B2, C1, etc.)
   * @param {Object} screensConfig - Screens configuration
   * @returns {Object} Screen metadata
   */
  static getScreen(screenId, screensConfig) {
    return screensConfig[screenId] || {};
  }

  /**
   * Check if a screen should be visible based on state
   * @param {string} screenId - Screen ID
   * @param {Object} state - Current state
   * @param {boolean} blocked - Whether content is blocked
   * @returns {boolean} Whether to show this screen
   */
  static shouldShow(screenId, state, blocked) {
    if (state.screen !== screenId) return false;
    if (blocked) return false;
    return true;
  }
}
