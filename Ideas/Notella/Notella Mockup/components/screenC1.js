// Screen C1: Meeting-Raum — der Notizblock
// Der wichtigste Bildschirm: schreiben, ohne im Schreiben unterbrochen zu
// werden. PRD §4.4.1 / Screen-Inventar C1.
//
// Eine Notiz ist ein einzelner Eintrag, kein Dokument je Treffen (E-14):
// schreiben → abschicken → nächste Notiz. Eine abgeschickte Notiz ist
// unveränderlich; Bearbeiten erzeugt intern eine neue Version, sichtbar ist
// davon nur die Markierung „bearbeitet" (E-15). Kein Versionswähler, keine
// Historie — die gibt es in der Kuration und im Wiki (E-17).
//
// Aufbau: eine zentrierte Spalte. Der Bildschirm ist die Schreibfläche;
// Team-Notizen kommen ausschließlich in der Schublade (C4, E-27).

import {
  avSt,
  VISIBILITIES,
  visLabel,
  composerVis,
  renderNoteText,
  markCount,
  noteBalance
} from '../utils/index.js';
import { skeletonBar } from './stateViews.js';
import { renderDrawer } from './drawer.js';

/* -------------------------------------------------------------------------
   Notizstrom
   ------------------------------------------------------------------------- */

/** Zurückhaltende Markierung am Fuß einer Notiz. */
function noteTag(text, color = '#8b8d97') {
  return `<span style="font-size:11.5px;color:${color}">${text}</span>`;
}

/**
 * Eine Notiz im Strom. Ein Klick macht sie an Ort und Stelle bearbeitbar —
 * für die schreibende Person fühlt sich das wie normales Bearbeiten an.
 */
function renderNote(note, preset, state) {
  const marks = markCount(note);
  const editing = state.editingId === note.id;

  if (editing) {
    return `
      <div style="padding:13px 15px;margin:0 -15px;border:1px solid #cec7ef;border-radius:11px;background:#fdfdff">
        <div id="c1-edit" contenteditable="true"
          oninput="app.onEditorInput(event)" onkeydown="app.onNoteEditKeyDown(event, '${note.id}')"
          style="font-size:15px;line-height:1.7;outline:none" spellcheck="false">${renderNoteText(note.parts, preset)}</div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:10px">
          <button onclick="app.saveEdit('${note.id}')" style="padding:6px 12px;border:none;border-radius:8px;background:#5340c4;color:#fff;font-size:12.5px;font-weight:500;cursor:pointer">Übernehmen</button>
          <button onclick="app.cancelEdit()" style="padding:6px 12px;border:1px solid #dcdbd5;border-radius:8px;background:#fff;font-size:12.5px;cursor:pointer">Abbrechen</button>
          <span style="flex:1"></span>
          <span style="font-size:11.5px;color:#8b8d97">Enter übernimmt · Esc bricht ab</span>
        </div>
      </div>
    `;
  }

  const tags = [
    noteTag(note.at),
    // Sichtbarkeit als Wort, nie nur Farbe oder Symbol (PRD §4.4.1)
    `<button onclick="app.cycleNoteVis('${note.id}')" title="Sichtbarkeit umstellen"
       style="font-size:11.5px;border:none;background:transparent;padding:0;cursor:pointer;color:${note.vis === 'mine' ? '#8a6a2f' : '#4a3aad'}">${visLabel(note.vis)}</button>`,
    ...(marks ? [noteTag(`${marks} markiert`, '#5a8f6f')] : []),
    ...(note.edited ? [noteTag('bearbeitet')] : []),
    ...(note.late ? [noteTag('nachträglich ergänzt', '#8a6a2f')] : []),
    // Der Fehlerfall lässt die Notiz stehen und kennzeichnet sie nur
    // (Screen-Inventar C1) — nichts geht verloren.
    ...(note.unsent ? [noteTag('nicht gesendet · wird übertragen', '#8a3a27')] : [])
  ];

  return `
    <div onclick="app.startEdit('${note.id}')"
      style="padding:13px 15px;margin:0 -15px;border-radius:11px;cursor:text;transition:background 120ms ease"
      onmouseover="this.style.background='#faf9f7'" onmouseout="this.style.background='transparent'">
      <p style="margin:0;font-size:15px;line-height:1.7;color:#26262c">${renderNoteText(note.parts, preset)}</p>
      <div style="display:flex;align-items:center;gap:12px;margin-top:7px;flex-wrap:wrap">${tags.join('')}</div>
    </div>
  `;
}

