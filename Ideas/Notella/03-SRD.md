# SRD — Notella (Arbeitstitel)

### Solution Requirements Document · Domain-agnostische Note-Taking-Engine

> **Version:** V0.3 — *Änderung ggü. V0.2: **Beziehungs-Graph** als eigene Phase V1.2
> aufgenommen (§5.4, §11.6), Cytoscape.js als Stack-Entscheidung begründet (§11.1),
> Priorisierung nach Beweiskraft neu sortiert — Graph vor Review-Inbox.
> Ggü. V0.1: O-08 geklärt (3 Monate Vollzeit, AI-gestützt), §11.6 AI-Neubewertung,
> §11.8 „Arbeitsweise mit AI-Agenten", O-10/O-11*
> **Datum:** 2026-08-07
> **Autor:** Sam (Digitale Leute School — AI Software Engineering)
> **Vorgänger:** `01-Problem-Framing.md`, `02-PRD.md` (V0.2)
> **Nachfolger:** Feature-Spezifikationen (technisch, je Baustein) → Screen-Inventar → Mockup

---

## 1. Customer

**Primär (Beachhead):** Kleine, wiederkehrend zusammenarbeitende Arbeitsgruppen von 3–12
Personen mit einer klaren Leitungsrolle — Produkt- und Entwicklungsteams, Studien- und
Kursgruppen, Nebenprojekt-Teams. Sie treffen sich über Monate im selben Kontext und
erzeugen kumulatives Wissen, sind aber zu klein für eine eigene Wissensmanagement-Rolle.

**Sekundär (Machbarkeitsnachweis):** TableTop-/Pen-and-Paper-Runden mit Spielleitung.
Strukturell identisch — eine leitende Person, mehrere Schreibende, wiederkehrende Treffen,
wachsender gemeinsamer Wissensstand.

**Systemrollen:** Lead · Kurator (delegierbar) · Member. Details siehe PRD §4.2.

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
| Klarheit über den Status | Drei Sichtbarkeitsstufen machen den Unterschied zwischen Meinung und Beschluss sichtbar |
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

1. **Sichtbarkeitsstufen mit Kanonisierungs-Entscheidung** (privat → geteilt → kanonisch)
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
| Accounts, Einladungslinks pro Projekt | Organisationen/Workspaces über Projekten, SSO, Gastzugang |
| Projekt → Arbeitsgruppe → Meeting → Notiz (fix 3-stufig) | Frei verschachtelbare Hierarchie |
| Drei Sichtbarkeitsstufen, serverseitig durchgesetzt | Freigabe an einzelne Personen, Zugriffsbeschränkung je Arbeitsgruppe |
| Markdown-Editor mit Live-Vorschau, Autosave, Offline-Puffer | Live-Co-Editing (CRDT), Kommentare an Notizen |
| Live-Feed geteilter Notizen | Chat, Reaktionen, Präsenzanzeige mit Cursorn |
| Erwähnungen per `@`/`#` **und** Textmarkierung | Sprach-/Audioerfassung |
| Preset-Import, zwei ausgelieferte Presets, additive Erweiterung | Preset-Editor im UI, Preset-Wechsel eines Projekts, Preset-Marktplatz |
| Sechs Feldtypen (Text, Langtext, Auswahl, Zahl, Datum, Referenz) | Mehrfachauswahl, Datei-Upload, Formeln, berechnete Felder |
| Gerichtete, typisierte Beziehungen mit Quell-/Zielprüfung | Beziehungseigenschaften, gewichtete Kanten |
| Review-Inbox mit Übernehmen / Zusammenführen / Ablehnen | Mehrstufige Freigabe, Abstimmung |
| Unscharfe Suche, Aliasse, Duplikathinweis, Zusammenführen | Semantische Suche, Suche über Projekte hinweg |
| Änderungshistorie der Entitäten inkl. Auslöser und Herkunft | Versionierung der Notiztexte |
| **Beziehungs-Graph** (V1.2): Leinwand, Preset-gesteuerte Formen und Farben, Typ- und Zeitfilter, Fokusmodus, Kanten-Herkunft | Pfadsuche, Clustering, Minimap, Zeitraffer-Abspielen der Weltentwicklung |
| Docker-Compose-Auslieferung | SaaS-Betrieb, Abrechnung, Mandantenfähigkeit im Betrieb |
| Vorbereitete AI-Andockstelle (inaktiv) | AI-Extraktion, Duplikaterkennung per Embedding, Kontextabruf |
| — | Zeitstrahl, Karten, Export/Backup, mobile App |

### 5.4 Phasenplanung

