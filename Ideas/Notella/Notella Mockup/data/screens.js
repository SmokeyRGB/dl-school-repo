/**
 * Screen-Register — einzige Quelle für Screen-Metadaten.
 *
 * chrome bestimmt das Rahmen-Verhalten (siehe components/navSidebar.js):
 *   'start'  — ohne Sidebar (Einstiegsseiten)
 *   'orient' — Sidebar dauerhaft offen (Überblicksseiten)
 *   'focus'  — Sidebar eingeklappt, öffnet bei Hover (Arbeitsseiten)
 */
export const SCREENS = {
  B1: { name: 'Alle Projekte', chrome: 'start' },
  B2: { name: 'Projekt anlegen', chrome: 'start' },
  B3: { name: 'Projektübersicht', chrome: 'orient' },
  C1: { name: 'Meeting-Raum', chrome: 'focus' },
  D2: { name: 'Wiki-Artikel', chrome: 'focus' },
  D5: { name: 'Beziehungs-Graph', chrome: 'focus' },
  E1: { name: 'Review-Inbox', chrome: 'focus' },
  F3: { name: 'Preset-Ansicht', chrome: 'focus' }
};
