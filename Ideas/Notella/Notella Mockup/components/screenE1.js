// Screen E1: Review-Inbox (Schnelldurchlauf)
// Ein Vorschlag füllt die Fläche — PRD §4.4.2 / Screen-Inventar E1.
// Kein Listen-plus-Detail-Bildschirm und bewusst kein Stapelweg.

import { chipSt } from '../utils/index.js';

function segmentBar(cards, idx) {
  return cards.map((c, i) => {
    const bg = i < idx ? '#5340c4' : i === idx ? '#bdb3f5' : '#e4e3de';
    return `<span style="width:26px;height:5px;border-radius:3px;background:${bg};display:inline-block"></span>`;
  }).join('');
}

function renderHeader(preset, state, cards, idx) {
  const { t, d } = preset;
  const openCount = Math.max(0, d.open - state.log.length);
  const dateShort = (d.meetingDate.split('·')[0] || '').trim();
  const where = `${d.wgName} › ${d.meetingTitle} · ${dateShort}`;
  const shown = Math.min(idx + 1, cards.length);
  return `
    <div style="flex:none;padding:14px 26px;border-bottom:1px solid #e6e5e0;background:#fff;display:flex;align-items:center;gap:18px;flex-wrap:wrap">
      <div style="font-size:12.5px;color:#5a5c66">${where}</div>
      <span style="flex:1"></span>
      <div style="display:flex;align-items:center;gap:10px">
        <div style="display:flex;gap:3px">${segmentBar(cards, idx)}</div>
        <span style="font-size:12px;color:#8b8d97">${shown} von ${cards.length} · ${openCount} offen im ${t.wg}</span>
      </div>
    </div>
  `;
}

function renderDoneState(preset, state, isLead) {
  const { t, d } = preset;
  const log = state.log || [];

  if (!isLead) {
    return `
      <div style="flex:1;display:flex;justify-content:center;padding:64px 44px">
        <div style="max-width:480px;width:100%">
          <span style="display:inline-block;font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:#8b8d97;margin-bottom:14px">Für dich nicht sichtbar</span>
          <h2 style="margin:0;font-family:Spectral,Georgia,serif;font-size:24px;font-weight:500;letter-spacing:-.01em;line-height:1.3">Hier arbeitet die Projektleitung Vorschläge ab</h2>
          <p style="margin:12px 0 0;font-size:14px;line-height:1.65;color:#5a5c66">Deine Vorschläge aus ${d.meetingTitle} stehen dort noch an — das Ergebnis siehst du im ${t.canonNoun}.</p>
          <button onclick="app.go('D2')" style="margin-top:22px;padding:10px 16px;border-radius:9px;background:#5340c4;color:#fff;font-size:13.5px;font-weight:500;border:none;cursor:pointer">Zum ${t.canonNoun}</button>
        </div>
      </div>
    `;
  }

  const acc = log.filter(l => l.which === 'primary' && l.kind !== 'B').length;
  const mer = log.filter(l => l.which === 'primary' && l.kind === 'B').length;
  const rej = log.filter(l => l.which === 'secondary').length;
  const lat = log.filter(l => l.which === 'later').length;
  const stats = [
    [String(log.length), 'Vorschläge bearbeitet'],
    [String(acc), 'neue Einträge'],
    [String(mer), 'zusammengeführt'],
    [String(rej + lat), 'abgelehnt / später'],
  ];

  return `
    <div style="flex:1;display:flex;justify-content:center;padding:64px 44px">
      <div style="max-width:520px;width:100%">
        <span style="display:inline-block;font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:#8b8d97;margin-bottom:14px">Durchlauf beendet</span>
        <h2 style="margin:0;font-family:Spectral,Georgia,serif;font-size:25px;font-weight:500;letter-spacing:-.01em;line-height:1.25">Alles durch</h2>
        <p style="margin:12px 0 0;font-size:14.5px;line-height:1.65;color:#5a5c66">Keine offenen Vorschläge mehr in ${d.meetingTitle}. Wo die Mühe sichtbar wird: im Netz.</p>
        <div style="display:flex;gap:26px;margin:24px 0 0;padding:18px 20px;background:#fff;border:1px solid #e8e7e2;border-radius:12px">
          ${stats.map(s => `
            <div>
              <div style="font-family:Spectral,Georgia,serif;font-size:26px;line-height:1">${s[0]}</div>
              <div style="font-size:12px;color:#5a5c66;margin-top:5px">${s[1]}</div>
            </div>
          `).join('')}
        </div>
        <div style="display:flex;gap:10px;margin-top:24px;flex-wrap:wrap">
          <button onclick="app.go('D5')" style="padding:10px 16px;border-radius:9px;background:#5340c4;color:#fff;font-size:13.5px;font-weight:500;border:none;cursor:pointer">Beziehungs-Graph ansehen</button>
          <button onclick="app.go('D2')" style="padding:10px 16px;border-radius:9px;border:1px solid #dcdbd5;background:#fff;font-size:13.5px;cursor:pointer">Zum ${t.canonNoun}</button>
          <button onclick="app.resetReview()" style="padding:10px 16px;border-radius:9px;border:1px solid #dcdbd5;background:#fff;font-size:13.5px;cursor:pointer">Nochmal durchlaufen</button>
        </div>
      </div>
    </div>
  `;
}

