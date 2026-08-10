// Screen B3: Projekt-Dashboard (Project Overview)
// Shows the active work group and all work groups for the current project
// Chrome: Orient — sidebar always expanded

import { tint, avSt } from '../utils/index.js';

export function renderScreenB3(preset, state) {
  const { t, d, wgs, types } = preset;
  const isLead = state.role === 'lead';

  const activeWg = wgs.find(w => w.live) || wgs[0];

  const wgCards = wgs.map(w => {
    const isLive = w.live;
    const pill = isLive ? 'läuft' : (w.meetings.some(m => m[1] === 'geplant') ? 'geplant' : 'beendet');
    const pillSt = isLive
      ? 'font-size:11px;padding:3px 9px;border-radius:999px;background:#efecfb;color:#4a3aad'
      : pill === 'geplant'
        ? 'font-size:11px;padding:3px 9px;border-radius:999px;background:#f3f1ea;color:#7a6a45'
        : 'font-size:11px;padding:3px 9px;border-radius:999px;background:#f2f1ed;color:#8b8d97';
    const borderColor = isLive ? '#cec7ef' : '#e6e5e0';
    const meetingCount = w.meetings.length;
    const avatars = (w.av || []).map((a, i) => `<span style="${avSt(i)}">${a}</span>`).join('');

    return `
      <div onclick="app.go('C1')" style="padding:17px 18px;background:#fff;border:1px solid ${borderColor};border-radius:13px;cursor:pointer;transition:border-color 160ms ease,transform 160ms ease;" onmouseover="this.style.borderColor='#c9c3ec';this.style.transform='translateY(-1px)'" onmouseout="this.style.borderColor='${borderColor}';this.style.transform='none'">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <div style="font-size:16px;font-weight:600;color:#16161a;flex:1;letter-spacing:-.01em;">${w.name}</div>
          <span style="${pillSt}">${pill}</span>
        </div>
        <div style="font-size:12.5px;color:#5a5c66;margin-bottom:14px;">${meetingCount} ${t.meetings} · ${w.meetings.filter(m => m[1] !== 'beendet').length} offen</div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;">${avatars}</div>
          <button onclick="event.stopPropagation();app.go('C1')" style="padding:7px 13px;border-radius:8px;${isLive ? 'background:#5340c4;color:#fff;' : 'border:1px solid #dcdbd5;background:#fff;color:#16161a;'}font-size:12.5px;font-weight:500;border-width:${isLive ? '0' : '1px'};cursor:pointer;">
            ${isLive ? 'Einsteigen' : 'Öffnen'}
          </button>
        </div>
      </div>
    `;
  }).join('');

  const typeStats = types.map(ty => `
    <div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid #f4f4f2;">
      <div style="width:8px;height:8px;border-radius:2px;background:${ty.color};flex:none;"></div>
      <div style="font-size:13px;color:#3f4048;flex:1;">${ty.label}</div>
      <div style="font-size:13px;font-weight:600;color:#16161a;">${ty.count}</div>
    </div>
  `).join('');

  return `
    <div style="min-height:100%;background:#f4f4f2;">
      <!-- Header -->
      <div style="padding:32px 40px 24px;border-bottom:1px solid #e4e4e0;background:#fff;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;">
          <div>
            <h1 style="margin:0 0 6px;font-size:28px;font-weight:600;line-height:1.1;letter-spacing:-.025em;">${d.projectName}</h1>
            <p style="margin:0;font-size:13.5px;color:#5a5c66;">${d.projectDesc}</p>
          </div>
          ${isLead ? `
            <div style="display:flex;gap:10px;flex:none;">
              <button style="padding:8px 16px;background:#5340c4;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">
                ${t.wg} anlegen
              </button>
              <button onclick="app.go('F3')" style="padding:8px 16px;background:#f4f4f2;color:#16161a;border:1px solid #e4e4e0;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;">
                Einstellungen
              </button>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Content -->
      <div style="padding:28px 40px;display:grid;grid-template-columns:1fr 260px;gap:28px;align-items:start;max-width:1100px;">
        <!-- Left: Work groups -->
        <div>
          ${activeWg ? `
            <div style="margin-bottom:24px;">
              <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8b8d97;margin-bottom:10px;">Aktive ${t.wg}</div>
              <div style="padding:20px;background:linear-gradient(135deg,#f9f8f6 0%,#f2f0fc 100%);border-radius:13px;border:1px solid #cec7ef;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                  <span style="width:8px;height:8px;border-radius:50%;background:#5340c4;animation:npulse 1.8s ease-in-out infinite;flex:none;"></span>
                  <h3 style="margin:0;font-size:17px;font-weight:600;color:#16161a;">${activeWg.name}</h3>
                </div>
                <div style="font-size:13px;color:#5a5c66;margin-bottom:16px;">${d.meetingDate} · ${activeWg.meetings.length} ${t.meetings}</div>
                <button onclick="app.go('C1')" style="padding:8px 14px;background:#5340c4;color:#fff;border:none;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;">
                  Zum ${t.meeting} →
                </button>
              </div>
            </div>
          ` : ''}

          <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8b8d97;margin-bottom:10px;">Alle ${t.wgs}</div>
          <div style="display:grid;gap:12px;">
            ${wgCards}
          </div>
        </div>

        <!-- Right: Wissen summary -->
        <div>
          <div style="background:#fff;border:1px solid #e6e5e0;border-radius:13px;padding:18px;">
            <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8b8d97;margin-bottom:12px;">${t.canonNoun}</div>
            ${typeStats}
            <button onclick="app.go('D2')" style="margin-top:14px;width:100%;padding:8px;background:#f4f4f2;color:#5340c4;border:none;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;text-align:center;">
              Alle Einträge →
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

