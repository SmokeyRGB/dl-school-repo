// Screen E2: Kuration Phase 2 — Notizen durchsehen
// PRD §4.4.2.4b / Screen-Inventar E2. Neu mit E-18.
//
// Warum es diesen Bildschirm gibt: Man kann sich nicht darauf verlassen,
// dass Teilnehmende während eines Gesprächs sinnvoll taggen. Alles, was
// niemand markiert hat, würde das Projektwissen ohne diese Phase nie
// erreichen. Phase 1 ist der schnelle Normalfall, Phase 2 das Sicherheitsnetz.
//
// Die Notiz ist die Karte — chronologisch, eine nach der anderen,
// bildschirmfüllend statt als Liste mit Detailbereich.

import { renderNoteText, markCount, visLabel } from '../utils/index.js';
import { noticeView, errorView, skeletonBar, skeletonBox } from './stateViews.js';
import { renderCurationHeader, segmentBar, undoToast, shortcutFooter } from './curationHeader.js';

function renderLoading() {
  return `
    <div style="min-height:100%;display:flex;justify-content:center;padding:30px 26px;background:#fbfaf8">
      <div style="width:100%;max-width:720px">
        ${skeletonBar('200px', 14, 'margin-bottom:16px')}
        ${skeletonBox(`
          ${skeletonBar('35%', 10, 'margin-bottom:16px')}
          ${skeletonBar('100%', 16, 'margin-bottom:10px')}
          ${skeletonBar('94%', 16, 'margin-bottom:10px')}
          ${skeletonBar('58%', 16)}
        `)}
      </div>
    </div>
  `;
}

/**
 * Bilanz statt kahler Fläche (E-22).
 *
 * Die letzte Zahl ist die wichtigste: sie erkennt an, wie viel bereits im
 * Treffen markiert war, und schließt damit den Kreis zu C1 (E-23) — Taggen
 * im Gespräch macht genau diesen Durchgang kürzer.
 */
function renderBalance(preset, stats) {
  const { t } = preset;
  const rows = [
    [String(stats.reviewed), 'Notizen durchgesehen'],
    [String(stats.created), 'neue Einträge'],
    [String(stats.merged), 'zusammengeführt'],
    [String(stats.dismissed), 'abgelehnt / später']
  ];

  return `
    <div style="flex:1;display:flex;justify-content:center;padding:64px 44px">
      <div style="max-width:560px;width:100%">
        <span style="display:inline-block;font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:#8b8d97;margin-bottom:14px">Durchsicht beendet</span>
        <h2 style="margin:0;font-family:Spectral,Georgia,serif;font-size:25px;font-weight:500;letter-spacing:-.01em;line-height:1.25">Dieses ${t.meeting} ist durch</h2>
        <p style="margin:12px 0 0;font-size:14.5px;line-height:1.65;color:#5a5c66">Wo die Mühe sichtbar wird: im ${t.canonNoun} und im Netz.</p>

        <div style="display:flex;gap:26px;margin:24px 0 0;padding:18px 20px;background:#fff;border:1px solid #e8e7e2;border-radius:12px;flex-wrap:wrap">
          ${rows.map((r) => `
            <div>
              <div style="font-family:Spectral,Georgia,serif;font-size:26px;line-height:1">${r[0]}</div>
              <div style="font-size:12px;color:#5a5c66;margin-top:5px">${r[1]}</div>
            </div>
          `).join('')}
        </div>

        <p style="margin:14px 0 0;padding:12px 15px;background:#f2f6f3;border:1px solid #dfeae3;border-radius:10px;font-size:13px;color:#3f5a49;line-height:1.6">
          <strong style="font-weight:600">${stats.preTagged} davon waren schon im ${t.meeting} markiert.</strong>
          Diese Notizen waren in Sekunden erledigt — die übrigen mussten gelesen werden.
        </p>

        <div style="display:flex;gap:10px;margin-top:24px;flex-wrap:wrap">
          <button onclick="app.go('D2')" style="padding:10px 16px;border-radius:9px;background:#5340c4;color:#fff;font-size:13.5px;font-weight:500;border:none;cursor:pointer">Zum ${t.canonNoun}</button>
          <button onclick="app.go('D5')" style="padding:10px 16px;border-radius:9px;border:1px solid #dcdbd5;background:#fff;font-size:13.5px;cursor:pointer">Beziehungs-Graph ansehen</button>
          <button onclick="app.resetCuration()" style="padding:10px 16px;border-radius:9px;border:1px solid #dcdbd5;background:#fff;font-size:13.5px;cursor:pointer">Nochmal durchsehen</button>
        </div>
      </div>
    </div>
  `;
}

