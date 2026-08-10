/**
 * Entwickler-Leiste — Verdrahtung der drei Umschaltergruppen.
 *
 * Alle drei funktionieren gleich (eine Gruppe, ein aktiver Knopf, ein
 * State-Feld), deshalb datengetrieben statt dreimal derselbe Listener.
 */

/** [CSS-Klasse der Knöpfe, State-Feld, data-Attribut] */
const TOGGLE_GROUPS = [
  ['preset-btn', 'presetId', 'preset'],
  ['mode-btn', 'mode', 'mode'],
  ['role-btn', 'role', 'role']
];

/**
 * Verbindet die Umschalter der Dev-Leiste mit dem App-State.
 * @param {object} app  App-Instanz mit setState()
 */
export function bindDevBar(app) {
  TOGGLE_GROUPS.forEach(([className, stateKey, dataKey]) => {
    const buttons = document.querySelectorAll(`.${className}`);
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        button.classList.add('active');
        app.setState({ [stateKey]: button.dataset[dataKey] });
      });
    });
  });
}
