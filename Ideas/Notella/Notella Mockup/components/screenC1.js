// Screen C1: Meeting notes (Meeting Editor)
// Interactive editor with mention detection, AI suggestions, and live entity graph

import { tint, chipSt, markSt, avSt, segSt, createIcon } from '../utils/index.js';
import { checkMention, analyzeAi, insertMention, acceptAi } from '../utils/index.js';

export function renderScreenC1(preset, state) {
  const { t, d, types } = preset;
  
  return `
    <div style="min-height: 100%; background: #f4f4f2; display: flex;">
      <!-- Main Content -->
      <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: auto;">
        <!-- Header -->
        <div style="flex: none; padding: 32px 40px 24px; border-bottom: 1px solid #e4e4e0; background: #fff;">
          <h1 style="margin: 0 0 12px 0; font-size: 28px; font-weight: 600; line-height: 1.1; letter-spacing: -0.025em;">
            ${d.meetingTitle}
          </h1>
          <div style="font-size: 13.5px; color: #5a5c66; line-height: 1.5;">
            ${d.meetingDate} · ${d.minutes} Min
          </div>
        </div>
        
        <!-- Editor -->
        <div style="flex: 1; overflow: auto; background: #fff; margin: 24px 40px 24px 40px; border-radius: 11px; border: 1px solid #e4e4e0;">
          <div style="padding: 24px; font-size: 14px; line-height: 1.7; color: #16161a; min-height: 300px;">
            <p style="margin: 0 0 12px 0;">
              <strong style="color: #5340c4;">@${d.leadName}</strong> leitet ein Brainstorming zu neuen Features ein.
            </p>
            <p style="margin: 0 0 12px 0;">
              Hauptpunkte:
            </p>
            <ul style="margin: 0 0 12px 0; padding-left: 20px;">
              <li>Benutzeroberfläche verbessern</li>
              <li>Performance-Optimierungen</li>
              <li>Datensicherheit erhöhen</li>
              <li>Dokumentation aktualisieren</li>
            </ul>
            <p style="margin: 0 0 12px 0;">
              <mark style="background: ${tint('#fff000', 0.3)}; border-radius: 3px; padding: 2px 4px;">
                <span style="font-weight: 600; color: #a07a00;">🤖 AI-Vorschlag:</span> Könnten die neuen Features im nächsten Sprint implementiert werden?
              </mark>
            </p>
            <p style="margin: 0;">
              <strong>Vereinbarte Nächste Schritte:</strong>
            </p>
            <ul style="margin: 8px 0 0 0; padding-left: 20px;">
              <li>Prototyp bis Freitag fertigstellen</li>
              <li>Feedback-Runde mit Stakeholder</li>
            </ul>
          </div>
        </div>
        
        <!-- Entity Types Bar -->
        <div style="flex: none; padding: 16px 40px 24px; display: flex; gap: 12px; flex-wrap: wrap;">
          ${types.map(type => `
            <div style="padding: 6px 12px; background: #fff; border: 1px solid ${tint(type.color, 0.3)}; border-radius: 7px; font-size: 12px; font-weight: 600; color: ${type.color};">
              ${type.label} (${type.count})
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Right Sidebar (Entity Explorer) -->
      <div style="flex: none; width: 320px; border-left: 1px solid #e4e4e0; background: #fff; display: flex; flex-direction: column; overflow: hidden;">
        <div style="padding: 16px; border-bottom: 1px solid #e4e4e0;">
          <h3 style="margin: 0; font-size: 13px; font-weight: 600; color: #16161a;">
            Entitäten (${types.reduce((sum, t) => sum + t.count, 0)})
          </h3>
        </div>
        
        <!-- Entity List -->
        <div style="flex: 1; overflow-y: auto; padding: 12px 0;">
          ${types.map(type => `
            <div style="padding: 0; border-top: 1px solid #e4e4e0;">
              <div style="padding: 10px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #8b8d97; background: #f9f8f6; font-weight: 600;">
                ${type.label}
              </div>
              <div style="padding: 6px;">
                ${[1, 2, 3].map(i => `
                  <div style="padding: 8px 12px; margin: 0 6px; border-radius: 7px; background: ${tint(type.color, 0.1)}; color: ${type.color}; font-size: 12px; font-weight: 500; cursor: pointer;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
                    ${type.label} ${i}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
