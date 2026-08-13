# SRD — Notella (Arbeitstitel)

### Solution Requirements Document · Domain-agnostische Note-Taking-Engine

> **Version:** V0.4 · 2026-08-13
> **Autor:** Sam (Digitale Leute School — AI Software Engineering)
> **Vorgänger:** `01-Problem-Framing.md` (v0.3), `02-PRD.md` (V0.9)
> **Nachfolger:** `04-Screen-Inventar.md` → Feature-Spezifikationen je Baustein → Mockup
>
> ⚠️ **V0.4 zieht §11 auf die Produktentscheidungen E-14…E-30 nach.** Zurückgenommen wurden
> u. a.: ProseMirror-JSON als Speicherformat (§11.4), Server-Sent Events, `pg_trgm`,
> Ausdrucksindizes für `show_in_list`, Preset-Import mit zeilengenauer Fehleranzeige, und die
> Reihenfolge „Graph vor Kuration". Neu: Modulgrenzen mit drei erzwingbaren Regeln (§11.2),
> Notiz-Versionierung, Stufe V1.3 für KI, korrigierte Aufwandsrechnung.
>
> *Änderung V0.3 ggü. V0.2 (historisch): Beziehungs-Graph als eigene Phase V1.2, Cytoscape.js
> begründet, Priorisierung nach Beweiskraft. V0.2 ggü. V0.1: O-08 geklärt, §11.6
> AI-Neubewertung, §11.8 „Arbeitsweise mit AI-Agenten", O-10/O-11.*

---

## 1. Customer

**Primär (Beachhead):** Kleine, wiederkehrend zusammenarbeitende Arbeitsgruppen von 3–12
Personen mit einer klaren Leitungsrolle — Produkt- und Entwicklungsteams, Studien- und
Kursgruppen, Nebenprojekt-Teams. Sie treffen sich über Monate im selben Kontext und
erzeugen kumulatives Wissen, sind aber zu klein für eine eigene Wissensmanagement-Rolle.

**Sekundär (Machbarkeitsnachweis):** TableTop-/Pen-and-Paper-Runden mit Spielleitung.
Strukturell identisch — eine leitende Person, mehrere Schreibende, wiederkehrende Treffen,
wachsender gemeinsamer Wissensstand.

**Systemrollen:** Lead · Member. Details siehe PRD §4.2. (Die Kurator-Rolle ist mit E-24 ins
Backlog gewandert.)

**Betreiber-Kunde:** In V1 hostet die Gruppe selbst (Docker Compose). Die technisch
versierte Person im Team ist damit ein eigener, oft übersehener Kunde — der
Installationsvorgang ist Teil des Produkts.

---

## 2. Job to be Done

> Als wiederkehrend zusammenarbeitende Gruppe einen gemeinsamen, verlässlichen Wissensstand
> aufbauen, **ohne dafür Zeit außerhalb der Treffen aufwenden zu müssen** — so, dass
> jederzeit klar ist, was verbindlich gilt, was persönliche Notiz ist, und aus welchem
> Treffen eine Information stammt.

Der entscheidende Zusatz gegenüber jedem Wiki: **ohne Nacharbeit**. Die Struktur muss im
Moment des Schreibens entstehen, sonst entsteht sie gar nicht.

---

## 3. Benefit

### 3.1 Kundennutzen

| Nutzen | Konkret |
|--------|---------|
| Einmal schreiben statt zweimal | Typisierung im Schreibfluss (`@` oder Markieren), keine Nachbereitungssitzung |
| Klarheit über den Status | Solange etwas nicht kanonisiert ist, ist es ein Vorschlag. Der Unterschied zwischen Mitschrift und Beschluss ist im Werkzeug abgebildet, nicht nur in der Absprache |
| Kontrolle über Eigenes | Jede Person entscheidet selbst über *geteilt*; nur der Lead über *kanonisch* |
| Nachvollziehbarkeit | Jeder verbindliche Eintrag verweist auf Notiz, Meeting und Person — und jede spätere Änderung ebenso |
| Passendes Vokabular ohne Setup-Last | Preset-Auswahl ist **eine** Entscheidung, kein Modellierungsprojekt |
| Entlastung des Leads | Kanonisierung als Inbox mit einer Entscheidung pro Bildschirm, nicht als Datenpflege |

### 3.2 Geschäftsnutzen

Als Open-Source-/Portfoliovorhaben mit späterer Produktoption:

| Ziel | Messgröße |
|------|-----------|
| Fachlicher Nachweis der Abstraktion | Zweites Preset läuft **ohne Codeänderung** — binär überprüfbar |
| Echte Nutzung | Eigene Gruppe nutzt es über **≥ 5 aufeinanderfolgende Treffen** ohne Ausweichwerkzeug |
| Intuitivität | **< 3 Minuten** vom Beitritt bis zur ersten strukturierten Notiz, ohne Erklärung |
| Vorzeigbarkeit | Dokumentierte Architekturentscheidungen + lauffähige Demo |
| Optionswert | Mandantenfähigkeit im Datenmodell vorbereitet, ohne V1-Aufwand |

### 3.3 Markenwirkung

> ⚠️ TBD — für ein self-hosted Open-Source-Vorhaben in V1 nicht relevant. Relevant würde
> es erst bei einer SaaS-Öffnung; dann wäre die Positionierung „das Tool, das weiß, woher
> euer Wissen kommt" der tragende Gedanke.

---

## 4. Problem

Ausführlich in `01-Problem-Framing.md`. Verdichtet:

| # | Problem | Beobachtbare Folge |
|---|---------|--------------------|
| P-1 | Notizen liegen verstreut und privat | Kein gemeinsamer Ort, an dem der Gruppenstand entsteht |
| P-2 | Kein Unterschied zwischen Mitschrift und verbindlichem Stand | Niemand kann sagen, was gilt |
| P-3 | Struktur entsteht nur durch Nacharbeit — also gar nicht | Wissen bleibt unstrukturiert liegen |
| P-4 | Herkunft geht verloren | „Warum haben wir das damals so entschieden?" bleibt unbeantwortet |
| P-5 | Vokabular passt nie ganz | Freitext-Tags oder Zwang ins fremde Domänenmodell |

**Zwei Schmerzmomente:** (1) *während* des Treffens — Struktur kostet Aufmerksamkeit, die
dem Gespräch fehlt; (2) *Wochen später* — die Information ist da, aber nicht auffindbar.

---

## 5. Solution

### 5.1 Benchmark-Analyse

| Produkt | Was es gut kann | Was fehlt (unsere Lücke) |
|---------|-----------------|--------------------------|
| **Notion / Confluence** | Beliebig strukturierbare Wissensdatenbank, Datenbanken mit Feldtypen | Kein Meeting-Ablauf, kein Sichtbarkeitsmodell zwischen „privat" und „öffentlich", keine Kanonisierung als Entscheidung. Struktur entsteht durch Nacharbeit. |
| **Obsidian** | Verlinkung im Schreibfluss (`[[…]]`), lokaler Graph, sehr schnelles Schreiben | Einzelplatz-Werkzeug. Kollaboration nur über Dateisynchronisation; kein Rollenmodell, keine Freigabe-Entscheidung. |
| **Linear / Jira** | Klarer Arbeitsfluss, Zustände, Zuständigkeiten | Erzeugt Vorgänge, kein Wissensnetz. Vollständig auf Softwareentwicklung festgelegt. |
| **Granola / Otter (AI-Notetaker)** | Automatisches Protokoll ohne Aufwand | Erzeugt Text, keine typisierten Entitäten mit Beziehungen. Kein Gruppenmodell. Setzt Cloud und Audiozugriff voraus. |
| **World Anvil / LegendKeeper (TableTop)** | Reiches Domänenmodell für Fantasywelten | Fest auf eine Domäne verdrahtet. Kein Meeting-Ablauf, keine Kanonisierungs-Warteschlange. |

**Positionierung:** Notella liegt genau in der Lücke zwischen *Wiki* (speichert gut,
kennt kein Treffen) und *Meeting-Tool* (kennt das Treffen, speichert kein Wissen) — und
ist als einziges in dieser Reihe **domänenneutral konfigurierbar**.

Die drei Elemente, die zusammen kein anderes Produkt hat:

1. **Sichtbarkeit je Notiz plus Kanonisierung als eigener Vorgang** („Für mich" / „Für Team",
   und davon getrennt: kanonisch als Eigenschaft der Entität)
2. **Herkunftsnachweis** als Erstklasse-Konzept, nicht als Versionsverlauf-Nebenprodukt
3. **Domänenschema als austauschbares Config-File** statt als Produktentscheidung

### 5.2 Vorher / Nachher

| Dimension | Heute | Mit Notella |
|-----------|-------|-------------|
| Während des Treffens | Jede Person schreibt in ihr eigenes Werkzeug oder gar nicht | Alle schreiben am selben Ort, Struktur entsteht per `@` beim Tippen |
| Nach dem Treffen | Niemand bereitet nach; Wissen verfällt | Der Lead arbeitet eine Warteschlange ab, meist wenige Minuten |
| „Was gilt eigentlich?" | Unbeantwortbar, jede Notiz sieht gleich aus | Kanonische Entitäten sind eindeutig markiert |
| „Woher wissen wir das?" | Unbeantwortbar | Ein Klick führt zur Notiz, zum Meeting und zur Person |
| Neue Person im Team | Muss sich durch verstreute Dokumente arbeiten | Liest das Projektwissen und sieht dessen Herkunft |
| Anderer Anwendungsfall | Neues Tool suchen | Anderes Preset wählen |

### 5.3 Scope

