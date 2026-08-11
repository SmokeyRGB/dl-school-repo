// Screen C1: Meeting-Raum — Notizeditor mit geteilten Notizen
// Der wichtigste Bildschirm: schreiben, ohne unterbrochen zu werden.
// Screen-Inventar C1. Inhalte kommen aus dem Preset (d.notes, d.shared) —
// der Bildschirm selbst kennt weder Sprints noch Sessions.

import { tint, avSt, typeOf } from '../utils/index.js';
import { skeletonBar } from './stateViews.js';

/** Chip in der Farbe des Entitätstyps — dieselbe Form wie eine @-Erwähnung. */
function entityChip(label, preset) {
  const entity = (preset.entities || []).find(e => e.label === label);
  const type = typeOf(entity ? entity.key : preset.types[0].key, preset);
  return `<span contenteditable="false" style="display:inline-flex;align-items:center;gap:5px;padding:1px 8px 2px;border-radius:999px;background:${tint(type.color, .14)};color:${type.color};font-size:14px;font-weight:500;white-space:nowrap"><span style="width:5px;height:5px;border-radius:50%;background:${type.color};display:inline-block"></span>${label}</span>`;
}

/** Absätze des Presets: Text und Entitäts-Chips im Wechsel. */
function renderNotes(preset) {
  return (preset.d.notes || []).map(paragraph => `
    <p style="margin:0 0 14px">${paragraph.map(part => part.ref ? entityChip(part.ref, preset) : part.t).join('')}</p>
  `).join('');
}

/**
 * Geteilte Notizen — der einzige Teil von C1 mit eigenen Zuständen.
 * Der Editor bleibt in jedem davon bedienbar (Screen-Inventar C1).
 */
function renderFeed(preset, state) {
  const shared = preset.d.shared || [];

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

  if (state.mode === 'error') {
    return `
      <div style="padding:14px 15px;border:1px solid #f0dcc4;background:#fdf5e0;border-radius:10px">
        <div style="font-size:13px;color:#7a6a45">Aktualisierung unterbrochen</div>
        <p style="margin:6px 0 0;font-size:12.5px;color:#8a7a55;line-height:1.55">Deine eigenen Notizen sind davon nicht betroffen — du schreibst normal weiter.</p>
        <button onclick="app.setState({mode:'normal'})" style="margin-top:10px;padding:7px 12px;border:1px solid #e0cfae;border-radius:8px;background:#fff;font-size:12.5px;cursor:pointer">Erneut verbinden</button>
      </div>
    `;
  }

  if (state.mode === 'empty' || !shared.length) {
    return `
      <p style="margin:0;padding:18px 0;font-size:13px;color:#8b8d97;line-height:1.6">
        Noch hat niemand etwas geteilt. Was du auf <em>geteilt</em> stellst, erscheint hier bei allen.
      </p>
    `;
  }

  return shared.map(note => `
    <div style="padding:12px 0;border-bottom:1px solid #f4f4f2">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <span style="width:20px;height:20px;border-radius:50%;background:#5340c4;color:#fff;font-size:9px;font-weight:600;display:inline-flex;align-items:center;justify-content:center">${note.initials}</span>
        <span style="font-size:12.5px;font-weight:600;color:#16161a">${note.name}</span>
        <span style="font-size:11.5px;color:#8b8d97;margin-left:auto">${note.ago}</span>
      </div>
      <p style="margin:0;font-size:13px;line-height:1.55;color:#3f4048">${note.text}</p>
    </div>
  `).join('');
}