/** Skeleton in der Form des erwarteten Inhalts — nie ein leeres Rechteck. */
function renderStreamLoading() {
  return [88, 64, 92].map((w) => `
    <div style="padding:13px 0;animation:nshim 1.6s infinite">
      ${skeletonBar('100%', 12, 'margin-bottom:7px')}
      ${skeletonBar(w + '%', 12, 'margin-bottom:10px')}
      ${skeletonBar('96px', 9)}
    </div>
  `).join('');
}

/**
 * Der Strom zeigt ausschließlich die **eigenen** Notizen (PRD §4.4.1).
 * Notizen mit `by` stammen von anderen und erscheinen nur in der Schublade
 * (wenn „Für Team") und in der Durchsicht der Leitung (E2, alle).
 */
export function ownNotes(notes) {
  return (notes || []).filter((note) => !note.by);
}

function renderStream(preset, state, sameMeeting) {
  // Der Verfasser ist sofort bedienbar; der Strom lädt darüber nach
  // (Screen-Inventar C1, Zustand „Laden").
  if (state.mode === 'loading') return renderStreamLoading();

  // Die Demonotizen gehören zum laufenden Treffen. Ein anderes Treffen
  // zeigt seinen Zustand, aber nicht dessen Notizen — sonst stünde
  // derselbe Strom unter jedem Titel.
  const notes = state.mode === 'empty' || !sameMeeting ? [] : ownNotes(state.notes);

  if (!notes.length) {
    return `
      <p style="margin:0;padding:28px 0;font-size:14px;color:#8b8d97;line-height:1.65">
        Noch keine Notiz. Schreib den ersten Gedanken auf — er muss nicht perfekt sein.
      </p>
    `;
  }

  return `<div style="display:grid;gap:4px">${notes.map((n) => renderNote(n, preset, state)).join('')}</div>`;
}

/* -------------------------------------------------------------------------
   Verfasser
   ------------------------------------------------------------------------- */