| Phase | Umfang | Ziel | Abhängigkeit |
|-------|--------|------|--------------|
| **V1.0 — Nutzbare Schleife** | Auth, Einladung, Projekt/Arbeitsgruppe/Meeting mit Zustandsmaschine, Notizen mit drei Sichtbarkeitsstufen, Live-Feed, **vollständiges Preset-System**, Terminologie-Auflösung, Teilnehmerprofile mit generischem Formular | „Die Gruppe kann damit ein echtes Meeting protokollieren." Erster echter Nutzungstest. | — |
| **V1.1 — Wissensschicht** | Erwähnungen (beide Wege), Entitäten-Liste und -Detail, Beziehungen, Review-Inbox, Duplikaterkennung und Zusammenführen, Herkunft und Änderungshistorie, additive Preset-Erweiterung | „Aus Meetings entsteht ein Wissensstand." Nachweis der Kernthese. | V1.0 |
| **V1.2 — Beziehungs-Graph** | Graph-Leinwand mit Preset-gesteuerten Formen und Farben, Typ- und Zeitfilter, Fokusmodus mit abgedunkeltem Kontext, Kanten-Herkunft, Leistungsgrenzen mit ehrlicher Filteraufforderung | „Man *sieht*, wie das Wissen zusammenhängt." Das stärkste Bild für die Abschlussdemo | V1.1 |
| **V2 — Ausbau** | AI-Extraktion, Zeitstrahl, Suche über Projekte, Export/Backup, SaaS-Vorbereitung, Pfadsuche und Clustering im Graph | Produktoption | V1.2 |

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
| Beobachtung | Verteilung der Sichtbarkeitsstufen | keine Stufe unter 10 % | `note_created` — validiert, ob drei Stufen gerechtfertigt sind |
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
| **Technisch** | **Generische Formulare sind der Kern und zugleich die härteste Stelle.** Feldtypen, Pflichtfeldprüfung, Referenzfelder, Filter — alles muss datengetrieben rendern. | Falsch geschnitten, wird jede Bildschirmmaske zum Sonderfall und die Abstraktion bricht. | Ein einziger `SchemaForm`-Baustein, der aus einer Felddefinition rendert. Wird **zuerst** gebaut und über beide Presets getestet, bevor irgendein Bildschirm entsteht. Eine Feldtyp-Prüfmatrix (6 Typen × pflicht/optional × leer/gefüllt/ungültig) als Testfundament. |
| **Technisch** | **Ablage der dynamischen Felder** (O-02) — falsche Wahl kostet Filterbarkeit oder Wartbarkeit. | Nachträglich nur mit Datenmigration änderbar. | Entscheidung in §11.3 getroffen und begründet: JSONB mit GIN-Index. |
| **Technisch** | **Erwähnungen an Textpositionen brechen beim Bearbeiten.** Speichert man Zeichen-Offsets, verschiebt jede Textänderung sie. | Herkunftsnachweis zeigt auf die falsche Stelle — genau das Versprechen des Produkts fällt. | Erwähnungen werden als **Knoten im Dokumentbaum** gespeichert, nicht als Offsets (§11.4). |
| **Technisch** | Sichtbarkeit wird versehentlich nur im Frontend durchgesetzt. | Private Notizen wären über die Schnittstelle abrufbar — Vertrauensbruch, DSGVO-Problem. | Eine einzige Autorisierungsschicht, durch die **jede** Abfrage läuft; automatisierte Tests „Member A ruft private Notiz von Member B ab → 404". Teil der Definition of Done jeder Endpunkt-Implementierung. |
| **Produkt** | **Kanonisierung wird zum Flaschenhals** (R-03). | Wissensgraph bleibt leer, Tool degradiert zum Notizspeicher. | Kuratoren-Delegation, Stapelaktionen, Gruppierung nach Typ, Zähler im Projektkopf. Messung über `suggestion_resolved`. Falls die Kennzahl reißt: automatische Übernahme von Vorschlägen mit hoher Duplikat-Ähnlichkeit als V2-Option. |
| **Produkt** | **Generizität frisst Intuitivität** (R-01). | Kernversprechen verfehlt. | Kein Schema-Editor im UI in V1. Endnutzende sehen ausschließlich Preset-Begriffe. Der Intuitivitäts-Test (< 3 min) ist Kern-Kennzahl, nicht Beobachtung. |
| **Produkt** | Konkurrenzdichte im Business-Beachhead (R-02). | Keine externe Adoption. | Erfolg bewusst an eigener Gruppe und Preset-Nachweis gemessen. Kein Marktziel in V1. |
| **Zeit** | **Der Umfang ist für Solo-Arbeit groß** (R-06). Grobschätzung §11.6: ~130 Personentage. | Projekt bleibt unfertig — das häufigste Ende ambitionierter Nebenprojekte. | Harter Schnitt V1.0/V1.1. Zusätzlich ein definierter **Notausgang** (§11.7): eine lauffähige Kern-Demo, die auch bei halber Zeit vorzeigbar ist. |
| **Zeit** | Der Editor (TipTap/ProseMirror) ist eine unbekannte Größe mit steiler Lernkurve. | Kann allein 2–3 Wochen kosten. | Vor V1.0 ein zeitlich begrenzter Machbarkeitsversuch (2 Tage): Erwähnungs-Baustein mit Auswahl-Dialog. Scheitert er, Rückfall auf CodeMirror mit einfacherer Erwähnung. |
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

- **Preset-System** (PRD §4.1): YAML mit Terminologie, Entitätstypen mit Feldern,
  Beziehungstypen mit Quell-/Zielprüfung, Verhaltens-Flags. Bindung als Kopie ans Projekt,
  Laufzeitänderungen ausschließlich additiv, versioniert.