export function renderScreenC1(preset, state) {
  const { t, d } = preset;

  // Zustand des Meetings aus den Arbeitsgruppen lesen
  const wg = (preset.wgs || []).find(w => (w.meetings || []).some(m => m[0] === d.meetingTitle));
  const meetingEntry = (preset.wgs || []).flatMap(w => w.meetings || []).find(m => m[0] === d.meetingTitle);
  const meetingState = (meetingEntry && meetingEntry[1]) || 'geplant';

  const isLive = meetingState === 'läuft';
  const isPlanned = meetingState === 'geplant';
  const isEnded = meetingState === 'beendet';
  const pillColor = isLive ? '#2fb8a0' : isEnded ? '#8b8d97' : '#c9a227';
  const pillBg = isLive ? '#e7f8f5' : isEnded ? '#f0efec' : '#fdf5e0';
  const pillLabel = isLive ? 'läuft' : isEnded ? 'beendet' : 'geplant';
  const dotAnim = isLive ? 'animation:npulse 1.8s ease-in-out infinite;' : '';

  const shared = d.shared || [];
  const feedLoading = state.mode === 'loading';
  const feedError = state.mode === 'error';
  const feedEmpty = state.mode === 'empty' || !shared.length;

  // Avatarstapel und Zähler der Schublade folgen dem Zustand des Feeds
  const avatarsHtml = shared.slice(0, 3).map((note, i) =>
    `<span style="${avSt(i)};width:20px;height:20px;font-size:9px;border-width:1.5px">${feedLoading ? '' : note.initials}</span>`
  ).join('');
  const feedBadge = feedError ? '!' : feedLoading ? '…' : feedEmpty ? '0' : String(shared.length);
  const badgeBg = feedError ? '#c8553d' : feedEmpty || feedLoading ? '#a3a3ab' : '#5340c4';

  // Sichtbarkeit: Kanonisch nur für die Projektleitung
  const isLead = state.role === 'lead';
  const visOptions = [
    { label: 'Privat', icon: '🔒' },
    { label: 'Geteilt', icon: '👥' },
    ...(isLead ? [{ label: 'Kanonisch', icon: '📖' }] : []),
  ];
  const visKeys = visOptions.map(v => v.label.toLowerCase());
  const activeVis = visKeys.includes(state.vis) ? state.vis : 'privat';
  const segHtml = visOptions.map(v => {
    const active = v.label.toLowerCase() === activeVis;
    return `
      <button onclick="app.setState({ vis: '${v.label.toLowerCase()}' })"
        style="display:flex;align-items:center;gap:5px;padding:4px 10px;border:none;border-radius:7px;font-size:12px;cursor:pointer;
               background:${active ? '#fff' : 'transparent'};color:${active ? '#16161a' : '#8b8d97'};
               font-weight:${active ? '600' : '400'};box-shadow:${active ? '0 1px 3px rgba(22,22,26,.1)' : 'none'};transition:all 120ms ease">
        <span>${v.icon}</span>${v.label}
      </button>
    `;
  }).join('');

  const shortcuts = [
    { k: '@', label: 'Eintrag verknüpfen' },
    { k: '**', label: 'Fett' },
    { k: '[]', label: 'Aufgabe' },
    // Nur zeigen, wenn der Vorschlag auch kommen kann (Dev-Leiste: KI)
    ...(state.aiMode ? [{ k: 'Tab', label: 'KI-Vorschlag' }] : []),
  ];
  const shortcutsHtml = shortcuts.map(s =>
    `<span style="display:flex;align-items:center;gap:6px">
      <span style="padding:2px 6px;border:1px solid #e2e1dc;border-radius:5px;background:#faf9f7;font-family:ui-monospace,Menlo,monospace;font-size:10.5px;color:#16161a">${s.k}</span>
      <span style="color:#8b8d97">${s.label}</span>
    </span>`
  ).join('');

  return `
    <div style="max-width:840px;margin:0 auto;padding:34px 28px 70px">
      <!-- Titelzeile -->
      <div style="display:flex;align-items:center;gap:12px">
        <h1 style="margin:0;font-family:Spectral,Georgia,serif;font-size:26px;font-weight:500;letter-spacing:-.015em">${d.meetingTitle}</h1>
        <span style="display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;background:${pillBg};color:${pillColor};font-size:12px;font-weight:600">
          <span style="width:6px;height:6px;border-radius:50%;background:${pillColor};display:inline-block;${dotAnim}"></span>${pillLabel}
        </span>
      </div>
      <p style="margin:7px 0 0;font-size:12.5px;color:#8b8d97">${d.meetingDate} · ${t.parts}: ${((wg || {}).av || []).length || shared.length} anwesend</p>

      <!-- Editorkarte -->
      <div style="margin-top:22px;background:#fff;border:1px solid #e6e5e0;border-radius:14px;box-shadow:0 1px 2px rgba(22,22,26,.04),0 8px 24px -18px rgba(22,22,26,.18)">

        <!-- Werkzeugleiste -->
        <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-bottom:1px solid #efeee9;flex-wrap:wrap">
          <div style="display:flex;gap:3px;padding:3px;background:#f4f3f0;border-radius:9px">
            ${segHtml}
          </div>
          <span style="font-size:11.5px;color:#8b8d97">Gespeichert</span>
          <span style="flex:1"></span>
          <!-- Schublade der geteilten Notizen -->
          <button id="c1-drawer-btn" onclick="app.toggleDrawer()" style="display:flex;align-items:center;gap:9px;padding:6px 10px 6px 8px;border:1px solid ${state.drawer ? '#c9c3ec' : '#e4e3de'};border-radius:999px;background:${state.drawer ? '#faf9fd' : '#fff'};cursor:pointer;transition:border-color 120ms ease"
            onmouseover="this.style.borderColor='#c9c3ec';this.style.background='#faf9fd'"
            onmouseout="this.style.borderColor='${state.drawer ? '#c9c3ec' : '#e4e3de'}';this.style.background='${state.drawer ? '#faf9fd' : '#fff'}'">
            <div style="display:flex;align-items:center">${avatarsHtml}</div>
            <span style="font-size:12.5px;color:#16161a">Geteilte Notizen</span>
            <span style="min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:${badgeBg};color:#fff;font-size:10.5px;font-weight:600;display:inline-flex;align-items:center;justify-content:center">${feedBadge}</span>
          </button>
        </div>

        ${isEnded ? `
          <div style="padding:10px 24px;background:#fdf5e0;border-bottom:1px solid #efeee9;font-size:12.5px;color:#7a6a45">
            Dieses ${t.meeting} ist beendet — Ergänzungen werden als „nachträglich ergänzt" markiert.
          </div>
        ` : ''}

        <!-- Notizfeld. Es wird auch beim Laden gezeichnet: der Editor ist
             bedienbar, bevor der Feed steht (Screen-Inventar C1). -->
        ${isPlanned ? `
          <div style="padding:40px 24px;text-align:center;color:#8b8d97;font-size:13.5px">
            Das Notizfeld öffnet sich, sobald ${d.leadFull} das ${t.meeting} startet.
          </div>
        ` : `
        <div contenteditable="true" oninput="app.onEditorInput(event)" onkeydown="app.onEditorKeyDown(event)" style="padding:20px 24px 8px;min-height:290px;font-size:15.5px;line-height:1.78;letter-spacing:-.003em;outline:none" spellcheck="false">
          ${renderNotes(preset)}
          <p style="margin:0">Tippe hier weiter — mit <strong style="font-weight:600">@</strong> markierst du einen Eintrag.</p>
        </div>
        `}

        <!-- Tastenkürzel -->
        <div style="display:flex;align-items:center;gap:16px;padding:11px 16px;border-top:1px solid #efeee9;font-size:11.5px;flex-wrap:wrap">
          ${shortcutsHtml}
        </div>
      </div>

      <!-- Hinweis zur @-Erwähnung -->
      ${state.hintOpen === false ? '' : `
      <div id="c1-hint" style="margin-top:14px;padding:14px 16px;border:1px solid #e6e5e0;background:#fff;border-radius:11px;display:flex;gap:12px;align-items:flex-start">
        <span style="font-size:14px;color:#5340c4;flex:none;margin-top:1px">@</span>
        <div style="min-width:0">
          <p style="margin:0;font-size:13px;line-height:1.6;color:#3f4048">Tipp <strong style="font-weight:600">@</strong>, um Personen, Orte, Konzepte oder Entscheidungen zu markieren. Oder Text markieren und den Typ zuweisen — beides erzeugt denselben Eintrag.</p>
          <p style="margin:6px 0 0;font-size:12.5px;color:#8b8d97;line-height:1.6">Private Einträge bleiben nur dir sichtbar. Geteilte gehen ans Team. Kanonische Einträge kommen in das ${t.canonNoun}.</p>
        </div>
        <button onclick="app.closeHint()" style="flex:none;font-size:12.5px;color:#8b8d97;padding:2px 6px;border:none;background:transparent;cursor:pointer;border-radius:5px"
          onmouseover="this.style.color='#16161a'" onmouseout="this.style.color='#8b8d97'">Verstanden</button>
      </div>
      `}
    </div>

    <!-- Schublade: geteilte Notizen -->
    <div id="c1-drawer" style="position:fixed;top:53px;right:0;bottom:0;width:340px;background:#fff;border-left:1px solid #e6e5e0;box-shadow:-16px 0 40px -24px rgba(22,22,26,.3);
                transform:translateX(${state.drawer ? '0' : '100%'});transition:transform 260ms cubic-bezier(.22,.7,.25,1);z-index:70;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;gap:10px;padding:16px 18px;border-bottom:1px solid #efeee9">
        <span style="font-size:14px;font-weight:600;flex:1">Geteilte Notizen</span>
        <button onclick="app.toggleDrawer()" style="border:none;background:transparent;cursor:pointer;color:#8b8d97;font-size:16px;padding:2px 6px;border-radius:6px" onmouseover="this.style.color='#16161a'" onmouseout="this.style.color='#8b8d97'">✕</button>
      </div>
      <div style="flex:1;overflow:auto;padding:14px 18px">
        ${renderFeed(preset, state)}
      </div>
      ${isLead ? `
        <div style="padding:12px 18px;border-top:1px solid #efeee9;font-size:12px;color:#5a5c66;display:flex;align-items:center;gap:8px">
          <input type="checkbox" id="c1-priv-toggle" style="margin:0">
          <label for="c1-priv-toggle">auch private Notizen anzeigen</label>
        </div>
      ` : ''}
    </div>
  `;
}
