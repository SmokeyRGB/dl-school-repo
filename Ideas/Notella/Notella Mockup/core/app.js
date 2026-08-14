/**
 * NotellaMockupApp — Orchestrierung.
 *
 * Zuständig für genau drei Dinge: State halten, auf State-Änderungen die
 * drei Bereiche (Kopfzeile, Navigation, Screen) neu zeichnen und die
 * Screen-Aktionen zusammenführen. Markup liegt in components/, Regeln in
 * utils/, Daten in data/.
 *
 * Die Aktionen werden am Ende der Datei in den Prototyp gemischt. Grund:
 * die Screens verdrahten ihre Knöpfe über Inline-Handler (`app.zoomGraph(…)`),
 * brauchen also eine flache API auf einem globalen `app` — Delegations-
 * methoden pro Aktion wären reines Rauschen.
 */
import { createInitialState, seedNotes } from './state.js';
import { bindKeyboard } from './keyboard.js';
import { editorActions } from './actions/editor.js';
import { noteActions } from './actions/notes.js';
import { reviewActions } from './actions/review.js';
import { curationActions } from './actions/curation.js';
import { wikiActions } from './actions/wiki.js';
import { graphActions } from './actions/graph.js';

import { PRESETS, getPreset } from '../data/presets/index.js';
import { SCREENS } from '../data/screens.js';
import { ReviewManager, CurationManager, ScreenManager } from '../utils/stateManager.js';
import { renderAppHeader } from '../components/appHeader.js';
import { renderNavSidebar } from '../components/navSidebar.js';
import { bindDevBar } from '../components/devBar.js';
import { mountScreenContainers, renderActiveScreen } from '../components/screenStage.js';

export class NotellaMockupApp {
  constructor() {
    this.state = createInitialState();
    this.reviewMgr = new ReviewManager(PRESETS);
    this.curationMgr = new CurationManager();

    this.el = {
      nav: document.getElementById('nav-sidebar'),
      stage: document.getElementById('content-area')
    };

    mountScreenContainers(this.el.stage);
    bindDevBar(this);
    bindKeyboard(this);
    this.render();
  }

  /** Aktuelles Preset — nie zwischenspeichern, der Umschalter ändert es. */
  get preset() {
    return getPreset(this.state.presetId);
  }

  /** Rahmen-Verhalten des aktiven Screens: 'start' | 'orient' | 'focus'. */
  get chrome() {
    return ScreenManager.getScreen(this.state.screen, SCREENS).chrome || 'start';
  }

  setState(updates) {
    const presetChanged = 'presetId' in updates && updates.presetId !== this.state.presetId;
    this.state = {
      ...this.state,
      ...updates,
      // Beim Presetwechsel gehören die alten Notizen, der Kurationsstand
      // und der gewählte Wiki-Eintrag zu einem anderen Projekt. Der
      // Sichtbarkeits-Umschalter fällt auf den Default des neuen Presets
      // zurück (composerVis: null) — genau das macht E-04 sichtbar.
      ...(presetChanged
        ? {
            ...this.reviewMgr.resetReview(),
            ...this.curationMgr.reset(),
            notes: seedNotes(updates.presetId),
            meeting: null,
            composerVis: null,
            editingId: null,
            entry: null
          }
        : {})
    };
    // Der KI-Schalter darf keinen bereits offenen Vorschlag stehen lassen —
    // das Popover hängt nicht am Screen-Render (siehe actions/editor.js).
    if (!this.state.aiMode && this.state.aiSug) this.dismissAi();
    this.render();
  }

  /** Screen wechseln; offene Overlays des alten Screens schließen. */
  go(screen) {
    // Die beiden Editor-Popover hängen an festen Elementen außerhalb der
    // Screen-Bühne — ein Screen-Render allein räumt sie nicht weg.
    this.closeMention();
    this.dismissAi();
    this.setState({ screen, drawer: false, editingId: null });
  }

  toggleCollapsible(label, event) {
    event.preventDefault();
    this.setState({
      navExp: Object.assign({}, this.state.navExp, { [label]: !this.state.navExp[label] })
    });
  }

  render() {
    const preset = this.preset;
    renderAppHeader(preset, this.state);
    renderNavSidebar(this.el.nav, preset, this.state, this.chrome);
    renderActiveScreen(this.el.stage, this.state.screen, preset, this.state, this);

    // Der Verfasser in C1 ist das einzige nicht persistierte Eingabefeld:
    // was dort halb getippt steht, ist noch keine Notiz und liegt deshalb
    // nicht im State. Ohne diese Zeile würde jeder State-Wechsel ihn leeren
    // (siehe actions/notes.js:restoreComposer).
    if (this.state.screen === 'C1') this.restoreComposer();
  }
}

// Screen-Aktionen als flache API auf der Instanz (siehe Kopfkommentar).
Object.assign(
  NotellaMockupApp.prototype,
  editorActions,
  noteActions,
  reviewActions,
  curationActions,
  wikiActions,
  graphActions
);
