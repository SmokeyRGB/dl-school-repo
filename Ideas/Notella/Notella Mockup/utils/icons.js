/**
 * Strich-Icons für die Navigation.
 *
 * Bewusst getrennt von renderHelpers.createIcon(): dort geht es um Icons
 * innerhalb der Screens, hier um das feste Set der Sidebar. Die Pfade sind
 * auf ein 20×20-Raster gezeichnet und werden auf 16 px ausgegeben.
 */

/** SVG-Pfade je Icon-Name, gezeichnet im viewBox 0 0 20 20. */
const ICON_PATHS = {
  home: '<path d="M3 9.5L10 3l7 6.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M7 18V12h6v6"/>',
  book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H15v14H5.5A1.5 1.5 0 0 1 4 15.5z"/><path d="M15 10H5.5"/>',
  graph: '<circle cx="5" cy="10" r="2"/><circle cx="15" cy="5" r="2"/><circle cx="15" cy="15" r="2"/><path d="M7 9.2L13 5.8M7 10.8L13 14.2"/>',
  inbox: '<path d="M3 12h4l1 2h4l1-2h4"/><path d="M3 12l2-7h10l2 7v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
  gear: '<circle cx="10" cy="10" r="2.8"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M14.4 5.6l-1.4 1.4M5.6 14.4l-1.4 1.4"/>',
  user: '<circle cx="10" cy="7" r="3.5"/><path d="M3 18.5c.6-3 3.3-5 7-5s6.4 2 7 5"/>',
  chev: '<path d="M8 5l5 5-5 5"/>'
};

/** Umschließt Icon-Pfade mit dem gemeinsamen SVG-Rahmen. */
function strokeSvg(inner, { size = 16, color = 'currentColor', rotate = 0 } = {}) {
  const transform = rotate
    ? `transform:rotate(${rotate}deg);transition:transform 180ms ease;`
    : '';
  return `<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="flex:none;${transform}">${inner}</svg>`;
}

/** Farbiger Statuspunkt (Meeting läuft / geplant / beendet). */
function stateDot(color) {
  return `<span style="width:7px;height:7px;border-radius:50%;background:${color};flex:none;display:inline-block"></span>`;
}

/**
 * Liefert das Icon-Markup für einen Navigationseintrag.
 *
 * @param {string} name  Icon-Name aus ICON_PATHS, 'stateDot' oder unbekannt (Platzhalter)
 * @param {{color?: string, rotate?: number, dotColor?: string}} [opts]
 * @returns {string} SVG- bzw. Span-Markup
 */
export function navIcon(name, opts = {}) {
  const { color = 'currentColor', rotate = 0, dotColor = '#8b8d97' } = opts;

  if (name === 'stateDot') return stateDot(dotColor);
  if (name === 'chev') return strokeSvg(ICON_PATHS.chev, { size: 13, color, rotate });
  if (ICON_PATHS[name]) return strokeSvg(ICON_PATHS[name], { color, rotate });

  return '<span style="width:8px;height:8px;border-radius:50%;background:currentColor;opacity:.35;flex:none;display:inline-block"></span>';
}
