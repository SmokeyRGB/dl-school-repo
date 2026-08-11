/**
 * Popover der @-Erwähnung im Meeting-Raum (nur Darstellung).
 *
 * Wird direkt in das feste #mention-popup geschrieben, nicht über den
 * Screen-Render — siehe core/actions/editor.js für den Grund.
 *
 * Zwei Abschnitte, Reihenfolge nach Screen-Inventar C2: vorhandene Einträge
 * zuerst, darunter abgetrennt die Anlage-Optionen. Die Trefferliste kommt
 * fertig sortiert aus core/actions/editor.js — hier wird nur gezeichnet.
 */

function sectionLabel(text) {
  return `<div style="padding:4px 8px 6px;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:#a3a3ab">${text}</div>`;
}

function renderOption(item, isSelected, index) {
  const background = isSelected ? '#f2f0fc' : 'transparent';
  const mark = item.kind === 'entity'
    ? `<span style="width:8px;height:8px;border-radius:50%;background:${item.color};flex:none"></span>`
    : `<span style="width:8px;height:8px;border-radius:2px;background:${item.color};flex:none"></span>`;

  return `
    <button onmousedown="event.preventDefault();app.selectMention(${index})" style="display:flex;align-items:center;gap:8px;width:100%;padding:7px 8px;border:none;border-radius:8px;background:${background};text-align:left;cursor:pointer;font-size:13px;color:#16161a">
      ${mark}
      <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.label}</span>
      ${item.meta ? `<span style="font-size:11px;color:#8b8d97;flex:none">${item.meta}</span>` : ''}
    </button>
  `;
}

/**
 * Zeigt das Popover an der Cursor-Position.
 *
 * @param {HTMLElement} el                             #mention-popup
 * @param {{x: number, y: number, q: string}} mention  Position und Suchtext
 * @param {Array<object>} items                        Treffer, Einträge zuerst
 * @param {number} selectedIdx                         Markierter Treffer
 */
export function showMentionPopup(el, mention, items, selectedIdx) {
  el.style.left = mention.x + 'px';
  el.style.top = mention.y + 'px';
  el.style.width = '300px';
  el.style.padding = '6px';

  const hits = items.filter((item) => item.kind === 'entity');
  const creates = items.filter((item) => item.kind === 'type');
  const query = (mention.q || '').trim();

  // Kein Treffer ist kein Fehler: der Hinweis steht über den Anlage-Optionen,
  // damit die Auswahl nie in einer Sackgasse endet (Screen-Inventar C2).
  const hitsHtml = hits.length
    ? sectionLabel('Vorhandene Einträge')
      + hits.map((item, i) => renderOption(item, i === selectedIdx, i)).join('')
    : `<div style="padding:8px;font-size:12.5px;color:#8b8d97">${
        query ? `Kein Treffer für „${query}"` : 'Noch keine Einträge im Projekt'
      }</div>`;

  const createLabel = query ? `„${query}" neu anlegen als …` : 'Neu anlegen als …';
  const createsHtml = creates.length
    ? `<div style="margin-top:4px;padding-top:4px;border-top:1px solid #efeee9">
         ${sectionLabel(createLabel)}
         ${creates.map((item, i) => renderOption(item, hits.length + i === selectedIdx, hits.length + i)).join('')}
       </div>`
    : '';

  el.innerHTML = hitsHtml + createsHtml;
  el.classList.add('active');
}

/** Blendet das Popover aus und leert es. */
export function hideMentionPopup(el) {
  el.classList.remove('active');
  el.innerHTML = '';
}