| In Scope (V1) | Out of Scope (V2+) |
|---------------|--------------------|
| Konten per Einladungslink, Profile je Projekt | Freie Registrierung, Mailversand, Organisationen über Projekten, SSO, Gastzugang |
| Projekt → Arbeitsgruppe → Treffen → Notiz (fix 3-stufig) | Frei verschachtelbare Hierarchie |
| Zwei Sichtbarkeiten je Notiz, serverseitig durchgesetzt | Zusicherung echter Vertraulichkeit, Freigabe an einzelne Personen, Zugriffsbeschränkung je Arbeitsgruppe |
| **Notizblock:** Einzelnotizen, unveränderliche Versionen, Offline-Puffer | Live-Co-Editing (CRDT), Kommentare an Notizen |
| Feed der Team-Notizen **auf Abruf** | Server-Push, Chat, Reaktionen, Präsenzanzeige mit Cursorn |
| Erwähnungen per `@` **und** Textmarkierung, in beiden Rollen | Sprach-/Audioerfassung |
| Zwei ausgelieferte Presets | Preset-Import, additive Erweiterung zur Laufzeit, Preset-Editor, Community-Einreichung, Preset-Wechsel eines Projekts |
| **Vier Feldtypen** (Text, Auswahl, Datum, Referenz) plus `longtext` als optionales Feld | Zahl, Mehrfachauswahl, Datei-Upload, Formeln, berechnete Felder |
| Gerichtete, typisierte Beziehungen mit Quell-/Zielprüfung | Beziehungseigenschaften, gewichtete Kanten |
| **Zweiphasige Kuration** mit Übernehmen / Zusammenführen / Ablehnen | Stapelaktionen, mehrstufige Freigabe, Abstimmung |
| Normalisierte Suche über Titel und Aliasse, Duplikathinweis, Zusammenführen | Unscharfe Suche, semantische Suche, Suche über Projekte hinweg |
| **Versionierung von Notizen und Wissensstand**, dauerhaft, mit Auslöser und Herkunft | Verschiebbare Zeitleiste, Umkehrfenster |
| **Beziehungs-Graph** (V1.2) | Pfadsuche, Clustering, Minimap, Zeitraffer-Abspielen |
| Docker-Compose-Auslieferung | SaaS-Betrieb, Abrechnung, Mandantenfähigkeit im Betrieb |
| Vorbereitete KI-Andockstelle (inaktiv, aber als V1.3-Schnittstelle entworfen) | KI-Extraktion und Auto-Merge selbst (V1.3) |
| Einsprachig Deutsch, CET | Mehrsprachigkeit, Zeitzonen |
| — | Karten, Export/Backup, mobile App |

### 5.4 Phasenplanung

| Phase | Umfang | Ziel | Abhängigkeit |
|-------|--------|------|--------------|
| **V1.0 — Die Schleife** | Konten per Einladung mit Profilwahl, Projekt/Arbeitsgruppe/Treffen mit Zustandsmaschine, **Notizblock mit versionierten Einzelnotizen**, zwei Sichtbarkeiten, abrufbarer Feed, **vollständiges Preset-System**, Terminologie-Auflösung, Profile mit generischem Formular | „Die Gruppe kann damit ein echtes Treffen protokollieren." Erster echter Nutzungstest — **aber noch kein Nachweis der These** | — |
| **V1.1 — Die Wissensschicht** | Erwähnungen (beide Wege), Entitäten-Liste und Wiki, Beziehungen, **Kanonisierungs-Dienst und zweiphasige Kuration**, Duplikatprüfung und Zusammenführen, Herkunft und Historie | „Aus Treffen entsteht nachvollziehbares Projektwissen." **Hier wird die Kernthese bewiesen** | V1.0 |
| **V1.2 — Beziehungs-Graph** | Graph-Leinwand mit preset-gesteuerten Formen und Farben, Typ- und Zeitfilter, Fokusmodus mit abgedunkeltem Kontext, Kanten-Herkunft, Leistungsgrenzen mit ehrlicher Filteraufforderung | „Man *sieht*, wie das Wissen zusammenhängt." Das stärkste Bild — aber es braucht V1.1, um etwas zu zeigen | V1.1 |
| **V1.3 — KI übernimmt das Unbequeme** | KI-Extraktion als zweiter Vorschlagslieferant für Phase 1, Markierungsvorschläge in Phase 2, Auto-Merge mit Rückfrage nur bei Unsicherheit, Zusammenführen mit Ähnlichkeitsbewertung | „Taggen und Nachkurieren werden leichter, nicht mehr." Entschärft R-03 dauerhaft | V1.1 |
| **Backlog** | Community-Presets, Preset-Editor, Kurator-Rolle, Mehrsprachigkeit, Zeitzonen, Mailversand, Server-Push, verschiebbare Zeitleiste, Karten, Suche über Projekte, Export/Backup, SaaS | Produktoption | — |

**Warum das Preset-System vollständig in V1.0 liegt:** Es bestimmt das Datenmodell. Ein
nachträglicher Einbau würde jede bestehende Tabelle berühren. Umgekehrt lässt sich die
Wissensschicht (V1.1) sauber additiv aufsetzen.

---

## 6. Success Metrics

| Art | Kennzahl | Zielwert | Erhebung |
|-----|----------|----------|----------|
| **Kern** | Zweites Preset läuft ohne Codeänderung | ja/nein | Manueller Abnahmetest: TableTop-Preset importieren, Projekt anlegen, Meeting durchspielen, Entität kanonisieren — ohne Deployment |
| **Kern** | Aufeinanderfolgende Meetings der eigenen Gruppe | ≥ 5 | `meeting_completed` |
| **Kern** | Zeit vom Beitritt bis zur ersten strukturierten Notiz | < 3 min (Median) | `time_to_first_structured_note` |
| Beobachtung | Anteil der Meetings, deren Vorschläge innerhalb von 7 Tagen abgearbeitet sind | > 70 % | `suggestion_resolved` — misst Risiko R-03 |
| Beobachtung | Verteilung der beiden Sichtbarkeiten | keine unter 10 % | `note_created` — validiert, ob „Für mich" überhaupt gebraucht wird oder ersatzlos entfallen kann |
| Beobachtung | Verhältnis `@`-Weg zu UI-Weg | beide > 15 % | `mention_created` — rechtfertigt zwei Wege oder spart einen |
| Beobachtung | Zusammenführungen je 100 Entitäten | < 10 | `entity_merged` — Wirksamkeit der Duplikatvermeidung |
| Beobachtung | Anteil Notizen ohne jede Erwähnung | < 40 % | Zeigt, ob die Typisierung im Schreibfluss wirklich funktioniert |

> Die Beobachtungskennzahlen sind bewusst als **Entscheidungshilfen für V1.1/V2** formuliert,
> nicht als Erfolgsdruck. Fällt der `@`-Weg unter 15 %, ist das ein Argument, ihn zu
> streichen — nicht ein Misserfolg.

---

## 7. Risks & Mitigation

| Art | Risiko | Auswirkung | Gegenmaßnahme |
|-----|--------|-----------|---------------|
| **Technisch** | **Generische Formulare sind der Kern und zugleich die härteste Stelle.** Feldtypen, Pflichtfeldprüfung, Referenzfelder, Filter — alles muss datengetrieben rendern. | Falsch geschnitten, wird jede Bildschirmmaske zum Sonderfall und die Abstraktion bricht. | Ein einziger `SchemaForm`-Baustein, der aus einer Felddefinition rendert. Wird **zuerst** gebaut und über beide Presets getestet, bevor irgendein Bildschirm entsteht. Feldtyp-Prüfmatrix (4 Typen × pflicht/optional × leer/gefüllt/ungültig) als Testfundament. |
| **Technisch** | **Ablage der dynamischen Felder** (O-02) — falsche Wahl kostet Filterbarkeit oder Wartbarkeit. | Nachträglich nur mit Datenmigration änderbar. | Entscheidung in §11.3: JSONB mit GIN-Index, **ohne** Ausdrucksindizes; Referenzfelder zusätzlich in einer Schattentabelle mit echten Fremdschlüsseln. |
| ~~**Technisch**~~ | ~~Erwähnungen an Textpositionen brechen beim Bearbeiten.~~ | — | **Aufgelöst durch E-15.** Eine abgeschickte Notiz-Version ist unveränderlich; in ihr kann sich nichts verschieben. Das Problem existiert nicht mehr, und mit ihm entfällt die Bindung des Speicherformats an den Editor (§11.4). |
| **Technisch** | Sichtbarkeit oder Fähigkeit wird versehentlich nur im Frontend durchgesetzt. | „Für mich"-Notizen wären über die Schnittstelle abrufbar; ein Member könnte kanonisieren. | Die Prüfung hängt am **Datenzugriff**, nicht am Transport (§11.2a) — es gibt keinen zweiten Weg zur Datenbank. Dazu Negativtests in der Definition of Done, ausdrücklich einschließlich „Member ruft die Kanonisierungs-Action direkt auf". |
| **Produkt** | **Kuration wird zum Flaschenhals** (R-03) — **das wichtigste Produktrisiko**. | Projektwissen bleibt leer, das Werkzeug degradiert zum Notizspeicher. | Die früheren Gegenmaßnahmen sind entfallen (Kurator-Delegation, Stapelaktionen). Stattdessen: Kuration als belohnende Erfahrung mit Anforderungscharakter (E-22), sichtbar lohnende Vorarbeit im Treffen (E-23), Messung über `note_curated` und `curation_session_ended` — und als eigentliche Entlastung **V1.3**, deshalb keine Backlog-Position. |
| **Produkt** | **Generizität frisst Intuitivität** (R-01). | Kernversprechen verfehlt. | Kein Schema-Editor im UI. Endnutzende sehen ausschließlich Preset-Begriffe. Der Intuitivitäts-Test (< 3 min) ist Kern-Kennzahl, nicht Beobachtung. |
| **Produkt** | **Der Notizblock verändert das Schreibgefühl** (R-07, neu). | Einzelne abzuschickende Notizen könnten sich zerstückelt anfühlen; die Gruppe weicht auf ein Zweitwerkzeug aus. | Bewusstes Wagnis — es ist die Voraussetzung für Sichtbarkeit und Kuration je Notiz. Die Schreibfläche bekommt im PRD dieselbe Detailtiefe wie die Kuration und wird früh an der eigenen Gruppe geprüft (PRD O-15). |
| **Produkt** | Konkurrenzdichte im Business-Beachhead (R-02). | Keine externe Adoption. | Erfolg bewusst an eigener Gruppe und Preset-Nachweis gemessen. Kein Marktziel in V1. |
| **Zeit** | **Der Umfang ist für Solo-Arbeit groß** (R-06). §11.6: ~162 PT konventionell, ~103 PT AI-gestützt gegen 63 verfügbare. | Projekt bleibt unfertig — das häufigste Ende ambitionierter Nebenprojekte. | Verbindliche Kontrollpunkte (§11.6) und ein definierter **Notausgang** (§11.7), der die Kuration ausdrücklich enthält. Gekürzt wird innerhalb von V1.1, nicht V1.1 als Ganzes. |
| **Zeit** | Der Editor ist eine unbekannte Größe. | Kann Tage kosten. | Machbarkeitsversuch vor V1.1 (O-07). **Entschärft in V0.4:** Da das Speicherformat nicht mehr am Editor hängt, ist der Rückfall ein einfacheres Eingabefeld — kein Datenmodellwechsel. |
| **Betrieb** | Self-hosted heißt: der Installationsvorgang ist Teil des Produkts. | Niemand testet es, weil das Aufsetzen scheitert. | Ein `docker compose up` mit vorbelegter Konfiguration und Beispieldaten. Teil der Abnahme von V1.0. |

