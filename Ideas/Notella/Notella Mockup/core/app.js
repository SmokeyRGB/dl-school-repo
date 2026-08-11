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
import { createInitialState } from './state.js';
import { bindKeyboard } from './keyboard.js';
import { editorActions } from './actions/editor.js';
import { reviewActions } from './actions/review.js';
import { wikiActions } from './actions/wiki.js';
import { graphActions } from './actions/graph.js';

import { PRESETS, getPreset } from '../data/presets/index.js';
import { SCREENS } from '../data/screens.js';
import { ReviewManager, ScreenManager } from '../utils/stateManager.js';
import { renderAppHeader } from '../components/appHeader.js';
import { renderNavSidebar } from '../components/navSidebar.js';
import { bindDevBar } from '../components/devBar.js';
import { mountScreenContainers, renderActiveScreen } from '../components/screenStage.js';

export class NotellaMockupApp {
  constructor() {
    this.state = createInitialState();
    this.reviewMgr = new ReviewManager(PRESETS);

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
      ...(presetChanged ? this.reviewMgr.resetReview() : {})
    };
    this.render();
  }

  /** Screen wechseln; offene Overlays des alten Screens schließen. */
  go(screen) {
    this.setState({ screen, mention: null, drawer: false });
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
  }
}

// Screen-Aktionen als flache API auf der Instanz (siehe Kopfkommentar).
Object.assign(
  NotellaMockupApp.prototype,
  editorActions,
  reviewActions,
  wikiActions,
  graphActions
);
