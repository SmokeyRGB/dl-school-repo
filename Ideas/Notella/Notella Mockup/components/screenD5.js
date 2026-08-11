// Screen D5: Beziehungs-Graph (Relationship Graph)
// Second projection of the same knowledge as the wiki (D1/D2) — no own data storage.
// Chrome: Fokus — borderless canvas, filter bar and zoom float above it.

import { tint, chipSt, shapePath } from '../utils/index.js';
import { typeOf } from '../utils/editorLogic.js';

/** Knotentitel für einen Inline-Handler absichern. */
function jsStr(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const VIEW_W = 900, VIEW_H = 560;
const CENTER_X = VIEW_W / 2, CENTER_Y = VIEW_H / 2;
const CIRCLE_R = 190;
const TOO_MANY_NODES = 1500;

function layoutXY(node, index, total, layout, override) {
  if (override) return override;
  if (layout === 'circle') {
    const angle = (index / Math.max(1, total)) * Math.PI * 2 - Math.PI / 2;
    return { x: CENTER_X + CIRCLE_R * Math.cos(angle), y: CENTER_Y + CIRCLE_R * Math.sin(angle) };
  }
  return { x: node.x, y: node.y };
}

export function renderScreenD5(preset, state) {
  const { t, types } = preset;
  const allNodes = preset.nodes || [];
  const allEdges = preset.edges || [];
  const isLoading = state.mode === 'loading';
  const isEmptyToggle = state.mode === 'empty';
  const isError = state.mode === 'error';

  // ---- Fehler: Rückfall auf die Liste, nichts ist verloren ----
  if (isError) {
    return `
      <div style="min-height:100%;display:flex;align-items:center;justify-content:center;padding:60px 40px;">
        <div style="max-width:420px;text-align:center;">
          <div style="font-size:32px;margin-bottom:16px;">🕸️</div>
          <h2 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#16161a;">Die Karte konnte nicht geladen werden</h2>
          <p style="margin:0 0 24px;font-size:14px;color:#5a5c66;line-height:1.6;">Das Netz ließ sich nicht berechnen — die Liste zeigt dieselben Daten. Nichts ist verloren gegangen.</p>
          <div style="display:flex;gap:10px;justify-content:center;">
            <button onclick="app.setState({mode:'normal'})" style="padding:10px 18px;background:#5340c4;color:#fff;border:none;border-radius:9px;font-size:13.5px;font-weight:600;cursor:pointer;">Erneut versuchen</button>
            <button onclick="app.go('D2')" style="padding:10px 18px;background:#f4f4f2;color:#16161a;border:1px solid #e4e4e0;border-radius:9px;font-size:13.5px;font-weight:500;cursor:pointer;">Zur Liste</button>
          </div>
        </div>
      </div>
    `;
  }

  // ---- Leer (kein Wissen): Projekt hat noch keine Einträge ----
  if (allNodes.length === 0) {
    return `
      <div style="min-height:100%;display:flex;align-items:center;justify-content:center;padding:60px 40px;">
        <div style="max-width:420px;text-align:center;">
          <div style="font-size:32px;margin-bottom:16px;">🕸️</div>
          <h2 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#16161a;">Hier entsteht die Karte eures ${t.canonNoun}s</h2>
          <p style="margin:0 0 24px;font-size:14px;color:#5a5c66;line-height:1.6;">Sobald ihr in ${t.meetings} Einträge markiert, erscheinen sie hier als Netz.</p>
          <button onclick="app.go('C1')" style="padding:10px 18px;background:#5340c4;color:#fff;border:none;border-radius:9px;font-size:13.5px;font-weight:600;cursor:pointer;">Ins ${t.meeting}</button>
        </div>
      </div>
    `;
  }

  const hidden = state.hidden || [];
  const onlyCanon = !!state.onlyCanon;
  const layout = state.graphLayout || 'force';
  const overrides = state.nodePos || {};

  const positioned = allNodes.map((n, i) =>
    Object.assign({}, n, layoutXY(n, i, allNodes.length, layout, overrides[n.id]))
  );
  const nodeMap = {};
  positioned.forEach(n => { nodeMap[n.id] = n; });

  const visNodes = positioned.filter(n => hidden.indexOf(n.key) < 0 && (!onlyCanon || n.canon));
  const visIds = new Set(visNodes.map(n => n.id));

  // ---- Zu groß: filtern, bevor das Layout gerechnet wird ----
  if (visNodes.length > TOO_MANY_NODES) {
    return `
      <div style="min-height:100%;display:flex;align-items:center;justify-content:center;padding:60px 40px;">
        <div style="max-width:440px;text-align:center;">
          <h2 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#16161a;">Zu viele Einträge für eine Karte</h2>
          <p style="margin:0 0 20px;font-size:14px;color:#5a5c66;line-height:1.6;">Über ${TOO_MANY_NODES.toLocaleString('de-DE')} sichtbare Knoten — bitte zuerst filtern, bevor das Layout berechnet wird.</p>
        </div>
      </div>
    `;
  }

  // Leer (keine Verbindungen) wird über den Dev-Bar-Modus "leer" vorgeführt:
  // echte Knoten bleiben sichtbar, nur die Kanten werden ausgeblendet.
  const showEdges = !isEmptyToggle;
  const visEdges = showEdges ? allEdges.filter(e => visIds.has(e.a) && visIds.has(e.b)) : [];
  const filteredEmpty = !isEmptyToggle && visNodes.length === 0;

  const degree = {};
  visEdges.forEach(e => {
    degree[e.a] = (degree[e.a] || 0) + 1;
    degree[e.b] = (degree[e.b] || 0) + 1;
  });

  const focusId = state.focus && visIds.has(state.focus) ? state.focus : null;
  const directNbrs = new Set();
  visEdges.forEach(e => {
    if (e.a === focusId) directNbrs.add(e.b);
    if (e.b === focusId) directNbrs.add(e.a);
  });
  let neighborSet = directNbrs;
  if (focusId && state.expand) {
    const expanded = new Set(directNbrs);
    visEdges.forEach(e => {
      if (directNbrs.has(e.a)) expanded.add(e.b);
      if (directNbrs.has(e.b)) expanded.add(e.a);
    });
    expanded.delete(focusId);
    neighborSet = expanded;
  }

  const focusedEdgeKey = !focusId ? state.edgeFocus : null;
  const labelsOn = !!focusId || (state.zoom || 1) >= 1.4;

  const nodesHtml = visNodes.map((n, i) => {
    const ty = typeOf(n.key, preset);
    const r = 15 + Math.min(9, (degree[n.id] || 1) * 2.2);
    const dim = focusId && n.id !== focusId && !neighborSet.has(n.id);
    const isFocused = n.id === focusId;
    const path = shapePath(ty.shape, r);
    const fill = n.canon ? tint(ty.color, 0.22) : tint(ty.color, 0.08);
    const dash = n.canon ? 'none' : '4 3';
    const animSt = isLoading ? `animation:nsvgin 620ms ease both;animation-delay:${i * 90}ms;` : '';
    return `
      <g class="d5-node" data-node-id="${n.id}" transform="translate(${n.x},${n.y})" opacity="${dim ? 0.13 : 1}"
         tabindex="0" role="button" aria-label="${ty.label}: ${n.label}"
         style="cursor:grab;${animSt}"
         onclick="event.stopPropagation();app.setGraphFocus('${n.id}')"
         ondblclick="event.stopPropagation();app.openEntry('${jsStr(n.label)}')"
         onkeydown="if(event.key==='Enter'){event.stopPropagation();app.setGraphFocus('${n.id}')}"
         onpointerdown="app.startNodeDrag(event,'${n.id}')">
        <path d="${path}" fill="${fill}" stroke="${ty.color}" stroke-width="${isFocused ? 2.6 : 1.6}" stroke-dasharray="${dash}"></path>
        <text y="${r + 15}" text-anchor="middle" font-size="11.5" fill="#26262c" style="font-family:Geist,sans-serif;paint-order:stroke;stroke:#fbfaf8;stroke-width:4px;pointer-events:none">${n.label}</text>
      </g>
    `;
  }).join('');

  const edgesHtml = visEdges.map(e => {
    const a = nodeMap[e.a], b = nodeMap[e.b];
    const key = e.a + '::' + e.b;
    const isEdgeFocused = focusedEdgeKey === key;
    const inFocusRadius = e.a === focusId || e.b === focusId || (state.expand && neighborSet.has(e.a) && neighborSet.has(e.b));
    const dim = focusId && !inFocusRadius && !isEdgeFocused;
    const color = isEdgeFocused ? '#5340c4' : '#9a9aa2';
    const w = e.weight * 0.9 + 0.4;
    const dash = e.style === 'dashed' ? '6 4' : e.style === 'dotted' ? '2 4' : 'none';
    const hx = a.x + (b.x - a.x) * 0.72, hy = a.y + (b.y - a.y) * 0.72;
    const showLabel = isEdgeFocused || (labelsOn && !dim);
    return `
      <g data-edge-a="${e.a}" data-edge-b="${e.b}" opacity="${dim ? 0.08 : 0.85}" style="cursor:pointer"
         onclick="event.stopPropagation();app.setEdgeFocus('${key}')">
        <line class="d5-edge-hit" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="transparent" stroke-width="14"></line>
        <line class="d5-edge-line" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${color}" stroke-width="${isEdgeFocused ? w + 1.2 : w}" stroke-dasharray="${dash}"></line>
        <circle class="d5-edge-dot" cx="${hx}" cy="${hy}" r="2.6" fill="${color}"></circle>
        ${showLabel ? `<text x="${(a.x + b.x) / 2}" y="${(a.y + b.y) / 2 - 5}" text-anchor="middle" font-size="10.5" fill="#5a5c66" style="font-family:Geist,sans-serif;paint-order:stroke;stroke:#fbfaf8;stroke-width:4px;pointer-events:none">${e.label}</text>` : ''}
      </g>
    `;
  }).join('');

  const zoom = state.zoom || 1;
  const graphTransform = `translate(${CENTER_X - CENTER_X * zoom},${CENTER_Y - CENTER_Y * zoom}) scale(${zoom})`;
  const zoomLabel = zoom.toFixed(1).replace('.', ',');

  const graphHint = isLoading
    ? 'Karte wird aufgebaut — die Filter links sind schon bedienbar'
    : filteredEmpty
      ? 'Kein Eintrag mit diesen Filtern'
      : isEmptyToggle
        ? 'Noch keine Verbindungen — Beziehungen entstehen beim Übernehmen oder auf den Detailseiten.'
        : focusId
          ? (state.expand
              ? 'Erweiterte Nachbarschaft hervorgehoben · Doppelklick öffnet die Detailseite · Esc verlässt'
              : 'Fokus: direkte Nachbarn hervorgehoben · Doppelklick öffnet die Detailseite · Esc verlässt')
          : focusedEdgeKey
            ? 'Verbindung ausgewählt · Esc schließt'
            : 'Knoten anklicken für Fokus · Ziehen zum Verschieben · Beschriftungen ab Zoom 1,4';

  const typeFiltersHtml = types.map(ty => {
    const off = hidden.indexOf(ty.key) >= 0;
    const count = allNodes.filter(n => n.key === ty.key).length;
    return `
      <button onclick="app.toggleGraphType('${ty.key}')" style="display:flex;align-items:center;gap:9px;padding:6px 8px;border-radius:7px;width:100%;${off ? 'color:#a3a3ab' : 'color:#3f4048'}">
        <svg width="16" height="16" viewBox="-9 -9 18 18" style="flex:none"><path d="${shapePath(ty.shape, 6.6)}" fill="${off ? '#fff' : tint(ty.color, 0.3)}" stroke="${off ? '#c9c8c2' : ty.color}" stroke-width="1.4"></path></svg>
        <span style="font-size:12.5px">${ty.label}</span>
        <span style="flex:1"></span>
        <span style="font-size:11px;color:#a3a3ab">${count}</span>
      </button>
    `;
  }).join('');

  const leftPanel = state.graphPanel !== false ? `
    <div style="width:238px;flex:none;border-right:1px solid #e6e5e0;background:#fff;padding:16px 14px;overflow:auto">
      <input placeholder="Im Netz suchen" style="width:100%;padding:8px 11px;border:1px solid #dcdbd5;border-radius:8px;font-size:13px;background:#fff">
      <div style="margin-top:16px;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#8b8d97">Typen aus dem Preset</div>
      <div style="display:grid;gap:1px;margin-top:8px">${typeFiltersHtml}</div>
      <div style="margin-top:18px;padding-top:14px;border-top:1px solid #efeee9;font-size:12.5px;color:#5a5c66">${visNodes.length} Einträge · ${visEdges.length} Verbindungen</div>
      <div style="margin-top:14px;display:grid;gap:8px">
        <label style="display:block">
          <span style="display:block;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#8b8d97;margin-bottom:6px">Zeitraum</span>
          <select style="width:100%;padding:7px 9px;border:1px solid #dcdbd5;border-radius:8px;font-size:12.5px;background:#fff">
            <option>Alle ${t.wgs}</option>
            <option>Letzte 30 Tage</option>
          </select>
        </label>
        <button onclick="app.toggleOnlyCanon()" style="display:flex;align-items:center;gap:9px;padding:8px 10px;border:1px solid ${onlyCanon ? '#c9c3ec' : '#e4e3de'};border-radius:9px;background:${onlyCanon ? '#f6f4fd' : '#fff'}">
          <span style="width:26px;height:15px;border-radius:999px;flex:none;position:relative;background:${onlyCanon ? '#5340c4' : '#dcdbd5'}">
            <span style="position:absolute;top:2px;left:${onlyCanon ? '13px' : '2px'};width:11px;height:11px;border-radius:50%;background:#fff;transition:left 140ms ease"></span>
          </span>
          <span style="font-size:12.5px">nur kanonisch</span>
        </button>
        ${(hidden.length || onlyCanon) ? `<button onclick="app.resetGraphFilters()" style="padding:7px 9px;border-radius:8px;font-size:12px;color:#5340c4;text-align:center">Filter zurücksetzen</button>` : ''}
      </div>
    </div>
  ` : '';

  const fNode = focusId ? nodeMap[focusId] : null;
  const fTy = fNode ? typeOf(fNode.key, preset) : null;
  const connectedEdges = fNode ? visEdges.filter(e => e.a === fNode.id || e.b === fNode.id) : [];

  const edgeForPanel = !fNode && focusedEdgeKey
    ? visEdges.find(e => (e.a + '::' + e.b) === focusedEdgeKey)
    : null;

  const rightPanel = fNode ? `
    <div style="width:290px;flex:none;border-left:1px solid #e6e5e0;background:#fff;padding:18px 16px;animation:nslide 220ms ease both;overflow:auto">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="${chipSt(fTy.color, false)}">${fTy.label}</span>
        <span style="flex:1"></span>
        <button onclick="app.clearGraphFocus()" style="font-size:12px;color:#8b8d97">Esc</button>
      </div>
      <h3 style="margin:12px 0 0;font-family:Spectral,Georgia,serif;font-size:21px;font-weight:500;letter-spacing:-.01em">${fNode.label}</h3>
      <div style="margin-top:14px;display:grid;gap:9px">
        ${fNode.fields.map(f => `<div style="display:flex;gap:10px;font-size:12.5px"><span style="color:#8b8d97;min-width:86px">${f[0]}</span><span>${f[1]}</span></div>`).join('')}
      </div>
      <p style="margin:14px 0 0;font-size:12px;color:#8b8d97">${fNode.canon ? 'Aus 2 Notizen · kanonisch' : `Vorschlag aus 1 Notiz · noch nicht ${t.canonVerb}`}</p>
      <div style="display:grid;gap:8px;margin-top:16px">
        <button onclick="app.openEntry('${jsStr(fNode.label)}')" style="padding:8px 12px;border:1px solid #dcdbd5;border-radius:8px;font-size:12.5px;background:#fff">Detailseite öffnen</button>
        <button onclick="app.expandNeighborhood()" ${state.expand ? 'disabled' : ''} style="padding:8px 12px;border:1px solid #dcdbd5;border-radius:8px;font-size:12.5px;background:${state.expand ? '#f4f4f2' : '#fff'};color:${state.expand ? '#a3a3ab' : '#16161a'}">${state.expand ? 'Nachbarschaft erweitert' : 'Nachbarschaft erweitern'}</button>
      </div>
      <div style="margin-top:18px;padding-top:14px;border-top:1px solid #efeee9">
        <div style="font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#8b8d97">Verbindungen</div>
        <div style="display:grid;gap:6px;margin-top:9px">
          ${connectedEdges.length ? connectedEdges.map(e => {
            const other = e.a === fNode.id ? nodeMap[e.b] : nodeMap[e.a];
            const text = e.a === fNode.id
              ? `${fNode.label} ${e.label} ${other ? other.label : '…'}`
              : `${other ? other.label : '…'} ${e.label} ${fNode.label}`;
            return `<div style="font-size:12.5px;color:#3f4048">${text}</div>`;
          }).join('') : `<div style="font-size:12px;color:#a3a3ab">Keine Verbindungen sichtbar</div>`}
        </div>
      </div>
    </div>
  ` : (edgeForPanel ? `
    <div style="width:290px;flex:none;border-left:1px solid #e6e5e0;background:#fff;padding:18px 16px;animation:nslide 220ms ease both;overflow:auto">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#8b8d97">Verbindung</span>
        <span style="flex:1"></span>
        <button onclick="app.clearGraphFocus()" style="font-size:12px;color:#8b8d97">Esc</button>
      </div>
      <p style="margin:12px 0 0;font-size:14.5px;color:#16161a;line-height:1.5"><strong>${nodeMap[edgeForPanel.a].label}</strong> ${edgeForPanel.label} <strong>${nodeMap[edgeForPanel.b].label}</strong></p>
      <div style="margin-top:18px;padding-top:14px;border-top:1px solid #efeee9">
        <div style="font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#8b8d97">Herkunft — dieselbe Notiz wie im Wiki</div>
        <div style="margin-top:9px;padding:10px 12px;background:#f9f8f6;border-radius:8px;font-size:12.5px;color:#3f4048">${edgeForPanel.origin || 'Herkunft unbekannt'}</div>
      </div>
    </div>
  ` : '');

  const canvasHint = filteredEmpty ? `
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
      <div style="text-align:center;max-width:280px;">
        <p style="margin:0 0 14px;font-size:13.5px;color:#5a5c66;">Kein Eintrag mit diesen Filtern</p>
        <button onclick="app.resetGraphFilters()" style="padding:8px 16px;background:#5340c4;color:#fff;border:none;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;">Zurücksetzen</button>
      </div>
    </div>
  ` : '';

  return `
    <div style="position:absolute;inset:0;display:flex;background:#fbfaf8">
      ${leftPanel}
      <div style="flex:1;min-width:0;position:relative">
        <button onclick="app.toggleGraphPanel()" style="position:absolute;left:12px;top:12px;z-index:5;padding:6px 10px;border:1px solid #e4e3de;border-radius:8px;background:#fff;font-size:12px;box-shadow:0 1px 3px rgba(22,22,26,.06)">${state.graphPanel !== false ? 'Filter ausblenden' : 'Filter'}</button>
        <svg id="d5-svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" preserveAspectRatio="xMidYMid meet" style="position:absolute;inset:0;width:100%;height:100%;background-image:radial-gradient(#e2e1db 1px,transparent 1px);background-size:22px 22px" onclick="app.clearGraphFocus()">
          <g id="d5-graph-g" transform="${graphTransform}">
            ${edgesHtml}
            ${nodesHtml}
          </g>
        </svg>
        ${canvasHint}
        <div style="position:absolute;right:14px;bottom:14px;display:flex;align-items:center;gap:6px;padding:5px;background:#fff;border:1px solid #e4e3de;border-radius:10px;box-shadow:0 1px 3px rgba(22,22,26,.07)">
          <button onclick="app.zoomGraph(-0.2)" style="width:28px;height:28px;border-radius:7px;text-align:center;font-size:15px">−</button>
          <span style="font-size:11.5px;color:#5a5c66;min-width:38px;text-align:center">${zoomLabel}</span>
          <button onclick="app.zoomGraph(0.2)" style="width:28px;height:28px;border-radius:7px;text-align:center;font-size:15px">+</button>
          <span style="width:1px;height:18px;background:#e4e3de"></span>
          <button onclick="app.setGraphLayout('${layout === 'circle' ? 'force' : 'circle'}')" style="padding:0 9px;height:28px;border-radius:7px;font-size:12px;white-space:nowrap">${layout === 'circle' ? 'Kräfte-Layout' : 'Kreis-Layout'}</button>
          <span style="width:1px;height:18px;background:#e4e3de"></span>
          <button onclick="app.resetGraphView()" style="padding:0 9px;height:28px;border-radius:7px;font-size:12px;white-space:nowrap">Zurücksetzen</button>
        </div>
        <div style="position:absolute;left:12px;bottom:14px;font-size:11.5px;color:#8b8d97;background:rgba(251,250,248,.86);padding:5px 9px;border-radius:7px;max-width:60%;">${graphHint}</div>
      </div>
      ${rightPanel}
    </div>
  `;
}
