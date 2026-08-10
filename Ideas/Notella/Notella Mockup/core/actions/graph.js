/**
 * Aktionen des Beziehungs-Graphen (D5): Filter, Fokus, Ansicht, Ziehen.
 * Wird per Object.assign in NotellaMockupApp.prototype gemischt (core/app.js).
 */

const ZOOM_MIN = 0.6;
const ZOOM_MAX = 2.4;

/** Position des Beziehungspunkts auf der Kante (0 = Start, 1 = Ziel). */
const EDGE_DOT_AT = 0.72;

const TRANSLATE_PATTERN = /translate\(([-\d.]+),([-\d.]+)\)/;

/** Liest die aktuelle translate()-Position eines SVG-Elements. */
function readTranslate(el, fallback = { x: 0, y: 0 }) {
  const match = el && TRANSLATE_PATTERN.exec(el.getAttribute('transform') || '');
  return match
    ? { x: parseFloat(match[1]), y: parseFloat(match[2]) }
    : fallback;
}

/** Rechnet Bildschirm- in Graph-Koordinaten um. */
function toGraphCoords(svg, group, clientX, clientY) {
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  return point.matrixTransform(group.getScreenCTM().inverse());
}

/** Zieht die Kanten eines bewegten Knotens mit. */
function followEdges(svg, edgeEls, nodeId, x, y) {
  edgeEls.forEach((edgeEl) => {
    const startsHere = edgeEl.getAttribute('data-edge-a') === nodeId;
    const otherId = startsHere
      ? edgeEl.getAttribute('data-edge-b')
      : edgeEl.getAttribute('data-edge-a');
    const other = readTranslate(svg.querySelector(`[data-node-id="${otherId}"]`), { x, y });

    const ax = startsHere ? x : other.x;
    const ay = startsHere ? y : other.y;
    const bx = startsHere ? other.x : x;
    const by = startsHere ? other.y : y;

    edgeEl.querySelectorAll('.d5-edge-hit, .d5-edge-line').forEach((line) => {
      line.setAttribute('x1', ax);
      line.setAttribute('y1', ay);
      line.setAttribute('x2', bx);
      line.setAttribute('y2', by);
    });

    const dot = edgeEl.querySelector('.d5-edge-dot');
    if (dot) {
      dot.setAttribute('cx', ax + (bx - ax) * EDGE_DOT_AT);
      dot.setAttribute('cy', ay + (by - ay) * EDGE_DOT_AT);
    }
  });
}

export const graphActions = {
  // -------- Filter --------

  toggleGraphType(key) {
    const hidden = this.state.hidden || [];
    const next = hidden.includes(key)
      ? hidden.filter((k) => k !== key)
      : hidden.concat([key]);
    this.setState({ hidden: next });
  },

  toggleOnlyCanon() {
    this.setState({ onlyCanon: !this.state.onlyCanon });
  },

  toggleGraphPanel() {
    this.setState({ graphPanel: this.state.graphPanel === false });
  },

  resetGraphFilters() {
    this.setState({ hidden: [], onlyCanon: false });
  },

  // -------- Fokus --------

  setGraphFocus(id) {
    this.setState({ focus: id, edgeFocus: null, expand: false });
  },

  setEdgeFocus(key) {
    this.setState({ edgeFocus: key, focus: null, expand: false });
  },

  clearGraphFocus() {
    this.setState({ focus: null, edgeFocus: null, expand: false });
  },

  expandNeighborhood() {
    this.setState({ expand: true });
  },

  // -------- Ansicht --------

  zoomGraph(delta) {
    const raw = +((this.state.zoom || 1) + delta).toFixed(2);
    this.setState({ zoom: Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, raw)) });
  },

  resetGraphView() {
    this.setState({ zoom: 1, focus: null, edgeFocus: null, expand: false });
  },

  setGraphLayout(mode) {
    this.setState({ graphLayout: mode, nodePos: {}, focus: null, edgeFocus: null });
  },

  /**
   * Knoten ziehen: während der Bewegung wird das SVG direkt manipuliert
   * (kein Re-Render pro Pixel), der State bekommt die neue Position erst
   * beim Loslassen.
   */
  startNodeDrag(event, id) {
    if (event.button !== undefined && event.button !== 0) return;

    const svg = document.getElementById('d5-svg');
    const group = document.getElementById('d5-graph-g');
    const nodeEl = svg && svg.querySelector(`[data-node-id="${id}"]`);
    if (!svg || !group || !nodeEl) return;

    event.stopPropagation();

    const origin = readTranslate(nodeEl);
    const grab = toGraphCoords(svg, group, event.clientX, event.clientY);
    const offsetX = grab.x - origin.x;
    const offsetY = grab.y - origin.y;
    const edgeEls = svg.querySelectorAll(`[data-edge-a="${id}"], [data-edge-b="${id}"]`);

    let moved = false;
    let last = origin;

    const onMove = (moveEvent) => {
      moved = true;
      const point = toGraphCoords(svg, group, moveEvent.clientX, moveEvent.clientY);
      last = { x: point.x - offsetX, y: point.y - offsetY };
      nodeEl.setAttribute('transform', `translate(${last.x},${last.y})`);
      followEdges(svg, edgeEls, id, last.x, last.y);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      if (!moved) return;
      this.state.nodePos = Object.assign({}, this.state.nodePos, { [id]: last });
      this.render();
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
  }
};
