// Screen B1: Alle Projekte (All Projects landing page)
// Shows all projects the user belongs to, across presets
// Chrome: Start — no sidebar

import { tint, avSt } from '../utils/index.js';
import { errorView } from './stateViews.js';

export function renderScreenB1(preset, state) {
  const { t, d } = preset;
  const projects = preset.projects || [];
  const isEmpty = state.mode === 'empty';
  const isLoading = state.mode === 'loading';

  if (state.mode === 'error') {
    return errorView({
      icon: '📋',
      title: `Deine ${t.projects} konnten nicht geladen werden`,
      text: 'Die Liste ließ sich nicht abrufen. Es ist nichts verloren gegangen — beim nächsten Versuch ist alles wieder da.'
    });
  }

  // "Läuft gerade" banner — shows if a live meeting is active
  const liveProject = projects.find(p => p.live);

  const emptyState = `
    <div style="padding: 80px 44px; text-align: center; max-width: 480px; margin: 0 auto;">
      <div style="font-size: 32px; margin-bottom: 16px;">📋</div>
      <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 600; color: #16161a;">Noch keine ${t.projects}</h2>
      <p style="margin: 0 0 24px; font-size: 14px; color: #5a5c66; line-height: 1.6;">
        Hier stehen deine ${t.projects}. Zwei Wege führen zum ersten: du legst eines an, oder du wirst eingeladen.
      </p>
      <button onclick="app.go('B2')" style="padding: 10px 20px; background: #5340c4; color: #fff; border: none; border-radius: 9px; font-size: 13.5px; font-weight: 600; cursor: pointer;">
        ${t.project} anlegen
      </button>
    </div>
  `;

  const loadingState = `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(272px, 1fr)); gap: 16px; margin-top: 26px;">
      ${[1, 2, 3].map(() => `
        <div style="padding: 18px; background: #fff; border: 1px solid #e6e5e0; border-radius: 13px; animation: nshim 1.6s infinite;">
          <div style="height: 12px; background: #e4e4e0; border-radius: 6px; width: 40%; margin-bottom: 16px;"></div>
          <div style="height: 20px; background: #e4e4e0; border-radius: 6px; width: 75%; margin-bottom: 10px;"></div>
          <div style="height: 14px; background: #e4e4e0; border-radius: 6px; width: 55%;"></div>
        </div>
      `).join('')}
    </div>
  `;

  const projectCards = projects.map(p => {
    const isSoftware = p.preset === 'Software-Projekt';
    const badgeSt = isSoftware
      ? 'font-size:11px;padding:3px 8px;border-radius:6px;background:#e9f5f3;color:#1d6a5f'
      : 'font-size:11px;padding:3px 8px;border-radius:6px;background:#fdf1e3;color:#8a5a1f';
    const avatarHtml = (p.av || []).map((a, i) =>
      `<span style="${avSt(i)}">${a}</span>`
    ).join('');

    const cardPresetId = isSoftware ? 'software' : 'tabletop';

    return `
      <button onclick="app.setState({presetId:'${cardPresetId}', screen:'B3'})" style="display:block;width:100%;text-align:left;padding:18px;background:#fff;border:1px solid #e6e5e0;border-radius:13px;cursor:pointer;transition:border-color 160ms ease,transform 160ms ease;" onmouseover="this.style.borderColor='#c9c3ec';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='#e6e5e0';this.style.transform='none'">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="${badgeSt}">${p.preset}</span>
          <span style="flex:1;"></span>
          ${p.live ? `<span style="display:flex;align-items:center;gap:5px;font-size:11px;color:#5340c4"><span style="width:6px;height:6px;border-radius:50%;background:#5340c4;animation:npulse 1.8s ease-in-out infinite;flex:none;"></span>läuft</span>` : ''}
        </div>
        <div style="font-family:Spectral,Georgia,serif;font-size:20px;margin-top:12px;letter-spacing:-.01em;color:#16161a;">${p.name}</div>
        <div style="font-size:12.5px;color:#5a5c66;margin-top:6px;">${p.meta}</div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:16px;">
          <div style="display:flex;">${avatarHtml}</div>
          <span style="font-size:11.5px;color:#8b8d97;">${p.activity}</span>
        </div>
      </button>
    `;
  }).join('');

  const createCard = `
    <button onclick="app.go('B2')" style="display:flex;flex-direction:column;justify-content:center;gap:6px;padding:18px;width:100%;border:1px dashed #cfcec8;border-radius:13px;color:#5a5c66;min-height:158px;background:transparent;cursor:pointer;text-align:left;transition:border-color 160ms ease,color 160ms ease,background 160ms ease;" onmouseover="this.style.borderColor='#5340c4';this.style.color='#5340c4';this.style.background='#faf9fd'" onmouseout="this.style.borderColor='#cfcec8';this.style.color='#5a5c66';this.style.background='transparent'">
      <span style="font-size:22px;line-height:1;">+</span>
      <span style="font-size:13.5px;font-weight:500;">${t.project} anlegen</span>
      <span style="font-size:12px;color:#8b8d97;">Preset wählen und loslegen</span>
    </button>
  `;

  return `
    <div style="padding:38px 44px 64px;max-width:1060px;">
      <span style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#8b8d97;">Start</span>
      <h1 style="margin:8px 0 0;font-family:Spectral,Georgia,serif;font-size:31px;font-weight:500;letter-spacing:-.015em;">Alle ${t.projects}</h1>
      <p style="margin:8px 0 0;font-size:14px;color:#5a5c66;">Wo geht es gerade weiter?</p>

      ${liveProject && !isEmpty && !isLoading ? `
        <div style="margin-top:26px;padding:18px 20px;border:1px solid #cec7ef;background:#f7f5fe;border-radius:13px;display:flex;align-items:center;gap:18px;">
          <span style="width:9px;height:9px;border-radius:50%;background:#5340c4;animation:npulse 1.8s ease-in-out infinite;flex:none;"></span>
          <div style="min-width:0;">
            <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#5340c4;">Läuft gerade</div>
            <div style="font-size:16px;font-weight:600;margin-top:4px;letter-spacing:-.01em;">${d.meetingTitle}</div>
            <div style="font-size:12.5px;color:#5a5c66;margin-top:3px;">${d.projectName} › ${d.wgName} · seit ${d.minutes} min</div>
          </div>
          <span style="flex:1;"></span>
          <button onclick="app.go('C1')" style="padding:10px 17px;border-radius:9px;background:#5340c4;color:#fff;font-size:13.5px;font-weight:500;border:none;cursor:pointer;">Einsteigen</button>
        </div>
      ` : ''}

      ${isEmpty ? emptyState : isLoading ? loadingState : `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(272px,1fr));gap:16px;margin-top:26px;">
          ${projectCards}
          ${createCard}
        </div>
      `}
    </div>
  `;
}

