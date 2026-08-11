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
