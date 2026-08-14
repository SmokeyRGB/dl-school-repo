/**
 * Preset „TableTop-Projekt" — reine Mockup-Daten, keine Logik.
 * Gleiche Struktur wie softwarePreset (siehe ./software.js).
 */
export const tabletopPreset = {
  id: 'tabletop-project',
  name: 'TableTop-Projekt',
  version: '1.0',
  t: {
    project: 'Kampagne',
    projects: 'Kampagnen',
    wg: 'Spieltag',
    wgs: 'Spieltage',
    meeting: 'Session',
    meetings: 'Sessions',
    part: 'Spieler',
    parts: 'Spieler',
    canonVerb: 'kanonisieren',
    canonNoun: 'Weltwissen'
  },
  d: {
    projectName: 'Aethermoor',
    projectDesc: 'D&D 5e Kampagne',
    wgName: 'Staffel 1',
    meetingTitle: 'Session 12 — Der Rat von Falkenstein',
    meetingDate: 'So, 10. August 2026 · 20:00',
    minutes: 156,
    leadName: 'Nils',
    leadFull: 'Nils Vogt',
    me: 'Timo Beck',
    open: 8,

    // Anders als im Software-Preset: im Spiel schreibt man erst mal für sich
    // (PRD §4.1.4, behavior.default_note_visibility: mine). Der Umschalter
    // im Verfasser kippt beim Presetwechsel sichtbar mit — das ist der
    // billigste Beweis der Preset-Neutralität im ganzen Mockup.
    defaultVisibility: 'mine',

    // Aufbau wie im Software-Preset (siehe ./software.js): ein Eintrag je
    // Notiz, älteste zuerst, `parts` mit Text und { ref } im Wechsel.
    notes: [
      { id: 'n1', at: '20:12', vis: 'mine', parts: [
        { t: 'Ankunft in ' }, { ref: 'Falkenstein' }, { t: ' bei Regen — der Hafen ist gesperrt, niemand kommt raus.' }] },
      { id: 'n2', at: '20:19', vis: 'mine', parts: [
        { t: 'Die Stadtwache wirkt nervös. Zwei Mann am Tor, die uns nicht aus den Augen lassen.' }] },
      { id: 'n3', at: '20:26', vis: 'team', parts: [
        { t: 'Beim Schmied: ' }, { ref: 'Gorm Eisenfaust' }, { t: ' rückt die ' }, { ref: 'Sturmklinge' }, { t: ' nicht heraus, nennt aber den Namen Vandermeer.' }] },
      { id: 'n4', at: '20:34', vis: 'mine', parts: [
        { t: 'Für mich: Thalia traut Gorm nicht. Ich spiele das nächste Runde aus, ohne es der Gruppe zu sagen.' }] },
      { id: 'n5', at: '20:41', vis: 'team', edited: true, parts: [
        { t: 'Offen: warum der ' }, { ref: 'Rat der Sieben' }, { t: ' erst nach Sonnenuntergang tagt. ' }, { ref: 'Der Rat tagt' }, { t: ' steht noch als Vorschlag.' }] },
      { id: 'n6', at: '20:52', vis: 'team', by: 'Nils Vogt', parts: [
        { t: 'Im Wirtshaus erzählt man sich, dass seit drei Wochen niemand mehr aus dem Nordviertel zurückkam.' }] },
      { id: 'n7', at: '21:05', vis: 'team', parts: [
        { t: 'Der Wirt will Gold sehen, bevor er redet. ' }, { ref: 'Der tanzende Pony' }, { t: ' ist offenbar der einzige Ort, an dem noch geredet wird.' }] },
      { id: 'n8', at: '21:18', vis: 'team', by: 'Ronja Kern', parts: [
        { t: 'Kampf am Kai: drei Schmuggler, einer entkommt. Wir haben eine Truhe mit Siegel erbeutet.' }] },
      { id: 'n9', at: '21:31', vis: 'team', parts: [
        { t: 'Das Siegel auf der Truhe führt zu ' }, { ref: 'Lyra Vandermeer' }, { t: ' — damit hängt der Schmied mit drin.' }] },
      { id: 'n10', at: '21:44', vis: 'team', parts: [
        { t: 'Regelfrage geklärt: Sturmangriff geht nicht mit einer Einhandwaffe im Nahkampf.' }] },
      { id: 'n11', at: '21:58', vis: 'team', parts: [
        { t: 'Nächste Session steigen wir direkt vor der Ratskammer ein.' }] }
    ],

    // Team-Notizen der anderen (Schublade C4) — Stand beim Öffnen (E-27).
    teamNotes: [
      { initials: 'NV', name: 'Nils Vogt', at: '20:44', text: 'Der Rat empfängt euch erst nach Sonnenuntergang — bis dahin habt ihr freie Hand in der Stadt.' },
      { initials: 'TB', name: 'Timo Beck', at: '21:02', text: 'Wer redet mit dem Wirt? Ich würde vorher den Keller ansehen.' },
      { initials: 'RK', name: 'Ronja Kern', at: '21:33', text: 'Gorm weicht aus, nennt aber „Vandermeer" — das gehört ins Weltwissen.' }
    ],
    feedStamp: '21:36'
  },
  types: [
    { key: 'npc', label: 'NSC', color: '#ff6b6b', shape: 'circle', count: 12 },
    { key: 'poi', label: 'Ort', color: '#4ecdc4', shape: 'roundrect', count: 8 },
    { key: 'faction', label: 'Fraktion', color: '#ffd93d', shape: 'hexagon', count: 5 },
    { key: 'item', label: 'Gegenstand', color: '#a8e6cf', shape: 'diamond', count: 15 },
    { key: 'event', label: 'Ereignis', color: '#ff8c94', shape: 'star', count: 6 }
  ],
  // Beziehungswörter, an denen der KI-Vorschlag eine Beziehung erkennt
  // (dieselben Bezeichnungen wie in edges).
  relations: [
    { label: 'lebt in' },
    { label: 'kennt' },
    { label: 'Mitglied von' },
    { label: 'besitzt' },
    { label: 'geschah bei' }
  ],
  wgs: [
    {
      name: 'Staffel 1',
      live: true,
      av: ['NV', 'RK', 'TB', 'MB'],
      meetings: [
        ['Session 12 — Der Rat von Falkenstein', 'läuft'],
        ['Session 11 — Die Möwenbucht', 'beendet'],
        ['Session 13', 'geplant']
      ]
    },
    {
      name: 'Die Binnenreiche',
      live: false,
      av: ['NV', 'RK'],
      meetings: [
        ['Session 7 — Abschied von Ravenlicht', 'beendet']
      ]
    },
    {
      name: 'One-Shot: Der Aschewald',
      live: false,
      av: ['NV', 'TB'],
      meetings: [
        ['Der Aschewald', 'geplant']
      ]
    }
  ],
  projects: [
    { name: 'Aethermoor', preset: 'TableTop', meta: '2 Kampagnen · 63 Einträge', activity: 'zuletzt heute', live: true, av: ['NV', 'RK', 'TB'] },
    { name: 'Die Feste Ravenlicht', preset: 'TableTop', meta: '1 Kampagne · 21 Einträge', activity: 'zuletzt 12. Juni', live: false, av: ['NV', 'MB'] },
    { name: 'Produktteam Nord', preset: 'Software-Projekt', meta: '3 Sprints · 41 Einträge', activity: 'zuletzt heute', live: false, av: ['SR', 'MK'] }
  ],
  entities: [
    { key: 'npc', label: 'Gorm Eisenfaust', tag: '' },
    { key: 'npc', label: 'Lyra Vandermeer', tag: '' },
    { key: 'npc', label: 'Der Wirt vom Pony', tag: 'Vorschlag' },
    { key: 'poi', label: 'Falkenstein', tag: '' },
    { key: 'poi', label: 'Der tanzende Pony', tag: '' },
    { key: 'faction', label: 'Rat der Sieben', tag: '' },
    { key: 'item', label: 'Sturmklinge', tag: '' },
    { key: 'event', label: 'Der Rat tagt', tag: 'Vorschlag' }
  ],
  nodes: [
    { id: 'n1', label: 'Gorm Eisenfaust', key: 'npc', x: 268, y: 178, canon: true, fields: [['Gesinnung', 'Neutral'], ['Status', 'Lebendig']] },
    { id: 'n2', label: 'Lyra Vandermeer', key: 'npc', x: 486, y: 106, canon: true, fields: [['Gesinnung', 'Chaotisch'], ['Status', 'Verschollen']] },
    { id: 'p1', label: 'Falkenstein', key: 'poi', x: 430, y: 300, canon: true, fields: [['Region', 'Sturmküste'], ['Art', 'Stadt']] },
    { id: 'p2', label: 'Der tanzende Pony', key: 'poi', x: 660, y: 386, canon: false, fields: [['Art', 'Bauwerk']] },
    { id: 'f1', label: 'Rat der Sieben', key: 'faction', x: 674, y: 186, canon: true, fields: [['Ziel', 'Die Küste halten']] },
    { id: 'i1', label: 'Sturmklinge', key: 'item', x: 196, y: 392, canon: true, fields: [['Seltenheit', 'Legendär']] },
    { id: 'e1', label: 'Der Rat tagt', key: 'event', x: 522, y: 456, canon: false, fields: [['Zeitpunkt (Ingame)', 'Nach Sonnenuntergang']] }
  ],
  edges: [
    { a: 'n1', b: 'p1', label: 'lebt in', style: 'solid', weight: 2, origin: 'Session 11 · Nils · 3. August' },
    { a: 'n2', b: 'p1', label: 'lebt in', style: 'solid', weight: 2, origin: 'Session 12 · Nils · heute' },
    { a: 'n1', b: 'n2', label: 'kennt', style: 'dashed', weight: 1, origin: 'Session 12 · Nils · heute' },
    { a: 'n1', b: 'f1', label: 'Mitglied von', style: 'solid', weight: 2, origin: 'Session 7 · Nils · 20. Juli' },
    { a: 'n1', b: 'i1', label: 'besitzt', style: 'solid', weight: 1, origin: 'Session 11 · Nils · 3. August' },
    { a: 'e1', b: 'p1', label: 'geschah bei', style: 'dotted', weight: 2, origin: 'Session 12 · Nils · heute' },
    { a: 'n2', b: 'p2', label: 'lebt in', style: 'dotted', weight: 1, origin: 'Session 12 · Nils · heute (Vorschlag)' }
  ],
  article: {
    typeKey: 'npc', title: 'Gorm Eisenfaust',
    state: 'kanonisch', aliases: 'Gorm der Schmied, Eisenfaust',
    originLine: 'Aus 3 Notizen · zuletzt geändert heute von Nils',
    fields: [['Gesinnung', 'Neutral'], ['Status', 'Lebendig'], ['Region', 'Sturmküste'], ['Angelegt', '14. Juni 2026 aus Session 8']],
    body: [
      'Waffenschmied in Falkenstein, Mitglied im Rat der Sieben und der einzige in der Stadt, der die Sturmklinge je in Händen hielt. Redet wenig über die Zeit vor seiner Ankunft.',
      'Nach der Begegnung in Session 12 ist klar: er kennt Lyra Vandermeer, verschweigt aber, woher. Die Gruppe vermutet eine gemeinsame Vergangenheit an der Küste.'
    ],
    rels: [
      { label: 'lebt in', items: ['Falkenstein'] },
      { label: 'kennt', items: ['Lyra Vandermeer'] },
      { label: 'Mitglied von', items: ['Rat der Sieben'] },
      { label: 'besitzt', items: ['Sturmklinge'] }
    ],
    backrefs: ['Session 8', 'Session 12', 'Notiz von Ronja'],
    origin: [
      { tag: 'Notiz', meta: 'Die Sturmküste › Session 8 · Nils · 14. Juni', text: 'In Falkenstein gibt es einen Schmied, Gorm Eisenfaust, der offenbar im Rat sitzt.', link: 'An die Textstelle springen' },
      { tag: 'Notiz', meta: 'Die Sturmküste › Session 10 · Timo · 12. Juli', text: 'Gorm will die Klinge nicht verkaufen. „Sie ist nicht meine, sie war es nie."', link: 'An die Textstelle springen' },
      { tag: 'Notiz · nachträglich geändert', meta: 'Die Sturmküste › Session 12 · Ronja · heute', text: 'Er weicht aus, nennt aber den Namen „Vandermeer".', link: 'An die Textstelle springen' }
    ],
    history: [
      { tag: 'Kanonisierung', meta: 'Nils · 14. Juni, 20:15', text: 'Aus Vorschlag übernommen. Status: leer → Lebendig.', link: 'Auslösende Notiz' },
      { tag: 'Bearbeitung', meta: 'Nils · 12. Juli, 21:40', text: 'Gesinnung: Unbekannt → Neutral.', link: '' },
      { tag: 'Zusammenführung', meta: 'Nils · heute, 19:22', text: '„Gorm der Schmied" zusammengeführt, Titel als Alias übernommen. Bleibt in der Historie nachvollziehbar — Zurücknehmen ist eine neue Änderung, kein Löschen.', link: 'Zusammenführung ansehen' }
    ]
  },
  review: [
    { kind: 'A', kindLabel: 'Neu', typeKey: 'poi', title: 'Falkenstein',
      question: 'Gehört das ins Weltwissen?', freq: '4 Erwähnungen · 3 Sessions',
      pre: 'Nach zwei Tagen Ritt erreichen wir die Stadt. ', hit: 'Falkenstein liegt auf einer Klippe über der Sturmküste',
      post: ' — Hafen unten, Rat oben, dazwischen die Handwerkergassen. Wir suchen zuerst den Schmied.',
      author: 'Ronja', authorInitials: 'RK', when: 'heute, 19:08',
      fields: [{ label: 'Art', options: ['Stadt', 'Dorf', 'Verlies', 'Bauwerk', 'Wildnis'] }],
      existing: ['Der tanzende Pony', 'Möwenbucht', 'Aschewald'],
      spread: ['4 Erwähnungen in 3 Sessions', 'zuletzt heute in Session 12'],
      primary: 'Kanonisieren', secondary: 'Ablehnen' },
    { kind: 'B', kindLabel: 'Duplikat', typeKey: 'poi', title: 'The Dancing Pony',
      target: 'Der tanzende Pony', question: 'Ist das derselbe Eintrag?', freq: '1 Erwähnung · 1 Session',
      pre: 'Wir nehmen Quartier. ', hit: 'The Dancing Pony hat einen Keller', post: ', und der Wirt kennt Lyra offenbar seit Jahren.',
      author: 'Timo', authorInitials: 'TB', when: 'heute, 19:26',
      fields: [], existing: ['Der tanzende Pony', 'Falkenstein', 'Möwenbucht'],
      spread: ['1 Erwähnung · beiläufig', 'Titel stimmt normalisiert mit „Der tanzende Pony" überein'],
      primary: 'Ist dasselbe → zusammenführen', secondary: 'Ist etwas anderes → neu anlegen' },
    { kind: 'C', kindLabel: 'Ergänzung', typeKey: 'npc', title: 'Gesinnung: Neutral',
      target: 'Gorm Eisenfaust', question: 'Soll das zum vorhandenen Eintrag hinzukommen?', freq: '2 Erwähnungen · 2 Sessions',
      pre: 'Gorm hilft uns, aber nur gegen Gegenleistung. ', hit: 'Er steht auf keiner Seite, nur auf seiner eigenen',
      post: '. Er würde die Stadt verteidigen, aber nicht den Rat.',
      author: 'Ronja', authorInitials: 'RK', when: 'heute, 19:34',
      fields: [{ label: 'Gesinnung', options: ['Rechtschaffen', 'Neutral', 'Chaotisch', 'Unbekannt'] }],
      existing: ['Gorm Eisenfaust', 'Lyra Vandermeer'],
      spread: ['2 Erwähnungen in 2 Sessions', 'Feld „Gesinnung" war zuvor Unbekannt'],
      primary: 'Kanonisieren', secondary: 'Verwerfen' },
    { kind: 'A', kindLabel: 'Neu', typeKey: 'faction', title: 'Rat der Sieben',
      question: 'Gehört das ins Weltwissen?', freq: '5 Erwähnungen · 3 Sessions', confidence: '0,91',
      pre: 'Über der Stadt thront das Ratshaus. ', hit: 'Der Rat der Sieben entscheidet über jeden Handel im Hafen',
      post: ' — und Gorm sitzt seit dem letzten Sturm darin.',
      author: 'Nils (DM)', authorInitials: 'NV', when: 'heute, 19:12',
      fields: [], existing: ['Die Sturmgilde', 'Haus Vandermeer'],
      spread: ['5 Erwähnungen in 3 Sessions', 'stärkstes Signal dieser Session'],
      primary: 'Kanonisieren', secondary: 'Ablehnen' },
    { kind: 'A', kindLabel: 'Neu', typeKey: 'event', title: 'Der Rat tagt nach Sonnenuntergang',
      question: 'Gehört das ins Weltwissen?', freq: '2 Erwähnungen · 1 Session', confidence: '0,68',
      pre: 'Nils: ', hit: 'Der Rat empfängt euch erst nach Sonnenuntergang',
      post: ' — bis dahin habt ihr freie Hand in der Stadt.',
      author: 'Nils (DM)', authorInitials: 'NV', when: 'heute, 19:41',
      fields: [{ label: 'Zeitpunkt (Ingame)', options: ['Tag', 'Abend', 'Nacht'] }],
      existing: ['Der Sturm von Falkenstein', 'Die Ratssitzung'],
      spread: ['2 Erwähnungen in 1 Session', 'verknüpft mit Falkenstein'],
      primary: 'Kanonisieren', secondary: 'Ablehnen' }
  ]
};
