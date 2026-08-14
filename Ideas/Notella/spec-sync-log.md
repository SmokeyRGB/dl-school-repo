# Spec-Sync-Log — Notella

> **Zweck:** Während der Mockup-/Code-Arbeit entstehen laufend kleine Produkt- und
> Design-Entscheidungen, die nicht sofort in `02-PRD.md`, `03-SRD.md` oder
> `04-Screen-Inventar.md` nachgezogen werden (Implementierung ist schneller als
> Dokumentation). Dieses Log fängt sie ein, bevor sie verloren gehen, und wird in
> Batches gegen die Spec-Dokumente abgearbeitet — ähnlich der Entscheidungstabelle
> E-01…E-13 in `01-Problem-Framing.md`, nur für Entscheidungen, die *nach* den
> Spec-Dokumenten und *während* der Umsetzung entstehen.
>
> **Ablauf:** Neuer Eintrag bei jeder Session mit spec-relevanter Änderung → Status
> `🔍 zu klären` oder `🆕 neu erfasst` → nach Review/Entscheidung auf `✅ übernommen`
> (mit Verweis auf den geänderten Abschnitt) oder `❌ verworfen` setzen.

---

> **Stand 2026-08-13, nachmittags — drei neue Einträge (SL-06…SL-08)** aus dem Nachziehen
> des Mockups auf v0.3. Der Vormittagsstand darunter bleibt unverändert gültig.

---

> **Stand 2026-08-13, vormittags — SL-01…SL-05 geschlossen.**
> Mit der Überarbeitung auf `01-Problem-Framing.md` v0.3, `02-PRD.md` V0.9, `03-SRD.md` V0.4
> und `04-Screen-Inventar.md` V0.2 sind SL-01…SL-05 erledigt. Zwei Wege: Die inhaltlich
> relevanten Fragen wurden entschieden und in die Spec-Dokumente übernommen; die rein
> mockup-bezogenen Einträge sind gegenstandslos geworden, weil die betroffenen Bildschirme
> neu geschrieben wurden.
>
> **Wichtige Klarstellung für künftige Einträge:** Das Mockup ist ein Werkzeug zur frühen
> Anforderungsfindung, **keine Implementierungsgrundlage**. Ein Unterschied zwischen Mockup
> und Spezifikation ist deshalb kein Fehler, der behoben werden muss — er ist nur dann
> festzuhalten, wenn im Mockup eine **Produktentscheidung** sichtbar wurde, die in der
> Spezifikation fehlt. Genau das war bei SL-02 der Fall.

## Offene Einträge

> **Herkunft:** Beim Nachziehen des Mockups auf v0.3 (Notizblock C1, zweiphasige
> Kuration E1/E2) am 2026-08-13. Aufgenommen sind ausdrücklich **nur** Fragen, bei denen im
> Bau eine Produktentscheidung sichtbar wurde, die in der Spezifikation fehlt — nicht jede
> Abweichung des Mockups (siehe Klarstellung oben).

