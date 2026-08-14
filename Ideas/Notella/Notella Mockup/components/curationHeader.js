/**
 * Kopfleiste der Kuration — gemeinsam für Phase 1 (E1) und Phase 2 (E2).
 *
 * Beide Phasen gehören zu **einem** Fluss (PRD §4.4.2.2, E-18): der Lead
 * wechselt zwischen ihnen, ohne den Bildschirm zu verlassen. Deshalb steht
 * der Umschalter an derselben Stelle und der Fortschritt in derselben Form —
 * zwei getrennte Kopfleisten würden aus einem Fluss zwei Aufgaben machen.
 *
 * Der Einstieg ist frei: Phase 1 lässt sich überspringen, und aus Phase 2
 * kommt man jederzeit zurück.
 */

/**
 * Segmentierter Fortschritt — ein Segment je Einheit, nicht eine Zahl allein.
 * Man soll sehen, wie nah das Ende ist (E-22).
 */
export function segmentBar(total, doneCount, activeIdx) {
  return Array.from({ length: total }, (_, i) => {
    const bg = i < doneCount ? '#5340c4' : i === activeIdx ? '#bdb3f5' : '#e4e3de';
    return `<span style="width:${total > 18 ? 12 : 26}px;height:5px;border-radius:3px;background:${bg};display:inline-block"></span>`;
  }).join('');
}

/**
 * @param {object}  head
 * @param {object}  head.preset
 * @param {'E1'|'E2'} head.phase     Aktive Phase
 * @param {number}  head.openCards   Offene Vorschläge (Phase 1)
 * @param {number}  head.openNotes   Offene Notizen (Phase 2)
 * @param {string}  head.progress    Fortschrittstext rechts
 * @param {string}  head.bar         Markup des Fortschrittsbalkens
 * @param {boolean} head.isLead      Phase 2 ist nur für den Lead
 */
export function renderCurationHeader({ preset, phase, openCards, openNotes, progress, bar, isLead }) {
  const { d } = preset;
  const dateShort = (d.meetingDate.split('·')[0] || '').trim();

  const tab = (key, label, count) => {
    const on = key === phase;
    return `
      <button onclick="app.go('${key}')"
        style="display:flex;align-items:center;gap:7px;padding:5px 11px;border:none;border-radius:7px;font-size:12.5px;cursor:pointer;
               background:${on ? '#fff' : 'transparent'};color:${on ? '#16161a' : '#8b8d97'};
               font-weight:${on ? '600' : '400'};box-shadow:${on ? '0 1px 3px rgba(22,22,26,.1)' : 'none'}">
        ${label}
        <span style="font-size:11px;padding:1px 6px;border-radius:999px;background:${on ? '#f1f0fb' : '#eceae5'};color:#5a5c66">${count}</span>
      </button>
    `;
  };

  return `
    <div style="flex:none;padding:12px 26px;border-bottom:1px solid #e6e5e0;background:#fff;display:flex;align-items:center;gap:18px;flex-wrap:wrap">
      <div style="font-size:12.5px;color:#5a5c66">${d.wgName} › ${d.meetingTitle} · ${dateShort}</div>

      ${isLead ? `
        <div style="display:flex;gap:3px;padding:3px;background:#f4f3f0;border-radius:9px">
          ${tab('E1', 'Vorschläge', openCards)}${tab('E2', 'Durchsicht', openNotes)}
        </div>
      ` : ''}

      <span style="flex:1"></span>
      <div style="display:flex;align-items:center;gap:10px">
        <div style="display:flex;gap:3px">${bar}</div>
        <span style="font-size:12px;color:#8b8d97">${progress}</span>
      </div>
    </div>
  `;
}

/**
 * Rückgängig-Hinweis am unteren Rand — 8 Sekunden, kein Bestätigungsdialog
 * (PRD §4.4.2.8). Das Kürzel ist `Z`, nicht `U`.
 */
export function undoToast(text, handler) {
  if (!text) return '';
  return `
    <div style="position:fixed;left:50%;bottom:64px;transform:translateX(-50%);z-index:80;display:flex;align-items:center;gap:14px;padding:11px 16px;background:#16161a;color:#f4f4f2;border-radius:11px;box-shadow:0 12px 30px -14px rgba(22,22,26,.5)">
      <span style="font-size:13px">${text}</span>
      <button onclick="${handler}" style="font-size:13px;font-weight:600;color:#bdb3f5;border:none;background:transparent;cursor:pointer">Rückgängig (Z)</button>
    </div>
  `;
}

/** Kürzelleiste am Fuß — dauerhaft sichtbar, nicht in einer Hilfe (§4.4.2.9). */
export function shortcutFooter(keys, extra = '') {
  return `
    <div style="position:sticky;bottom:0;flex:none;display:flex;align-items:center;gap:16px;padding:10px 26px;border-top:1px solid #e6e5e0;background:rgba(255,255,255,.94);font-size:11.5px;color:#8b8d97;flex-wrap:wrap">
      ${keys.map((k) => `
        <span style="display:flex;align-items:center;gap:6px">
          <span style="padding:2px 6px;border:1px solid #e2e1dc;border-radius:5px;background:#faf9f7;font-family:ui-monospace,Menlo,monospace;font-size:10.5px;color:#16161a">${k.k}</span>${k.label}
        </span>
      `).join('')}
      ${extra ? `<span style="flex:1"></span>${extra}` : ''}
    </div>
  `;
}
