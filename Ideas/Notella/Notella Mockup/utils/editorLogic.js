/**
 * Editor interaction logic
 * Handles mention popups, AI suggestions, and related functionality
 */

/**
 * Check for mention pattern (@) in editor and update position
 * @param {Object} state - Current component state
 * @param {Object} preset - Current preset data
 * @returns {Object} Updated mention state or null
 */
export function checkMention(state, preset) {
  const sel = document.getSelection();
  if (!sel || !sel.anchorNode) return null;

  const txt = (sel.anchorNode.textContent || '').slice(0, sel.anchorOffset);
  const m = txt.match(/@([\wÄÖÜäöüß\- ]{0,24})$/);
  if (!m) return null;

  const r = sel.getRangeAt(0).getBoundingClientRect();
  const position = {
    q: m[1],
    x: Math.max(8, Math.min(r.left, window.innerWidth - 340)),
    y: flipY(r, 268),
  };

  return position;
}

/**
 * Analyze text for AI suggestions
 * @param {Object} state - Current component state
 * @param {Object} preset - Current preset data
 * @returns {Object} AI suggestion or null
 */
export function analyzeAi(state, preset) {
  if (!state.aiMode || state.mention) return null;

  const sel = document.getSelection();
  if (!sel || !sel.anchorNode) return null;

  const full = sel.anchorNode.textContent || '';
  const before = full.slice(0, sel.anchorOffset);
  const m = before.match(/([A-ZÄÖÜ][A-Za-zÄÖÜäöüß\-]{2,})$/);
  if (!m) return null;

  const word = m[1];
  const hit = preset.entities.find(
    (e) => e.label.toLowerCase().indexOf(word.toLowerCase()) === 0
  );

  const r = sel.getRangeAt(0).getBoundingClientRect();
  const pos = {
    x: Math.max(8, Math.min(r.left, window.innerWidth - 360)),
    y: flipY(r, 92),
  };

  if (hit) {
    const ty = typeOf(hit.key, preset);

    // Check for relation suggestion
    const rel = (preset.relations || []).find(
      (rr) =>
        before.toLowerCase().indexOf(' ' + rr.label.toLowerCase() + ' ') >= 0
    );
    const other = rel
      ? preset.entities.find(
          (e) =>
            e.label !== hit.label &&
            before.toLowerCase().indexOf(e.label.toLowerCase()) >= 0
        )
      : null;

    if (rel && other) {
      return Object.assign(pos, {
        kind: 'relation',
        word: word,
        insert: hit.label,
        color: ty.color,
        text: `Beziehung erkannt: ${other.label} ${rel.label} ${hit.label}`,
        sub: `markiert ${hit.label} als ${ty.label} und legt die Beziehung als Vorschlag an`,
      });
    }

    return Object.assign(pos, {
      kind: 'known',
      word: word,
      insert: hit.label,
      color: ty.color,
      text: `„${hit.label}" als ${ty.label} markieren`,
      sub: hit.tag
        ? 'vorhandener Vorschlag'
        : `vorhandener Eintrag im ${preset.t.canonNoun}`,
    });
  }

  if (word.length >= 4) {
    const ty =
      preset.types.find(
        (x) => x.key !== 'teammember' && x.key !== 'character'
      ) || preset.types[0];
    return Object.assign(pos, {
      kind: 'new',
      word: word,
      insert: word,
      color: ty.color,
      text: `„${word}" neu als ${ty.label} anlegen`,
      sub: 'noch kein Eintrag mit diesem Namen',
    });
  }

  return null;
}

/**
 * Insert a mention at current cursor position
 * @param {string} label - The text to insert
 * @param {string} color - The color for the mention badge
 * @param {Object} state - Current state to remove mention string
 */
export function insertMention(label, color, state) {
  const q = state.mention ? state.mention.q : '';
  for (let i = 0; i < q.length + 1; i++) {
    document.execCommand('delete', false);
  }

  const html =
    `<span contenteditable="false" style="display:inline-flex;align-items:center;gap:5px;padding:1px 8px 2px;border-radius:999px;background:${tintColor(color, 0.14)};color:${color};font-size:14px;font-weight:500;white-space:nowrap">` +
    `<span style="width:5px;height:5px;border-radius:50%;background:${color}"></span>${label}</span>&nbsp;`;

  document.execCommand('insertHTML', false, html);
}

/**
 * Accept an AI suggestion by inserting the text
 * @param {Object} aiSug - AI suggestion object
 */
export function acceptAi(aiSug) {
  if (!aiSug) return;

  for (let i = 0; i < aiSug.word.length; i++) {
    document.execCommand('delete', false);
  }

  const html =
    `<span contenteditable="false" style="display:inline-flex;align-items:center;gap:5px;padding:1px 8px 2px;border-radius:999px;background:${tintColor(aiSug.color, 0.14)};color:${aiSug.color};font-size:14px;font-weight:500;white-space:nowrap">` +
    `<span style="width:5px;height:5px;border-radius:50%;background:${aiSug.color}"></span>${aiSug.insert}</span>&nbsp;`;

  document.execCommand('insertHTML', false, html);
}

/**
 * Flip position vertically if content would overflow viewport
 * @param {DOMRect} r - Bounding rect of cursor
 * @param {number} h - Height of popup
 * @returns {number} Y position (top or above)
 */
export function flipY(r, h) {
  const below = r.bottom + 8;
  return below + h > window.innerHeight - 8
    ? Math.max(8, r.top - h - 8)
    : below;
}

/**
 * Get type info by key
 * @param {string} key - Type key
 * @param {Object} preset - Current preset
 * @returns {Object} Type object with label, color, etc.
 */
function typeOf(key, preset) {
  return preset.types.find((t) => t.key === key) || preset.types[0];
}

/**
 * Tint a hex color with alpha
 * @param {string} hex - Hex color
 * @param {number} alpha - Alpha value
 * @returns {string} RGBA string
 */
function tintColor(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

export { typeOf, tintColor };