function renderComposer(preset, state, meeting) {
  const { t, d } = preset;

  // Zustand „geplant": gesperrt, aber mit Begründung — kein toter Knopf.
  if (meeting.planned) {
    return `
      <div style="flex:none;padding:18px 20px;border-top:1px solid #e6e5e0;background:#faf9f7;text-align:center">
        <p style="margin:0;font-size:13.5px;color:#8b8d97;line-height:1.6">
          Der Notizblock öffnet sich, sobald ${d.leadFull} das ${t.meeting} startet.
        </p>
      </div>
    `;
  }

  const active = composerVis(preset, state);
  const segHtml = VISIBILITIES.map((v) => {
    const on = v.key === active;
    return `
      <button onclick="app.setComposerVis('${v.key}')"
        style="display:flex;align-items:center;gap:5px;padding:4px 11px;border:none;border-radius:7px;font-size:12px;cursor:pointer;
               background:${on ? '#fff' : 'transparent'};color:${on ? '#16161a' : '#8b8d97'};
               font-weight:${on ? '600' : '400'};box-shadow:${on ? '0 1px 3px rgba(22,22,26,.1)' : 'none'};transition:all 120ms ease">
        <span>${v.icon}</span>${v.label}
      </button>
    `;
  }).join('');

  const shortcuts = [
    { k: 'Enter', label: 'Abschicken' },
    { k: '⇧ Enter', label: 'Neue Zeile' },
    { k: '@', label: 'Eintrag markieren' },
    // Ein Kürzel, das nichts auslöst, wird nicht angezeigt (Dev-Leiste: KI).
    ...(state.aiMode ? [{ k: 'Tab', label: 'KI-Vorschlag' }] : [])
  ];

  return `
    <div style="flex:none;border-top:1px solid #e6e5e0;background:#fff">
      ${meeting.ended ? `
        <div style="padding:9px 20px;background:#fdf5e0;border-bottom:1px solid #f2e8cf;font-size:12.5px;color:#7a6a45">
          Dieses ${t.meeting} ist beendet — Ergänzungen werden als „nachträglich ergänzt" markiert.
        </div>
      ` : ''}

      <div id="c1-composer" contenteditable="true"
        oninput="app.onEditorInput(event)" onkeydown="app.onComposerKeyDown(event)"
        data-placeholder="Notiz schreiben …"
        style="padding:16px 20px 12px;min-height:62px;max-height:210px;overflow:auto;font-size:15.5px;line-height:1.7;outline:none" spellcheck="false"></div>

      <div style="display:flex;align-items:center;gap:14px;padding:10px 16px 12px;flex-wrap:wrap">
        <div style="display:flex;gap:3px;padding:3px;background:#f4f3f0;border-radius:9px">${segHtml}</div>
        <span style="flex:1"></span>
        ${shortcuts.map((s) => `
          <span style="display:flex;align-items:center;gap:6px;font-size:11.5px">
            <span style="padding:2px 6px;border:1px solid #e2e1dc;border-radius:5px;background:#faf9f7;font-family:ui-monospace,Menlo,monospace;font-size:10.5px;color:#16161a">${s.k}</span>
            <span style="color:#8b8d97">${s.label}</span>
          </span>
        `).join('')}
        <button onclick="app.submitNote()" style="padding:8px 15px;border:none;border-radius:9px;background:#5340c4;color:#fff;font-size:13px;font-weight:500;cursor:pointer">Abschicken</button>
      </div>
    </div>
  `;
}

/* -------------------------------------------------------------------------
   Schublade — Team-Notizen (C4)
   ------------------------------------------------------------------------- */

function renderTeamNotes(preset, state) {
  const teamNotes = preset.d.teamNotes || [];

  if (state.mode === 'loading') {
    return [1, 2, 3].map(() => `
      <div style="padding:12px 0;border-bottom:1px solid #f4f4f2;animation:nshim 1.6s infinite">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <div style="width:20px;height:20px;border-radius:50%;background:#e4e4e0"></div>
          ${skeletonBar('38%', 10)}
        </div>
        ${skeletonBar('100%', 10, 'margin-bottom:6px')}
        ${skeletonBar('72%', 10)}
      </div>
    `).join('');
  }

  // Der Notizblock bleibt im Fehlerfall voll funktionsfähig, und der zuletzt
  // geladene Stand bleibt sichtbar (Screen-Inventar C4).
  if (state.mode === 'error') {
    return `
      <div style="padding:14px 15px;border:1px solid #f0dcc4;background:#fdf5e0;border-radius:10px">
        <div style="font-size:13px;color:#7a6a45">Aktualisierung fehlgeschlagen</div>
        <p style="margin:6px 0 0;font-size:12.5px;color:#8a7a55;line-height:1.55">Der zuletzt geladene Stand bleibt sichtbar. Deine eigenen Notizen sind nicht betroffen — du schreibst normal weiter.</p>
        <button onclick="app.setState({mode:'normal'})" style="margin-top:10px;padding:7px 12px;border:1px solid #e0cfae;border-radius:8px;background:#fff;font-size:12.5px;cursor:pointer">Erneut versuchen</button>
      </div>
    `;
  }

  if (state.mode === 'empty' || !teamNotes.length) {
    return `
      <p style="margin:0;padding:18px 0;font-size:13px;color:#8b8d97;line-height:1.6">
        Noch hat niemand etwas geteilt. Was du auf <em>Für Team</em> stellst, erscheint hier bei allen.
      </p>
    `;
  }

  return teamNotes.map((note) => `
    <div style="padding:0 0 12px;border-bottom:1px solid #f4f4f2">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span style="width:20px;height:20px;border-radius:50%;background:#5340c4;color:#fff;font-size:9px;font-weight:600;display:inline-flex;align-items:center;justify-content:center">${note.initials}</span>
        <span style="font-size:12.5px;font-weight:600;color:#16161a">${note.name}</span>
        <span style="font-size:11.5px;color:#8b8d97;margin-left:auto">${note.at}</span>
      </div>
      <p style="margin:0;font-size:13px;line-height:1.55;color:#3f4048">${note.text}</p>
    </div>
  `).join('');
}

