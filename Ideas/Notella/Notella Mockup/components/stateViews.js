/**
 * Bausteine für die Pflichtzustände Laden · Leer · Fehler (SRD §10).
 *
 * Damit alle Screens dieselbe Sprache sprechen: eine Form für die
 * Mitteilung, ein Baustein für Skeletons. Was drinsteht, bestimmt der
 * Screen — die Texte stehen im Screen-Inventar, nicht hier.
 *
 * Skeletons bleiben bewusst formfrei: sie sollen die Form des erwarteten
 * Inhalts nachbilden, nicht eine allgemeine graue Fläche sein.
 */

/**
 * Mittige Mitteilung mit optionalen Handlungen.
 *
 * @param {object}  view
 * @param {string} [view.icon]   Ein Zeichen über der Überschrift
 * @param {string}  view.title   Was los ist, in einem Satzteil
 * @param {string}  view.text    Ein Satz ohne Fachjargon
 * @param {Array<{label: string, onclick: string, primary?: boolean}>} [view.actions]
 */
export function noticeView({ icon, title, text, actions = [] }) {
  const buttons = actions.map((action) => `
    <button onclick="${action.onclick}" style="padding:10px 18px;border-radius:9px;font-size:13.5px;font-weight:${action.primary ? '600' : '500'};cursor:pointer;
      ${action.primary
        ? 'background:#5340c4;color:#fff;border:none'
        : 'background:#fff;color:#16161a;border:1px solid #e4e4e0'}">${action.label}</button>
  `).join('');

  return `
    <div style="min-height:100%;display:flex;align-items:center;justify-content:center;padding:60px 40px">
      <div style="max-width:440px;text-align:center">
        ${icon ? `<div style="font-size:32px;margin-bottom:16px">${icon}</div>` : ''}
        <h2 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#16161a">${title}</h2>
        <p style="margin:0 0 24px;font-size:14px;color:#5a5c66;line-height:1.6">${text}</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">${buttons}</div>
      </div>
    </div>
  `;
}

/**
 * Fehlerform: was schiefging, „Erneut versuchen", und die Zusicherung,
 * dass nichts verloren ging (SRD §10).
 *
 * @param {object}  view
 * @param {string}  view.title       Ein Satz, kein Fachjargon
 * @param {string}  view.text        Zusicherung inklusive
 * @param {string} [view.icon]
 * @param {{label: string, onclick: string}} [view.fallback]  Zweiter Weg zum selben Inhalt
 */
export function errorView({ title, text, icon, fallback }) {
  return noticeView({
    icon,
    title,
    text,
    actions: [
      { label: 'Erneut versuchen', onclick: "app.setState({mode:'normal'})", primary: true },
      ...(fallback ? [fallback] : [])
    ]
  });
}

/** Ein graues Rechteck in Wunschmaß — Bauteil für Skeletons. */
export function skeletonBar(width, height = 12, extra = '') {
  return `<div style="height:${height}px;width:${width};background:#e4e4e0;border-radius:6px;${extra}"></div>`;
}

/** Rahmen um Skeleton-Bauteile; das Schimmern kommt aus global.css. */
export function skeletonBox(inner, extra = '') {
  return `<div style="padding:18px;background:#fff;border:1px solid #e6e5e0;border-radius:13px;animation:nshim 1.6s infinite;${extra}">${inner}</div>`;
}
