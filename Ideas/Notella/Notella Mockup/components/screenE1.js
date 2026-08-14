// Screen E1: Kuration Phase 1 — Vorschläge
// Ein Vorschlag füllt die Fläche — PRD §4.4.2.3 f. / Screen-Inventar E1.
// Kein Listen-plus-Detail-Bildschirm und bewusst kein Stapelweg: die
// Entlastung kommt aus Geschwindigkeit, nicht aus Bündelung.
//
// Phase 1 ist der Normalfall, Phase 2 (screenE2.js) das Sicherheitsnetz.
// Der Leerzustand ist deshalb kein Abschluss, sondern der Übergang dorthin —
// Phase 1 kann nichts darüber aussagen, was *nicht* getaggt wurde.

import { chipSt } from '../utils/index.js';
import { errorView, skeletonBar, skeletonBox } from './stateViews.js';
import { renderCurationHeader, segmentBar, undoToast, shortcutFooter } from './curationHeader.js';

/** Belegstelle und Vorschlagskarte als Umriss — die Karte springt nicht. */
function renderLoading() {
  return `
    <div style="min-height:100%;display:flex;justify-content:center;padding:30px 26px;background:#fbfaf8">
      <div style="width:100%;max-width:720px">
        ${skeletonBar('180px', 14, 'margin-bottom:16px')}
        ${skeletonBox(`
          ${skeletonBar('40%', 10, 'margin-bottom:14px')}
          ${skeletonBar('100%', 14, 'margin-bottom:8px')}
          ${skeletonBar('86%', 14)}
        `, 'margin-bottom:16px')}
        ${skeletonBox(`
          ${skeletonBar('30%', 12, 'margin-bottom:14px')}
          ${skeletonBar('62%', 22, 'margin-bottom:18px')}
          ${skeletonBar('44%', 34)}
        `)}
      </div>
    </div>
  `;
}

function header(preset, state, cards, idx, isLead) {
  const openNotes = (state.notes || []).filter((n) => (state.closed || []).indexOf(n.id) < 0).length;
  const shown = Math.min(idx + 1, cards.length);

  return renderCurationHeader({
    preset,
    phase: 'E1',
    isLead,
    openCards: Math.max(0, cards.length - idx),
    openNotes,
    bar: segmentBar(cards.length, idx, idx),
    progress: `${shown} von ${cards.length}`
  });
}

/**
 * Leerzustand = Übergang, nicht Abschluss (Screen-Inventar E1).
 * Bilanziert wird erst am Ende von Phase 2, weil erst dort ein Treffen
 * wirklich durchgesehen ist.
 */
function renderDoneState(preset, state, isLead) {
  const { t, d } = preset;

  if (!isLead) {
    return `
      <div style="flex:1;display:flex;justify-content:center;padding:64px 44px">
        <div style="max-width:480px;width:100%">
          <span style="display:inline-block;font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:#8b8d97;margin-bottom:14px">Für dich nicht bearbeitbar</span>
          <h2 style="margin:0;font-family:Spectral,Georgia,serif;font-size:24px;font-weight:500;letter-spacing:-.01em;line-height:1.3">Hier arbeitet die Projektleitung Vorschläge ab</h2>
          <p style="margin:12px 0 0;font-size:14px;line-height:1.65;color:#5a5c66">Deine Vorschläge aus ${d.meetingTitle} stehen noch an — das Ergebnis siehst du im ${t.canonNoun}.</p>
          <button onclick="app.go('D2')" style="margin-top:22px;padding:10px 16px;border-radius:9px;background:#5340c4;color:#fff;font-size:13.5px;font-weight:500;border:none;cursor:pointer">Zum ${t.canonNoun}</button>
        </div>
      </div>
    `;
  }

  const openNotes = (state.notes || []).filter((n) => (state.closed || []).indexOf(n.id) < 0).length;

  return `
    <div style="flex:1;display:flex;justify-content:center;padding:64px 44px">
      <div style="max-width:520px;width:100%">
        <span style="display:inline-block;font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:#8b8d97;margin-bottom:14px">Phase 1 erledigt</span>
        <h2 style="margin:0;font-family:Spectral,Georgia,serif;font-size:25px;font-weight:500;letter-spacing:-.01em;line-height:1.25">Alle Vorschläge bearbeitet</h2>
        <p style="margin:12px 0 0;font-size:14.5px;line-height:1.65;color:#5a5c66">
          Weiter zur Durchsicht — ${openNotes} ${openNotes === 1 ? 'Notiz' : 'Notizen'}.
          Erst dort zeigt sich, was im ${t.meeting} zu markieren vergessen wurde.
        </p>
        <div style="display:flex;gap:10px;margin-top:24px;flex-wrap:wrap">
          <button onclick="app.go('E2')" style="padding:10px 16px;border-radius:9px;background:#5340c4;color:#fff;font-size:13.5px;font-weight:500;border:none;cursor:pointer">Zur Durchsicht</button>
          <button onclick="app.resetReview()" style="padding:10px 16px;border-radius:9px;border:1px solid #dcdbd5;background:#fff;font-size:13.5px;cursor:pointer">Nochmal durchlaufen</button>
        </div>
      </div>
    </div>
  `;
}

