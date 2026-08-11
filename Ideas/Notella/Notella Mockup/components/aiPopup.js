/**
 * Popover des KI-Vorschlags im Meeting-Raum (nur Darstellung).
 *
 * Gleicher Weg wie das Erwähnungs-Popover: direkt in das feste #ai-popup,
 * nicht über den Screen-Render (siehe core/actions/editor.js).
 *
 * Der Vorschlag ist ein Angebot, keine Unterbrechung — er schlägt nichts
 * selbst zu, sondern wartet auf Tab. Weiterschreiben blendet ihn aus.
 */

const KIND_LABEL = {
  known: 'Vorhandener Eintrag',
  relation: 'Beziehung erkannt',
  new: 'Neuer Eintrag'
};

/**
 * Zeigt den Vorschlag an der Cursor-Position.
 *
 * @param {HTMLElement} el   #ai-popup
 * @param {object} sug       Ergebnis von analyzeAi()
 */
export function showAiPopup(el, sug) {
  el.style.left = sug.x + 'px';
  el.style.top = sug.y + 'px';
  el.style.width = '340px';
  el.style.padding = '11px 13px';

  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px">
      <span style="width:8px;height:8px;border-radius:2px;background:${sug.color};flex:none"></span>
      <span style="font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:#a3a3ab">${KIND_LABEL[sug.kind] || 'Vorschlag'}</span>
      <span style="flex:1"></span>
      <button onmousedown="event.preventDefault();app.dismissAi()" style="font-size:11.5px;color:#8b8d97;border:none;background:transparent;cursor:pointer;padding:0">Esc</button>
    </div>
    <div style="margin-top:7px;font-size:13px;color:#16161a;line-height:1.5">${sug.text}</div>
    <div style="margin-top:3px;font-size:12px;color:#8b8d97;line-height:1.5">${sug.sub}</div>
    <button onmousedown="event.preventDefault();app.acceptAiSuggestion()" style="margin-top:10px;display:flex;align-items:center;gap:8px;width:100%;padding:7px 9px;border:1px solid #dcdbd5;border-radius:8px;background:#fff;cursor:pointer;font-size:12.5px;color:#16161a;text-align:left">
      <span style="padding:2px 6px;border:1px solid #e2e1dc;border-radius:5px;background:#faf9f7;font-family:ui-monospace,Menlo,monospace;font-size:10.5px">Tab</span>
      Übernehmen
    </button>
  `;
  el.classList.add('active');
}

/** Blendet den Vorschlag aus und leert ihn. */
export function hideAiPopup(el) {
  el.classList.remove('active');
  el.innerHTML = '';
}
