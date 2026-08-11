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

## Offene Einträge

| ID | Datum | Quelle | Entscheidung / Änderung | Betrifft | Status |
|----|-------|--------|--------------------------|----------|--------|
| SL-01 | 2026-08-11 | `Notella Mockup/components/screenC1.js` (Commit `63063d8`) | Sichtbarkeits-Umschalter in C1 blendet „Kanonisch" für Nicht-Lead-Rollen **komplett aus** (statt deaktiviert anzuzeigen); zusätzlich neuer Fallback: fällt `state.vis` für die aktuelle Rolle auf eine unsichtbare Option, gilt „Privat" als aktiv | `04-Screen-Inventar.md` §C1 | 🔍 zu klären |
| SL-05 | 2026-08-11 | `Notella Mockup/components/screenB3.js`, `screenB1.js`, `screenD2.js`, `screenE1.js` | Die Demo-Modi decken jetzt alle vier Screens ab. Für **B3 und B1 schreibt das Screen-Inventar keinen Fehlerzustand vor** (nur „Leer"), umgesetzt wurde er nach der allgemeinen Regel aus `03-SRD.md` §10 (ein Satz ohne Fachjargon · „Erneut versuchen" · Zusicherung). Ebenso ist der **Ladezustand für B3, D2 und E1** nirgends im Inventar beschrieben — die Skeletons folgen der allgemeinen Regel „Skeleton in der Form des erwarteten Inhalts" | `04-Screen-Inventar.md` §B1/§B3/§D2/§E1 (Zustandstabellen) | 🆕 neu erfasst |
| SL-04 | 2026-08-11 | `Notella Mockup/core/actions/editor.js`, `components/aiPopup.js`, `index.html` | KI-Vorschlag ist an C1 angebunden (Tab übernimmt, Esc verwirft) und über eine **vierte Dev-Leisten-Gruppe „KI: an/aus"** abschaltbar. Folge fürs Inventar: die Fußzeile in C1 zeigt „Tab · KI-Vorschlag" nur, wenn die KI-Unterstützung aktiv ist — ein Kürzel, das nichts auslöst, wird nicht angezeigt | `04-Screen-Inventar.md` §C1 (Tastenkürzelleiste), `02-PRD.md` (KI-Unterstützung abschaltbar) | 🆕 neu erfasst |
| SL-03 | 2026-08-11 | `Notella Mockup/utils/wikiArticle.js`, `components/screenD2.js` | D2 zeigt jetzt den **ausgewählten** Eintrag. Jedes Preset liefert nur einen ausgeschriebenen Artikel; alle übrigen Artikel werden aus `nodes`/`edges` abgeleitet. Dabei zwei Festlegungen, die das Inventar nicht kennt: (a) Beziehungsrichtung wird mit `→` / `←` vor der Bezeichnung dargestellt, statt Umkehrverben zu erfinden („hängt ab von" hat keins); (b) abgeleitete Artikel haben keine Aliasse und keinen handgeschriebenen Beschreibungstext | `04-Screen-Inventar.md` §D2 (Beziehungsblock) | 🔍 zu klären |
| SL-02 | 2026-08-11 | Mockup-weit: `core/state.js`, `components/appHeader.js`, `navSidebar.js`, `screenB3.js`, `screenC1.js`, `screenD2.js`, `screenE1.js`, `core/actions/review.js` | Der gesamte Mockup-Code kennt nur ein binäres Rollenmodell (`role === 'lead'` vs. alles andere). Der in `02-PRD.md` §4.2.1 definierte, delegierbare **Kurator**-Status — der laut §4.2.2 (Zeile 363) und §4.5 (Zeile 375) ebenfalls direkt kanonisieren darf — existiert im Mockup nirgends als eigener State-Wert. SL-01 übernimmt diese bestehende Vereinfachung 1:1: Kurator wird beim Kanonisieren aus C1 heraus wie ein Member behandelt | `02-PRD.md` §4.2 / `04-Screen-Inventar.md` (Rollen-Spalte „L, K, M") | 🔍 zu klären |

---

## Entscheidungsvorschläge (zur Klärung mit dem Autor)

**Zu SL-01:** Regel „keine inaktiven Handlungsschaltflächen für unprivilegierte Rollen"
existierte bisher nur explizit für E1 (`04-Screen-Inventar.md:748`). Vorschlag: als
generelle UI-Regel in ein neues Teilkapitel „Rollenabhängige Sichtbarkeit von Steuerelementen"
heben (statt sie screen-für-screen zu wiederholen), C1 und E1 beide darauf verweisen.

**Zu SL-02:** Zwei Wege, keiner davon "automatisch richtig":
- **(a)** Kurator als dritten Rollenwert im Dev-Toggle und in allen Rollen-Checks nachziehen,
  damit der Mockup das PRD-Rollenmodell vollständig abbildet.
- **(b)** Bewusst dokumentieren, dass der Mockup-Prototyp Kurator und Lead aus
  Aufwandsgründen zusammenfasst, und das explizit als Scope-Einschränkung in
  `04-Screen-Inventar.md` (Kopfbereich, analog zum Hinweis „Mobil ist Nutzbarkeit, nicht
  Optimierung") vermerken.

Beides ist einmal zu entscheiden, dann aber **konsistent für alle Screens** anzuwenden —
aktuell ist es weder das eine noch das andere, sondern eine stillschweigende Lücke.

---

## Erledigte Einträge

_(noch keine)_
