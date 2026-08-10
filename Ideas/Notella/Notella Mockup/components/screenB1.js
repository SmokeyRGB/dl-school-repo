// Screen B1: Alle Projekte (All Projects)
// Shows a list of work groups within the project with type counts

import { tint, chipSt, markSt, avSt, segSt, createIcon } from '../utils/index.js';

export function renderScreenB1(preset, state) {
  const { t, d, types } = preset;
  const isLoading = state.mode === 'loading';
  const isEmpty = state.mode === 'empty';
  
  if (isEmpty) {
    return `
      <div style="padding: 60px 40px; text-align: center;">
        <div style="font-size: 14px; color: #5a5c66; margin-top: 20px;">
          Keine ${t.wgs.toLowerCase()} vorhanden
        </div>
      </div>
    `;
  }
  
  const wgs = [
    { id: 'wg1', name: 'Sprint 12', date: 'Vor 2 Wochen', active: false },
    { id: 'wg2', name: d.wgName, date: 'Aktuelle Woche', active: true },
    { id: 'wg3', name: 'Sprint 15', date: 'Nächste Woche', active: false },
  ];
  
  let html = `
    <div style="min-height: 100%; background: #f4f4f2;">
      <!-- Header -->
      <div style="padding: 32px 40px 24px; border-bottom: 1px solid #e4e4e0; background: #fff;">
        <h1 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 600; line-height: 1.1; letter-spacing: -0.025em;">
          ${d.projectName}
        </h1>
        <p style="margin: 0; font-size: 13.5px; color: #5a5c66; line-height: 1.5;">
          ${d.projectDesc}
        </p>
      </div>
      
      <!-- Content -->
      <div style="padding: 24px 40px;">
  `;
  
  if (isLoading) {
    // Skeleton loading state
    html += `
      <div style="display: grid; gap: 12px;">
        ${[1,2,3].map(() => `
          <div style="padding: 16px; background: #fff; border-radius: 9px; border: 1px solid #e4e4e0; animation: nshim 1.6s infinite;">
            <div style="height: 20px; background: #e4e4e0; border-radius: 6px; margin-bottom: 8px;"></div>
            <div style="height: 14px; background: #e4e4e0; border-radius: 6px; width: 60%;"></div>
          </div>
        `).join('')}
      </div>
    `;
  } else {
    // Normal state with work groups
    html += `
      <div style="display: grid; gap: 12px;">
        ${wgs.map(wg => `
          <div style="padding: 16px; background: #fff; border-radius: 9px; border: 1px solid #e4e4e0; cursor: pointer; transition: all 120ms ease; display: flex; justify-content: space-between; align-items: center;" onmouseover="this.style.background='#f9f8f6'" onmouseout="this.style.background='#fff'">
            <div>
              <div style="font-size: 14px; font-weight: 600; color: #16161a; margin-bottom: 4px;">
                ${wg.name}
              </div>
              <div style="font-size: 12px; color: #8b8d97;">
                ${wg.date}${wg.active ? ' · <span style="color: #2fb8a0; font-weight: 600;">Aktiv</span>' : ''}
              </div>
            </div>
            <div style="display: flex; gap: 8px;">
              ${types.slice(0, 3).map(type => `
                <div style="padding: 4px 8px; border-radius: 6px; background: ${tint(type.color, 0.1)}; font-size: 11px; color: ${type.color}; font-weight: 600;">
                  ${type.count}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  html += `
      </div>
    </div>
  `;
  
  return html;
}