export function renderScreenE1(preset, state, reviewMgr) {
  const { t, types } = preset;
  const isLead = state.role === 'lead';
  const cards = preset.review || [];
  const idx = Math.min(state.reviewIdx, cards.length);
  const done = idx >= cards.length;

  const undoToast = state.undo ? `
    <div style="position:fixed;left:50%;bottom:64px;transform:translateX(-50%);z-index:80;display:flex;align-items:center;gap:14px;padding:11px 16px;background:#16161a;color:#f4f4f2;border-radius:11px;box-shadow:0 12px 30px -14px rgba(22,22,26,.5)">
      <span style="font-size:13px">${state.undo}</span>
      <button onclick="app.reviewUndo()" style="font-size:13px;font-weight:600;color:#bdb3f5;border:none;background:transparent;cursor:pointer">Rückgängig</button>
    </div>
  ` : '';

  if (done) {
    return `
      <div style="min-height:100%;display:flex;flex-direction:column;background:#fbfaf8">
        ${renderHeader(preset, state, cards, idx)}
        ${renderDoneState(preset, state, isLead)}
      </div>
      ${undoToast}
    `;
  }

  const card = cards[idx];
  const cardType = types.find(ty => ty.key === card.typeKey) || types[0];
  const ready = reviewMgr.ready(card, state);
  const kindColor = card.kind === 'A' ? '#3f7fd0' : card.kind === 'B' ? '#c8553d' : '#5f9b3f';

  const fieldsHtml = (card.fields || []).map((f, fi) => {
    const key = card.title + '|' + f.label;
    const optsHtml = f.options.map((o, oi) => {
      const on = state.rf[key] === o;
      const onclick = isLead ? `onclick="app.pickReviewField(this)"` : '';
      return `
        <button data-card="${idx}" data-field="${fi}" data-opt="${oi}" ${onclick}
          style="display:inline-flex;align-items:center;padding:7px 12px;border-radius:8px;font-size:13px;border:1px solid ${on ? '#5340c4' : '#dcdbd5'};background:${on ? '#f2f0fc' : '#fff'};color:#16161a;font-weight:${on ? '600' : '400'};cursor:${isLead ? 'pointer' : 'default'}">
          <span style="font-family:ui-monospace,Menlo,monospace;font-size:10px;color:#8b8d97;margin-right:6px">${oi + 1}</span>${o}
        </button>
      `;
    }).join('');
    return `
      <div>
        <div style="font-size:12px;color:#5a5c66;margin-bottom:7px">${f.label} <span style="color:#c8553d">Pflicht</span></div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">${optsHtml}</div>
      </div>
    `;
  }).join('');

  const actionsHtml = isLead ? `
    <div style="display:flex;align-items:center;gap:10px;margin-top:20px;flex-wrap:wrap">
      <button onclick="app.reviewDecide('primary')" ${ready ? '' : 'disabled'}
        style="padding:11px 17px;border-radius:9px;font-size:13.5px;font-weight:500;border:none;cursor:${ready ? 'pointer' : 'not-allowed'};background:${ready ? '#5340c4' : '#e8e7e2'};color:${ready ? '#fff' : '#a3a3ab'}">
        ${card.primary}
      </button>
      <button onclick="app.reviewDecide('secondary')" style="padding:11px 17px;border-radius:9px;font-size:13.5px;border:1px solid #dcdbd5;background:#fff;cursor:pointer">
        ${card.secondary}
      </button>
      <span style="flex:1"></span>
      <button onclick="app.reviewDecide('later')" style="font-size:12.5px;color:#8b8d97;padding:6px 8px;border:none;background:transparent;cursor:pointer">Später</button>
    </div>
    ${!ready ? `<p style="margin:10px 0 0;font-size:12px;color:#8a3a27">Erst „${(card.fields[0] || {}).label || ''}" wählen — ein Klick oder eine Zifferntaste.</p>` : ''}
  ` : `
    <p style="margin:18px 0 0;padding-top:14px;border-top:1px solid #efeee9;font-size:12.5px;color:#5a5c66">Nur die Projektleitung entscheidet. Du siehst mit, damit nachvollziehbar bleibt, was übernommen wird.</p>
  `;

  const keys = [
    { k: 'Enter', label: card.primary.split('→')[0].trim() },
    { k: 'A', label: card.secondary.split('→')[0].trim() },
    { k: 'S', label: 'Später' },
    { k: '1–4', label: 'Pflichtfeld setzen' },
    { k: 'U', label: 'Rückgängig' },
  ];
  const footer = isLead ? `
    <div style="position:sticky;bottom:0;flex:none;display:flex;align-items:center;gap:16px;padding:10px 26px;border-top:1px solid #e6e5e0;background:rgba(255,255,255,.92);font-size:11.5px;color:#8b8d97;flex-wrap:wrap">
      ${keys.map(k => `<span style="display:flex;align-items:center;gap:6px"><span style="padding:2px 6px;border:1px solid #e2e1dc;border-radius:5px;background:#faf9f7;font-family:ui-monospace,Menlo,monospace;font-size:10.5px;color:#16161a">${k.k}</span>${k.label}</span>`).join('')}
    </div>
  ` : '';

  return `
    <div style="min-height:100%;display:flex;flex-direction:column;background:#fbfaf8">
      ${renderHeader(preset, state, cards, idx)}

      <div style="flex:1;display:flex;justify-content:center;gap:30px;padding:30px 26px 90px">
        <div style="width:100%;max-width:720px">
          <div style="font-size:12px;color:#5a5c66;display:flex;align-items:center;gap:8px">
            <span style="${chipSt(kindColor, false)}">${card.kindLabel}</span>
            <span>${card.freq}</span>
            ${card.confidence ? `<span style="display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:999px;background:#eef0fb;color:#3b3f8f;font-size:11.5px">KI-Vorschlag · Konfidenz ${card.confidence}</span>` : ''}
          </div>

          <div style="margin-top:14px;padding:18px 20px;background:#fff;border:1px solid #e6e5e0;border-radius:13px">
            <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8b8d97">Belegstelle · ganzer Absatz</div>
            <p style="margin:10px 0 0;font-family:Spectral,Georgia,serif;font-size:16.5px;line-height:1.75;color:#26262c">${card.pre}<mark style="background:#efecfb;color:#3b2b9e;padding:1px 3px;border-radius:3px">${card.hit}</mark>${card.post}</p>
          </div>

          <div style="margin-top:16px;padding:18px 20px;background:#fff;border:1px solid #cec7ef;border-radius:13px">
            <div style="display:flex;align-items:center;gap:9px;flex-wrap:wrap">
              <span style="${chipSt(cardType.color, false)}">${cardType.label}</span>
              ${card.target ? `<span style="font-size:12px;color:#8b8d97">→ vorhandener Eintrag: ${card.target}</span>` : ''}
            </div>
            <div style="margin-top:10px;font-family:Spectral,Georgia,serif;font-size:23px;letter-spacing:-.01em">${card.title}</div>
            <div style="margin-top:14px;font-size:14.5px;font-weight:600">${card.question}</div>
            ${fieldsHtml ? `<div style="margin-top:16px;display:grid;gap:12px">${fieldsHtml}</div>` : ''}
            ${actionsHtml}
          </div>
        </div>

        <aside style="width:242px;flex:none;padding-top:38px;display:grid;gap:18px;align-content:start">
          <div>
            <div style="font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#a3a3ab">Herkunft</div>
            <div style="margin-top:8px;display:flex;align-items:center;gap:8px">
              <span style="width:22px;height:22px;border-radius:50%;background:#e7e5f8;color:#4a3aad;font-size:10.5px;font-weight:600;display:flex;align-items:center;justify-content:center">${card.authorInitials}</span>
              <span style="font-size:12.5px;color:#5a5c66">${card.author}</span>
            </div>
            <div style="margin-top:6px;font-size:12px;color:#8b8d97;line-height:1.55">${card.when}</div>
          </div>
          <div>
            <div style="font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#a3a3ab">Streuung</div>
            <div style="margin-top:7px;display:grid;gap:5px">${(card.spread || []).map(x => `<div style="font-size:12px;color:#5a5c66">${x}</div>`).join('')}</div>
          </div>
          <div>
            <div style="font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#a3a3ab">Vorhanden, gleicher Typ</div>
            <div style="margin-top:7px;display:grid;gap:4px">${(card.existing || []).map(x => `<div style="font-size:12px;color:#5a5c66">${x}</div>`).join('')}</div>
          </div>
        </aside>
      </div>

      ${footer}
    </div>
    ${undoToast}
  `;
}
