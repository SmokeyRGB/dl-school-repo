/**
 * Entwickler-Leiste — Verdrahtung der drei Umschaltergruppen.
 *
 * Alle drei funktionieren gleich (eine Gruppe, ein aktiver Knopf, ein
 * State-Feld), deshalb datengetrieben statt dreimal derselbe Listener.
 */

/**
 * Eine Zeile je Umschaltergruppe. `parse` übersetzt den data-Wert in das
 * State-Feld — nötig, weil data-Attribute immer Text sind, aiMode aber ein
 * Schalter ist.
 */
const TOGGLE_GROUPS = [
  { className: 'preset-btn', stateKey: 'presetId', dataKey: 'preset' },
  { className: 'mode-btn', stateKey: 'mode', dataKey: 'mode' },
  { className: 'role-btn', stateKey: 'role', dataKey: 'role' },
  { className: 'ai-btn', stateKey: 'aiMode', dataKey: 'ai', parse: (value) => value === 'on' }
];

/**
 * Verbindet die Umschalter der Dev-Leiste mit dem App-State.
 * @param {object} app  App-Instanz mit setState()
 */
export function bindDevBar(app) {
  TOGGLE_GROUPS.forEach(({ className, stateKey, dataKey, parse }) => {
    const buttons = document.querySelectorAll(`.${className}`);
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        button.classList.add('active');
        const raw = button.dataset[dataKey];
        app.setState({ [stateKey]: parse ? parse(raw) : raw });
      });
    });
  });
}