---

## 8. Feedback Loops

### 8.1 Stakeholder-Rückmeldung

| Punkt | Festlegung |
|-------|------------|
| **Wer** | (1) Die eigene Gruppe als tatsächliche Nutzer — wichtigste Quelle. (2) Betreuung/Dozierende der Digitale Leute School für Architektur und Vorgehen. (3) Später: fremde Self-Hoster über GitHub-Issues. |
| **Wie erfasst** | Nach jedem Meeting der Testgruppe eine kurze, feste Frage: „Was hat dich beim Schreiben gestört?" — schriftlich, nicht in der Runde. Zusätzlich die Telemetrie aus PRD §5. |
| **Priorisierung** | (1) Alles, was Notizverlust verursacht — sofort. (2) Alles, was den Schreibfluss unterbricht — vor dem nächsten Meeting. (3) Alles, was die Kanonisierung ausbremst — vor V1.1-Abschluss. (4) Rest ins Backlog. |

### 8.2 A/B-Testing

> ⚠️ Nicht anwendbar in V1 — die Nutzerbasis ist zu klein für statistisch tragfähige
> Aussagen. Ersatz: die Telemetrie-Verhältnisse aus §6 (z.B. `@`-Weg vs. UI-Weg) dienen
> als qualitative Entscheidungsgrundlage.

### 8.3 Vorher/Nachher-Daten

Da es keinen Vorzustand im selben System gibt, wird eine **Baseline vor dem ersten Einsatz**
erhoben — einmalig, in der Testgruppe:

| Frage | Erhebung | Vergleich nach 5 Meetings |
|-------|----------|---------------------------|
| Wie viele Werkzeuge nutzt ihr heute für Meeting-Notizen? | Zählung | Ziel: Reduktion auf eines |
| Wie lange brauchst du, um eine Entscheidung aus einem Meeting vor 4 Wochen wiederzufinden? | Stoppuhr, drei Beispielfragen | Ziel: deutliche Verkürzung, Ziel < 60 s |
| Weißt du, was aus dem letzten Meeting verbindlich beschlossen wurde? | Freie Antwort, Abgleich mit Protokoll | Ziel: Übereinstimmung steigt |

---

## 9. Produktanforderungen (Zusammenfassung)

Vollständig in `02-PRD.md`. Kernpunkte:

- **Preset-System** (PRD §4.1): YAML mit Formatversion, Terminologie, Entitätstypen mit
  Feldern, Beziehungstypen mit Quell-/Zielprüfung, Darstellungsangaben für den Graph.
  **Wird ausgeliefert, nicht importiert**; am Projekt hängt nur der Schlüssel, unveränderlich.
- **Rollen und Rechte** (PRD §4.2): Lead / Member; **zwei** Sichtbarkeiten je Notiz,
  serverseitig durchgesetzt. Keine Zusicherung von Vertraulichkeit — der Lead sieht in der
  Kuration alle Notizen, und das wird einmal klar gesagt.
- **Notizblock** (PRD §4.4.1): Einzelnotizen statt eines Dokuments je Treffen; abgeschickte
  Notizen sind unveränderlich, Bearbeiten erzeugt eine neue Version.
- **Meeting-Zustandsmaschine** (PRD §4.3.2): geplant → laufend → beendet, Nachtrag unbegrenzt
  möglich und gekennzeichnet. Der Kurationszustand hängt an der **Notiz**, nicht am Treffen.
- **Zwei gleichwertige Typisierungswege** (PRD §4.4.1): `@` per Tastatur und Textmarkierung
  per Maus, identische Datenstruktur, **beide in beiden Rollen**.
- **Kuration** (PRD §4.4.2): zwei Phasen in einem Fluss — Vorschläge abarbeiten, dann Notizen
  durchsehen. Eine Entscheidung pro Bildschirm; Übernahme gesperrt bei offenen Pflichtfeldern;
  **keine** Stapelaktionen; Beziehungen in derselben Geste; Belohnung als Anforderung.
- **Herkunft und Historie** (PRD §4.5): jede Änderung als Schnappschuss mit Auslöser, Person
  und Verweis auf Notiz-Version, Treffen und Arbeitsgruppe. Dauerhaft, ohne Frist.
- **Profile** (PRD §4.0, E-12/E-29): Projekt-Entitäten, mehrere je Konto möglich; der
  Einladungslink ist der Mechanismus.

---

## 10. UI/UX-Anforderungen (Zusammenfassung)

| Prinzip | Konsequenz |
|---------|-----------|
| **Nie generische Begriffe** | Jedes Label aus dem Preset. Erscheint doch ein generischer Schlüssel, ist das ein **sichtbar markierter Fehlerzustand**, keine stille Rückfallebene. |
| **Eine Entscheidung pro Bildschirm** | Gilt besonders für die Kuration. Keine Massenformulare, keine Stapelaktionen. |
| **Kuration muss sich lohnen** | Sichtbarer Fortschritt, Quittung bei jedem Abschluss, offene Arbeit nie in Warnfarbe. Anforderung, nicht Verzierung (E-22). |
| **Progressive Offenlegung** | Historie und Zusammenführen sind vorhanden, aber nicht im Hauptweg sichtbar. Im Meeting-Raum ist die Versionshistorie gar nicht erreichbar (E-17). |
| **Einheitlicher Entitätsaufbau** | Alle Typen teilen denselben Detailaufbau: Titel → Felder → Beziehungen → Herkunft → Historie. |
| **Schreibfluss hat Vorrang** | Der Meeting-Raum ist vollständig per Tastatur bedienbar. Nichts unterbricht das Tippen — kein Modal, kein Bestätigungsdialog beim Erwähnen, keine Bewegung durch fremde Beiträge. |
| **Solide Zustände** | Laden (Platzhalter in der Form des Inhalts), Leer (Text aus dem Preset, wo die Domäne den Begriff bestimmt), Fehler (ein Satz ohne Fachjargon plus Wiederholung), Keine Berechtigung (Erklärung statt Sperre). Einmal zentral festgelegt, nicht je Bildschirm neu erfunden. |
| **Desktop-first** | Mobil ist nutzbar, nicht optimiert. Die Kuration ist mobil bewusst nicht vorgesehen. |
| **Barrierefreiheit als Pflicht** | Erwähnungs-Auswahl als ARIA-Combobox; Sichtbarkeiten immer als Wort lesbar, nie nur Farbe oder Symbol. |

---

## 11. Technische Lösungsrichtung

> Dieser Abschnitt beantwortet: **Wie komplex ist das wirklich?** Er trifft die
> architektonischen Weichenstellungen und schätzt den Aufwand. Die konkrete Umsetzung je
> Baustein gehört in nachgelagerte Feature-Spezifikationen.

### 11.1 Empfohlener Stack

