/**
 * Shared utility functions for rendering and styling
 * These are used across multiple components
 */

/**
 * Tint a hex color with alpha transparency
 * @param {string} hex - Hex color code (e.g., '#5340c4')
 * @param {number} alpha - Alpha value (0-1)
 * @returns {string} RGBA color string
 */
export function tint(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

/**
 * Create a mark/indicator square style
 * @param {string} color - Hex color
 * @param {number} size - Size in pixels (default: 9)
 * @returns {string} CSS style string
 */
export function markSt(color, size = 9) {
  return `width:${size}px;height:${size}px;border-radius:3px;background:${color};flex:none;display:inline-block`;
}

/**
 * Create a chip/badge style with background and border
 * @param {string} color - Hex color
 * @param {boolean} dashed - Whether to use dashed border
 * @returns {string} CSS style string
 */
export function chipSt(color, dashed = false) {
  return `display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;font-size:11.5px;font-weight:500;background:${tint(color, 0.13)};color:${color};border:1px ${dashed ? 'dashed' : 'solid'} ${tint(color, 0.3)}`;
}

/**
 * Create an avatar circle style
 * @param {number} index - Position index (for negative margin overlap)
 * @returns {string} CSS style string
 */
export function avSt(index = 0) {
  return `width:24px;height:24px;border-radius:50%;background:#e9e7f7;color:#4a3aad;font-size:10px;font-weight:600;display:flex;align-items:center;justify-content:center;border:2px solid #fff;margin-left:${index ? '-7px' : '0'}`;
}

/**
 * Create a segment/tab button style (for toggle groups)
 * @param {boolean} active - Whether the segment is active
 * @returns {string} CSS style string
 */
export function segSt(active) {
  return `padding:5px 11px;border-radius:6px;font-size:11.5px;white-space:nowrap;${
    active
      ? 'background:#f4f4f2;color:#16161a;font-weight:600'
      : 'color:#a3a3ab'
  }`;
}

/**
 * Generate an SVG icon component (for React)
 * @param {string} name - Icon name
 * @returns {React.Element} SVG element
 */
export function createIcon(name) {
  const React = typeof require !== 'undefined' ? require('react') : window.React;
  const R = React.createElement;
  const p = {
    width: 15,
    height: 15,
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const paths = {
    home: ['M3 8.5 10 3l7 5.5V16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z'],
    pencil: ['M4 16h3l9-9-3-3-9 9z', 'M13 4l3 3'],
    book: [
      'M4 4h5a2 2 0 0 1 2 2v10a2 2 0 0 0-2-2H4z',
      'M16 4h-5a2 2 0 0 0-2 2v10a2 2 0 0 1 2-2h5z',
    ],
    graph: [
      'M6 6.5h0.01',
      'M14 5h0.01',
      'M9 14h0.01',
      'M6.6 7.2 13.4 5.6',
      'M7 8 8.6 12.6',
      'M10 13.4 13.6 6.2',
    ],
    inbox: [
      'M3 11h4l1 2h4l1-2h4',
      'M3 11l2-6h10l2 6v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z',
    ],
    gear: [
      'M10 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
      'M10 3v2M10 15v2M3 10h2M15 10h2M5.5 5.5l1.4 1.4M13.1 13.1l1.4 1.4M14.5 5.5l-1.4 1.4M6.9 13.1l-1.4 1.4',
    ],
    user: [
      'M10 4.5a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2z',
      'M4.5 16.5c.7-2.8 2.9-4.3 5.5-4.3s4.8 1.5 5.5 4.3',
    ],
  };

  const circles = {
    graph: [
      [6, 6.5, 2.2],
      [14, 5, 1.8],
      [9, 14, 2],
    ],
  };

  const kids = (paths[name] || []).map((d, i) =>
    R('path', { key: 'p' + i, d })
  );
  (circles[name] || []).forEach((c, i) =>
    kids.push(
      R('circle', { key: 'c' + i, cx: c[0], cy: c[1], r: c[2] })
    )
  );

  return R('svg', p, kids);
}

/**
 * Generate SVG shapes for graph visualization
 * @param {string} shape - Shape type: 'circle', 'roundrect', 'diamond', 'hexagon', 'pentagon', 'star'
 * @param {number} r - Radius size
 * @returns {string} SVG path data
 */
export function shapePath(shape, r) {
  const pts = (n, rot) => {
    let a = [];
    for (let i = 0; i < n; i++) {
      const t = rot + (i * 2 * Math.PI) / n;
      a.push((r * Math.cos(t)).toFixed(1) + ',' + (r * Math.sin(t)).toFixed(1));
    }
    return 'M' + a.join('L') + 'Z';
  };

  if (shape === 'circle') {
    return (
      'M' +
      -r +
      ',0a' +
      r +
      ',' +
      r +
      ' 0 1,0 ' +
      2 * r +
      ',0a' +
      r +
      ',' +
      r +
      ' 0 1,0 ' +
      -2 * r +
      ',0'
    );
  }
  if (shape === 'roundrect') {
    const w = r * 1.25,
      h = r * 0.86,
      k = 3.5;
    return (
      'M' +
      (-w + k) +
      ',' +
      -h +
      'h' +
      (2 * w - 2 * k) +
      'a' +
      k +
      ',' +
      k +
      ' 0 0 1 ' +
      k +
      ',' +
      k +
      'v' +
      (2 * h - 2 * k) +
      'a' +
      k +
      ',' +
      k +
      ' 0 0 1 ' +
      -k +
      ',' +
      k +
      'h' +
      (-2 * w + 2 * k) +
      'a' +
      k +
      ',' +
      k +
      ' 0 0 1 ' +
      -k +
      ',' +
      -k +
      'v' +
      (-2 * h + 2 * k) +
      'a' +
      k +
      ',' +
      k +
      ' 0 0 1 ' +
      k +
      ',' +
      -k +
      'Z'
    );
  }
  if (shape === 'diamond') return pts(4, -Math.PI / 2);
  if (shape === 'hexagon') return pts(6, Math.PI / 2);
  if (shape === 'pentagon') return pts(5, -Math.PI / 2);
  if (shape === 'star') {
    let a = [];
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 ? r * 0.46 : r;
      const t = -Math.PI / 2 + (i * Math.PI) / 5;
      a.push((rr * Math.cos(t)).toFixed(1) + ',' + (rr * Math.sin(t)).toFixed(1));
    }
    return 'M' + a.join('L') + 'Z';
  }
  return pts(6, Math.PI / 2);
}