- **Rollen und Rechte** (PRD §4.2): Lead / Kurator / Member; drei Sichtbarkeitsstufen,
  serverseitig durchgesetzt; Transparenzhinweis bei `lead_can_read_private`.
- **Meeting-Zustandsmaschine** (PRD §4.3.2): geplant → laufend → beendet, Nachtrag
  unbegrenzt möglich und gekennzeichnet.
- **Zwei gleichwertige Typisierungswege** (PRD §4.4.1): `@`/`#` per Tastatur und
  Textmarkierung per Maus, identische Datenstruktur.
- **Review-Inbox** (PRD §4.4.2): eine Entscheidung pro Bildschirm; Übernahme gesperrt bei
  offenen Pflichtfeldern; Stapelaktionen gegen den Flaschenhals.
- **Herkunft und Historie** (PRD §4.5): jede Änderung mit Auslöser, Person und Verweis auf
  Notiz/Meeting/Arbeitsgruppe.
- **Teilnehmerprofile** (PRD §4.0, E-12): Projekt-Entitäten, mehrere je Account möglich,
  Zuordnung zu Arbeitsgruppen.

---

## 10. UI/UX-Anforderungen (Zusammenfassung)

| Prinzip | Konsequenz |
|---------|-----------|
| **Nie generische Begriffe** | Jedes Label aus dem Preset. „Entität" erscheint ausschließlich in der Preset-Verwaltung. |
| **Eine Entscheidung pro Bildschirm** | Gilt besonders für die Review-Inbox. Keine Massenformulare. |
| **Progressive Offenlegung** | Preset-Erweiterung, Historie und Zusammenführen sind vorhanden, aber nicht im Hauptweg sichtbar. |
| **Einheitlicher Entitätsaufbau** | Alle Typen teilen denselben Detailaufbau: Titel → Felder → Beziehungen → Herkunft → Historie. |
| **Schreibfluss hat Vorrang** | Der Meeting-Raum ist vollständig per Tastatur bedienbar. Nichts unterbricht das Tippen — kein Modal, kein Bestätigungsdialog beim Erwähnen. |
| **Alle vier Zustände je Bildschirm** | Laden (Skeleton), Leer (mit Handlungsaufforderung), Fehler (mit Wiederholung), Keine Berechtigung (mit Erklärung statt Sperre). |
| **Desktop-first** | Mobil ist nutzbar, nicht optimiert. Kanonisierung ist mobil bewusst nicht vorgesehen. |
| **Barrierefreiheit als Pflicht** | Erwähnungs-Auswahl als ARIA-Combobox; Sichtbarkeitsstufen nie nur farbcodiert. |

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
| **Datenbank** | **PostgreSQL 16+** | JSONB für dynamische Felder, `pg_trgm` für unscharfe Suche, rekursive Abfragen für Beziehungspfade. Deckt alle drei Sonderbedarfe ohne Zusatzsystem. | Neo4j o.ä.: konzeptuell verlockend (Wissensgraph), aber zweites System, zweite Abfragesprache, kein Vorteil bei den erwarteten Größenordnungen (5 000 Entitäten). Auch für den Beziehungs-Graph in V1.2 bleibt Postgres ausreichend — die Graph-Logik liegt im Client, nicht in der Datenbank. |
| **Datenzugriff** | **Drizzle ORM** | Nah an SQL, erstklassige JSONB-Unterstützung, typsichere Migrationen, kein verstecktes Verhalten. Bei dynamischen Feldern ein Vorteil. | Prisma: bequemer, aber JSONB-Abfragen und Ausdrucksindizes sind umständlicher — genau unser Kernfall. |
| **Editor** | **TipTap** (ProseMirror) mit Markdown-Eingaberegeln, `Mention`-Erweiterung und `BubbleMenu` | Liefert **beide** in E-07 geforderten Wege ohne Eigenbau: `Mention` deckt den `@`-Weg ab, `BubbleMenu` den Markierungs-Weg. Erwähnungen sind echte Dokumentknoten — das löst zugleich das Offset-Problem (§11.4). | CodeMirror 6: leichter und schneller erlernt, aber Erwähnungen wären reiner Text; Positionsstabilität müsste selbst gebaut werden. Rückfalloption, falls der Machbarkeitsversuch scheitert. |
| **Authentifizierung** | **Auth.js** mit Credentials-Provider, Argon2id | Self-hostbar ohne externen Dienst, Sessions über Datenbank, später um OAuth erweiterbar. | Lucia: schlanker und lehrreicher, aber mehr Eigenbau. Clerk/Auth0: für self-hosted ungeeignet. |
| **Echtzeit (Live-Feed)** | **Server-Sent Events** je Meeting-Kanal | Einweg-Datenfluss, genau unser Fall (E-06). Läuft über normales HTTP, kein zusätzlicher Server, automatische Wiederverbindung im Browser eingebaut. | WebSocket: unnötige Gegenrichtung und zusätzliche Betriebskomplexität. Polling: einfacher, aber 2-s-Ziel bei vielen Teilnehmenden ineffizient. |
| **Suche** | `pg_trgm` mit GIN-Index über Titel und Aliasse | Tippfehlertoleranz und Ähnlichkeitswert für die Duplikaterkennung in einer Abfrage. Genau die Sorge aus dem Dialog. | Elasticsearch/Meilisearch: mächtiger, aber drittes System für 5 000 Datensätze. Bei V2-Semantiksuche neu bewerten. |
| **Graph-Darstellung** | **Cytoscape.js** mit `fcose`-Layout | Ausgereift, kräftebasiertes Layout mit stabilen Ergebnissen, Formen und Farben vollständig datengesteuert (genau unser Preset-Fall), Fokus-/Abdunkelungs-Effekte über Stilklassen ohne Eigenbau, trägt die erwarteten Größenordnungen mühelos. | **React Flow**: stark für editierbare Ablaufdiagramme, aber schwaches automatisches Layout für organische Netze. **D3-force**: volle Kontrolle, aber Layout, Zoom, Auswahl und Trefferzonen sind Eigenbau — mehrere Tage Mehraufwand. **Sigma.js/WebGL**: erst ab zehntausenden Knoten im Vorteil, schwächere Stil-Schnittstelle. |
| **Auslieferung** | Docker Compose (App + Postgres), versionierte Images | Ein Befehl zum Start. Rücknahme durch vorheriges Image. | Kubernetes: unangemessen. Reines Node-Deployment: Postgres-Einrichtung wird zur Einstiegshürde. |