| Ebene | Empfehlung | Begründung | Verworfene Alternative |
|-------|-----------|------------|------------------------|
| **Sprache** | TypeScript durchgängig | Ein Typsystem für Preset-Schema, API-Verträge und UI. Die Preset-Definition wird zur Laufzeit mit **Zod** validiert und liefert per Typinferenz zugleich die Compile-Zeit-Typen — genau das, was ein schema-getriebenes Produkt braucht. | Python-Backend: sinnvoll, wenn die AI-Pipeline zentral wäre. Ist sie in V1 nicht (E-09), und zwei Sprachen kosten Solo-Zeit. |
| **Frontend + Backend** | **Next.js (App Router)** mit Server Actions und Route Handlers | Ein Deployment-Artefakt, eine Codebasis, gemeinsame Typen. Für Solo-Arbeit der geringste Reibungsverlust. Server Components halten die Preset-Auflösung serverseitig. | Getrenntes React-SPA + NestJS: sauberere Schichtung, aber doppelte Infrastruktur und doppelte Typpflege. Für ein Team richtig, für Solo teuer. |
| **Datenbank** | **PostgreSQL 16+** | JSONB für dynamische Felder, rekursive Abfragen für Beziehungspfade. Deckt beide Sonderbedarfe ohne Zusatzsystem. | Neo4j o.ä.: konzeptuell verlockend (Wissensgraph), aber zweites System, zweite Abfragesprache, kein Vorteil bei den erwarteten Größenordnungen (5 000 Entitäten). Auch für den Beziehungs-Graph in V1.2 bleibt Postgres ausreichend — die Graph-Logik liegt im Client, nicht in der Datenbank. |
| **Datenzugriff** | **Drizzle ORM** | Nah an SQL, erstklassige JSONB-Unterstützung, typsichere Migrationen, kein verstecktes Verhalten. Bei dynamischen Feldern ein Vorteil. | Prisma: bequemer, aber JSONB-Abfragen sind umständlicher — genau unser Kernfall. |
| **Preset-Format** *(V0.4)* | **YAML-Dateien im Repository**, geprüft gegen **ein** Zod-Schema beim Build und beim Start. Aus demselben Schema wird ein **JSON Schema** erzeugt und per `# yaml-language-server: $schema=…` in der Datei referenziert | Presets werden ausgeliefert, nicht hochgeladen (E-01). YAML, weil Kommentare möglich sind und die ausgelieferten Presets dokumentiert sein sollen. Das JSON Schema gibt Autovervollständigung und Fehlermarkierung **im Editor** — damit entfällt die zeilengenaue Fehleranzeige im Produkt ersatzlos | **TypeScript-Module:** würden die Prüfung erübrigen, machen Presets aber zu Code — abschreckend für Nicht-Entwickelnde und ein Loch in genau der Grenze, auf der das Produkt steht. **JSON-Schema + YAML-Parser + Zod nebeneinander** (V0.3): drei Techniken für eine Datei, ohne Gegenwert |
| **Editor** *(V0.4 präzisiert)* | **TipTap** (ProseMirror) mit `Mention`-Erweiterung und `BubbleMenu` — **als Bedienoberfläche, nicht als Speicherformat** | Liefert **beide** in E-07 geforderten Wege ohne Eigenbau und stellt Erwähnungen inline als Chip dar (PRD §4.4.1 verlangt genau das). Beim Abschicken wird in das eigene Speicherformat serialisiert (§11.4) | CodeMirror 6 / einfaches Textfeld: leichter, aber ohne inline gerenderte Chips und ohne Markierungsmenü. **Wichtig:** Der Rückfall ist jetzt billig, weil das Speicherformat nicht am Editor hängt — anders als in V0.3 |
| **Authentifizierung** | **Auth.js** mit Credentials-Provider, Argon2id | Self-hostbar ohne externen Dienst, Sessions über Datenbank, später um OAuth erweiterbar. **Kein Mailversand** (E-29): Konten entstehen nur über Einladungslinks, Passwort-Rücksetzung über signierte Links des Leads | Lucia: schlanker und lehrreicher, aber mehr Eigenbau. Clerk/Auth0: für self-hosted ungeeignet. **SMTP:** eine ganze Abhängigkeit im Auslieferungsartefakt für eine Funktion, die der Einladungslink bereits abdeckt |
| **Feed** *(V0.4)* | **Gewöhnliche Abfrage auf Abruf.** Aktualisieren-Symbol in der Schublade; ein Zähler nur, wenn er ohne Zusatzaufwand aus derselben Abfrage fällt | E-27. Der Feed ist Interesse, keine Dringlichkeit — Anlass zum Aktualisieren ist meist Neugier | **Server-Sent Events** (V0.3): erfordern Kanalverwaltung, `Last-Event-ID`-Nachlieferung nach Verbindungsabbruch, empfängerabhängige Filterung (also N Prüfungen und N Nutzlasten je Ereignis), ein eigenes Ereignis für zurückgenommene Freigaben und `proxy_buffering off` in jeder Reverse-Proxy-Anleitung. Viel Betriebsfläche für eine Funktion, die den Kernnachweis nicht trägt. Bleibt eine spätere Bequemlichkeit |
| **Suche und Duplikate** *(V0.4)* | **Normalisierte Spalte** (klein, ohne Satzzeichen, Leerraum zusammengefasst) über Titel **und** Aliasse, mit gewöhnlichem Btree-Index; Präfix- und Teilstringsuche | E-28. Trägt beide Anwendungsfälle — Erwähnungs-Auswahl und Duplikatprüfung — bei 5 000 Entitäten mühelos | **`pg_trgm`** (V0.3): `similarity_threshold` ist eine Sitzungsvariable und leckt bei Verbindungspooling; die 80-%-Marke war nie an echten Daten kalibriert; ein GIN-Trigramm-Index funktioniert auf `text[]` gar nicht, Aliassuche hätte also ohnehin eine abgeleitete Spalte gebraucht. Unscharfe Bewertung kommt in V1.3 zurück — dann KI-gestützt. Elasticsearch/Meilisearch: drittes System für 5 000 Datensätze |
| **Graph-Darstellung** | **Cytoscape.js** mit `fcose`-Layout | Ausgereift, kräftebasiertes Layout mit stabilen Ergebnissen, Formen und Farben vollständig datengesteuert (genau unser Preset-Fall), Fokus-/Abdunkelungs-Effekte über Stilklassen ohne Eigenbau, trägt die erwarteten Größenordnungen mühelos. | **React Flow**: stark für editierbare Ablaufdiagramme, aber schwaches automatisches Layout für organische Netze. **D3-force**: volle Kontrolle, aber Layout, Zoom, Auswahl und Trefferzonen sind Eigenbau — mehrere Tage Mehraufwand. **Sigma.js/WebGL**: erst ab zehntausenden Knoten im Vorteil, schwächere Stil-Schnittstelle. |
| **Auslieferung** | Docker Compose (App + Postgres), versionierte Images | Ein Befehl zum Start. Rücknahme durch vorheriges Image. | Kubernetes: unangemessen. Reines Node-Deployment: Postgres-Einrichtung wird zur Einstiegshürde. |

### 11.2 Architekturschichten

```text
┌─────────────────────────────────────────────────────────┐
│  UI-Schicht — rendert AUSSCHLIESSLICH aus Preset-Schema │
│  SchemaForm · SchemaTable · MentionPicker · RelationPicker│
├─────────────────────────────────────────────────────────┤
│  Preset-Auflösung  (Terminologie, Typen, Felder, Regeln) │
│  beim Start geladen und geprüft, im Client vorgehalten   │
├─────────────────────────────────────────────────────────┤
│  Datenzugriff  ← JEDE Abfrage passiert ihn               │
│  Mitgliedschaft · Fähigkeit · Sichtbarkeit · Projektgrenze│
├─────────────────────────────────────────────────────────┤
│  Fachlogik — generisch, kennt keine Domänenbegriffe      │
│  Entity · Relation · Note · Mention · Suggestion · Change │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL  (feste Spalten + JSONB für Preset-Felder)   │
└─────────────────────────────────────────────────────────┘
```

**Kernregel 1 — kein Domänenbegriff unterhalb der Preset-Auflösung.** Ein `grep` nach „NPC"
oder „Sprint" außerhalb der Preset-Dateien muss leer bleiben. Das ist zugleich der
überprüfbare Nachweis für das Erfolgsziel „zweites Preset ohne Codeänderung".

#### 11.2a Modulgrenze und die drei Regeln, die sie durchsetzen *(neu in V0.4)*

Eine Schichtzeichnung ist eine Absichtserklärung. Damit sie hält — besonders bei überwiegend
agentengestützter Umsetzung — braucht es Grenzen, die ein Werkzeug prüft. Bewusst **drei
Regeln, mehr nicht**: keine hexagonale Architektur, keine Repository-Schnittstellen, kein
Container für Abhängigkeiten. Ein Solo-Vorhaben über drei Monate verdient sich das nicht.

```text
src/
  app/        Next.js: page/layout/loading/error, Server Actions, Route Handlers
              darf importieren: ui/, data/, preset/ — niemals db
  data/       DIE EINZIGE STELLE, DIE db IMPORTIEREN DARF.
              Jede exportierte Funktion nimmt ctx: AuthContext als erstes Argument.
              db.ts · schema.ts · authz.ts · notes.ts · entities.ts · suggestions.ts · changes.ts
  preset/     die Schemasprache. Kein React, kein db.
              file-schema.ts · loader.ts · terminology.ts · field-types.ts
  core/       generische Regeln. Importiert preset/. NIEMALS data/ oder React.
              canonicalize.ts · merge.ts · visibility.ts · note-format.ts
  ui/         schema-form/ (zuerst gebaut) · states/ · …
presets/      die YAML-Dateien — der einzige Ort, an dem Domänenbegriffe vorkommen
```

| # | Regel | Durchsetzung |
|---|-------|--------------|
| **R-1** | Kein Domänenbegriff außerhalb von `presets/` und den Textdateien | `grep` als CI-Schritt (Kernregel 1) |
| **R-2** | `@/data/db` ist nur aus `src/data/**` importierbar | `eslint no-restricted-imports` — exakt und kostenlos, im Gegensatz zu einem `grep` |
| **R-3** | `core/**` importiert weder `data/**` noch `react` | zweiter `no-restricted-imports`-Eintrag |

R-3 ist „Abhängigkeiten zeigen nach innen", vollständig — mehr braucht es nicht.

**Warum die Autorisierung am Datenzugriff hängt und nicht am Transport.**
Das PRD verlangt eine einzige Autorisierungsschicht. Der gewählte Stack hat aber mehrere
Einstiegspunkte, über die Daten den Server verlassen können: Server Actions, Route Handlers,
Datenabrufe in Server Components, `middleware.ts` und `generateMetadata`. Eine Regel „jeder
Endpunkt prüft" ist damit eine Frage der Disziplin — und Disziplin ist genau das, was bei
agentengestützter Umsetzung als Erstes reißt. Hängt die Prüfung dagegen am **Datenzugriff**,
gibt es keinen Weg an ihr vorbei, weil es keinen zweiten Weg zur Datenbank gibt.

> ⚠️ **Benannter Fehlerfall, der in dieser Architektur sonst entsteht.**
> Das PRD legt fest, dass ein Member in der Kuration **keine** Handlungsschaltflächen sieht —
> weder aktiv noch ausgegraut. Eine Server Action ist aber ein adressierbarer Endpunkt: Wer
> ihre Kennung kennt, kann sie aufrufen, ganz gleich was gerendert wurde. Wer diese
> UI-Festlegung als Berechtigungsspezifikation liest, liefert eine Kanonisierung aus, die
> jedes Mitglied auslösen kann. **Der Fall gehört wörtlich in die Negativtests** (§11.8),
> neben „Member A ruft die »Für mich«-Notiz von B ab → 404".

**Berechtigungen werden als Fähigkeiten geprüft, nicht als Rollenvergleiche.**
Eine reine Funktion `can(ctx, 'canonicalize')` in `data/authz.ts` — bei zwei Rollen und einer
geschlossenen Rechtematrix genügt ein `switch`; eine eigene Rechtetabelle wäre
Abstraktionssteuer ohne Gegenwert. Wichtig ist der **eine Ort**: Wird die Kurator-Rolle aus
dem Backlog geholt (E-24), ist das eine Zeile statt einer Durchsicht aller Prüfstellen.

> **Nicht übersehen:** `can()` braucht das **Preset** im Kontext, nicht nur die Rolle. Das
> Preset bestimmt Verhaltens-Flags, und in V1 hängt daran der Sichtbarkeits-Default. Die
> Signatur ist deshalb `can(ctx, action)` mit `ctx = { account, membership, preset }`.

### 11.3 Entscheidung O-02 — Ablage der dynamischen Felder

