// Screen D2: Projektwissen — Wiki (Baum + Artikel)
// Zweispaltig: Wissensbaum links, Artikel rechts. Herkunfts-Panel fährt von
// rechts über den Inhalt ein (dasselbe Muster wie die Schublade in C1).
// PRD §4.4.3 / Screen-Inventar D1/D2.

import { tint, chipSt, markSt, resolveArticle } from '../utils/index.js';
import { noticeView, errorView, skeletonBar } from './stateViews.js';

/** Baum und Artikel in ihrer eigenen Form — die Spalten springen nicht. */
function renderLoading() {
  const treeRows = [70, 90, 60, 80, 50].map(w => skeletonBar(w + '%', 12, 'margin-bottom:12px')).join('');
  const bodyRows = [95, 88, 92, 60].map(w => skeletonBar(w + '%', 14, 'margin-bottom:14px')).join('');
  return `
    <div style="display:flex;min-height:100%;align-items:stretch;animation:nshim 1.6s infinite">
      <div style="width:262px;flex:none;border-right:1px solid #e6e5e0;background:#fbfaf8;padding:18px 14px">
        ${skeletonBar('100%', 32, 'margin-bottom:18px')}${treeRows}
      </div>
      <div style="flex:1;min-width:0;display:flex;justify-content:center">
        <div style="width:100%;max-width:760px;padding:34px 40px">
          ${skeletonBar('120px', 20, 'margin-bottom:16px')}
          ${skeletonBar('58%', 32, 'margin-bottom:28px')}
          ${bodyRows}
        </div>
      </div>
    </div>
  `;
}

function typeOf(key, preset) {
  return preset.types.find(ty => ty.key === key) || preset.types[0];
}

