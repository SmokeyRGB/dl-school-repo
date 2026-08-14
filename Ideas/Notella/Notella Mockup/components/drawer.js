/**
 * Schublade — ein Muster, zwei Anwendungen.
 *
 * PRD §4.4.1 und Screen-Inventar C4 verlangen ausdrücklich, dass die
 * Team-Notizen in C1 und die Herkunftsansicht im Wiki (D1/D2) *dieselbe*
 * Komponente sind: gleiche Öffnungsrichtung, gleiche Geste, gleiches Esc.
 * Vorher waren es zwei Implementierungen, die nur ähnlich aussahen.
 *
 * Die Hülle liegt `inset:0` im Screen-Container und braucht deshalb kein
 * Wissen über die App-Shell — ein `position:fixed` würde unter der
 * Dev-Leiste landen, ein `position:absolute` im .app-content würde die
 * Komponente an einen festen Elternknoten binden. Voraussetzung ist
 * lediglich, dass der aufrufende Screen `position:relative` setzt.
 */

/**
 * @param {object}   drawer
 * @param {string}   drawer.title           Kopfzeile
 * @param {boolean}  drawer.open            Offen oder eingefahren
 * @param {string}   drawer.onClose         Inline-Handler zum Schließen
 * @param {string}   drawer.body            Markup des Inhalts (scrollt)
 * @param {Array<{key: string, label: string}>} [drawer.tabs]  Reiterzeile
 * @param {string}   [drawer.activeTab]     Schlüssel des aktiven Reiters
 * @param {string}   [drawer.onTab]         Handler-Vorlage, `{key}` wird ersetzt
 * @param {string}   [drawer.action]        Markup rechts im Kopf (z. B. Aktualisieren)
 * @param {string}   [drawer.footer]        Markup am unteren Rand
 * @param {number}   [drawer.width=430]     Breite in px
 */
export function renderDrawer({
  title,
  open,
  onClose,
  body,
  tabs,
  activeTab,
  onTab,
  action = '',
  footer = '',
  width = 430
}) {
  const tabsHtml = (tabs || []).map((tab) => {
    const on = tab.key === activeTab;
    return `
      <button onclick="${(onTab || '').replace('{key}', tab.key)}"
        style="font-size:12.5px;border:none;background:transparent;cursor:pointer;padding:0 0 8px;
               border-bottom:2px solid ${on ? '#5340c4' : 'transparent'};
               color:${on ? '#16161a' : '#8b8d97'};font-weight:${on ? '600' : '400'}">${tab.label}</button>
    `;
  }).join('');

  return `
    <div style="position:absolute;inset:0;z-index:70;display:flex;justify-content:flex-end;${open ? '' : 'pointer-events:none'}">
      <div onclick="${onClose}" style="position:absolute;inset:0;background:rgba(22,22,26,.14);opacity:${open ? '1' : '0'};transition:opacity 240ms ease"></div>
      <div style="position:relative;width:${width}px;max-width:92%;height:100%;background:#fff;border-left:1px solid #e2e1dc;
                  box-shadow:-18px 0 44px -30px rgba(22,22,26,.4);
                  transform:translateX(${open ? '0' : '100%'});transition:transform 260ms cubic-bezier(.22,.7,.25,1);
                  display:flex;flex-direction:column">
        <div style="flex:none;padding:15px 18px ${tabsHtml ? '0' : '15px'}">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:14px;font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${title}</span>
            <span style="flex:1"></span>
            ${action}
            <button onclick="${onClose}" style="font-size:12px;color:#8b8d97;border:none;background:transparent;cursor:pointer">Esc</button>
          </div>
          ${tabsHtml ? `<div style="display:flex;gap:16px;margin-top:14px">${tabsHtml}</div>` : ''}
        </div>
        <div style="flex:1;overflow:auto;padding:18px;display:grid;gap:14px;align-content:start">${body}</div>
        ${footer}
      </div>
    </div>
  `;
}
