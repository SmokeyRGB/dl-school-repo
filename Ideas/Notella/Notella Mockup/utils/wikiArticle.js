/**
 * Artikel-Auflösung für den Wiki-Artikel (D2).
 *
 * Jedes Preset bringt genau einen ausgeschriebenen Artikel mit (`article`).
 * Für alle übrigen Einträge — Baum, Beziehungs-Chips, Doppelklick im Graphen —
 * wird der Artikel aus dem vorhandenen Wissensmodell abgeleitet: Felder aus
 * `nodes`, Beziehungen und Herkunft aus `edges`. Nichts wird erfunden, was
 * nicht schon im Preset steht; deshalb bleibt der Bildschirm preset-neutral.
 *
 * Pure Funktionen, kein DOM.
 */

/** Richtungszeichen statt erfundener Umkehrverben („hängt ab von" ↔ ?). */
const OUT = '→';
const IN = '←';

function typeOf(key, preset) {
  return preset.types.find((type) => type.key === key) || preset.types[0];
}

/** Erste Angabe einer Herkunftszeile: „Sprint-Planung KW 30 · Sam · 22. Juli". */
function meetingOf(origin) {
  return (origin || '').split('·')[0].trim();
}

function uniq(values) {
  return values.filter((value, i) => value && values.indexOf(value) === i);
}

/** Beziehungen nach Bezeichnung gruppieren, Richtung als Zeichen davor. */
function relationsOf(preset, node) {
  if (!node) return [];
  const groups = new Map();

  (preset.edges || []).forEach((edge) => {
    const outgoing = edge.a === node.id;
    const incoming = edge.b === node.id;
    if (!outgoing && !incoming) return;

    const otherId = outgoing ? edge.b : edge.a;
    const other = (preset.nodes || []).find((n) => n.id === otherId);
    if (!other) return;

    const label = `${outgoing ? OUT : IN} ${edge.label}`;
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(other.label);
  });

  return [...groups].map(([label, items]) => ({ label, items: uniq(items) }));
}

/** Herkunft: je Kante die Stelle, an der die Beziehung festgehalten wurde. */
function originOf(preset, node, title) {
  const { d, t } = preset;
  if (!node) {
    return [{
      tag: 'Notiz',
      meta: `${d.wgName} › ${d.meetingTitle}`,
      text: `„${title}" ist bislang nur als Vorschlag erwähnt — noch keine Belegstelle im ${t.canonNoun}.`,
      link: ''
    }];
  }

  const items = (preset.edges || [])
    .filter((edge) => edge.a === node.id || edge.b === node.id)
    .map((edge) => {
      const otherId = edge.a === node.id ? edge.b : edge.a;
      const other = (preset.nodes || []).find((n) => n.id === otherId);
      const from = edge.a === node.id ? node.label : (other || {}).label;
      const to = edge.a === node.id ? (other || {}).label : node.label;
      return {
        tag: 'Notiz',
        meta: edge.origin || `${d.wgName} › ${d.meetingTitle}`,
        text: `„${from} ${edge.label} ${to}" — hier festgehalten.`,
        link: 'An die Textstelle springen'
      };
    });

  return items.length ? items : [{
    tag: 'Notiz',
    meta: `${d.wgName} › ${d.meetingTitle}`,
    text: `„${title}" wurde erwähnt, aber noch mit nichts verbunden.`,
    link: 'An die Textstelle springen'
  }];
}

function historyOf(preset, node, isCanon) {
  const { d, t } = preset;
  return [{
    tag: isCanon ? 'Kanonisierung' : 'Vorschlag',
    meta: `${d.leadFull} · ${d.meetingDate}`,
    text: isCanon
      ? `Aus einem Vorschlag ins ${t.canonNoun} übernommen.`
      : `Als Vorschlag angelegt — noch nicht ${t.canonVerb}. Die Entscheidung steht in der Kuration an.`,
    link: node ? 'Auslösende Notiz' : ''
  }];
}

/**
 * Baut den Artikel eines Eintrags aus Entitäten, Knoten und Kanten.
 * @param {object} preset  Aktuelles Preset
 * @param {string} title   Titel des Eintrags
 */
function buildArticle(preset, title) {
  const { t, d } = preset;
  const entity = (preset.entities || []).find((e) => e.label === title);
  const node = (preset.nodes || []).find((n) => n.label === title);
  const type = typeOf((entity || node || {}).key, preset);
  const isCanon = node ? node.canon : !(entity && entity.tag);

  const rels = relationsOf(preset, node);
  const origin = originOf(preset, node, title);
  const relCount = rels.reduce((sum, group) => sum + group.items.length, 0);

  const fieldSummary = (node && node.fields || [])
    .map((f) => `${f[0]}: ${f[1]}`)
    .join(' · ');

  return {
    typeKey: type.key,
    title,
    state: isCanon ? 'kanonisch' : 'Vorschlag',
    aliases: '—',
    originLine: `Aus ${origin.length} ${origin.length === 1 ? 'Notiz' : 'Notizen'} · zuletzt gesehen in ${d.meetingTitle}`,
    fields: (node && node.fields) || [],
    body: [
      `„${title}" steht als ${type.label} im ${t.canonNoun} von ${d.projectName}${fieldSummary ? ` — ${fieldSummary}` : ''}.`,
      isCanon
        ? `${relCount} ${relCount === 1 ? 'Verbindung hängt' : 'Verbindungen hängen'} an diesem Eintrag. Der Text wächst aus dem, was in ${t.meetings} dazu geschrieben wird.`
        : `Noch ein Vorschlag: die Projektleitung muss ihn erst ${t.canonVerb} — dann steht er im ${t.canonNoun}.`
    ],
    rels,
    backrefs: uniq(origin.map((o) => meetingOf(o.meta))),
    origin,
    history: historyOf(preset, node, isCanon)
  };
}

/**
 * Artikel zum ausgewählten Eintrag. Ohne Auswahl (und für den Eintrag, den
 * das Preset ausgeschrieben mitbringt) der handgeschriebene Artikel.
 *
 * @param {object} preset       Aktuelles Preset
 * @param {string} [entryTitle] Titel aus state.entry
 */
export function resolveArticle(preset, entryTitle) {
  const title = entryTitle || preset.article.title;
  if (title === preset.article.title) return preset.article;
  return buildArticle(preset, title);
}