| ID | Datum | Quelle | Befund / offene Frage | Betrifft | Status |
|----|-------|--------|------------------------|----------|--------|
| SL-06 | 2026-08-13 | `Notella Mockup/core/actions/notes.js` (`cycleNoteVis`) | **Erzeugt das Ändern der Sichtbarkeit an einer abgeschickten Notiz eine neue Version?** PRD §4.4.1 sagt beides, ohne es zu verbinden: eine abgeschickte Notiz ist unveränderlich und Bearbeiten erzeugt eine Version (E-15) — *und* „an einer bereits abgeschickten Notiz ist die Sichtbarkeit weiterhin änderbar". Sichtbarkeit ist kein Textinhalt; eine Version dafür anzulegen würde die Historie mit Nicht-Inhalt füllen und den Herkunftsnachweis verwässern. Das Mockup ändert sie **ohne** Version und **ohne** „bearbeitet"-Markierung. Die Frage ist echt, weil sie den Datenschnitt betrifft: hängt `visibility` an der Notiz oder an der Notiz-*Version*? | `02-PRD.md` §4.4.1 · `03-SRD.md` (Speicherformat der Notiz) | 🔍 zu klären |
| SL-07 | 2026-08-13 | `Notella Mockup/components/curationHeader.js` | **Was zeigt der Phasenumschalter, wenn eine Phase leer ist?** PRD §4.4.2.2 stellt den Einstieg frei („Der Lead kann Phase 1 überspringen"), sagt aber nichts über den Rückweg aus einer bereits leeren Phase. Das Mockup zeigt beide Reiter immer, mit Zähler — auch bei `0`, weil ein verschwindender Reiter die Orientierung kostet und ein Zähler `0` die Aussage „hier ist nichts mehr offen" selbst trägt. Gegenposition: ein Reiter, der zu einem Leerzustand führt, ist eine Sackgasse | `02-PRD.md` §4.4.2.2 · `04-Screen-Inventar.md` E1/E2 | 🆕 neu erfasst |
| SL-08 | 2026-08-13 | `Notella Mockup/components/screenE2.js` | **Woran erkennt Phase 2 einen „offenen" Vorschlag?** Das Screen-Inventar verlangt „bestätigte Stellen als Chip in Typfarbe, offene Vorschläge als Chip mit Umriss" — die Unterscheidung hängt also am **Vorschlag**, nicht an der Notiz. Im Mockup gibt es diese Verknüpfung nicht: Erwähnungen in `d.notes` und Karten in `review` sind zwei getrennte Datensätze, deshalb zeichnet E2 alle Chips einheitlich als offen, solange Phase 1 nicht durch ist. Für die Umsetzung heißt das: **eine Erwähnung braucht einen Zustand** (`offen` / `übernommen` / `abgelehnt`), und der Kanonisierungs-Dienst muss ihn setzen — sonst ist das Kriterium nicht erfüllbar | `03-SRD.md` §11.7 (Kanonisierungs-Dienst) · `02-PRD.md` §4.4.2.4b | 🆕 neu erfasst |

## Frühere Einträge (alle geschlossen)

| ID | Datum | Quelle | Entscheidung / Änderung | Betrifft | Status |
|----|-------|--------|--------------------------|----------|--------|
| SL-01 | 2026-08-11 | `Notella Mockup/components/screenC1.js` (Commit `63063d8`) | Sichtbarkeits-Umschalter in C1 blendet „Kanonisch" für Nicht-Lead-Rollen **komplett aus** (statt deaktiviert anzuzeigen); zusätzlich neuer Fallback: fällt `state.vis` für die aktuelle Rolle auf eine unsichtbare Option, gilt „Privat" als aktiv | `04-Screen-Inventar.md` §C1 | 🔍 zu klären |
| SL-05 | 2026-08-11 | `Notella Mockup/components/screenB3.js`, `screenB1.js`, `screenD2.js`, `screenE1.js` | Die Demo-Modi decken jetzt alle vier Screens ab. Für **B3 und B1 schreibt das Screen-Inventar keinen Fehlerzustand vor** (nur „Leer"), umgesetzt wurde er nach der allgemeinen Regel aus `03-SRD.md` §10 (ein Satz ohne Fachjargon · „Erneut versuchen" · Zusicherung). Ebenso ist der **Ladezustand für B3, D2 und E1** nirgends im Inventar beschrieben — die Skeletons folgen der allgemeinen Regel „Skeleton in der Form des erwarteten Inhalts" | `04-Screen-Inventar.md` §B1/§B3/§D2/§E1 (Zustandstabellen) | 🆕 neu erfasst |
| SL-04 | 2026-08-11 | `Notella Mockup/core/actions/editor.js`, `components/aiPopup.js`, `index.html` | KI-Vorschlag ist an C1 angebunden (Tab übernimmt, Esc verwirft) und über eine **vierte Dev-Leisten-Gruppe „KI: an/aus"** abschaltbar. Folge fürs Inventar: die Fußzeile in C1 zeigt „Tab · KI-Vorschlag" nur, wenn die KI-Unterstützung aktiv ist — ein Kürzel, das nichts auslöst, wird nicht angezeigt | `04-Screen-Inventar.md` §C1 (Tastenkürzelleiste), `02-PRD.md` (KI-Unterstützung abschaltbar) | 🆕 neu erfasst |
| SL-03 | 2026-08-11 | `Notella Mockup/utils/wikiArticle.js`, `components/screenD2.js` | D2 zeigt jetzt den **ausgewählten** Eintrag. Jedes Preset liefert nur einen ausgeschriebenen Artikel; alle übrigen Artikel werden aus `nodes`/`edges` abgeleitet. Dabei zwei Festlegungen, die das Inventar nicht kennt: (a) Beziehungsrichtung wird mit `→` / `←` vor der Bezeichnung dargestellt, statt Umkehrverben zu erfinden („hängt ab von" hat keins); (b) abgeleitete Artikel haben keine Aliasse und keinen handgeschriebenen Beschreibungstext | `04-Screen-Inventar.md` §D2 (Beziehungsblock) | 🔍 zu klären |
| SL-02 | 2026-08-11 | Mockup-weit: `core/state.js`, `components/appHeader.js`, `navSidebar.js`, `screenB3.js`, `screenC1.js`, `screenD2.js`, `screenE1.js`, `core/actions/review.js` | Der gesamte Mockup-Code kennt nur ein binäres Rollenmodell (`role === 'lead'` vs. alles andere). Der in `02-PRD.md` §4.2.1 definierte, delegierbare **Kurator**-Status — der laut §4.2.2 (Zeile 363) und §4.5 (Zeile 375) ebenfalls direkt kanonisieren darf — existiert im Mockup nirgends als eigener State-Wert. SL-01 übernimmt diese bestehende Vereinfachung 1:1: Kurator wird beim Kanonisieren aus C1 heraus wie ein Member behandelt | `02-PRD.md` §4.2 / `04-Screen-Inventar.md` (Rollen-Spalte „L, K, M") | 🔍 zu klären |

---

## Auflösung (2026-08-13)

| ID | Auflösung | Wo nachlesbar |
|----|-----------|---------------|
| **SL-01** | ✅ **übernommen.** Die Regel „keine inaktiven Handlungsschaltflächen für unprivilegierte Rollen" gilt jetzt allgemein, nicht mehr nur für E1 — und ist ausdrücklich als **Darstellungsregel** gekennzeichnet, **nicht** als Berechtigungsprüfung. Der Fallback-Teil ist gegenstandslos: Es gibt nur noch zwei Sichtbarkeiten, „Kanonisch" ist keine davon, und beide stehen jeder Rolle offen | `02-PRD.md` §4.2.2 und §4.4.2.11 · `03-SRD.md` §11.2a · `04-Screen-Inventar.md` E1 |
| **SL-02** | ✅ **entschieden — mit einem dritten Weg.** Weder (a) noch (b): Die **Kurator-Rolle ist ganz entfallen** und steht im Backlog (E-24). Damit ist das binäre Rollenmodell keine Vereinfachung des Mockups mehr, sondern die Spezifikation. Der eigentliche Befund war ohnehin ein **Widerspruch in den Spec-Dokumenten selbst**: `01-Problem-Framing.md` E-04 sagte „ausschließlich der Lead", `02-PRD.md` §4.2 nannte Lead **und** Kurator. Zusätzlich festgelegt: Berechtigungen werden als **Fähigkeiten** geprüft, nicht als Rollenvergleiche — dann kostet ein Nachrüsten der Rolle eine Zeile | `01-Problem-Framing.md` E-24 · `02-PRD.md` §4.2 · `03-SRD.md` §11.2a |
| **SL-03** | ⚪ **gegenstandslos.** Die beiden D2-Regeln (Richtungspfeile statt erfundener Umkehrverben; abgeleitete Artikel ohne Aliasse) betrafen die Darstellung im Mockup. Das Preset-Format führt `inverse_label` je Beziehungstyp, die Darstellungsfrage gehört in die Feature-Spezifikation zum Wiki | `02-PRD.md` §4.1.3 (`inverse_label`) |
| **SL-04** | ⚪ **gegenstandslos, Kern übernommen.** Der KI-Vorschlag im Mockup war eine Vorwegnahme. Die KI ist jetzt eine eigene, terminierte Ausbaustufe **V1.3** mit beschriebener Schnittstelle. Die Regel dahinter — *ein Kürzel, das nichts auslöst, wird nicht angezeigt* — ist als allgemeines Verhalten übernommen: Ohne hinterlegten Zugang existiert die Aktion nicht, statt deaktiviert zu erscheinen | `01-Problem-Framing.md` E-09 · `03-SRD.md` §11.9 · `02-PRD.md` §6.2 |
| **SL-05** | ✅ **übernommen — als Regeländerung.** Der Befund war richtig: Zustände wurden für Bildschirme gebaut, für die das Inventar keine vorschrieb. Die Konsequenz ist nicht, 27 × 4 Fälle nachzudokumentieren, sondern das Verhalten **einmal zentral** festzulegen und je Bildschirm nur die Abweichung zu beschreiben. Der Qualitätsanspruch bleibt, die Dokumentationslast fällt | `04-Screen-Inventar.md` (Legende) · `02-PRD.md` §4.4.4 |

---

## Erledigte Einträge

SL-01 · SL-02 · SL-03 · SL-04 · SL-05 — siehe Auflösungstabelle oben.

**Offen:** SL-06 · SL-07 · SL-08 — siehe „Offene Einträge".