| Ansatz | Vorteil | Nachteil | Bewertung |
|--------|---------|----------|-----------|
| **JSONB-Spalte je Entität** ✅ | Ein Schema für alle Typen, keine DDL zur Laufzeit, additive Erweiterung kostenlos, Validierung zentral gegen das Preset (Zod) | Filterung braucht Ausdrucksindizes; referenzielle Integrität von Referenzfeldern muss die Anwendung sicherstellen | **Gewählt.** Passt exakt zur additiven Erweiterungsregel und zur erwarteten Datenmenge. |
| EAV (Zeile je Feldwert) | Voll indizierbar, referenzielle Integrität möglich | Jede Entitätsabfrage braucht Joins über N Felder; Formulare werden mühsam; Leistung bricht früh | Verworfen — Komplexität ohne Gegenwert bei dieser Größenordnung. |
| Tabelle je Entitätstyp | Beste Abfrageleistung, echte Fremdschlüssel | Erfordert DDL zur Laufzeit beim Preset-Import — Migrationen im Betrieb, hohes Risiko | Verworfen — widerspricht dem Preset-Gedanken direkt. |

**Konkret:**
`entities(id, project_id, type_key, title, title_normalized, aliases text[], aliases_normalized text[], state, data jsonb, …)`

**Indizes — bewusst wenige:**

- **GIN** über `data` (`jsonb_path_ops`)
- **Btree** über `(project_id, type_key, title)` für Listenansichten
- **Btree** über `(project_id, title_normalized)` für Erwähnungs-Auswahl und Duplikatprüfung

> **Zurückgenommen in V0.4: die Ausdrucksindizes für `show_in_list`-Felder.** Sie
> widersprachen der eigenen Begründung dieses Abschnitts. Tabelle-je-Typ wurde verworfen, weil
> es „DDL zur Laufzeit beim Preset-Import" erfordere — und zwei Sätze später standen Indizes,
> deren Feldnamen ebenfalls erst aus dem Preset kommen. Zweites Problem: Ein Ausdrucksindex auf
> `data->>'status'` ist projekt- und typübergreifend, während `status` in beiden Presets an
> mehreren Typen mit verschiedenen Optionslisten vorkommt — ein Index, mehrere Bedeutungen,
> ohne `project_id` darin.
>
> Der GIN-Index plus der Btree über `(project_id, type_key, title)` trägt jede Listenansicht
> bei der Zielgröße von 5 000 Entitäten. Wird das eines Tages knapp, ist ein Ausdrucksindex
> eine Migration von zwei Zeilen — dann aber gemessen statt vermutet.

**Referenzfelder bekommen echte Fremdschlüssel — über eine Schattentabelle.**

```sql
entity_refs(from_entity_id, field_key, to_entity_id)   -- FKs auf entities(id)
```

Geschrieben von **derselben** Funktion, die `data` jsonb schreibt; JSONB bleibt die
Anzeigewahrheit. Begründung: Ein Referenzfeld ist der einzige Feldtyp, dessen Wert ins Leere
zeigen kann, und die Integrität hängt an drei Schreib- und zwei Löschpfaden (Formular,
Zusammenführen, Preset-gestützte Anlage; Entität löschen, Merge-Quelle auflösen). Einen davon
zu übersehen ist wahrscheinlich — und JSONB hat keinen Fremdschlüssel, der es bemerkt. Die
Schattentabelle macht daraus eine Datenbankgarantie und verwandelt „beim Löschen alle
verweisenden Felder leeren" von einem projektweiten JSONB-Durchlauf in eine indizierte Abfrage.

> **Ausdrücklich nicht** dasselbe wie `relations`. Ein Referenzfeld ist einwertig, trägt einen
> Feldnamen, steht im Steckbrief und kann Pflichtfeld sein; eine Beziehung ist n:m, trägt ein
> eigenes Verb samt Umkehrung und erscheint im Graph. Beide zu vereinheitlichen wurde erwogen
> und **verworfen**: `SchemaForm` — der Baustein, der zuerst und am einfachsten sein muss —
> müsste dann aus zwei Speicherorten über zwei Schreibwege rendern, und im Graph entstünden
> doppelte Kanten überall dort, wo ein Preset dieselbe Tatsache als Feld *und* als Beziehung
> modelliert (siehe PRD O-14).

### 11.4 Entscheidung — Speicherformat der Notiz *(in V0.4 ersetzt)*

