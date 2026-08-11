/**
 * Preset „Software-Projekt" — reine Mockup-Daten, keine Logik.
 *
 * t = Terminologie (Vokabular des Presets), d = Demo-Werte,
 * types/entities/nodes/edges = Wissensmodell, article = D2, review = E1.
 */
export const softwarePreset = {
  id: 'software-project',
  name: 'Software-Projekt',
  version: '1.2',
  t: {
    project: 'Projekt',
    projects: 'Projekte',
    wg: 'Sprint',
    wgs: 'Sprints',
    meeting: 'Meeting',
    meetings: 'Meetings',
    part: 'Teammitglied',
    parts: 'Team',
    canonVerb: 'übernehmen',
    canonNoun: 'Projektwissen'
  },
  d: {
    projectName: 'Produktteam Nord',
    projectDesc: 'Discovery und Umsetzung, wöchentlich',
    wgName: 'Sprint 14',
    meetingTitle: 'Sprint-Planung KW 32',
    meetingDate: 'Mi, 5. August 2026 · 10:00',
    minutes: 24,
    leadName: 'Sam',
    leadFull: 'Sam Ritter',
    me: 'Mira Kant',
    open: 5,
    // Notizen des laufenden Meetings (C1). Ein Absatz = eine Liste aus
    // Textstücken; { ref } zeigt auf eine Entität und wird als Chip in der
    // Farbe ihres Typs gezeichnet.
    notes: [
      [{ t: 'Runde zum ' }, { ref: 'Preset-Loader' }, { t: ': das Laden der YAML-Datei ist fertig, die Validierung fehlt noch.' }],
      [{ t: 'Wir haben festgelegt, dass wir ' }, { ref: 'Postgres statt SQLite' }, { t: ' nehmen — Begründung: wir brauchen JSONB für die Preset-Bindung.' }],
      [{ t: 'Offen: wer den Validator schreibt. ' }, { ref: 'Schema-Validator schreiben' }, { t: ' hängt am ' }, { ref: 'Preset-Loader' }, { t: '.' }]
    ],
    // Geteilte Notizen der anderen (Schublade in C1)
    shared: [
      { initials: 'SR', name: 'Sam Ritter', text: 'Postgres statt SQLite steht fest — JSONB für die Preset-Bindung.', ago: '2 Min' },
      { initials: 'MK', name: 'Mira Kant', text: 'Wer übernimmt den Schema-Validator? Ich kann das nächste Woche machen.', ago: '5 Min' },
      { initials: 'JH', name: 'Jo Halász', text: 'Erwähnungs-Auswahl per @ läuft schon lokal, muss noch an die Presets angebunden werden.', ago: '11 Min' }
    ]
  },
  types: [
    { key: 'component', label: 'Komponente', color: '#2fb8a0', shape: 'roundrect', count: 7 },
    { key: 'decision', label: 'Entscheidung', color: '#5340c4', shape: 'diamond', count: 4 },
    { key: 'risk', label: 'Risiko', color: '#c8553d', shape: 'star', count: 3 },
    { key: 'task', label: 'Aufgabe', color: '#3f7fd0', shape: 'pentagon', count: 6 },
    { key: 'teammember', label: 'Teammitglied', color: '#7a7f8c', shape: 'circle', count: 5 }
  ],
  // Beziehungswörter, an denen der KI-Vorschlag eine Beziehung erkennt
  // (dieselben Bezeichnungen wie in edges).
  relations: [
    { label: 'hängt ab von' },
    { label: 'verantwortet' },
    { label: 'betrifft' },
    { label: 'gefährdet' },
    { label: 'setzt um' }
  ],
  wgs: [
    {
      name: 'Sprint 12',
      live: false,
      av: ['SR', 'MK', 'JH'],
      meetings: [
        ['Sprint Review KW 30', 'beendet'],
        ['Retro & Planning', 'beendet']
      ]
    },
    {
      name: 'Sprint 14',
      live: true,
      av: ['SR', 'MK', 'JH', 'LP'],
      meetings: [
        ['Sprint-Planung KW 32', 'läuft'],
        ['Daily Standup', 'läuft'],
        ['Sprint Review', 'geplant']
      ]
    },
    {
      name: 'Sprint 15',
      live: false,
      av: ['MK', 'LP'],
      meetings: [
        ['Planning Session', 'geplant']
      ]
    }
  ],
  projects: [
    { name: 'Produktteam Nord', preset: 'Software-Projekt', meta: '3 Sprints · 41 Einträge', activity: 'zuletzt heute', live: true, av: ['SR', 'MK', 'JH'] },
    { name: 'Aethermoor', preset: 'TableTop', meta: '2 Kampagnen · 63 Einträge', activity: 'zuletzt Sonntag', live: false, av: ['TB', 'NV', 'RK'] },
    { name: 'Studiengruppe Statistik', preset: 'Software-Projekt', meta: '1 Sprint · 8 Einträge', activity: 'zuletzt 22. Juli', live: false, av: ['MK', 'LP'] }
  ],
  entities: [
    { key: 'component', label: 'Preset-Loader', tag: '' },
    { key: 'component', label: 'Auth-Gateway', tag: '' },
    { key: 'component', label: 'Notiz-Editor', tag: '' },
    { key: 'decision', label: 'Postgres statt SQLite', tag: '' },
    { key: 'decision', label: 'Kein Live-Co-Editing', tag: '' },
    { key: 'risk', label: 'Kanonisierung als Flaschenhals', tag: '' },
    { key: 'task', label: 'Schema-Validator schreiben', tag: 'Vorschlag' },
    { key: 'teammember', label: 'Sam Ritter', tag: '' },
    { key: 'teammember', label: 'Mira Kant', tag: '' }
  ],
  nodes: [
    { id: 'c1', label: 'Auth-Gateway', key: 'component', x: 262, y: 176, canon: true, fields: [['Ebene', 'Backend'], ['Status', 'Fertig']] },
    { id: 'c2', label: 'Notiz-Editor', key: 'component', x: 486, y: 112, canon: true, fields: [['Ebene', 'Frontend'], ['Status', 'In Arbeit']] },
    { id: 'c3', label: 'Preset-Loader', key: 'component', x: 442, y: 300, canon: true, fields: [['Ebene', 'Backend'], ['Status', 'In Arbeit']] },
    { id: 'd1', label: 'Postgres statt SQLite', key: 'decision', x: 676, y: 232, canon: true, fields: [['Status', 'Gültig'], ['Entschieden am', '30. Juli']] },
    { id: 'r1', label: 'Kanonisierung als Flaschenhals', key: 'risk', x: 654, y: 428, canon: true, fields: [['Schwere', 'Hoch']] },
    { id: 't1', label: 'Schema-Validator schreiben', key: 'task', x: 246, y: 412, canon: false, fields: [['Status', 'Offen'], ['Zuständig', 'Jo Halász']] },
    { id: 'm1', label: 'Sam Ritter', key: 'teammember', x: 116, y: 288, canon: true, fields: [['Rolle', 'Backend']] },
    { id: 'm2', label: 'Mira Kant', key: 'teammember', x: 622, y: 74, canon: true, fields: [['Rolle', 'UI/UX']] }
  ],
  edges: [
    { a: 'c2', b: 'c1', label: 'hängt ab von', style: 'solid', weight: 2, origin: 'Sprint-Planung KW 30 · Sam Ritter · 22. Juli' },
    { a: 'c3', b: 'c1', label: 'hängt ab von', style: 'solid', weight: 2, origin: 'Daily Mi · Jo Halász · 30. Juli' },
    { a: 'm1', b: 'c1', label: 'verantwortet', style: 'solid', weight: 1, origin: 'Sprint-Planung KW 30 · Sam Ritter · 22. Juli' },
    { a: 'm2', b: 'c2', label: 'verantwortet', style: 'solid', weight: 1, origin: 'Sprint Review KW 30 · Mira Kant · 25. Juli' },
    { a: 'd1', b: 'c3', label: 'betrifft', style: 'dashed', weight: 1, origin: 'Sprint-Planung KW 32 · Sam Ritter · heute' },
    { a: 'r1', b: 'c3', label: 'gefährdet', style: 'dotted', weight: 2, origin: 'Daily Mi · Jo Halász · 30. Juli' },
    { a: 't1', b: 'c3', label: 'setzt um', style: 'dashed', weight: 1, origin: 'Daily Mi · Jo Halász · 30. Juli' }
  ],
  article: {
    typeKey: 'component', title: 'Preset-Loader',
    state: 'kanonisch', aliases: 'Schema-Loader, PresetReader',
    originLine: 'Aus 3 Notizen · zuletzt geändert heute von Sam',
    fields: [['Ebene', 'Backend'], ['Status', 'In Arbeit'], ['Verantwortlich', 'Sam Ritter'], ['Angelegt', '22. Juli 2026 aus Sprint-Planung KW 30']],
    body: [
      'Lädt Preset-Dateien, validiert sie gegen das JSON-Schema und bindet eine Kopie an das Projekt. Der Loader ist die einzige Stelle, an der Preset-Dateien gelesen werden — alle anderen Bausteine fragen die gebundene Kopie.',
      'Offen ist die Validierung: derzeit werden Fehler gesammelt, aber nicht zeilengenau gemeldet. Die zeilengenaue Ausgabe ist Voraussetzung für den Import-Bildschirm.'
    ],
    rels: [
      { label: 'wird benötigt von', items: ['Notiz-Editor', 'Review-Inbox'] },
      { label: 'betroffen von', items: ['Postgres statt SQLite'] },
      { label: 'gefährdet durch', items: ['Kanonisierung als Flaschenhals'] },
      { label: 'umgesetzt durch', items: ['Schema-Validator schreiben'] }
    ],
    backrefs: ['Sprint-Planung KW 30', 'Daily Mi 30.07.', 'Notiz von Jo Halász'],
    origin: [
      { tag: 'Notiz', meta: 'Sprint 14 › Sprint-Planung KW 30 · Sam Ritter · 22. Juli', text: 'Wir brauchen einen Loader, der das YAML liest und gegen ein Schema prüft — sonst fällt jede kaputte Preset-Datei erst zur Laufzeit auf.', link: 'An die Textstelle springen' },
      { tag: 'Notiz', meta: 'Sprint 14 › Daily Mi · Jo Halász · 30. Juli', text: 'Loader lädt jetzt, Validierung fehlt. Fehler kommen als Sammelmeldung, das reicht für F5 nicht.', link: 'An die Textstelle springen' },
      { tag: 'Notiz · nachträglich geändert', meta: 'Sprint 14 › Sprint-Planung KW 32 · Sam Ritter · heute', text: 'Preset-Bindung wird als Kopie am Projekt gespeichert.', link: 'An die Textstelle springen' }
    ],
    history: [
      { tag: 'Kanonisierung', meta: 'Sam Ritter · 22. Juli, 10:41', text: 'Aus Vorschlag übernommen. Ebene: leer → Backend. Status: leer → Idee.', link: 'Auslösende Notiz' },
      { tag: 'Bearbeitung', meta: 'Jo Halász · 30. Juli, 09:12', text: 'Status: Idee → In Arbeit.', link: '' },
      { tag: 'Zusammenführung', meta: 'Sam Ritter · heute, 10:18', text: '„Schema-Loader" zusammengeführt, Titel als Alias übernommen. Umkehrbar innerhalb von 30 Tagen.', link: 'Zusammenführung ansehen' }
    ]
  },
  review: [
    { kind: 'A', kindLabel: 'Neu', typeKey: 'task', title: 'Schema-Validator schreiben',
      question: 'Gehört das ins Projektwissen?', freq: '3 Erwähnungen · 2 Meetings',
      pre: 'Loader lädt jetzt, aber die Validierung fehlt. ', hit: 'Jemand muss den Schema-Validator schreiben, sonst blockiert F5',
      post: ' — ich würde das noch in diesem Sprint einplanen, sonst zieht sich der Import-Bildschirm.',
      author: 'Jo Halász', authorInitials: 'JH', when: '30. Juli, 09:12',
      fields: [{ label: 'Status', options: ['Offen', 'In Arbeit', 'Erledigt'] }],
      existing: ['Token-Refresh nachziehen', 'Fehlerseiten bauen', 'Preset-Import testen'],
      spread: ['3 Erwähnungen in 2 Meetings', 'zuletzt heute in Sprint-Planung KW 32'],
      primary: 'Übernehmen', secondary: 'Ablehnen' },
    { kind: 'B', kindLabel: 'Duplikat', typeKey: 'component', title: 'Auth Gateway',
      target: 'Auth-Gateway', question: 'Ist das derselbe Eintrag?', freq: '1 Erwähnung · 1 Meeting',
      pre: 'Zum Deployment: ', hit: 'Auth Gateway läuft auf Staging', post: ', Token-Refresh fehlt noch. Ich prüfe morgen die Logs.',
      author: 'Jo Halász', authorInitials: 'JH', when: 'heute, 10:24',
      fields: [], existing: ['Auth-Gateway', 'Notiz-Editor', 'Preset-Loader'],
      spread: ['1 Erwähnung · beiläufig', 'Titel zu 92 % ähnlich zu Auth-Gateway'],
      primary: 'Ist dasselbe → zusammenführen', secondary: 'Ist etwas anderes → neu anlegen' },
    { kind: 'C', kindLabel: 'Ergänzung', typeKey: 'decision', title: 'Begründung: JSONB für die Preset-Bindung',
      target: 'Postgres statt SQLite', question: 'Soll das zum vorhandenen Eintrag hinzukommen?', freq: '2 Erwähnungen · 1 Meeting',
      pre: 'Wir haben festgelegt, dass wir Postgres statt SQLite nehmen — ', hit: 'Begründung: wir brauchen JSONB für die Preset-Bindung',
      post: '. SQLite kann das nur über Textfelder, und dann verlieren wir die Abfragen.',
      author: 'Mira Kant', authorInitials: 'MK', when: 'heute, 10:31',
      fields: [{ label: 'Status', options: ['Gültig', 'Überholt', 'Zurückgenommen'] }],
      existing: ['Postgres statt SQLite', 'Kein Live-Co-Editing'],
      spread: ['2 Erwähnungen in 1 Meeting', 'Feld „Begründung" ist derzeit leer'],
      primary: 'Übernehmen', secondary: 'Verwerfen' },
    { kind: 'A', kindLabel: 'Neu', typeKey: 'risk', title: 'Token-Refresh fehlt im Auth-Gateway',
      question: 'Gehört das ins Projektwissen?', freq: '2 Erwähnungen · 2 Meetings', confidence: '0,74',
      pre: 'Staging läuft, aber nach einer Stunde fliegen alle raus. ', hit: 'Der Token-Refresh fehlt im Auth-Gateway',
      post: ' — bis das drin ist, können wir niemanden zum Testen einladen.',
      author: 'Jo Halász', authorInitials: 'JH', when: 'heute, 10:29',
      fields: [{ label: 'Schwere', options: ['Niedrig', 'Mittel', 'Hoch'] }],
      existing: ['Kanonisierung als Flaschenhals', 'Preset-Fehldesign'],
      spread: ['2 Erwähnungen in 2 Meetings', 'blockiert 1 Aufgabe'],
      primary: 'Übernehmen', secondary: 'Ablehnen' },
    { kind: 'A', kindLabel: 'Neu', typeKey: 'decision', title: 'Review-Inbox gruppiert nach Meeting',
      question: 'Gehört das ins Projektwissen?', freq: '1 Erwähnung · 1 Meeting', confidence: '0,61',
      pre: 'Zur Frage von Lea: ', hit: 'Wir gruppieren die Review-Inbox nach Meeting, nicht nach Sprint',
      post: ' — dann bleibt die Trennkarte ein sinnvoller Ausstiegspunkt.',
      author: 'Sam Ritter', authorInitials: 'SR', when: 'heute, 10:36',
      fields: [{ label: 'Status', options: ['Gültig', 'Überholt', 'Zurückgenommen'] }],
      existing: ['Postgres statt SQLite', 'Kein Live-Co-Editing'],
      spread: ['1 Erwähnung · Festlegung der Leitung', 'zuletzt heute'],
      primary: 'Übernehmen', secondary: 'Ablehnen' }
  ]
};