/* -------------------------------------------------------------------------
   Bildschirm
   ------------------------------------------------------------------------- */

export function renderScreenC1(preset, state) {
  const { t, d } = preset;

  // Gewähltes Treffen (Sidebar) oder das laufende aus dem Preset
  const title = state.meeting || d.meetingTitle;
  const meetingEntry = (preset.wgs || []).flatMap((w) => w.meetings || []).find((m) => m[0] === title);
  const meetingState = (meetingEntry && meetingEntry[1]) || 'geplant';
  const meeting = {
    live: meetingState === 'läuft',
    planned: meetingState === 'geplant',
    ended: meetingState === 'beendet'
  };

  const pillColor = meeting.live ? '#2fb8a0' : meeting.ended ? '#8b8d97' : '#c9a227';
  const pillBg = meeting.live ? '#e7f8f5' : meeting.ended ? '#f0efec' : '#fdf5e0';
  const pillLabel = meeting.live ? `läuft · ${d.minutes} min` : meeting.ended ? 'beendet' : 'geplant';
  const dotAnim = meeting.live ? 'animation:npulse 1.8s ease-in-out infinite;' : '';

  // Bilanz „12 Notizen · 7 markiert" — bewusst über das **ganze** Treffen,
  // nicht nur den eigenen Strom (PRD §4.4.1). Sie macht sichtbar, dass
  // Vorarbeit im Treffen die Kuration verkürzt (E-23).
  const sameMeeting = title === d.meetingTitle;
  const counted = state.mode === 'loading' || state.mode === 'empty' || !sameMeeting ? [] : state.notes || [];
  const balance = noteBalance(counted);

  const teamNotes = d.teamNotes || [];
  const avatarsHtml = teamNotes.slice(0, 3).map((note, i) =>
    `<span style="${avSt(i)};width:20px;height:20px;font-size:9px;border-width:1.5px">${state.mode === 'loading' ? '' : note.initials}</span>`
  ).join('');

  return `
    <div style="position:relative;height:100%;display:flex;flex-direction:column;overflow:hidden">

      <div style="flex:1;min-height:0;overflow:auto">
        <div style="max-width:840px;margin:0 auto;padding:30px 28px 8px">

          <!-- Kopf der Spalte -->
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <h1 style="margin:0;font-family:Spectral,Georgia,serif;font-size:26px;font-weight:500;letter-spacing:-.015em">${title}</h1>
            <span style="display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;background:${pillBg};color:${pillColor};font-size:12px;font-weight:600">
              <span style="width:6px;height:6px;border-radius:50%;background:${pillColor};display:inline-block;${dotAnim}"></span>${pillLabel}
            </span>
            <span style="flex:1"></span>

            <!-- Feed-Umschalter mit Avatarstapel: Team-Notizen auf Abruf -->
            <button id="c1-drawer-btn" onclick="app.toggleDrawer()"
              style="display:flex;align-items:center;gap:9px;padding:6px 12px 6px 8px;border:1px solid ${state.drawer ? '#c9c3ec' : '#e4e3de'};border-radius:999px;background:${state.drawer ? '#faf9fd' : '#fff'};cursor:pointer;transition:border-color 120ms ease"
              onmouseover="this.style.borderColor='#c9c3ec'" onmouseout="this.style.borderColor='${state.drawer ? '#c9c3ec' : '#e4e3de'}'">
              <div style="display:flex;align-items:center">${avatarsHtml}</div>
              <span style="font-size:12.5px;color:#16161a">Team-Notizen</span>
            </button>
          </div>

          <p style="margin:8px 0 0;font-size:12.5px;color:#8b8d97">
            ${d.meetingDate} · ${balance.total} ${balance.total === 1 ? 'Notiz' : 'Notizen'} · ${balance.marked} markiert
          </p>

          <!-- Einmaliger Hinweis: Markieren und Ehrlichkeitsaussage
               gemeinsam (Screen-Inventar C1), nicht als Dauerbanner. -->
          ${state.hintOpen === false ? '' : `
            <div id="c1-hint" style="margin-top:18px;padding:14px 16px;border:1px solid #e6e5e0;background:#fff;border-radius:11px;display:flex;gap:12px;align-items:flex-start">
              <span style="font-size:14px;color:#5340c4;flex:none;margin-top:1px">@</span>
              <div style="min-width:0">
                <p style="margin:0;font-size:13px;line-height:1.6;color:#3f4048">Tipp <strong style="font-weight:600">@</strong> oder markiere Text, um Einträge festzuhalten. Beides erzeugt denselben Vorschlag — und spart später in der Kuration Zeit.</p>
                <p style="margin:6px 0 0;font-size:12.5px;color:#8b8d97;line-height:1.6">Die Projektleitung sieht in der Kuration alle Notizen. <strong style="font-weight:600">„Für mich"</strong> bestimmt, was im Team-Feed erscheint.</p>
              </div>
              <button onclick="app.closeHint()" style="flex:none;font-size:12.5px;color:#8b8d97;padding:2px 6px;border:none;background:transparent;cursor:pointer;border-radius:5px"
                onmouseover="this.style.color='#16161a'" onmouseout="this.style.color='#8b8d97'">Verstanden</button>
            </div>
          `}

          <!-- Notizstrom: eigene Notizen, älteste oben -->
          <div style="margin-top:22px;padding-bottom:20px">
            ${renderStream(preset, state, sameMeeting)}
          </div>
        </div>
      </div>

      <!-- Verfasser: fest am unteren Rand, während der Strom darüber wächst -->
      <div style="flex:none;background:#fff">
        <div style="max-width:840px;margin:0 auto">
          ${renderComposer(preset, state, meeting)}
        </div>
      </div>

      ${renderDrawer({
        title: 'Team-Notizen',
        open: state.drawer,
        onClose: 'app.toggleDrawer()',
        width: 360,
        // Abgerufen, nicht gepusst (E-27): Stand beim Öffnen plus ein
        // Aktualisieren-Symbol. Kein automatisches Nachladen.
        action: `
          <button onclick="app.refreshFeed()" title="Aktualisieren"
            style="font-size:13px;color:#5340c4;border:none;background:transparent;cursor:pointer;padding:2px 4px">⟳</button>
          <span style="font-size:11.5px;color:#8b8d97">Stand ${d.feedStamp || ''}</span>
        `,
        body: renderTeamNotes(preset, state),
        footer: `
          <div style="flex:none;padding:11px 18px;border-top:1px solid #efeee9;font-size:11.5px;color:#8b8d97;line-height:1.5">
            Zeigt ausschließlich Notizen mit „Für Team". ${t.parts}-Notizen mit „Für mich" erscheinen hier nie.
          </div>
        `
      })}
    </div>
  `;
}
