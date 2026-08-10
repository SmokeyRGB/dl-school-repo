// Screen C1: Meeting notes editor
// Centered editor card matching original Notella mockup layout

import { tint, chipSt, avSt } from '../utils/index.js';

export function renderScreenC1(preset, state) {
  const { t, d } = preset;

  // Look up current meeting state from wgs data
  const allMeetings = (preset.wgs || []).flatMap(w => w.meetings || []);
  const meetingEntry = allMeetings.find(m => m[0] === d.meetingTitle);
  const meetingState = (meetingEntry && meetingEntry[1]) || 'geplant';

  const isLive = meetingState === 'läuft';
  const isPlanned = meetingState === 'geplant';
  const isEnded = meetingState === 'beendet';
  const pillColor = isLive ? '#2fb8a0' : isEnded ? '#8b8d97' : '#c9a227';
  const pillBg = isLive ? '#e7f8f5' : isEnded ? '#f0efec' : '#fdf5e0';
  const pillLabel = isLive ? 'läuft' : isEnded ? 'beendet' : 'geplant';
  const dotAnim = isLive ? 'animation:npulse 1.8s ease-in-out infinite;' : '';

  // Stacked avatars for "Geteilte Notizen" button (up to 3)
  const avCount = Math.min(3, (d.participants || 4));
  const avColors = ['#5340c4', '#2fb8a0', '#c9a227'];
  const avInitials = ['A', 'B', 'C'];
  const avatarsHtml = Array.from({ length: avCount }, (_, i) =>
    `<span style="width:20px;height:20px;border-radius:50%;background:${avColors[i]};color:#fff;font-size:9px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;margin-left:${i > 0 ? '-6px' : '0'};border:1.5px solid #fff">${avInitials[i]}</span>`
  ).join('');

  // Visibility segment options
  const vis = [
    { label: 'Privat', icon: '🔒', active: state.vis === 'privat' || !state.vis },
    { label: 'Geteilt', icon: '👥', active: state.vis === 'geteilt' },
    { label: 'Kanonisch', icon: '📖', active: state.vis === 'kanonisch' },
  ];
  const segHtml = vis.map(v => `
    <button onclick="app.setState({ vis: '${v.label.toLowerCase()}' })"
      style="display:flex;align-items:center;gap:5px;padding:4px 10px;border:none;border-radius:7px;font-size:12px;cursor:pointer;
             background:${v.active ? '#fff' : 'transparent'};color:${v.active ? '#16161a' : '#8b8d97'};
             font-weight:${v.active ? '600' : '400'};box-shadow:${v.active ? '0 1px 3px rgba(22,22,26,.1)' : 'none'};transition:all 120ms ease">
      <span>${v.icon}</span>${v.label}
    </button>
  `).join('');

  // Inline @mention chips (example content)
  const chipStyle = (bg, color) =>
    `display:inline-flex;align-items:center;gap:5px;padding:1px 8px 2px;border-radius:999px;background:${bg};color:${color};font-size:14px;font-weight:500;white-space:nowrap`;

  // Shortcuts bar
  const shortcuts = [
    { k: '@', label: 'Eintrag verknüpfen' },
    { k: '**', label: 'Fett' },
    { k: '[]', label: 'Aufgabe' },
    { k: 'Tab', label: 'KI-Vorschlag' },
  ];
  const shortcutsHtml = shortcuts.map(s =>
    `<span style="display:flex;align-items:center;gap:6px">
      <span style="padding:2px 6px;border:1px solid #e2e1dc;border-radius:5px;background:#faf9f7;font-family:ui-monospace,Menlo,monospace;font-size:10.5px;color:#16161a">${s.k}</span>
      <span style="color:#8b8d97">${s.label}</span>
    </span>`
  ).join('');

  return `
    <div style="max-width:840px;margin:0 auto;padding:34px 28px 70px">
      <!-- Title row -->
      <div style="display:flex;align-items:center;gap:12px">
        <h1 style="margin:0;font-family:Spectral,Georgia,serif;font-size:26px;font-weight:500;letter-spacing:-.015em">${d.meetingTitle}</h1>
        <span style="display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;background:${pillBg};color:${pillColor};font-size:12px;font-weight:600">
          <span style="width:6px;height:6px;border-radius:50%;background:${pillColor};display:inline-block;${dotAnim}"></span>${pillLabel}
        </span>
      </div>
      <p style="margin:7px 0 0;font-size:12.5px;color:#8b8d97">${d.meetingDate} · ${t.parts}: 4 anwesend</p>

      <!-- Editor card -->
      <div style="margin-top:22px;background:#fff;border:1px solid #e6e5e0;border-radius:14px;box-shadow:0 1px 2px rgba(22,22,26,.04),0 8px 24px -18px rgba(22,22,26,.18)">
        
        <!-- Toolbar -->
        <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-bottom:1px solid #efeee9;flex-wrap:wrap">
          <div style="display:flex;gap:3px;padding:3px;background:#f4f3f0;border-radius:9px">
            ${segHtml}
          </div>
          <span style="font-size:11.5px;color:#8b8d97">Gespeichert</span>
          <span style="flex:1"></span>
          <!-- Geteilte Notizen drawer button -->
          <button id="c1-drawer-btn" onclick="app.toggleDrawer()" style="display:flex;align-items:center;gap:9px;padding:6px 10px 6px 8px;border:1px solid ${state.drawer ? '#c9c3ec' : '#e4e3de'};border-radius:999px;background:${state.drawer ? '#faf9fd' : '#fff'};cursor:pointer;transition:border-color 120ms ease"
            onmouseover="this.style.borderColor='#c9c3ec';this.style.background='#faf9fd'"
            onmouseout="this.style.borderColor='${state.drawer ? '#c9c3ec' : '#e4e3de'}';this.style.background='${state.drawer ? '#faf9fd' : '#fff'}'">
            <div style="display:flex;align-items:center">${avatarsHtml}</div>
            <span style="font-size:12.5px;color:#16161a">Geteilte Notizen</span>
            <span style="min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:#5340c4;color:#fff;font-size:10.5px;font-weight:600;display:inline-flex;align-items:center;justify-content:center">3</span>
          </button>
        </div>

        ${isEnded ? `
          <div style="padding:10px 24px;background:#fdf5e0;border-bottom:1px solid #efeee9;font-size:12.5px;color:#7a6a45">
            Dieses Meeting ist beendet — Ergänzungen werden als „nachträglich ergänzt" markiert.
          </div>
        ` : ''}

        <!-- Editor content -->
        ${isPlanned ? `
          <div style="padding:40px 24px;text-align:center;color:#8b8d97;font-size:13.5px">
            Das Notizfeld öffnet sich, sobald ${d.leadFull} das ${t.meeting} startet.
          </div>
        ` : `
        <div contenteditable="true" oninput="app.onEditorInput(event)" onkeydown="app.onEditorKeyDown(event)" style="padding:20px 24px 8px;min-height:290px;font-size:15.5px;line-height:1.78;letter-spacing:-.003em;outline:none" spellcheck="false">
          <p style="margin:0 0 14px">Runde zum Preset-Loader: das Laden der YAML-Datei ist fertig, die Validierung fehlt noch.</p>
          <p style="margin:0 0 14px">Wir haben festgelegt, dass wir
            <span contenteditable="false" style="${chipStyle('#efecfb', '#4a3aad')}"><span style="width:5px;height:5px;border-radius:50%;background:#5340c4;display:inline-block"></span>Postgres statt SQLite</span>
            nehmen — Begründung: wir brauchen JSONB für die Preset-Bindung.
          </p>
          <p style="margin:0 0 14px">Offen: wer den Schema-Validator schreibt.
            <span contenteditable="false" style="${chipStyle('#eaf3ec', '#2c6b45')}"><span style="width:5px;height:5px;border-radius:50%;background:#3f8f5f;display:inline-block"></span>Schema-Validator schreiben</span>
            hängt am
            <span contenteditable="false" style="${chipStyle('#e6f4f2', '#1d6a5f')}"><span style="width:5px;height:5px;border-radius:50%;background:#2fb8a0;display:inline-block"></span>Preset-Loader</span>.
          </p>
          <p style="margin:0">Tippe hier weiter — mit <strong style="font-weight:600">@</strong> markierst du einen Eintrag.</p>
        </div>
        `}

        <!-- Shortcuts bar -->
        <div style="display:flex;align-items:center;gap:16px;padding:11px 16px;border-top:1px solid #efeee9;font-size:11.5px;flex-wrap:wrap">
          ${shortcutsHtml}
        </div>
      </div>

      <!-- @ hint panel -->
      <div style="margin-top:14px;padding:14px 16px;border:1px solid #e6e5e0;background:#fff;border-radius:11px;display:flex;gap:12px;align-items:flex-start">
        <span style="font-size:14px;color:#5340c4;flex:none;margin-top:1px">@</span>
        <div style="min-width:0">
          <p style="margin:0;font-size:13px;line-height:1.6;color:#3f4048">Tipp <strong style="font-weight:600">@</strong>, um Personen, Orte, Konzepte oder Entscheidungen zu markieren. Oder Text markieren und den Typ zuweisen — beides erzeugt denselben Eintrag.</p>
          <p style="margin:6px 0 0;font-size:12.5px;color:#8b8d97;line-height:1.6">Private Einträge bleiben nur dir sichtbar. Geteilte gehen ans Team. Kanonische Einträge kommen in das Projektwissen.</p>
        </div>
        <button style="flex:none;font-size:12.5px;color:#8b8d97;padding:2px 6px;border:none;background:transparent;cursor:pointer;border-radius:5px"
          onmouseover="this.style.color='#16161a'" onmouseout="this.style.color='#8b8d97'">Verstanden</button>
      </div>
    </div>

    <!-- Geteilte-Notizen-Schublade -->
    <div id="c1-drawer" style="position:fixed;top:53px;right:0;bottom:0;width:340px;background:#fff;border-left:1px solid #e6e5e0;box-shadow:-16px 0 40px -24px rgba(22,22,26,.3);
                transform:translateX(${state.drawer ? '0' : '100%'});transition:transform 260ms cubic-bezier(.22,.7,.25,1);z-index:70;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;gap:10px;padding:16px 18px;border-bottom:1px solid #efeee9">
        <span style="font-size:14px;font-weight:600;flex:1">Geteilte Notizen</span>
        <button onclick="app.toggleDrawer()" style="border:none;background:transparent;cursor:pointer;color:#8b8d97;font-size:16px;padding:2px 6px;border-radius:6px" onmouseover="this.style.color='#16161a'" onmouseout="this.style.color='#8b8d97'">✕</button>
      </div>
      <div style="flex:1;overflow:auto;padding:14px 18px">
        ${[
          { a: 'A', name: d.leadFull, text: 'Postgres statt SQLite steht fest — JSONB für die Preset-Bindung.', ago: '2 Min' },
          { a: 'B', name: d.me, text: 'Wer übernimmt den Schema-Validator? Ich kann das nächste Woche machen.', ago: '5 Min' },
          { a: 'C', name: 'Jonas Herold', text: 'Erwähnungs-Auswahl per @ läuft schon lokal, muss noch an die Presets angebunden werden.', ago: '11 Min' },
        ].map(n => `
          <div style="padding:12px 0;border-bottom:1px solid #f4f4f2">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="width:20px;height:20px;border-radius:50%;background:#5340c4;color:#fff;font-size:9px;font-weight:600;display:inline-flex;align-items:center;justify-content:center">${n.a}</span>
              <span style="font-size:12.5px;font-weight:600;color:#16161a">${n.name}</span>
              <span style="font-size:11.5px;color:#8b8d97;margin-left:auto">${n.ago}</span>
            </div>
            <p style="margin:0;font-size:13px;line-height:1.55;color:#3f4048">${n.text}</p>
          </div>
        `).join('')}
      </div>
      ${state.role === 'lead' ? `
        <div style="padding:12px 18px;border-top:1px solid #efeee9;font-size:12px;color:#5a5c66;display:flex;align-items:center;gap:8px">
          <input type="checkbox" id="c1-priv-toggle" style="margin:0">
          <label for="c1-priv-toggle">auch private Notizen anzeigen</label>
        </div>
      ` : ''}
    </div>
  `;
}
