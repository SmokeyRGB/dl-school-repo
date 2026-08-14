/**
 * Screen-Bühne — Registry und Umschaltung der Screens.
 *
 * Ersetzt die frühere switch-Anweisung: ein neuer Screen wird angemeldet,
 * indem er in SCREENS (data/screens.js) und in SCREEN_RENDERERS eingetragen
 * wird. Die Container-<div>s entstehen daraus automatisch.
 */
import { SCREENS } from '../data/screens.js';
import { renderScreenB1 } from './screenB1.js';
import { renderScreenB3 } from './screenB3.js';
import { renderScreenC1 } from './screenC1.js';
import { renderScreenD2 } from './screenD2.js';
import { renderScreenD5 } from './screenD5.js';
import { renderScreenE1 } from './screenE1.js';
import { renderScreenE2 } from './screenE2.js';

/**
 * Render-Funktion je Screen-ID. Einheitliche Signatur (preset, state, app),
 * damit die Bühne nichts über den einzelnen Screen wissen muss.
 */
const SCREEN_RENDERERS = {
  B1: (preset, state) => renderScreenB1(preset, state),
  B3: (preset, state) => renderScreenB3(preset, state),
  C1: (preset, state) => renderScreenC1(preset, state),
  D2: (preset, state) => renderScreenD2(preset, state),
  D5: (preset, state) => renderScreenD5(preset, state),
  E1: (preset, state, app) => renderScreenE1(preset, state, app.reviewMgr),
  E2: (preset, state, app) => renderScreenE2(preset, state, app.curationMgr)
};

/** Platzhalter für Screens, die im Inventar stehen, aber noch fehlen. */
function renderPlaceholder(screenId) {
  const name = SCREENS[screenId] ? SCREENS[screenId].name : screenId;
  return `
    <div style="padding:40px;text-align:center;color:#8b8d97">
      <p>${screenId} — ${name}: noch nicht umgesetzt</p>
    </div>
  `;
}

/** Legt für jeden Screen aus dem Register einen leeren Container an. */
export function mountScreenContainers(stageEl) {
  stageEl.innerHTML = Object.keys(SCREENS)
    .map((id) => `<div id="screen-${id}" class="app-screen"></div>`)
    .join('');
}

/**
 * Zeigt genau einen Screen und rendert dessen Inhalt neu.
 *
 * @param {HTMLElement} stageEl  Container (#content-area)
 * @param {string} screenId      Aktive Screen-ID
 * @param {object} preset        Aktuelles Preset
 * @param {object} state         App-State
 * @param {object} app           App-Instanz (für Screens mit eigenen Managern)
 */
export function renderActiveScreen(stageEl, screenId, preset, state, app) {
  stageEl.querySelectorAll('.app-screen').forEach((el) => el.classList.remove('active'));

  const screenEl = stageEl.querySelector(`#screen-${screenId}`);
  if (!screenEl) return;

  screenEl.classList.add('active');
  const render = SCREEN_RENDERERS[screenId];
  screenEl.innerHTML = render ? render(preset, state, app) : renderPlaceholder(screenId);
}