/** Titel für einen Inline-Handler: Anführungszeichen dürfen nicht ausbrechen. */
function jsStr(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function renderTree(preset, state, article) {
  const { t, d, types, entities } = preset;
  const modeBtn = (key, label) => {
    const on = (state.treeMode || 'entry') === key;
    return `
      <button onclick="app.setTreeMode('${key}')" style="flex:1;padding:6px 8px;border-radius:6px;font-size:12px;text-align:center;border:none;cursor:pointer;
        ${on ? 'background:#fff;color:#16161a;font-weight:600;box-shadow:0 1px 2px rgba(22,22,26,.07)' : 'background:transparent;color:#8b8d97'}">${label}</button>
    `;
  };

  let groupsHtml;
  if ((state.treeMode || 'entry') === 'entry') {
    groupsHtml = types.map(ty => {
      const items = entities.filter(e => e.key === ty.key);
      if (!items.length) return '';
      const itemsHtml = items.map(e => {
        const on = e.label === article.title;
        return `
          <button onclick="app.openEntry('${jsStr(e.label)}')" style="display:flex;align-items:center;gap:6px;width:100%;padding:6px 8px;border-radius:7px;font-size:13px;border:none;background:${on ? '#f2f0fc' : 'transparent'};color:${on ? '#16161a' : (e.tag ? '#8b8d97' : '#3f4048')};font-weight:${on ? '600' : '400'};cursor:pointer;text-align:left">
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${e.label}</span>
            ${e.tag ? `<span style="font-size:10px;padding:1px 6px;border-radius:5px;background:#f3f1ea;color:#8b8d97;flex:none">${e.tag}</span>` : ''}
          </button>
        `;
      }).join('');
      return `
        <div>
          <div style="display:flex;align-items:center;gap:8px;padding:0 4px 7px">
            <span style="${markSt(ty.color)}"></span>
            <span style="font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#5a5c66">${ty.label}</span>
            <span style="flex:1"></span>
            <span style="font-size:11px;color:#a3a3ab">${items.length}</span>
          </div>
          <div style="display:grid;gap:1px">${itemsHtml}</div>
        </div>
      `;
    }).filter(Boolean).join('');
  } else {
    const recent = entities.slice(0, 3);
    const earlier = entities.slice(3, 7);
    const timeGroup = (label, mark, items, tags) => `
      <div>
        <div style="display:flex;align-items:center;gap:8px;padding:0 4px 7px">
          <span style="${mark}"></span>
          <span style="font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#5a5c66">${label}</span>
          <span style="flex:1"></span>
          <span style="font-size:11px;color:#a3a3ab">${items.length}</span>
        </div>
        <div style="display:grid;gap:1px">
          ${items.map((e, i) => `
            <button onclick="app.openEntry('${jsStr(e.label)}')" style="display:flex;align-items:center;gap:6px;width:100%;padding:6px 8px;border-radius:7px;font-size:13px;border:none;background:${e.label === article.title ? '#f2f0fc' : 'transparent'};color:#3f4048;cursor:pointer;text-align:left">
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${e.label}</span>
              <span style="font-size:10px;padding:1px 6px;border-radius:5px;background:#f3f1ea;color:#8b8d97;flex:none">${tags[i]}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    groupsHtml = timeGroup(`${d.meetingTitle} · heute`, markSt('#5340c4'), recent, ['neu', 'geändert', 'Vorschlag'])
      + timeGroup(`Vorheriges ${t.meeting}`, markSt('#a3a3ab'), earlier, ['geändert', 'neu', 'neu', 'neu']);
  }

  return `
    <div style="width:262px;flex:none;border-right:1px solid #e6e5e0;background:#fbfaf8;padding:18px 14px 40px;overflow:auto">
      <input placeholder="${t.canonNoun} durchsuchen" style="width:100%;padding:8px 11px;border:1px solid #dcdbd5;border-radius:8px;background:#fff;font-size:13px;box-sizing:border-box">
      <div style="display:flex;gap:3px;margin-top:12px;padding:3px;background:#f1f0ec;border-radius:8px">
        ${modeBtn('entry', 'Nach Eintrag')}${modeBtn('time', 'Nach Zeitpunkt')}
      </div>
      <div style="margin-top:18px;display:grid;gap:18px">${groupsHtml}</div>
    </div>
  `;
}

function renderArticle(preset, state, article) {
  const { t, d, entities } = preset;
  const artTy = typeOf(article.typeKey, preset);
  const isLead = state.role === 'lead';

  const fieldsHtml = article.fields.map(f => `
    <div style="padding:11px 0;border-bottom:1px solid #f2f1ec;font-size:12.5px;color:#8b8d97">${f[0]}</div>
    <div style="padding:11px 0;border-bottom:1px solid #f2f1ec;font-size:13.5px">${f[1]}</div>
  `).join('');

  const bodyHtml = article.body.map(p => `
    <p style="margin:0 0 14px;font-family:Spectral,Georgia,serif;font-size:17px;line-height:1.75;color:#26262c">${p}</p>
  `).join('');

  const relGroupsHtml = article.rels.map(r => {
    const itemsHtml = r.items.map(label => {
      const e = entities.find(x => x.label === label);
      const ty = typeOf(e ? e.key : preset.types[0].key, preset);
      return `
        <button onclick="app.openEntry('${jsStr(label)}')" style="display:inline-flex;align-items:center;gap:7px;padding:5px 11px;border-radius:999px;border:1px solid ${tint(ty.color, .35)};background:${tint(ty.color, .09)};font-size:12.5px;cursor:pointer">
          <span style="${markSt(ty.color, 8)}"></span>${label}
        </button>
      `;
    }).join('');
    return `
      <div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap">
        <span style="font-size:13px;color:#5a5c66;min-width:132px">${r.label}</span>
        <div style="display:flex;flex-wrap:wrap;gap:7px">${itemsHtml}</div>
      </div>
    `;
  }).join('');

  const backrefsHtml = article.backrefs.length ? `
    <h2 style="margin:32px 0 10px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8b8d97">Verweist hierher</h2>
    <div style="display:flex;flex-wrap:wrap;gap:7px">
      ${article.backrefs.map(b => `<span style="font-size:12px;padding:4px 10px;border-radius:999px;background:#f2f1ed;color:#5a5c66">${b}</span>`).join('')}
    </div>
  ` : '';

  return `
    <div style="flex:1;min-width:0;display:flex;justify-content:center">
      <article style="width:100%;max-width:760px;padding:34px 40px 80px">
        <div style="display:flex;align-items:center;gap:9px;flex-wrap:wrap">
          <span style="${chipSt(artTy.color, false)}">${artTy.label}</span>
          <span style="font-size:11px;padding:3px 8px;border-radius:6px;background:#f1f0fb;color:#4a3aad">${article.state}</span>
          <span style="font-size:12px;color:#8b8d97">Alias: ${article.aliases}</span>
        </div>
        <h1 style="margin:12px 0 0;font-family:Spectral,Georgia,serif;font-size:34px;font-weight:500;letter-spacing:-.02em;line-height:1.15">${article.title}</h1>
        <button onclick="app.openOrigin('origin')" style="margin-top:10px;display:inline-flex;align-items:center;gap:7px;font-size:12.5px;color:#5340c4;border:none;border-bottom:1px solid #d9d4f3;padding:0 0 2px;background:transparent;cursor:pointer">
          ${article.originLine} <span style="font-size:11px">↗</span>
        </button>

        <div style="margin-top:26px;display:grid;grid-template-columns:150px 1fr;gap:1px 18px;border-top:1px solid #ecebe6">${fieldsHtml}</div>

        <h2 style="margin:32px 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8b8d97">Beschreibung</h2>
        ${bodyHtml}

        <!-- Ohne Beziehungen entfällt der Abschnitt ganz (Screen-Inventar D2) -->
        ${article.rels.length ? `
          <h2 style="margin:30px 0 12px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8b8d97">Beziehungen</h2>
          <div style="display:grid;gap:12px">${relGroupsHtml}</div>
        ` : ''}
        <div style="display:flex;gap:10px;margin-top:16px">
          <button onclick="app.go('D5')" style="padding:8px 13px;border:1px solid #dcdbd5;border-radius:8px;background:#fff;font-size:12.5px;cursor:pointer">Umgebung im Netz ansehen</button>
          ${isLead ? `<button style="padding:8px 13px;border:1px solid #dcdbd5;border-radius:8px;background:#fff;font-size:12.5px;cursor:pointer">Beziehung hinzufügen</button>` : ''}
        </div>

        ${backrefsHtml}

        ${!isLead ? `<p style="margin:30px 0 0;padding:12px 14px;border:1px solid #e6e5e0;background:#faf9f7;border-radius:10px;font-size:12.5px;color:#5a5c66">Nur die Projektleitung kann das ${t.canonNoun} ändern — frag ${d.leadName}. Felder sind schreibgeschützt.</p>` : ''}
      </article>
    </div>
  `;
}

function renderOriginPanel(preset, state, article) {
  const tab = state.originTab || 'origin';
  const items = tab === 'origin' ? article.origin : article.history;

  const tabBtn = (key, label) => {
    const on = tab === key;
    return `
      <button onclick="app.setOriginTab('${key}')" style="font-size:12.5px;border:none;background:transparent;cursor:pointer;padding:0 0 8px;border-bottom:2px solid ${on ? '#5340c4' : 'transparent'};color:${on ? '#16161a' : '#8b8d97'};font-weight:${on ? '600' : '400'}">${label}</button>
    `;
  };

  const itemsHtml = items.map(o => `
    <div style="padding:13px 15px;border:1px solid #ecebe6;border-radius:11px;background:#fdfdfc">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="font-size:10.5px;padding:2px 7px;border-radius:6px;background:${o.tag.indexOf('geändert') > 0 ? '#fdf3e6' : '#f1f0fb'};color:${o.tag.indexOf('geändert') > 0 ? '#8a6a2f' : '#4a3aad'}">${o.tag}</span>
        <span style="font-size:12px;color:#5a5c66">${o.meta}</span>
      </div>
      <p style="margin:9px 0 0;font-family:Spectral,Georgia,serif;font-size:14.5px;line-height:1.7;color:#26262c">${o.text}</p>
      ${o.link ? `<button style="margin-top:9px;font-size:12px;color:#5340c4;border:none;background:transparent;cursor:pointer;padding:0">${o.link} ↗</button>` : ''}
    </div>
  `).join('');

  return `
    <div style="position:absolute;inset:0;z-index:70;display:flex;justify-content:flex-end;${state.origin ? '' : 'pointer-events:none'}">
      <div onclick="app.closeOrigin()" style="position:absolute;inset:0;background:rgba(22,22,26,.14);opacity:${state.origin ? '1' : '0'};transition:opacity 240ms ease"></div>
      <div style="position:relative;width:430px;max-width:92%;height:100%;background:#fff;border-left:1px solid #e2e1dc;box-shadow:-18px 0 44px -30px rgba(22,22,26,.4);
                  transform:translateX(${state.origin ? '0' : '100%'});transition:transform 260ms cubic-bezier(.22,.7,.25,1);display:flex;flex-direction:column">
        <div style="flex:none;padding:15px 18px 0">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:14px;font-weight:600">${article.title}</span>
            <span style="flex:1"></span>
            <button onclick="app.closeOrigin()" style="font-size:12px;color:#8b8d97;border:none;background:transparent;cursor:pointer">Esc</button>
          </div>
          <div style="display:flex;gap:16px;margin-top:14px">
            ${tabBtn('origin', 'Herkunft · woher?')}${tabBtn('history', 'Verlauf · wann?')}
          </div>
        </div>
        <div style="flex:1;overflow:auto;padding:18px;display:grid;gap:14px;align-content:start">${itemsHtml}</div>
      </div>
    </div>
  `;
}

export function renderScreenD2(preset, state) {
  const { t } = preset;

  if (state.mode === 'error') {
    return errorView({
      icon: '📖',
      title: `Das ${t.canonNoun} konnte nicht geladen werden`,
      text: `Die Einträge ließen sich nicht abrufen. Geschrieben ist alles — es fehlt nur die Ansicht.`,
      fallback: { label: 'Zum Beziehungs-Graph', onclick: "app.go('D5')" }
    });
  }

  if (state.mode === 'loading') return renderLoading();

  if (state.mode === 'empty' || !(preset.entities || []).length) {
    return noticeView({
      icon: '📖',
      title: `Hier entsteht euer ${t.canonNoun}`,
      text: `Aus dem, was ihr in ${t.meetings} schreibt. Markiere im ${t.meeting} einen Eintrag mit @ — er steht dann hier.`,
      actions: [{ label: `Ins ${t.meeting}`, onclick: "app.go('C1')", primary: true }]
    });
  }

  // Ein Artikel je Aufruf: der ausgewählte Eintrag (state.entry) oder der
  // ausgeschriebene Artikel des Presets — siehe utils/wikiArticle.js.
  const article = resolveArticle(preset, state.entry);

  return `
    <div style="display:flex;min-height:100%;align-items:stretch;position:relative">
      ${renderTree(preset, state, article)}
      ${renderArticle(preset, state, article)}
      ${renderOriginPanel(preset, state, article)}
    </div>
  `;
}
