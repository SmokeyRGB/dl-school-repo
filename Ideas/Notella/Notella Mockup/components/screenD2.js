// Screen D2: Entity Details
// Shows detailed view of a selected entity with relations and metadata

import { tint, chipSt, markSt, avSt, segSt, createIcon } from '../utils/index.js';

export function renderScreenD2(preset, state) {
  const { t, d, types } = preset;
  const entityType = types[0];
  
  return `
    <div style="min-height: 100%; background: #f4f4f2; display: flex;">
      <!-- Main Content -->
      <div style="flex: 1; min-width: 0; overflow: auto;">
        <div style="padding: 32px 40px;">
          <!-- Header -->
          <div style="margin-bottom: 32px;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <span style="width: 40px; height: 40px; border-radius: 9px; background: ${tint(entityType.color, 0.2)}; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                🏷️
              </span>
              <div>
                <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #16161a;">
                  ${entityType.label} Alpha
                </h1>
                <p style="margin: 4px 0 0 0; font-size: 13px; color: #5a5c66;">
                  Erstellt vor 3 Tagen · 2 Relationen
                </p>
              </div>
            </div>
          </div>
          
          <!-- Properties -->
          <div style="background: #fff; border-radius: 11px; border: 1px solid #e4e4e0; padding: 24px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #16161a;">
              Eigenschaften
            </h2>
            <div style="display: grid; gap: 16px;">
              <div>
                <label style="display: block; font-size: 12px; font-weight: 600; color: #8b8d97; margin-bottom: 6px;">
                  Name
                </label>
                <div style="font-size: 14px; color: #16161a;">
                  ${entityType.label} Alpha
                </div>
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 600; color: #8b8d97; margin-bottom: 6px;">
                  Beschreibung
                </label>
                <div style="font-size: 13.5px; color: #5a5c66; line-height: 1.6;">
                  Eine detaillierte Beschreibung dieser ${entityType.label.toLowerCase()} mit Kontext und Bedeutung.
                </div>
              </div>
              <div>
                <label style="display: block; font-size: 12px; font-weight: 600; color: #8b8d97; margin-bottom: 6px;">
                  Typ
                </label>
                <div style="display: inline-block; padding: 6px 12px; background: ${tint(entityType.color, 0.1)}; color: ${entityType.color}; font-size: 12px; font-weight: 600; border-radius: 7px;">
                  ${entityType.label}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Relations -->
          <div style="background: #fff; border-radius: 11px; border: 1px solid #e4e4e0; padding: 24px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #16161a;">
              Relationen
            </h2>
            <div style="display: grid; gap: 12px;">
              ${[
                { label: 'Verbunden mit', entity: 'Component Beta', icon: '🔗' },
                { label: 'Abhängig von', entity: 'Decision Gamma', icon: '⬅️' },
              ].map(rel => `
                <div style="padding: 12px; background: #f9f8f6; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onmouseover="this.style.background='#f2f0fc'" onmouseout="this.style.background='#f9f8f6'">
                  <div>
                    <div style="font-size: 11px; color: #8b8d97; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                      ${rel.label}
                    </div>
                    <div style="font-size: 13px; font-weight: 600; color: #16161a;">
                      ${rel.entity}
                    </div>
                  </div>
                  <span style="font-size: 16px;">${rel.icon}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Mentions in Meetings -->
          <div style="background: #fff; border-radius: 11px; border: 1px solid #e4e4e0; padding: 24px;">
            <h2 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #16161a;">
              Erwähnt in Meetings (${2})
            </h2>
            <div style="display: grid; gap: 10px;">
              ${[d.meetingTitle, 'Sprint-Review KW 31'].map(meeting => `
                <div style="padding: 12px; background: #f9f8f6; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" onmouseover="this.style.background='#f2f0fc'" onmouseout="this.style.background='#f9f8f6'">
                  <span style="font-size: 13px; color: #16161a; font-weight: 500;">
                    ${meeting}
                  </span>
                  <span style="color: #c2c2ca;">›</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Sidebar (Summary) -->
      <div style="flex: none; width: 300px; border-left: 1px solid #e4e4e0; background: #fff; padding: 24px; display: flex; flex-direction: column;">
        <h3 style="margin: 0 0 16px 0; font-size: 13px; font-weight: 600; color: #16161a;">
          Übersicht
        </h3>
        
        <div style="display: grid; gap: 16px; font-size: 13px;">
          <div>
            <div style="color: #8b8d97; margin-bottom: 6px; font-weight: 500;">Status</div>
            <div style="color: #2fb8a0; font-weight: 600;">Aktiv</div>
          </div>
          
          <div>
            <div style="color: #8b8d97; margin-bottom: 6px; font-weight: 500;">Ersteller</div>
            <div style="color: #16161a; font-weight: 600;">${d.leadFull}</div>
          </div>
          
          <div>
            <div style="color: #8b8d97; margin-bottom: 6px; font-weight: 500;">Erstellt am</div>
            <div style="color: #5a5c66;">15. Juli 2026</div>
          </div>
          
          <div>
            <div style="color: #8b8d97; margin-bottom: 6px; font-weight: 500;">Zuletzt bearbeitet</div>
            <div style="color: #5a5c66;">Vor 4 Stunden</div>
          </div>
        </div>
        
        <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid #e4e4e0; display: flex; gap: 8px;">
          <button style="flex: 1; padding: 8px 12px; border: 1px solid #e4e4e0; background: #fff; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer;">
            Bearbeiten
          </button>
          <button style="flex: 1; padding: 8px 12px; border: 1px solid #e4e4e0; background: #fff; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer;">
            Löschen
          </button>
        </div>
      </div>
    </div>
  `;
}
