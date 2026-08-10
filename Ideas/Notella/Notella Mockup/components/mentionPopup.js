/**
 * Popover der @-Erwähnung im Meeting-Raum (nur Darstellung).
 *
 * Wird direkt in das feste #mention-popup geschrieben, nicht über den
 * Screen-Render — siehe core/actions/editor.js für den Grund.
 */

function renderOption(type, isSelected, index) {
  const background = isSelected ? '#f2f0fc' : 'transparent';
  return `
    <button onmousedown="event.preventDefault();app.selectMention(${index})" style="display:flex;align-items:center;gap:8px;width:100%;padding:7px 8px;border:none;border-radius:8px;background:${background};text-align:left;cursor:pointer;font-size:13px;color:#16161a">
      <span style="width:8px;height:8px;border-radius:2px;background:${type.color};flex:none"></span>${type.label}
    </button>
  `;
}

/**
 * Zeigt das Popover an der Cursor-Position.
 *
 * @param {HTMLElement} el                     #mention-popup
 * @param {{x: number, y: number, q: string}} mention  Position und Suchtext
 * @param {Array<object>} items                Treffer aus preset.types
 * @param {number} selectedIdx                 Markierter Treffer
 */
export function showMentionPopup(el, mention, items, selectedIdx) {
  el.style.left = mention.x + 'px';
  el.style.top = mention.y + 'px';
  el.style.width = '260px';
  el.style.padding = '6px';

  const options = items.length
    ? items.map((type, i) => renderOption(type, i === selectedIdx, i)).join('')
    : `<div style="padding:8px;font-size:12.5px;color:#8b8d97">Kein Treffer für „${mention.q}"</div>`;

  el.innerHTML = `
    <div style="padding:4px 8px 6px;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:#a3a3ab">Neu anlegen als …</div>
    ${options}
  `;
  el.classList.add('active');
}

/** Blendet das Popover aus und leert es. */
export function hideMentionPopup(el) {
  el.classList.remove('active');
  el.innerHTML = '';
}