export function renderScreenE1(preset, state, reviewMgr) {
  const { t, types } = preset;
  const isLead = state.role === 'lead';

  if (state.mode === 'error') {
    return errorView({
      icon: '📥',
      title: 'Die Vorschläge konnten nicht geladen werden',
      text: `Nichts ist verloren gegangen: bereits getroffene Entscheidungen stehen im ${t.canonNoun}, die offenen Vorschläge warten weiter.`,
      fallback: { label: `Zum ${t.canonNoun}`, onclick: "app.go('D2')" }
    });
  }

  if (state.mode === 'loading') return renderLoading();

  const cards = preset.review || [];
  const idx = Math.min(state.reviewIdx, cards.length);
  const done = idx >= cards.length || state.mode === 'empty';

  const toast = undoToast(state.undo, 'app.reviewUndo()');

  if (done) {
    return `
      <div style="min-height:100%;display:flex;flex-direction:column;background:#fbfaf8">
        ${header(preset, state, cards, cards.length, isLead)}
        ${renderDoneState(preset, state, isLead)}
      </div>
      ${toast}
    `;
  }

  const card = cards[idx];
  const cardType = types.find((ty) => ty.key === card.typeKey) || types[0];
  const ready = reviewMgr.ready(card, state);
  const kindColor = card.kind === 'A' ? '#3f7fd0' : card.kind === 'B' ? '#c8553d' : '#5f9b3f';

  // Vorbereitung auf V1.3 (PRD §4.4.2.6): Ist die KI aktiv, ist der
  // wahrscheinliche Chip vorbelegt und mit einem Punkt markiert. Das Layout
  // bleibt identisch — nur die Menge der offenen Fragen sinkt.
  const aiActive = state.aiMode && !!card.confidence;

  const fieldsHtml = (card.fields || []).map((f, fi) => {
    const key = card.title + '|' + f.label;
    const optsHtml = f.options.map((o, oi) => {
      const on = state.rf[key] === o;
      const suggested = aiActive && oi === 0 && !state.rf[key];
      const onclick = isLead ? `onclick="app.pickReviewField(this)"` : '';
      return `
        <button data-card="${idx}" data-field="${fi}" data-opt="${oi}" ${onclick}
          style="display:inline-flex;align-items:center;padding:7px 12px;border-radius:8px;font-size:13px;border:1px ${suggested ? 'dashed' : 'solid'} ${on || suggested ? '#5340c4' : '#dcdbd5'};background:${on ? '#f2f0fc' : '#fff'};color:#16161a;font-weight:${on ? '600' : '400'};cursor:${isLead ? 'pointer' : 'default'}">
          <span style="font-family:ui-monospace,Menlo,monospace;font-size:10px;color:#8b8d97;margin-right:6px">${oi + 1}</span>${o}
          ${suggested ? `<span style="width:5px;height:5px;border-radius:50%;background:#5340c4;margin-left:7px" title="KI-Vorschlag"></span>` : ''}
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

  // Genau ein gefüllter Knopf (P-3); die Begründung für einen inaktiven
  // Primärknopf steht unmittelbar am Knopf, nicht am Fuß der Karte.
  const actionsHtml = isLead ? `
    <div style="display:flex;align-items:center;gap:10px;margin-top:20px;flex-wrap:wrap">
      <button onclick="app.reviewDecide('primary')" ${ready ? '' : 'disabled'}
        style="padding:11px 17px;border-radius:9px;font-size:13.5px;font-weight:500;border:none;cursor:${ready ? 'pointer' : 'not-allowed'};background:${ready ? '#5340c4' : '#e8e7e2'};color:${ready ? '#fff' : '#a3a3ab'}">
        ${card.primary}
      </button>
      ${!ready ? `<span style="font-size:12px;color:#8a3a27">${(card.fields[0] || {}).label || ''} wählen, dann übernehmen</span>` : ''}
      <button onclick="app.reviewDecide('secondary')" style="padding:11px 17px;border-radius:9px;font-size:13.5px;border:1px solid #dcdbd5;background:#fff;cursor:pointer">
        ${card.secondary}
      </button>
      <span style="flex:1"></span>
      <button onclick="app.reviewDecide('later')" style="font-size:12.5px;color:#8b8d97;padding:6px 8px;border:none;background:transparent;cursor:pointer">Später</button>
    </div>
  ` : `
    <p style="margin:18px 0 0;padding-top:14px;border-top:1px solid #efeee9;font-size:12.5px;color:#5a5c66">Nur die Projektleitung entscheidet. Du siehst mit, damit nachvollziehbar bleibt, was übernommen wird.</p>
  `;

  // Tastenkürzel nach PRD §4.4.2.9. `N` erscheint ausschließlich bei
  // Kartenart B — ein Kürzel, das nichts auslöst, wird nicht angezeigt.
  const keys = [
    { k: 'A · Enter', label: card.kind === 'B' ? 'Zusammenführen' : 'Übernehmen' },
    { k: 'X', label: card.kind === 'B' ? 'Ablehnen' : card.secondary.split('→')[0].trim() },
    ...(card.kind === 'B' ? [{ k: 'N', label: 'Neu anlegen' }] : []),
    { k: 'S', label: 'Später' },
    ...(card.fields && card.fields.length ? [{ k: '1–9', label: 'Pflichtfeld setzen' }] : []),
    { k: 'Z', label: 'Rückgängig' },
    { k: '←', label: 'Zurück' }
  ];

  return `
    <div style="min-height:100%;display:flex;flex-direction:column;background:#fbfaf8">
      ${header(preset, state, cards, idx, isLead)}

      <div style="flex:1;display:flex;justify-content:center;gap:30px;padding:30px 26px 90px">
        <div style="width:100%;max-width:720px">
          <div style="font-size:12px;color:#5a5c66;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="${chipSt(kindColor, false)}">${card.kindLabel}</span>
            <span>${card.freq}</span>
            ${aiActive ? `<span style="display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:999px;background:#eef0fb;color:#3b3f8f;font-size:11.5px">KI-Vorarbeit · Konfidenz ${card.confidence}</span>` : ''}
          </div>

          <!-- Belegstelle: größtes Element der Karte, ganzer Absatz (P-5) -->
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

        <!-- Kontextspalte: rahmenlos und gedämpft, damit sie nicht mit der
             Entscheidung konkurriert (PRD §4.4.2.5) -->
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
            <div style="margin-top:7px;display:grid;gap:5px">${(card.spread || []).map((x) => `<div style="font-size:12px;color:#5a5c66">${x}</div>`).join('')}</div>
          </div>
          <div>
            <div style="font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#a3a3ab">Vorhanden, gleicher Typ</div>
            <div style="margin-top:7px;display:grid;gap:4px">${(card.existing || []).map((x) => `<div style="font-size:12px;color:#5a5c66">${x}</div>`).join('')}</div>
          </div>
        </aside>
      </div>

      ${isLead ? shortcutFooter(keys) : ''}
    </div>
    ${toast}
  `;
}