### 11.2 Architekturschichten

```text
┌─────────────────────────────────────────────────────────┐
│  UI-Schicht — rendert AUSSCHLIESSLICH aus Preset-Schema │
│  SchemaForm · SchemaTable · MentionPicker · RelationPicker│
├─────────────────────────────────────────────────────────┤
│  Preset-Auflösung  (Terminologie, Typen, Felder, Regeln) │
│  serverseitig geladen, im Client zwischengespeichert     │
├─────────────────────────────────────────────────────────┤
│  Autorisierungsschicht  ← JEDE Abfrage passiert sie      │
│  Mitgliedschaft · Rolle · Sichtbarkeit · Projektgrenze   │
├─────────────────────────────────────────────────────────┤
│  Fachlogik — generisch, kennt keine Domänenbegriffe      │
│  Entity · Relation · Note · Mention · Suggestion · Audit │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL  (feste Spalten + JSONB für Preset-Felder)   │
└─────────────────────────────────────────────────────────┘
```

**Die architektonische Kernregel:** Unterhalb der Preset-Auflösung darf **kein einziger
Domänenbegriff** vorkommen. Ein `grep` nach „NPC" oder „Sprint" außerhalb der
Preset-Dateien muss leer bleiben. Das ist zugleich der überprüfbare Nachweis für das
Erfolgsziel „zweites Preset ohne Codeänderung" — und lässt sich als automatisierter
Test formulieren.

### 11.3 Entscheidung O-02 — Ablage der dynamischen Felder

| Ansatz | Vorteil | Nachteil | Bewertung |
|--------|---------|----------|-----------|
| **JSONB-Spalte je Entität** ✅ | Ein Schema für alle Typen, keine DDL zur Laufzeit, additive Erweiterung kostenlos, Validierung zentral gegen das Preset (Zod) | Filterung braucht Ausdrucksindizes; referenzielle Integrität von Referenzfeldern muss die Anwendung sicherstellen | **Gewählt.** Passt exakt zur additiven Erweiterungsregel und zur erwarteten Datenmenge. |
| EAV (Zeile je Feldwert) | Voll indizierbar, referenzielle Integrität möglich | Jede Entitätsabfrage braucht Joins über N Felder; Formulare werden mühsam; Leistung bricht früh | Verworfen — Komplexität ohne Gegenwert bei dieser Größenordnung. |
| Tabelle je Entitätstyp | Beste Abfrageleistung, echte Fremdschlüssel | Erfordert DDL zur Laufzeit beim Preset-Import — Migrationen im Betrieb, hohes Risiko | Verworfen — widerspricht dem Preset-Gedanken direkt. |

**Konkret:** `entities(id, project_id, type_key, title, aliases text[], state, data jsonb, …)`.
GIN-Index über `data`, zusätzlich Ausdrucksindizes für Felder mit `show_in_list: true`
(diese werden gefiltert und sortiert). Referenzfelder speichern die Ziel-`entity_id`;
die Anwendung prüft beim Schreiben Existenz und Typkonformität, und beim Löschen einer
Entität werden verweisende Felder geleert und im Prüfprotokoll vermerkt.

### 11.4 Entscheidung — Positionsstabilität der Erwähnungen

