/**
 * State management and navigation logic
 */

/**
 * Review/curation decision logic
 * Handles accepting, rejecting, or deferring review items
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
            on: state.screen === 'C1' && m[0] === d.meetingTitle,
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
      groups.push({
        label: 'Kuration',
        items: [
          {
            label: 'Review-Inbox',
            screen: 'E1',
            iconName: 'inbox',
            badge: String(
              Math.max(0, d.open - state.log.length)
            ),
            on: state.screen === 'E1',
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