**Das ursprüngliche Problem.** Speichert man eine Erwähnung als Zeichen-Offset („Zeichen
340–352"), verschiebt jede spätere Textänderung alle nachfolgenden Erwähnungen. Der
Herkunftsnachweis zeigt dann auf die falsche Stelle — und genau der ist das Produktversprechen.
V0.3 löste das, indem die Notiz als ProseMirror-Dokument (JSON) gespeichert wurde: Erwähnungen
sind Knoten im Dokumentbaum und wandern mit dem Text.

**Warum das nicht mehr nötig ist.** Mit E-15 ist eine abgeschickte Notiz-Version
**unveränderlich**. Eine Bearbeitung erzeugt eine neue Version mit eigenen Erwähnungen. Damit
kann sich in einer gespeicherten Version nie etwas verschieben — das Problem, für das das
Dokumentmodell die Lösung war, existiert nicht mehr.

**Neue Festlegung: Text mit expliziter Erwähnungs-Syntax.**

```text
note_versions(id, note_id, seq, body text, created_at, author_id)

body:  "Wir nehmen [[entity:0f3a…|Postgres statt SQLite]] — wegen JSONB."
```

- Der Text ist die **Quelle**, nicht eine abgeleitete Projektion. Es gibt keine zweite
  Repräsentation und damit auch keine Frage, welche bei Abweichung gewinnt
- Erwähnungen werden zusätzlich in `mentions(note_version_id, entity_id, …)` geführt — für
  Abfragen wie „alle Notizen zu dieser Entität". Der Text bleibt aber vollständig ohne diese
  Tabelle lesbar
- **Nutzende sehen die Syntax nie.** Beim Schreiben wie beim Lesen erscheint die Erwähnung als
  Chip in Typfarbe (PRD §4.4.1). TipTap dient als Bedienoberfläche; beim Abschicken wird
  serialisiert, beim Bearbeiten zurückgelesen

**Was diese Entscheidung zusätzlich löst:**

| Problem in V0.3 | Auflösung |
|-----------------|-----------|
| Zwei Repräsentationen (ProseMirror-JSON **und** abgeleitete Markdown-Spalte) ohne festgelegte Autorität und ohne benannten Auslöser für die Neuerzeugung | Es gibt nur noch eine |
| Der Rückfall auf CodeMirror hätte Erwähnungen zu reinem Text gemacht — also die Lösung dieses Abschnitts beseitigt. O-07 war damit kein Rückfall, sondern eine Existenzfrage | Das Speicherformat hängt nicht mehr am Editor. Ein Editorwechsel berührt keine gespeicherte Notiz |
| Beim Löschen einer Entität müsste der Server fremde Dokumentbäume umschreiben — in Notizen, die er womöglich nicht lesen darf, und im Wettlauf mit dem Autosave des Autors | Die `entity_id` ist ein **weicher** Zeiger. Läuft er ins Leere, rendert die Stelle als einfacher Text. **Null Schreibvorgänge, kein Wettlauf, umkehrbar** |
| Beim Kanonisieren musste der Textausschnitt als Momentaufnahme kopiert werden, damit der Beleg eine spätere Bearbeitung übersteht | Entfällt: Die Version **ist** die Momentaufnahme. Der Beleg zeigt auf `note_version_id` |

**Offener Punkt, der bleibt:** Die Serialisierung zwischen Editor und Speicherformat muss
verlustfrei hin und zurück laufen. Das ist der Kern des Machbarkeitsversuchs (O-07), jetzt
allerdings mit deutlich kleinerem Einsatz — scheitert er, wird das Eingabefeld einfacher,
nicht das Datenmodell anders.

### 11.4a Notiz-Versionierung und Historie *(neu in V0.4)*

Zwei getrennte Zeitstrahlen, die nicht vermischt werden dürfen:

| | Was wird versioniert | Tabelle | Wer erzeugt Einträge |
|---|---|---|---|
| **Notiz** | der geschriebene Text | `note_versions` | die schreibende Person |
| **Wissen** | Entitäten und Beziehungen | `change_entries` | die Kuration, Bearbeitung, Zusammenführung |

**`change_entries` speichert vollständige Schnappschüsse, keine Feld-Differenzen.**

```text
change_entries(id, project_id, subject_type, subject_id, snapshot jsonb,
               trigger, actor_id, note_version_id?, meeting_id?, created_at)
```

Begründung: Das PRD verlangt zwei Dinge, die Feld-Differenzen nicht beide leisten. Erstens
eine Vorher/Nachher-Anzeige — die lässt sich aus zwei Schnappschüssen beim Lesen berechnen.
Zweitens „Zustand zum Zeitpunkt T" — das ist mit Schnappschüssen eine einzige Abfrage, mit
Differenzen ein Nachrechnen über die gesamte Kette. Der zweite Fall ist die Voraussetzung für
die Verlaufsansicht und für die spätere verschiebbare Zeitleiste (E-25). Bei 5 000 Entitäten
ist die Datenmenge unerheblich.

**Es gibt kein Umkehrfenster und keinen Aufräumprozess.** Eine Rücknahme ist ein weiterer
Eintrag, der einen früheren Schnappschuss wiederherstellt. Damit entfällt der
Hintergrund-Job, den V0.3 für die 30-Tage-Frist und den Einladungsablauf gebraucht hätte —
Einladungen laufen stattdessen **beim Lesen** ab.

**Indizes:** `(project_id, meeting_id, created_at desc)` — die Wiki-Gliederung „nach
Zeitpunkt" (PRD §4.4.3) liest ausschließlich hierüber — und `(subject_id, created_at desc)`
für die Verlaufsansicht einer einzelnen Entität. Die Historie ist ein **Lesepfad**, keine
Nebenaufzeichnung; das ist der Grund, warum `ChangeEntry` im PRD ein eigenes Kernobjekt ist.

### 11.5 Komplexitätsbewertung je Baustein

| Baustein | Komplexität | Warum |
|----------|:-----------:|-------|
| Auth, Einladungslinks | 🟢 niedrig | Gelöstes Problem, Auth.js deckt es ab. **Kein Mailversand** (E-29) |
| Projekt/Arbeitsgruppe/Treffen-CRUD | 🟢 niedrig | Gewöhnliche Datenhaltung, Zustandsmaschine mit drei Zuständen |
| **Preset-Format, Schema, Prüfung** | 🟢 **niedrig** *(war 🟡)* | Ein Zod-Schema, geladen beim Start, fail fast. **Import, Bindung als Kopie, Versionierung der Bindung und zeilengenaue Fehlerausgabe entfallen** (E-01) |
| **Generisches Formular-Rendering** | 🔴 **hoch** | Jetzt 4 Feldtypen statt 6, aber weiterhin × Pflicht/Optional × Anzeige/Bearbeitung/Validierung. **Der Baustein, an dem das Produkt steht oder fällt.** Zuerst bauen |
| Terminologie-Auflösung | 🟢 niedrig *(war 🟡)* | Einsprachig (E-30), fertige Sätze aus dem Preset statt komponierter Grammatik. Übrig bleibt das Fehlerverhalten |
| Autorisierungsschicht | 🟡 mittel | Konzeptionell einfach, aber lückenlos durchzusetzen und zu testen. Die Modulgrenze aus §11.2a nimmt den Großteil des Risikos |
| **Notizblock mit Versionierung** | 🟡 mittel *(neu)* | Einzelnotizen, unveränderliche Versionen, Bearbeiten fühlt sich normal an, Offline-Puffer für nicht abgeschickte Notizen. Konzeptionell einfach, aber viele kleine Zustände |
| **Erwähnungs-Auswahl (beide Wege)** | 🟡 mittel *(war 🔴)* | Der Risikoanteil ist weg: keine Positionsstabilität mehr zu lösen (§11.4), keine unscharfe Suche mehr (E-28). Übrig bleiben Chip-Darstellung, Serialisierung und vollständige Tastaturbedienung |
| Feed (Abruf) | 🟢 niedrig *(war 🟡)* | Eine Abfrage mit Sichtbarkeitsfilter. Kanalverwaltung, Wiederverbindung und Rücknahme-Ereignisse entfallen (E-27) |
| Entitäten-Liste mit dynamischen Spalten | 🟡 mittel | Baut auf dem Formular-Baustein auf; JSONB-Filterung |
| Beziehungen mit Quell-/Zielprüfung | 🟡 mittel | Regelauswertung aus dem Preset, beidseitige Anzeige, Schnellsuche in der Kuration |
| **Kanonisierungs-Dienst** | 🟡 mittel *(neu)* | Ein Dienst für alle Aufrufer: Erwähnung heute, KI ab V1.3. Pflichtfeldprüfung am Übergang, Schnappschuss schreiben, Herkunft verknüpfen |
| **Kuration (beide Phasen)** | 🔴 **hoch** | Phase 1: Kartenlogik, Pflichtfeld-Chips, Zusammenführen-Ansicht. Phase 2: Notizdurchgang, Markieren auf gerendertem Text, Abschlusszustand je Notiz. **Stapelaktionen entfallen** (E-13/PRD §4.4.2) |
| Duplikatprüfung und Zusammenführen | 🟡 mittel *(war 🔴)* | Normalisierter Abgleich statt Ähnlichkeitswertung, Datenübernahmeregeln. **Kein Umkehrfenster** (E-25) |
| Herkunft und Änderungshistorie | 🟡 mittel | Schnappschuss je Änderung mit Auslöser-Kontext; Differenzen beim Lesen |
| Docker-Auslieferung | 🟢 niedrig | Compose-Datei, Startskript, Beispieldaten |

**Zwei harte Stellen statt fünf.** Der generische Formular-Baustein und die Kuration —
beide in der Wissensschicht, und die Kuration hängt am Formular-Baustein. Deshalb steht er
in §11.7 an erster Stelle.

> **Warum drei Bausteine leichter geworden sind:** In allen drei Fällen wurde nicht die
> Umsetzung vereinfacht, sondern die *Anforderung* zurückgenommen — Preset-Import (E-01),
> Server-Push (E-27), unscharfe Suche (E-28). Das ist der eigentliche Ertrag der
> Überarbeitung: nicht schneller bauen, sondern weniger bauen.

### 11.6 Aufwandsschätzung

Grobschätzung in Personentagen (1 PT = ein konzentrierter Arbeitstag), Solo-Arbeit,
inklusive Tests und Nacharbeit. Bewusst konservativ.

> **In V0.4 vollständig neu gerechnet.** Die alte Rechnung hatte zwei Fehler: Die Gesamtsumme
> „≈ 138" addierte nur V1.0 und V1.1 und ließ V1.2 (28 PT) stillschweigend weg — richtig wären
> 166 gewesen. Und die daraus abgeleitete AI-Umrechnung erbte den Fehler. Beides ist korrigiert;
> zugleich hat die Streichliste aus E-14…E-30 erheblichen Umfang herausgenommen.

**V1.0 — Die Schleife**

| Position | PT | Δ |
|----------|---:|---|
| Projektaufsetzung, Werkzeugkette, CI, Docker-Compose | 3 | |
| Lint-Regeln R-1…R-3 einrichten (§11.2a) | 1 | neu |
| Datenmodell und Migrationen inkl. Notiz-Versionen | 5 | +1 |
| Authentifizierung, Einladungslinks, Profilwahl beim Beitritt | 5 | −1, kein Mailversand |
| Preset-Format, Zod-Schema, Prüfung beim Start, JSON-Schema-Erzeugung | 4 | −2, kein Import |
| **Generischer Formular-Baustein** (4 Feldtypen, Validierung, Prüfmatrix) | 7 | −1 |
| Terminologie-Auflösung (einsprachig, Sätze aus dem Preset) | 2 | −1 |
| Autorisierungsschicht inklusive Sichtbarkeits- und Negativtests | 5 | |
| Projekt / Arbeitsgruppe / Treffen inkl. Zustandsmaschine | 6 | |
| **Notizblock:** Verfasser, Strom, Abschicken, Versionen, Offline-Puffer | 8 | +1 ggü. Editor-Position |
| Sichtbarkeitsumschalter je Notiz, Ehrlichkeitsaussage im Onboarding | 2 | |
| Feed als Schublade (Abruf) | 2 | −2, kein SSE |
| Teilnehmerprofile, Beitrittsfluss | 4 | |
| Dashboard und Übersichten inkl. Bildschirmzuständen | 5 | |
| Beide Presets ausformulieren, dokumentieren, durchtesten | 4 | +1 |
| Nacharbeit, Fehlerbehebung, Feinschliff | 8 | |
| **Summe V1.0** | **≈ 71** | −3 |

**V1.1 — Die Wissensschicht**

| Position | PT | Δ |
|----------|---:|---|
| Erwähnungs-Datenmodell, Speicherformat, Serialisierung | 4 | |
| `@`-Auswahl: normalisierte Suche, Tastaturbedienung, Anlage an Ort und Stelle | 5 | −2 |
| Markierungs-Weg (BubbleMenu), in Meeting-Raum **und** Kuration | 4 | +1 |
| Entitäten-Liste: dynamische Spalten, Filter, Suche | 6 | |
| Entitäten-Detail / Wiki: generische Feldanzeige und -bearbeitung | 5 | |
| Beziehungen: Typprüfung, beidseitige Anzeige, Schnellsuche | 6 | |
| **Kanonisierungs-Dienst** (gemeinsame Grundlage, vor beiden Oberflächen) | 3 | neu |
| Kuration Phase 1: Karten, Pflichtfeld-Chips, Zusammenführen-Ansicht | 6 | −2, keine Stapelaktionen |
| Kuration Phase 2: Notizdurchgang, Markieren, Abschluss je Notiz | 5 | neu |
| Belohnungsgestaltung: Fortschritt, Quittungen, Bilanz (E-22) | 2 | neu |
| Duplikatprüfung (normalisiert), Zusammenführen | 4 | −3 |
| Herkunft und Historie: Schnappschüsse, Verlaufsansicht | 5 | |
| Nacharbeit, Fehlerbehebung, Feinschliff | 8 | |
| **Summe V1.1** | **≈ 63** | −1 |

> Die additive Preset-Erweiterung im UI (5 PT) ist ersatzlos entfallen (E-01).

**V1.2 — Beziehungs-Graph**

| Position | PT |
|----------|---:|
| Cytoscape-Einbindung, Layout, Zoom/Verschieben, Zustandserhalt | 4 |
| Preset-gesteuerte Formen, Farben, Kantenstile inkl. Rückfall ohne `graph`-Block | 3 |
| Filterleiste: Typfilter mit Zählern, Zeit-/Gruppenfilter, Suche | 4 |
| Fokusmodus: Abdunkeln, Kantenbeschriftungen, Seitenpanel, Nachbarschaft erweitern | 5 |
| Kanten-Herkunft (Klick auf Kante → Ursprungsnotizen) | 3 |
| Leistungsgrenzen, Filteraufforderung, Layout-Zwischenspeicherung | 3 |
| Tastaturnavigation und Barrierefreiheit | 2 |
| Nacharbeit und Feinschliff | 4 |
| **Summe V1.2** | **≈ 28** |

| | PT (konventionell) | bei 3 PT/Woche (nebenbei) | bei 5 PT/Woche (Vollzeit) |
|---|---:|---|---|
| V1.0 | 71 | ~24 Wochen | ~14 Wochen |
| V1.1 | 63 | ~21 Wochen | ~13 Wochen |
| V1.2 | 28 | ~9 Wochen | ~6 Wochen |
| **Gesamt V1.0–V1.2** | **≈ 162** | **~54 Wochen** | **~32 Wochen** |

> **Korrigiert in V0.4:** V0.3 nannte hier „≈ 138" und addierte dabei nur V1.0 und V1.1 —
> V1.2 fiel aus der Summe, obwohl es als eigene Phase geführt wurde. Die AI-Umrechnung
> unten baute auf derselben zu niedrigen Zahl auf. V1.3 (KI) ist noch nicht geschätzt und
> in keiner Summe enthalten.

#### Neubewertung für AI-gestützte Umsetzung (O-08 geklärt)

**Rahmen:** 3 Monate Vollzeit ≈ **63 Arbeitstage**, mit AI-Agenten als ausführender
Kraft; die eigene Rolle ist Planung, Orchestrierung und Review.

Der Beschleunigungsfaktor ist **nicht** über alle Positionen gleich. Er ist hoch, wo
Spezifikation und Ausführung nah beieinanderliegen, und nahe eins, wo die Schwierigkeit
im Entwurf oder im Debuggen fremder Bibliotheken steckt.

| Arbeitsart | Anteil | Faktor | Begründung |
|------------|-------:|:------:|------------|
| **Mechanisch** — CRUD, Migrationen, Formularfelder, Übersichten, Leerzustände, Docker, Auth-Anbindung | ~55 % (89 PT) | **2,5×** | Klar spezifiziert, wiederholte Muster, gut prüfbar. Hier liegt der eigentliche Gewinn |
| **Mittel** — Autorisierungsschicht, JSONB-Filterung, Terminologie-Auflösung, Kurationslogik, Graph-Einbindung | ~25 % (41 PT) | **1,6×** | Agenten liefern brauchbare Entwürfe, aber Randfälle und Sicherheitslücken brauchen echtes Review |
| **Hart** — generischer Formular-Baustein, Editor-Serialisierung, Zusammenführungs-Semantik, Belohnungsgestaltung | ~20 % (32 PT) | **1,15×** | Der Aufwand steckt im Entwurf und im Debuggen fremder Bibliotheken. Ein Agent kann eine Editor-Erweiterung vorschlagen, aber nicht wissen, warum sie im Zusammenspiel bricht |

| | PT konventionell | PT AI-gestützt |
|---|---:|---:|
| Mechanisch | 89 | 36 |
| Mittel | 41 | 26 |
| Hart | 32 | 28 |
| Zwischensumme | 162 | 90 |
| **+ 15 % Integrationsreibung** | — | **≈ 103** |

> **Integrationsreibung** ist der Posten, der bei AI-gestützter Arbeit am häufigsten
> unterschätzt wird: Agenten-Ausgaben, die einzeln korrekt und zusammen inkonsistent sind;
> Nacharbeit an Benennungen; Wiederholungsschleifen bei unpräzisen Vorgaben. Sie wächst
> mit der Anzahl paralleler Agenten und schrumpft mit der Präzision der Spezifikation —
> was diese Dokumente zu einem direkten Hebel auf den Zeitplan macht.

**Einordnung gegen 63 verfügbare Tage:**

| Ziel | Aufwand AI-gestützt | Bewertung |
|------|--------------------:|-----------|
| Kern-Demo (§11.7) | ≈ 21 PT | Zwischenziel, nicht Endziel |
| V1.0 vollständig | ≈ 45 PT | Sicher erreichbar — **aber allein kein Nachweis der These** |
| **V1.0 + V1.1 vollständig** | **≈ 85 PT** | Über Budget (63 PT). Etwa 25 % von V1.1 muss fallen |
| V1.0 + V1.1 + V1.2 | ≈ 103 PT | Deutlich über Budget |

**Empfehlung:** V1.0 vollständig **plus die Ränge 1 und 2** als verbindliches Ziel — das ist
der Punkt, an dem die These bewiesen ist. Danach nach Beweiskraft weiter, bis die Zeit endet:

| Rang | Umfang | PT (AI) | Begründung |
|:----:|--------|--------:|------------|
| 1 | Erwähnungen (beide Wege) + Entitäten-Liste und Wiki + Herkunft | ~12 | *Ohne diese ist die Kernthese nicht bewiesen* |
| 2 | **Kanonisierungs-Dienst + Kuration (beide Phasen)** | ~9 | *Ohne Kuration entsteht kein Projektwissen — und ohne Projektwissen gibt es nichts zu zeigen* |
| 3 | Beziehungen mit Typprüfung und Schnellsuche | ~4 | *Macht aus einer Liste ein Wissensnetz — Voraussetzung für den Graph* |
| 4 | **Beziehungs-Graph (V1.2)** | ~17 | *Das überzeugendste Bild der Abschlussdemo — aber es braucht Rang 2 und 3, um überhaupt etwas zu zeigen* |
| 5 | Duplikatprüfung und Zusammenführen | ~3 | Streichkandidat |

**Umsortierung gegenüber V0.3 — der Graph steht jetzt hinter der Kuration.**
V0.3 zog ihn nach vorn, weil er für ein Abschlussvorhaben das stärkere Argument sei, und
setzte als Zwischenlösung eine „Direktübernahme per Klick aus der Notiz" für „unter einem Tag"
an. Beides ist zurückgenommen:

- Die Direktübernahme war im PRD **gleichzeitig verboten** (Zustand *laufend*: keine
  Kanonisierung) und hätte Pflichtfeldprüfung, Duplikatprüfung und Beziehungen umgangen —
  bei gleichzeitiger Pflicht, denselben Historieneintrag zu schreiben. Unter einem Tag wäre
  sie nur gewesen, wenn sie denselben Dienst aufruft, den die Kuration aufruft. Genau deshalb
  ist dieser Dienst jetzt ein eigener Baustein und steht vor beiden Oberflächen (E-20)
- Ein Graph über einem leeren Wissensstand beweist nichts. Wenn die Zeit für Rang 4 nicht
  reicht, hat man ein Produkt ohne Bild — reicht sie für Rang 4, aber nicht für Rang 2, hat
  man ein Bild ohne Produkt

Ränge 1–3 summieren sich auf ~25 PT und passen zusammen mit V1.0 (45 PT) **nicht** ins Budget
von 63 PT — es fehlen etwa 7 PT. Deshalb sind die Kontrollpunkte unten verbindlich, nicht
dekorativ, und der Notausgang in §11.7 ist real.

**Kontrollpunkte:**

| Zeitpunkt | Erwarteter Stand | Wenn nicht erreicht |
|-----------|------------------|---------------------|
| Ende Woche 2 | Preset-System + generischer Formular-Baustein abgenommen (beide Presets rendern korrekt) | **Ernstes Warnsignal.** Umfang sofort auf Kern-Demo reduzieren |
| Ende Woche 5 | V1.0 lauffähig: echtes Treffen mit der eigenen Gruppe protokollierbar | Rang 3–5 vorsorglich streichen |
| Ende Woche 8 | **Rang 1–2 fertig: Erwähnungen, Entitäten, Wiki, Herkunft und Kuration.** Ab hier ist die These bewiesen | Graph fällt ersatzlos; verbleibende Zeit in Kuration und Feinschliff |
| Ende Woche 10 | Rang 3–4: Beziehungen und Graph laufen in beiden Presets | Rang 5 streichen, Graph auf statische Ansicht ohne Fokusmodus reduzieren |
| Ende Woche 12 | Feinschliff, Dokumentation, Demo-Aufzeichnung | — |

> **Der Kontrollpunkt in Woche 8 ist der wichtigste.** Bis dahin muss die Schleife
> Notiz → Vorschlag → Kuration → Projektwissen → Herkunft in beiden Presets vollständig
> laufen. Alles danach ist Verstärkung, nicht Nachweis.

> Die letzten zwei Wochen sind **bewusst nicht** für Funktionen verplant. Bei einem
> Abschlussvorhaben ist die vorführbare Demo Teil des Ergebnisses, nicht ein Nebenprodukt.

### 11.7 Empfohlene Baureihenfolge und Notausgang

**Reihenfolge — nach Risiko, nicht nach Bildschirmen:**

0. **Modulgrenze und die drei Lint-Regeln** (§11.2a) — ein halber Tag, vor der ersten
   Fachzeile. Danach eingezogen kosten sie ein Vielfaches, weil jede Verletzung erst
   zurückgebaut werden muss.
1. **Preset-Format + Zod-Schema + generischer Formular-Baustein** — die gesamte Produktthese
   in einem Schritt. Abnahme: beide Presets rendern korrekte Formulare mit Pflichtfeldprüfung,
   ohne typspezifischen Code. *Scheitert das, scheitert das Produkt — und zwar nach 14 statt
   nach 71 Tagen.*
2. Datenmodell, Authentifizierung, Autorisierung im Datenzugriff
3. Projekt / Arbeitsgruppe / Treffen, Profile, Beitrittsfluss
4. Notizblock mit Versionierung und Sichtbarkeit → **hier ist V1.0 nutzbar**
5. Feed (Abruf)
6. Erwähnungen — beide Wege (nach vorgeschaltetem Machbarkeitsversuch, O-07)
7. Entitäten-Liste und Wiki
8. **Kanonisierungs-Dienst** — vor jeder Oberfläche, die ihn benutzt
9. Kuration Phase 1, dann Phase 2
10. Beziehungen, Duplikatprüfung, Zusammenführen
11. Herkunft und Historie
12. Beziehungs-Graph

> **Warum Schritt 8 vor 9 steht.** Der Kanonisierungs-Dienst ist der einzige Weg, auf dem ein
> Vorschlag kanonisch wird — für die Kuration heute und für die KI ab V1.3. Wird er erst
> innerhalb der Kurations-Oberfläche gebaut, entsteht in V1.3 eine zweite Pipeline mit
> eigener Pflichtfeldprüfung und eigenem Historieneintrag. Er separat zu bauen kostet jetzt
> ~3 PT und spart später einen Umbau.

**Notausgang — „Kern-Demo" (≈ 33 PT):** Falls die Zeit knapp wird, ist folgender Umfang
bereits ein vollständiger Nachweis der Kernthese und vorzeigbar:

Preset-System + generischer Formular-Baustein + Projekt/Treffen/Notizblock mit zwei
Sichtbarkeiten + Erwähnung (beide Wege) + **Kanonisierungs-Dienst mit einer minimalen
Kuration (nur Phase 1)** + einfache Entitätsliste mit Herkunftsnachweis.

Weggelassen: Feed, Kuration Phase 2, Beziehungen, Duplikatprüfung, Zusammenführen,
Verlaufsansicht, Graph.

> **Geändert gegenüber V0.3:** Der alte Notausgang ließ die Kanonisierung ganz weg und
> ersetzte sie durch eine Direktübernahme aus der Notiz. Das ist zurückgenommen — ohne
> irgendeine Form von Kuration entsteht kein Projektwissen, und ohne Projektwissen ist die
> Kernthese *„aus Notizen wird nachvollziehbares Gruppenwissen"* nicht vorgeführt, sondern nur
> behauptet. Phase 1 allein ist billig genug, um im Notausgang zu bleiben.
>
> Der Wechsel zwischen beiden Presets bleibt vollständig demonstrierbar — und damit das
> zentrale Erfolgskriterium.

### 11.8 Arbeitsweise mit AI-Agenten

Da die Umsetzung überwiegend durch AI-Agenten erfolgt und die eigene Rolle Orchestrierung
und Review ist, sind einige Architekturentscheidungen zugleich **Leitplanken für Agenten**.
Sie sind hier gebündelt, weil sie den Unterschied zwischen brauchbarem und
unbrauchbarem Agenten-Output ausmachen.

| Leitplanke | Warum sie bei AI-Arbeit besonders zählt |
|------------|------------------------------------------|
| **Drei Regeln, die ein Werkzeug prüft** (§11.2a) | Agenten neigen dazu, den offensichtlichen Weg zu gehen: `if (type === 'npc')` schreiben, `db` direkt importieren, React in eine Regel-Datei ziehen. Ein `grep` gegen Domänenbegriffe und zwei `no-restricted-imports`-Regeln machen die Architektur unumgehbar — statt sie in jedem Review von Hand zu suchen |
| **Abnahmekriterien aus dem PRD als Testfälle** | Die Kriterien in PRD §4.4 sind bewusst überprüfbar formuliert („Auswahl öffnet in < 150 ms und zeigt max. 8 Treffer"). Sie lassen sich direkt als Agenten-Auftrag und als Testbeschreibung verwenden — die Spezifikation wird zur Abnahme |
| **Feldtyp-Prüfmatrix zuerst** | 4 Feldtypen × pflicht/optional × leer/gefüllt/ungültig = 24 Fälle, plus die Sonderregel „`longtext` nie pflicht" und „Vorschlag darf unvollständig sein". Als Testsuite **vor** der Implementierung geschrieben, wird der schwierigste Baustein sicher bearbeitbar |
| **Autorisierung an genau einer Stelle — strukturell, nicht als Vorsatz** | Verteilte Berechtigungsprüfungen sind die häufigste Lücke in agentengenerierten Endpunkten. Deshalb hängt die Prüfung am Datenzugriff (§11.2a) und nicht am Transport: Es gibt keinen zweiten Weg zur Datenbank, an dem sie sich umgehen ließe |
| **Negative Tests in der Definition of Done** | Mindestens: „Member A ruft die »Für mich«-Notiz von B ab → 404" · **„Member ruft die Kanonisierungs-Action direkt auf → 403, obwohl die Schaltfläche nie gerendert wurde"** · „Erwähnung zeigt auf Entität aus fremdem Projekt → abgelehnt" |
| **Enge Bausteingrenzen** | Ein Agent-Auftrag sollte höchstens einen Baustein aus §11.5 umfassen. Aufträge über mehrere Bausteine hinweg erzeugen genau die Integrationsreibung, die in der Schätzung mit 15 % eingepreist ist |
| **Feature-Spezifikationen als Agenten-Vorgabe (O-09)** | Die nachgelagerten technischen Dokumente sind nicht Dokumentation im Nachhinein, sondern der Eingabetext für die Umsetzung. Ihre Präzision übersetzt sich unmittelbar in weniger Wiederholungsschleifen |

**Konsequenz für die Dokumentenlage:** Die Detailspezifikationen aus O-09 (Preset-Format,
Formular-Baustein, Erwähnungs-System, **Kanonisierungs-Dienst**, Kuration) sind bei dieser
Arbeitsweise **nicht optional**. Sie sind der Hebel, der den Faktor 2,5 im mechanischen
Anteil überhaupt erst ermöglicht.

### 11.9 Die KI-Andockstelle (E-09) — Schnittstelle für V1.3, nicht Reserve

> **Höhergestuft in V0.4.** V0.3 führte diesen Abschnitt als „drei Vorkehrungen, die später
> Umbauten ersparen". Mit E-09 ist die KI die **übernächste Ausbaustufe** und nicht mehr
> Backlog — sie soll genau die zwei Stellen übernehmen, die das Produkt heute anstrengend
> machen: beim Schreiben ans Taggen denken, und danach nachkurieren. Entsprechend ist das
> hier eine Schnittstellenbeschreibung, keine Absichtserklärung.

**Der tragende Satz:** *Etwas erzeugt Vorschläge aus einer Notiz-Version; die Kuration weiß
nicht, wer.* Alles Weitere folgt daraus.

1. **Ein Erzeugungs-Dienst, von Anfang an.** `createSuggestion(ctx, { noteVersionId, span,
   typeKey, title, source, confidence, producerVersion })`. Der Erwähnungs-Pfad in V1 ruft
   ihn auf; die KI wird in V1.3 ein zweiter Aufrufer. Ohne diesen Dienst entsteht später
   eine Parallel-Pipeline mit eigener Prüfung und eigenem Historieneintrag.
2. **Ein Kanonisierungs-Dienst** (Reihenfolge §11.7, Schritt 8), der eine Liste von
   Vorschlägen entgegennimmt — unabhängig davon, wer sie erzeugt hat.
3. **Spalten ab V1.0:** `source` (`manual` | `ai`), `confidence` (bei `manual` immer 1.0) und
   `producer_version`. Letzteres ist neu und wichtig: Prompts ändern sich häufiger als Modelle
   und Modelle häufiger als Anbieter — ohne festgehaltene Erzeuger-Version lässt sich später
   nicht beantworten, warum eine Vorschlagswelle schlechter war als die vorige.
4. **Ein Vorschlagsobjekt, nicht zwei.** Vorschlag und kanonische Entität sind **dieselbe
   Tabelle** mit dem Zustand `suggested` bzw. `canonical`; `source`, `confidence` und
   `producer_version` hängen an der Herkunftsverknüpfung. Eine eigene `suggestions`-Tabelle
   neben `entities` wäre der direkte Weg in zwei Pipelines.
5. **Prompts sind versionierte Datendateien**, keine Zeichenketten im Code — sie sind der
   Teil, der sich am häufigsten ändert. Die Modell-Kennung ist Konfiguration, der Anbieter ein
   Adapter hinter *einer* Funktion `analyze(noteVersion, presetSchema) → Suggestion[]`.
   **Keine Anbieter-Abstraktionsschicht vor dem zweiten Anbieter.**
6. **Auslösung.** Ist ein API-Zugang hinterlegt, erscheint im beendeten Treffen die Aktion
   „Notizen analysieren". Ist keiner hinterlegt, existiert die Aktion nicht — kein
   deaktivierter Knopf, kein Hinweis auf eine fehlende Funktion.
7. **Auto-Merge im Versionskontroll-Modell (V1.3).** Ein Vorschlag mit hoher Konfidenz und
   ohne Konflikt wird selbstständig kanonisiert; ein Konflikt — Duplikatverdacht,
   widersprüchliches Pflichtfeld, unklarer Typ — landet in Phase 1 der Kuration. Genau die
   Aufteilung, die ein Versionskontrollsystem zwischen automatischem Merge und manueller
   Konfliktauflösung trifft. Die zweiphasige Kuration ist dafür bereits die richtige Form:
   Phase 1 bekommt einen zweiten Lieferanten, Phase 2 bekommt Markierungsvorschläge.

---

## 12. Offene Punkte nach diesem SRD

| # | Punkt | Nächster Schritt |
|---|-------|------------------|
| **O-04** | Endgültiger Produktname | Vor der ersten öffentlichen Auslieferung entscheiden |
| ~~O-05~~ | ~~Preset-Wechsel eines bestehenden Projekts~~ | **Geklärt (E-01):** dauerhaft ausgeschlossen. Presets werden ausgeliefert; Aktualisierungen sind rein additiv |
| **O-07** *(umformuliert)* | **Machbarkeitsversuch Editor-Serialisierung (2 PT)** | Vor Baubeginn von V1.1. Zu zeigen ist: TipTap stellt Erwähnungen inline als Chip dar, das Markierungsmenü funktioniert, und die Serialisierung in das Marker-Format läuft **verlustfrei hin und zurück**. **In V0.4 entschärft:** Da das Speicherformat nicht mehr am Editor hängt (§11.4), ist ein Scheitern kein Go/No-Go mehr — der Rückfall ist ein einfacheres Eingabefeld, nicht ein anderes Datenmodell |
| ~~O-08~~ | ~~Umfangsentscheidung~~ | **Geklärt:** 3 Monate Vollzeit, AI-gestützt. Ziel: **V1.0 + Rang 1–2** als verbindlich (das ist der Punkt, an dem die These bewiesen ist), danach nach Priorität. Kontrollpunkte in §11.6 |
| **O-09** | Detailspezifikationen je Baustein — **bei AI-gestützter Umsetzung nicht optional** (§11.8) | Je Baustein ein technisches Dokument: Preset-Format, Formular-Baustein, Erwähnungs-System, **Kanonisierungs-Dienst**, Kuration |
| **O-10** | Backup/Restore für Self-Hoster | Vorschlag: `pg_dump`-basiertes Sicherungsskript plus dokumentierter Wiederherstellungsweg, ≈ 2 PT, in V1.0. **Zusätzliches Gewicht seit V0.4:** Die Historie ist dauerhaft und wird nie neu erzeugt — ein Datenverlust ist damit endgültig |
| **O-11** | Teststrategie als eigenes Kapitel | Kernbestandteile bereits in §11.8 vorgezeichnet: Feldtyp-Prüfmatrix, Negativtests der Autorisierung, die drei Lint-Regeln als CI-Schritt |
| **O-16** *(neu)* | Aufwand für V1.3 (KI) ist nicht geschätzt | Nach V1.1 schätzen, wenn die Kurationszahlen aus der eigenen Nutzung vorliegen — sie bestimmen, wie viel die KI überhaupt abnehmen muss |
| **O-17** *(neu)* | Reverse-Proxy- und Betriebsanleitung für Self-Hoster | Mit dem Wegfall von SSE deutlich kleiner geworden, aber weiterhin nötig: Compose-Datei, Umgebungsvariablen, Sicherungsskript, erster Betreiberzugang |

---

## 13. Nächster Schritt

→ **`04-Screen-Inventar.md`** auf diesen Stand nachziehen — Bildschirme, Zustände und
Bauabhängigkeiten.

→ **Detailspezifikationen (O-09)** in dieser Reihenfolge, weil sie die Bauabhängigkeit
abbildet: Preset-Format → Formular-Baustein → Erwähnungs-System → Kanonisierungs-Dienst →
Kuration.

→ **Mockup** der drei tragenden Bildschirme: Notizblock, Kuration, Wiki — jeweils in beiden
Presets nebeneinander, um die Domänenneutralität sichtbar zu machen. Das vorhandene Mockup
ist eine Vorarbeit aus der Findungsphase und bildet den Stand vor V0.4 ab; es ist ein
Requirements-Werkzeug, keine Codebasis.