export function renderScreenE2(preset, state, curationMgr) {
  const { t, d } = preset;

  // Phase 2 ist ausschließlich für den Lead (Screen-Inventar E2): sie zeigt
  // alle Notizen des Treffens, auch die mit „Für mich" (E-16).
  if (state.role !== 'lead') {
    return noticeView({
      icon: '🔍',
      title: 'Die Durchsicht führt die Projektleitung',
      text: `Sie geht dabei alle Notizen des ${t.meetings} durch — auch die, die niemand markiert hat. Deine Vorschläge kannst du in der Vorschlagsliste mitverfolgen.`,
      actions: [{ label: 'Zu den Vorschlägen', onclick: "app.go('E1')", primary: true }]
    });
  }

  if (state.mode === 'error') {
    return errorView({
      icon: '🔍',
      title: 'Die Notizen konnten nicht geladen werden',
      text: `Nichts ist verloren gegangen: abgeschlossene Notizen bleiben abgeschlossen, die offenen warten weiter.`,
      fallback: { label: 'Zu den Vorschlägen', onclick: "app.go('E1')" }
    });
  }

  if (state.mode === 'loading') return renderLoading();

  const notes = state.mode === 'empty' ? [] : state.notes || [];
  const open = curationMgr.open(notes, state.closed);
  const closedCount = notes.length - open.length;
  const cards = preset.review || [];

  const head = (progress) => renderCurationHeader({
    preset,
    phase: 'E2',
    isLead: true,
    openCards: Math.max(0, cards.length - state.reviewIdx),
    openNotes: open.length,
    bar: segmentBar(notes.length, closedCount, closedCount),
    progress
  });

  const toast = undoToast(state.curationUndo, 'app.curationUndo()');

  if (!open.length) {
    return `
      <div style="min-height:100%;display:flex;flex-direction:column;background:#fbfaf8">
        ${head(`${notes.length} von ${notes.length}`)}
        ${renderBalance(preset, curationMgr.stats(notes, state, state.log))}
      </div>
      ${toast}
    `;
  }

  const idx = Math.min(state.noteIdx, open.length - 1);
  const note = open[idx];
  const marks = markCount(note);

  // In C1 sieht man den eigenen Strom, hier liest die Leitung das ganze
  // Treffen — deshalb steht der Autor an der Notiz. Ohne Angabe ist es die
  // Notiz der angemeldeten Person.
  const author = note.by || d.me;
  const initials = author.split(' ').map((w) => w[0]).join('');

  // Offene Vorschläge dieser Notiz erscheinen als Chip mit Umriss, bereits
  // bestätigte in Typfarbe. Im Mockup gelten die Erwähnungen der Notizen,
  // die in Phase 1 noch anstehen, als offen.
  const stillOpen = state.reviewIdx < cards.length;

  const keys = [
    { k: 'Enter', label: 'Abschließen und weiter' },
    { k: '← →', label: 'Eine Notiz zurück / vor' },
    { k: 'R', label: 'Beziehung anlegen' },
    { k: 'Z', label: 'Rückgängig' }
  ];

  return `
    <div style="min-height:100%;display:flex;flex-direction:column;background:#fbfaf8">
      ${head(`Notiz ${closedCount + 1} von ${notes.length}`)}

      <div style="flex:1;display:flex;justify-content:center;padding:34px 26px 90px">
        <div style="width:100%;max-width:720px">

          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:12px;color:#5a5c66">
            <span style="width:22px;height:22px;border-radius:50%;background:#e7e5f8;color:#4a3aad;font-size:10.5px;font-weight:600;display:flex;align-items:center;justify-content:center">${initials}</span>
            <span>${author}</span>
            <span style="color:#a3a3ab">·</span>
            <span>${note.at}</span>
            ${note.edited ? `<span style="color:#8b8d97">· bearbeitet</span>` : ''}
            ${note.late ? `<span style="color:#8a6a2f">· nachträglich ergänzt</span>` : ''}

            <!-- „Für mich"-Notizen erscheinen hier ebenfalls (E-16),
                 gekennzeichnet: die schreibende Person hatte sie nicht für
                 die Gruppe gedacht. Das ändert nichts am Umgang mit dem
                 Inhalt, wohl aber an dessen Gewichtung. -->
            ${note.vis === 'mine' ? `
              <span style="display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border-radius:999px;background:#fdf5e0;color:#7a6a45;font-size:11.5px">
                🔒 ${visLabel('mine')} — nicht für die Gruppe geschrieben
              </span>
            ` : ''}
            <span style="flex:1"></span>
            <span style="color:#8b8d97">${marks ? `${marks} markiert` : 'nichts markiert'}</span>
          </div>

          <!-- Die Notiz ist die Karte: vollständiger Text der neuesten
               Version, gut lesbar gesetzt. Lesen ist der Hauptzweck. -->
          <div style="margin-top:14px;padding:26px 28px;background:#fff;border:1px solid #e6e5e0;border-radius:14px">
            <p style="margin:0;font-family:Spectral,Georgia,serif;font-size:18px;line-height:1.8;color:#26262c">${renderNoteText(note.parts, preset, stillOpen)}</p>
          </div>

          <p style="margin:12px 2px 0;font-size:12px;color:#8b8d97;line-height:1.6">
            Text markieren, um Übersehenes zu typisieren — dieselbe Geste wie im ${t.meeting}.
            ${stillOpen ? 'Chips mit Umriss sind Vorschläge, über die noch nicht entschieden wurde.' : 'Alle Vorschläge dieser Notiz sind entschieden.'}
          </p>

          <div style="display:flex;align-items:center;gap:10px;margin-top:22px;flex-wrap:wrap">
            <button onclick="app.closeNote()" style="padding:11px 18px;border:none;border-radius:9px;background:#5340c4;color:#fff;font-size:13.5px;font-weight:500;cursor:pointer">Notiz abschließen</button>
            <button onclick="app.stepNote(1)" style="padding:11px 16px;border:1px solid #dcdbd5;border-radius:9px;background:#fff;font-size:13.5px;cursor:pointer">Überspringen</button>
            <span style="flex:1"></span>
            <span style="font-size:12px;color:#8b8d97">Aufhören ist erlaubt — der Stand bleibt erhalten.</span>
          </div>
        </div>
      </div>

      ${shortcutFooter(keys)}
    </div>
    ${toast}
  `;
}