Das Problem: Speichert man eine Erwähnung als Zeichen-Offset („Zeichen 340–352"),
verschiebt jede spätere Textänderung alle nachfolgenden Erwähnungen. Der Herkunftsnachweis
zeigt dann auf die falsche Stelle — und genau der ist das Produktversprechen.

**Lösung:** Die Notiz wird als **ProseMirror-Dokument (JSON)** gespeichert, nicht als
Markdown-Zeichenkette. Erwähnungen sind eigene Knoten im Dokumentbaum mit `mention_id`
und `entity_id`. Sie verschieben sich mit dem Text, weil sie Teil des Textes sind.

Zusätzlich:

- **Markdown wird abgeleitet** — für Suche, Export und den Live-Feed serverseitig aus dem
  JSON erzeugt und in einer Spalte mitgeführt. Es ist eine Projektion, nicht die Quelle.
- Beim Kanonisieren wird der Textausschnitt zusätzlich als **unveränderliche Momentaufnahme**
  in den Vorschlag kopiert. Damit bleibt der Beleg auch dann korrekt, wenn der Autor die
  Notiz später bearbeitet (PRD §4.5, O-03).

### 11.5 Komplexitätsbewertung je Baustein

| Baustein | Komplexität | Warum |
|----------|:-----------:|-------|
| Auth, Einladungslinks | 🟢 niedrig | Gelöstes Problem, Auth.js deckt es ab |
| Projekt/Arbeitsgruppe/Meeting-CRUD | 🟢 niedrig | Gewöhnliche Datenhaltung, Zustandsmaschine mit drei Zuständen |
| Preset-Format, Validierung, Import | 🟡 mittel | Zod-Schema, gute Fehlermeldungen, Bindung als Kopie. Konzeptionell anspruchsvoll, technisch überschaubar |
| **Generisches Formular-Rendering** | 🔴 **hoch** | 6 Feldtypen × Pflicht/Optional × Anzeige/Bearbeitung/Validierung. **Der Baustein, an dem das Produkt steht oder fällt.** Zuerst bauen |
| Terminologie-Auflösung | 🟡 mittel | Zwei Ebenen (UI-Sprache + Preset-Terminologie) sauber trennen; Fallback-Verhalten |
| Autorisierungsschicht | 🟡 mittel | Konzeptionell einfach, aber lückenlos durchzusetzen und zu testen |
| Markdown-Editor, Autosave, Offline | 🟡 mittel | TipTap-Grundlagen sind gut dokumentiert; Offline-Puffer ist Fleißarbeit |
| **Erwähnungs-Auswahl (beide Wege)** | 🔴 **hoch** | ProseMirror-Erweiterung, unscharfe Suche unter 150 ms, vollständige Tastaturbedienung, Inline-Anlage neuer Entitäten |
| Live-Feed (SSE) | 🟡 mittel | Kanalverwaltung, Wiederverbindung, Sichtbarkeitsfilterung je Empfänger |
| Entitäten-Liste mit dynamischen Spalten | 🟡 mittel | Baut auf dem Formular-Baustein auf; JSONB-Filterung |
| Beziehungen mit Quell-/Zielprüfung | 🟡 mittel | Regelauswertung aus dem Preset, beidseitige Anzeige |
| **Review-Inbox** | 🔴 **hoch** | Warteschlangenlogik, Pflichtfeldsperre, Zusammenführen-Ansicht, Stapelaktionen, Zustandsübergänge |
| Duplikaterkennung und Zusammenführen | 🔴 hoch | Ähnlichkeitswertung, Datenübernahmeregeln, Umkehrbarkeit innerhalb 30 Tagen |
| Herkunft und Änderungshistorie | 🟡 mittel | Durchgängiges Protokollieren mit Auslöser-Kontext |
| Docker-Auslieferung | 🟢 niedrig | Compose-Datei, Startskript, Beispieldaten |

**Fünf harte Stellen**, alle in der Wissensschicht — und alle hängen am generischen
Formular-Baustein. Deshalb steht er in §11.7 an erster Stelle.

### 11.6 Aufwandsschätzung

Grobschätzung in Personentagen (1 PT = ein konzentrierter Arbeitstag), Solo-Arbeit,
inklusive Tests und Nacharbeit. Bewusst konservativ.

**V1.0 — Nutzbare Schleife**

| Position | PT |
|----------|---:|
| Projektaufsetzung, Werkzeugkette, CI, Docker-Compose | 3 |
| Datenmodell und Migrationen | 4 |
| Authentifizierung, Einladungslinks | 6 |
| Preset-Format, Zod-Validierung, Import, Bindung | 6 |
| **Generischer Formular-Baustein** (6 Feldtypen, Validierung, Prüfmatrix) | 8 |
| Terminologie-Auflösung (UI-Sprache + Preset, zweisprachig) | 3 |
| Autorisierungsschicht inklusive Sichtbarkeitstests | 5 |
| Projekt / Arbeitsgruppe / Meeting inkl. Zustandsmaschine | 6 |
| Editor: TipTap-Grundlagen, Markdown, Autosave, Offline-Puffer | 7 |
| Sichtbarkeitsumschalter, Transparenzhinweis | 2 |
| Live-Feed (SSE) inkl. Sichtbarkeitsfilterung | 4 |
| Teilnehmerprofile, Beitrittsfluss | 4 |
| Dashboard und Übersichten inkl. aller vier Bildschirmzustände | 5 |
| Beide Presets ausformulieren und durchtesten | 3 |
| Nacharbeit, Fehlerbehebung, Feinschliff | 8 |
| **Summe V1.0** | **≈ 74** |

**V1.1 — Wissensschicht**

| Position | PT |
|----------|---:|
| Erwähnungs-Datenmodell, ProseMirror-Knoten | 4 |
| `@`-Auswahl: unscharfe Suche, Tastaturbedienung, Inline-Anlage | 7 |
| Markierungs-Weg (BubbleMenu) | 3 |
| Entitäten-Liste: dynamische Spalten, Filter, Suche | 6 |
| Entitäten-Detail: generische Feldanzeige und -bearbeitung | 5 |
| Beziehungen: Typprüfung, beidseitige Anzeige, Auswahl | 6 |
| Review-Inbox inkl. Pflichtfeldsperre und Stapelaktionen | 8 |
| Duplikaterkennung (`pg_trgm`), Zusammenführen, Umkehrbarkeit | 7 |
| Herkunft und Änderungshistorie mit Auslöser-Kontext | 5 |
| Additive Preset-Erweiterung im UI | 5 |
| Nacharbeit, Fehlerbehebung, Feinschliff | 8 |
| **Summe V1.1** | **≈ 64** |

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
| V1.0 | 74 | ~25 Wochen | ~15 Wochen |
| V1.1 | 64 | ~21 Wochen | ~13 Wochen |
| **Gesamt** | **≈ 138** | **~46 Wochen** | **~28 Wochen** |

#### Neubewertung für AI-gestützte Umsetzung (O-08 geklärt)

**Rahmen:** 3 Monate Vollzeit ≈ **63 Arbeitstage**, mit AI-Agenten als ausführender
Kraft; die eigene Rolle ist Planung, Orchestrierung und Review.

Der Beschleunigungsfaktor ist **nicht** über alle Positionen gleich. Er ist hoch, wo
Spezifikation und Ausführung nah beieinanderliegen, und nahe eins, wo die Schwierigkeit
im Entwurf oder im Debuggen fremder Bibliotheken steckt.

| Arbeitsart | Anteil | Faktor | Begründung |
|------------|-------:|:------:|------------|
| **Mechanisch** — CRUD, Migrationen, Formularfelder, Übersichten, Leerzustände, Docker, Auth-Anbindung | ~55 % (76 PT) | **2,5×** | Klar spezifiziert, wiederholte Muster, gut prüfbar. Hier liegt der eigentliche Gewinn |
| **Mittel** — Autorisierungsschicht, SSE-Kanäle, JSONB-Filterung, Terminologie-Auflösung, Review-Inbox-Logik | ~25 % (34 PT) | **1,6×** | Agenten liefern brauchbare Entwürfe, aber Randfälle und Sicherheitslücken brauchen echtes Review |
| **Hart** — generischer Formular-Baustein, ProseMirror-Erwähnungen, Zusammenführungs-Semantik, Duplikat-Schwellwerte | ~20 % (28 PT) | **1,15×** | Der Aufwand steckt im Entwurf und im Debuggen fremder Bibliotheken. Ein Agent kann eine ProseMirror-Erweiterung vorschlagen, aber nicht wissen, warum sie im Zusammenspiel bricht |

| | PT konventionell | PT AI-gestützt |
|---|---:|---:|
| Mechanisch | 76 | 30 |
| Mittel | 34 | 21 |
| Hart | 28 | 24 |
| Zwischensumme | 138 | 75 |
| **+ 15 % Integrationsreibung** | — | **≈ 86** |

> **Integrationsreibung** ist der Posten, der bei AI-gestützter Arbeit am häufigsten
> unterschätzt wird: Agenten-Ausgaben, die einzeln korrekt und zusammen inkonsistent sind;
> Nacharbeit an Benennungen; Wiederholungsschleifen bei unpräzisen Vorgaben. Sie wächst
> mit der Anzahl paralleler Agenten und schrumpft mit der Präzision der Spezifikation —
> was diese Dokumente zu einem direkten Hebel auf den Zeitplan macht.

**Einordnung gegen 63 verfügbare Tage:**

| Ziel | Aufwand AI-gestützt | Bewertung |
|------|--------------------:|-----------|
| Kern-Demo (§11.7) | ≈ 19 PT | Sehr komfortabel — als Zwischenziel, nicht als Endziel |
| **V1.0 vollständig** | **≈ 43 PT** | **Sicher erreichbar.** Lässt ~20 Tage für die Wissensschicht |
| V1.0 + V1.1 vollständig | ≈ 86 PT | Über Budget (63 PT). Etwa 25–30 % von V1.1 muss fallen |
| V1.0 + V1.1 + V1.2 | ≈ 103 PT | Deutlich über Budget — Priorisierung ist unvermeidlich |

**Empfehlung:** V1.0 vollständig als **verbindliches Ziel**, danach nach Beweiskraft
priorisiert bis die Zeit endet:

| Rang | Umfang | PT (AI) | Begründung |
|:----:|--------|--------:|------------|
| 1 | Erwähnungen (beide Wege) + Entitäten-Liste und -Detail + Herkunft | ~13 | *Ohne diese ist die Kernthese nicht bewiesen* |
| 2 | Beziehungen mit Typprüfung | ~4 | *Macht aus einer Liste ein Wissensnetz — und ist Voraussetzung für den Graph* |
| 3 | **Beziehungs-Graph (V1.2)** | ~17 | *Das überzeugendste Bild der Abschlussdemo. Zeigt Preset-Neutralität visuell in einer Sekunde* |
| 4 | Review-Inbox | ~5 | *Bis dahin: Direktübernahme per Klick aus der Notiz* |
| 5 | Duplikaterkennung und Zusammenführen | ~5 | Streichkandidat |
| 6 | Additive Preset-Erweiterung im UI | ~3 | Streichkandidat — bis dahin Preset-Datei erneut importieren |

**Bewusste Umsortierung gegenüber der reinen Phasenfolge:** Der Graph steht **vor** der
Review-Inbox. Grund: Für ein Abschlussvorhaben ist der Graph das stärkere Argument —
er macht die Domänenneutralität in einem einzigen Screenshot sichtbar, während die
Inbox ihren Wert erst im Dauerbetrieb zeigt. Eine vereinfachte Direktübernahme aus der
Notiz kostet unter einem Tag und deckt die Kanonisierung solange funktional ab.

Rang 1–4 summieren sich auf ~39 PT und passen zusammen mit V1.0 (43 PT) knapp nicht
ins Budget — deshalb sind die Kontrollpunkte unten verbindlich, nicht dekorativ.

**Kontrollpunkte:**

| Zeitpunkt | Erwarteter Stand | Wenn nicht erreicht |
|-----------|------------------|---------------------|
| Ende Woche 2 | Preset-System + generischer Formular-Baustein abgenommen (beide Presets rendern korrekt) | **Ernstes Warnsignal.** Umfang sofort auf Kern-Demo reduzieren |
| Ende Woche 5 | V1.0 lauffähig: echtes Meeting mit der eigenen Gruppe protokollierbar | Priorisierung auf Rang 1–2 kürzen |
| Ende Woche 8 | Rang 1–2 fertig: Erwähnungen, Entitäten, Beziehungen, Herkunft | Graph (Rang 3) auf eine statische Ansicht ohne Fokusmodus reduzieren |
| Ende Woche 10 | Rang 3 fertig: Beziehungs-Graph läuft in beiden Presets | Rang 5–6 streichen |
| Ende Woche 12 | Feinschliff, Dokumentation, Demo-Aufzeichnung | — |

> Die letzten zwei Wochen sind **bewusst nicht** für Funktionen verplant. Bei einem
> Abschlussvorhaben ist die vorführbare Demo Teil des Ergebnisses, nicht ein Nebenprodukt.

### 11.7 Empfohlene Baureihenfolge und Notausgang

**Reihenfolge — nach Risiko, nicht nach Bildschirmen:**

1. **Preset-Format + Zod-Validierung + generischer Formular-Baustein** — die gesamte
   Produktthese in einem Schritt. Abnahme: beide Presets rendern korrekte Formulare mit
   Pflichtfeldprüfung, ohne typspezifischen Code. *Scheitert das, scheitert das Produkt —
   und zwar nach 14 statt nach 74 Tagen.*
2. Datenmodell, Authentifizierung, Autorisierungsschicht
3. Projekt / Arbeitsgruppe / Meeting, Teilnehmerprofile
4. Editor mit Autosave und Sichtbarkeit → **hier ist V1.0 nutzbar**
5. Live-Feed
6. Erwähnungen (nach vorgeschaltetem 2-Tage-Machbarkeitsversuch)
7. Entitäten-Liste und -Detail
8. Beziehungen
9. Review-Inbox, Duplikate, Zusammenführen
10. Herkunft und Historie, additive Preset-Erweiterung

**Notausgang — „Kern-Demo" (≈ 30 PT):** Falls die Zeit knapp wird, ist folgender Umfang
bereits ein vollständiger Nachweis der Kernthese und vorzeigbar:

Preset-System + generischer Formular-Baustein + Projekt/Meeting/Notiz mit drei
Sichtbarkeitsstufen + `@`-Erwähnung + einfache Entitätsliste mit Herkunftsnachweis.

Weggelassen: Live-Feed, Review-Inbox (Kanonisierung dann direkt aus der Notiz per Klick),
Beziehungen, Zusammenführen, Historie, additive Erweiterung. Der Wechsel zwischen beiden
Presets bleibt vollständig demonstrierbar — und damit das zentrale Erfolgskriterium.

### 11.8 Arbeitsweise mit AI-Agenten

Da die Umsetzung überwiegend durch AI-Agenten erfolgt und die eigene Rolle Orchestrierung
und Review ist, sind einige Architekturentscheidungen zugleich **Leitplanken für Agenten**.
Sie sind hier gebündelt, weil sie den Unterschied zwischen brauchbarem und
unbrauchbarem Agenten-Output ausmachen.

| Leitplanke | Warum sie bei AI-Arbeit besonders zählt |
|------------|------------------------------------------|
| **„Kein Domänenbegriff im Kern" als automatisierter Test** | Agenten neigen dazu, den offensichtlichen Weg zu gehen und `if (type === 'npc')` zu schreiben. Ein CI-Schritt, der `grep -r "npc\|sprint\|kampagne" src/core/` prüft und bei Treffern fehlschlägt, macht die zentrale Architekturregel unumgehbar — statt sie in jedem Review von Hand suchen zu müssen |
| **Abnahmekriterien aus dem PRD als Testfälle** | Die Kriterien in PRD §4.4 sind bewusst überprüfbar formuliert („Auswahl öffnet in < 150 ms und zeigt max. 8 Treffer"). Sie lassen sich direkt als Agenten-Auftrag und als Testbeschreibung verwenden — die Spezifikation wird zur Abnahme |
| **Feldtyp-Prüfmatrix zuerst** | 6 Feldtypen × pflicht/optional × leer/gefüllt/ungültig = 36 Fälle. Als Testsuite **vor** der Implementierung geschrieben, wird der schwierigste Baustein für Agenten sicher bearbeitbar |
| **Autorisierung an genau einer Stelle** | Verteilte Berechtigungsprüfungen sind die häufigste Lücke in agentengenerierten Endpunkten. Eine einzige Schicht, durch die alles läuft, plus negative Tests („Member A ruft private Notiz von B ab → 404") in der Definition of Done |
| **Enge Bausteingrenzen** | Ein Agent-Auftrag sollte höchstens einen Baustein aus §11.5 umfassen. Aufträge über mehrere Bausteine hinweg erzeugen genau die Integrationsreibung, die in der Schätzung mit 15 % eingepreist ist |
| **Feature-Spezifikationen als Agenten-Vorgabe (O-09)** | Die nachgelagerten technischen Dokumente sind nicht Dokumentation im Nachhinein, sondern der Eingabetext für die Umsetzung. Ihre Präzision übersetzt sich unmittelbar in weniger Wiederholungsschleifen |

**Konsequenz für die Dokumentenlage:** Die vier Detailspezifikationen aus O-09
(Preset-Format, Formular-Baustein, Erwähnungs-System, Review-Inbox) sind bei dieser
Arbeitsweise **nicht optional**. Sie sind der Hebel, der den Faktor 2,5 im mechanischen
Anteil überhaupt erst ermöglicht.

### 11.9 Vorbereitung der AI-Andockstelle (E-09)

Kein AI-Code in V1, aber drei Vorkehrungen, die später Umbauten ersparen:

1. `suggestions` trägt von Anfang an die Spalten `source` (`manual` | `ai`) und
   `confidence` (bei `manual` immer 1.0). Die Review-Inbox behandelt beide Quellen gleich.
2. Der Kanonisierungsvorgang nimmt eine Liste von Vorschlägen entgegen — unabhängig davon,
   wer sie erzeugt hat.
3. Die Einstellungen sehen ein Feld für einen API-Schlüssel vor. Ist es gefüllt, erscheint
   im beendeten Meeting die Aktion „Notizen analysieren". Ist es leer, existiert die Aktion
   nicht — kein deaktivierter Knopf, kein Hinweis auf eine fehlende Funktion.

---

## 12. Offene Punkte nach diesem SRD

| # | Punkt | Nächster Schritt |
|---|-------|------------------|
| **O-04** | Endgültiger Produktname | Nach dem Mockup entscheiden |
| **O-05** | Preset-Wechsel eines bestehenden Projekts dauerhaft ausgeschlossen? | Bestätigen oder als V2-Migrationsthema aufnehmen |
| **O-07** | Machbarkeitsversuch TipTap-Erwähnung (2 PT) | Vor Baubeginn von V1.1 durchführen; Ergebnis entscheidet über Rückfall auf CodeMirror |
| ~~O-08~~ | ~~Umfangsentscheidung~~ | **Geklärt:** 3 Monate Vollzeit, AI-gestützt. Ziel: **V1.0 vollständig** als verbindlich, V1.1 nach Priorität bis zur Zeitgrenze. Kontrollpunkte in §11.6 |
| **O-09** | Detailspezifikationen je Baustein — **bei AI-gestützter Umsetzung nicht optional** (§11.8) | Je Baustein ein technisches Dokument: Preset-Format, Formular-Baustein, Erwähnungs-System, Review-Inbox |
| **O-10** | Backup/Restore für Self-Hoster | Im Review-Log als Lücke erfasst. Vorschlag: `pg_dump`-basiertes Sicherungsskript plus dokumentierter Wiederherstellungsweg, ≈ 2 PT, in V1.0 |
| **O-11** | Teststrategie als eigenes Kapitel | Im Review-Log als Lücke erfasst. Kernbestandteile bereits in §11.8 vorgezeichnet |

---

## 13. Nächster Schritt

→ **Screen-Inventar** (alle Bildschirme mit Zweck, Kernelementen und vier Zuständen)
→ **Low-Fidelity-Mockup** der drei tragenden Bildschirme: Meeting-Raum, Review-Inbox,
Entitäten-Detail — jeweils in beiden Presets nebeneinander, um die Domänenneutralität
sichtbar zu machen.
