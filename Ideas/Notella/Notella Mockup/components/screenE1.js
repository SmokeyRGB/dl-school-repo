// Screen E1: Review / Decision Workflow
// Shows the curation and review process with decide/undoLast/ready workflow

import { tint, chipSt, markSt, avSt, segSt, createIcon } from '../utils/index.js';
import { ReviewManager } from '../utils/index.js';

export function renderScreenE1(preset, state, reviewMgr) {
  const { t, d, types } = preset;
  const isLead = state.role === 'lead';
  
  // Sample review items
  const pendingItems = [
    { id: 1, entity: 'Component Beta', type: 'component', decision: null, created: '10 Min' },
    { id: 2, entity: 'Risk: Performance', type: 'risk', decision: null, created: '25 Min' },
    { id: 3, entity: 'Task: Documentation', type: 'task', decision: null, created: '1 Std' },
  ];
  
  const decidedItems = [
    { id: 4, entity: 'Decision: Auth Strategy', type: 'decision', decision: 'ACCEPT', created: '2 Std' },
    { id: 5, entity: 'Component Alpha', type: 'component', decision: 'ACCEPT', created: '3 Std' },
    { id: 6, entity: 'Risk: Security', type: 'risk', decision: 'REJECT', created: '4 Std' },
  ];
  
  return `
    <div style="min-height: 100%; background: #f4f4f2; display: flex;">
      <!-- Main Content -->
      <div style="flex: 1; min-width: 0; overflow: auto;">
        <div style="padding: 32px 40px;">
          <!-- Header -->
          <div style="margin-bottom: 32px;">
            <h1 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 600; color: #16161a;">
              ${t.canonNoun} kuratieren
            </h1>
            <p style="margin: 0; font-size: 13.5px; color: #5a5c66; line-height: 1.5;">
              Entscheidungen treffen für ${pendingItems.length + decidedItems.length} Entitäten aus diesem ${t.meeting.toLowerCase()}
            </p>
          </div>
          
          <!-- Progress Bar -->
          <div style="margin-bottom: 32px; padding: 20px; background: linear-gradient(135deg, #f0f7ff 0%, #f0f0ff 100%); border-radius: 11px; border: 1px solid #e4e4e0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-size: 14px; font-weight: 600; color: #16161a;">
                Fortschritt
              </span>
              <span style="font-size: 13px; color: #5a5c66;">
                ${decidedItems.length} von ${pendingItems.length + decidedItems.length} abgeschlossen
              </span>
            </div>
            <div style="width: 100%; height: 8px; background: #e4e4e0; border-radius: 4px; overflow: hidden;">
              <div style="width: ${(decidedItems.length / (pendingItems.length + decidedItems.length)) * 100}%; height: 100%; background: linear-gradient(90deg, #5340c4, #2fb8a0); transition: width 300ms ease;"></div>
            </div>
          </div>
          
          <!-- Pending Review -->
          <div style="margin-bottom: 32px;">
            <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #16161a;">
              Ausstehend (${pendingItems.length})
            </h2>
            <div style="display: grid; gap: 12px;">
              ${pendingItems.map((item, idx) => {
                const itemType = types.find(t => t.key === item.type);
                return `
                  <div style="padding: 16px 20px; background: #fff; border-radius: 9px; border: 2px solid #e4e4e0; display: flex; justify-content: space-between; align-items: center; transition: all 120ms ease;">
                    <div style="display: flex; gap: 12px; align-items: center;">
                      <span style="width: 12px; height: 12px; border-radius: 50%; background: ${itemType.color};"></span>
                      <div>
                        <div style="font-size: 14px; font-weight: 600; color: #16161a;">
                          ${item.entity}
                        </div>
                        <div style="font-size: 12px; color: #8b8d97;">
                          ${item.created}
                        </div>
                      </div>
                    </div>
                    ${isLead ? `
                      <div style="display: flex; gap: 8px;">
                        <button style="padding: 6px 14px; background: #2fb8a0; color: #fff; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
                          ✓ Accept
                        </button>
                        <button style="padding: 6px 14px; background: #c8553d; color: #fff; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
                          ✗ Reject
                        </button>
                      </div>
                    ` : `
                      <div style="font-size: 12px; color: #8b8d97; font-weight: 500;">
                        Wartet auf Entscheidung
                      </div>
                    `}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          
          <!-- Decided Items -->
          <div>
            <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #16161a;">
              Entschieden (${decidedItems.length})
            </h2>
            <div style="display: grid; gap: 12px;">
              ${decidedItems.map((item) => {
                const itemType = types.find(t => t.key === item.type);
                const isAccepted = item.decision === 'ACCEPT';
                return `
                  <div style="padding: 16px 20px; background: #fff; border-radius: 9px; border: 1px solid #e4e4e0; display: flex; justify-content: space-between; align-items: center; opacity: 0.85;">
                    <div style="display: flex; gap: 12px; align-items: center;">
                      <span style="width: 12px; height: 12px; border-radius: 50%; background: ${itemType.color};"></span>
                      <div>
                        <div style="font-size: 14px; font-weight: 600; color: #16161a;">
                          ${item.entity}
                        </div>
                        <div style="font-size: 12px; color: #8b8d97;">
                          ${item.created}
                        </div>
                      </div>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                      <span style="font-size: 11px; font-weight: 600; color: ${isAccepted ? '#2fb8a0' : '#c8553d'}; text-transform: uppercase; letter-spacing: 0.04em;">
                        ${item.decision}
                      </span>
                      <span style="font-size: 16px; opacity: 0.6;">
                        ${isAccepted ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Sidebar (Stats) -->
      <div style="flex: none; width: 280px; border-left: 1px solid #e4e4e0; background: linear-gradient(180deg, #fafafa 0%, #f4f4f2 100%); padding: 24px; display: flex; flex-direction: column;">
        <h3 style="margin: 0 0 20px 0; font-size: 13px; font-weight: 600; color: #16161a;">
          Statistiken
        </h3>
        
        <div style="display: grid; gap: 16px; margin-bottom: 32px;">
          ${[
            { label: 'Ausstehend', value: pendingItems.length, color: '#a3a3ab' },
            { label: 'Akzeptiert', value: decidedItems.filter(i => i.decision === 'ACCEPT').length, color: '#2fb8a0' },
            { label: 'Abgelehnt', value: decidedItems.filter(i => i.decision === 'REJECT').length, color: '#c8553d' },
          ].map(stat => `
            <div>
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #8b8d97; font-weight: 600; margin-bottom: 6px;">
                ${stat.label}
              </div>
              <div style="font-size: 24px; font-weight: 600; color: ${stat.color};">
                ${stat.value}
              </div>
            </div>
          `).join('')}
        </div>
        
        <!-- Actions -->
        ${isLead ? `
          <div style="display: grid; gap: 8px; margin-top: auto;">
            <button style="width: 100%; padding: 10px; background: #5340c4; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">
              Alle kuratieren
            </button>
            <button style="width: 100%; padding: 10px; background: #fff; border: 1px solid #e4e4e0; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">
              In Fokus legen
            </button>
          </div>
        ` : `
          <div style="padding: 12px; background: #e4e4e0; border-radius: 8px; text-align: center; font-size: 12px; color: #5a5c66;">
            Nur der Lead kann Entscheidungen treffen
          </div>
        `}
      </div>
    </div>
  `;
}
