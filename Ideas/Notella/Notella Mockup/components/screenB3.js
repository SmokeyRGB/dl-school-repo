// Screen B3: Arbeitsphasen im Projekt (Work Groups / Sprints)
// Shows detailed view of a single project with all work groups

import { tint, chipSt, markSt, avSt, segSt, createIcon } from '../utils/index.js';

export function renderScreenB3(preset, state) {
  const { t, d, types } = preset;
  
  return `
    <div style="min-height: 100%; background: #f4f4f2;">
      <!-- Header -->
      <div style="padding: 32px 40px 24px; border-bottom: 1px solid #e4e4e0; background: #fff;">
        <h1 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 600; line-height: 1.1; letter-spacing: -0.025em;">
          ${d.projectName}
        </h1>
        <div style="display: flex; gap: 16px; margin-top: 16px;">
          <button style="padding: 8px 16px; background: #5340c4; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">
            Neue Arbeitsphase
          </button>
          <button style="padding: 8px 16px; background: #e4e4e0; color: #16161a; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">
            Einstellungen
          </button>
        </div>
      </div>
      
      <!-- Content -->
      <div style="padding: 24px 40px; display: grid; gap: 24px;">
        <!-- Current WG -->
        <div>
          <h2 style="margin: 0 0 12px 0; font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase; color: #8b8d97;">
            Aktuelle Arbeitsphase
          </h2>
          <div style="padding: 20px; background: linear-gradient(135deg, #f9f8f6 0%, #f2f0fc 100%); border-radius: 11px; border: 1px solid #e4e4e0;">
            <h3 style="margin: 0 0 8px 0; font-size: 17px; font-weight: 600; color: #16161a;">
              ${d.wgName}
            </h3>
            <div style="font-size: 13px; color: #5a5c66; margin-bottom: 16px;">
              ${d.meetingDate}
            </div>
            <button onclick="app.go('C1')" style="padding: 8px 14px; background: #5340c4; color: #fff; border: none; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer;">
              Zum Meeting
            </button>
          </div>
        </div>
        
        <!-- All WGs -->
        <div>
          <h2 style="margin: 0 0 12px 0; font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase; color: #8b8d97;">
            Alle ${t.wgs.toLowerCase()}
          </h2>
          <div style="display: grid; gap: 12px;">
            ${[1, 2, 3, 4, 5].map((i) => `
              <div style="padding: 16px; background: #fff; border-radius: 9px; border: 1px solid #e4e4e0; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onmouseover="this.style.background='#f9f8f6'" onmouseout="this.style.background='#fff'">
                <div>
                  <div style="font-size: 14px; font-weight: 600; color: #16161a; margin-bottom: 4px;">
                    ${t.wgs.slice(0, -1)} ${i}
                  </div>
                  <div style="font-size: 12px; color: #8b8d97;">
                    ${i === 2 ? d.meetingDate : 'Vor ' + (i === 1 ? '2' : '1') + ' Wochen'}
                  </div>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 12px; color: #5a5c66; font-weight: 500;">
                    ${3 + i} Meetings
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
