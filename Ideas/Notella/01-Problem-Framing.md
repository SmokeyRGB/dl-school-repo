# Problem Framing — Notella (Arbeitstitel)

### Domain-agnostische Note-Taking-Engine für gemeinsam arbeitende Gruppen

> **Status:** Entwurf v0.2 · 2026-08-07
> **Vorgänger:** `Legacy (TableTop-Worldbuilder)/TableTop-Worldbuilder-ProblemFraming.md` (DnD WorldBuilder, PRS)
> **Nachfolger:** `02-PRD.md` → `03-SRD.md` → `04-Screen-Inventar.md` → `05-Mockup.html`
>
> **Änderung ggü. v0.1:** Beziehungs-Graph aus dem Backlog in den V1-Scope gehoben (E-13,
> eigene Phase V1.2) · E-12 (Teilnehmerprofil) nachgetragen · Phasenschnitt auf
> V1.0 / V1.1 / V1.2 korrigiert

> **Namenshinweis:** Von deinen bisherigen Ideen ist nur *Notella* domain-neutral.
> *Archivium* und *EverLore* tragen Fantasy-Konnotation und würden das Tool im
> Business-Kontext wieder auf den Spiel-Ursprung festlegen. Arbeitstitel daher: **Notella**.

---

## Problem Statement

Gruppen, die über längere Zeit gemeinsam an einem Vorhaben arbeiten — Software-Teams
ebenso wie Pen-and-Paper-Runden — erzeugen in jedem Treffen wertvolles Wissen, das
unmittelbar danach zerfällt. Notizen liegen verteilt in privaten Obsidian-Vaults,
Notion-Seiten, Chatverläufen und Notizbüchern; niemand weiß verlässlich, was
gemeinsamer, verbindlicher Stand ist und was jemandes persönliche Mitschrift war.
Wer es besser machen will, muss Struktur **nachträglich** von Hand herstellen: Seiten
anlegen, verlinken, Duplikate zusammenführen, Entscheidungen wiederfinden. Genau
diese Nacharbeit findet in der Praxis fast nie statt, weil sie nach dem Meeting
passieren müsste — dann, wenn die Aufmerksamkeit schon woanders ist.

Bestehende Werkzeuge lösen jeweils nur eine Hälfte: Wikis (Notion, Confluence,
Obsidian) sind exzellent im Speichern, kennen aber weder den Ablauf eines Treffens
noch den Unterschied zwischen „meine Mitschrift" und „gemeinsamer Stand". Meeting-
und Projekt-Tools (Linear, Jira) kennen den Ablauf, erzeugen aber kein zusammen­
hängendes Wissensnetz. Und alle setzen ein festes Vokabular voraus, das entweder
zum Software-Kontext passt oder gar nicht.

**Notella** ist eine Note-Taking-Engine, die Struktur *während* des Treffens entstehen
lässt statt danach: Teilnehmende schreiben frei, markieren im Schreibfluss relevante
Begriffe als typisierte Einträge, und die Projektleitung entscheidet in einem
Inbox-Workflow, was davon in den verbindlichen Projektstand übernommen wird. Welche
Typen und Beziehungen es überhaupt gibt, kommt aus einem austauschbaren
**Domain-Preset** — im Software-Team `Component / Endpoint / Decision / Risk`, in der
DnD-Runde `NPC / POI / Item / Faction`. Der Kern der Anwendung kennt nur *Entität*
und *Beziehung*; die Domäne ist Konfiguration, nicht Code.

Für die Nutzenden bedeutet das: einmal schreiben statt zweimal aufschreiben, und
jederzeit beantworten können „was gilt eigentlich, und woher wissen wir das?".
Für das Projekt bedeutet es einen belastbaren Nachweis, dass eine sauber
abstrahierte Engine zwei völlig verschiedene Anwendungsdomänen allein über ein
Config-File bedienen kann — bei gleichzeitig echter, freiwilliger Nutzung durch
eine reale Gruppe.

---

## Kernfelder

| Feld | Beschreibung |
|------|--------------|
| **WHO** | **Primär (V1):** kleine, wiederkehrend zusammenarbeitende Arbeitsgruppen von 3–12 Personen mit einer klaren Leitungsrolle — Produkt-/Projektteams, Studien- und Kursgruppen, Nebenprojekt-Teams. Zwei Rollen: **Lead** (Projektleitung, entscheidet über den verbindlichen Stand) und **Member** (schreibt Notizen, entscheidet über die Sichtbarkeit der eigenen Notizen).<br>**Sekundär (V1, als Preset):** TableTop-/Pen-and-Paper-Runden mit Spielleitung (DM) und Spielenden — dieselben zwei Rollen, anderes Vokabular.<br>**Warum genau diese Gruppen:** Sie treffen sich wiederholt über Monate im selben Kontext, erzeugen also kumulatives Wissen, sind aber zu klein für Wissensmanagement-Prozesse mit eigener Rolle. Der Leidensdruck entsteht nicht im einzelnen Meeting, sondern beim zwanzigsten. |
| **WHAT Problem** | • **Notizen liegen verstreut und privat.** Jede Person schreibt in ihr eigenes Werkzeug; es gibt keinen gemeinsamen Ort, an dem der Gruppenstand entsteht.<br>• **Kein Unterschied zwischen Mitschrift und verbindlichem Stand.** In einem Wiki sieht eine spontane Idee genauso aus wie eine getroffene Entscheidung. Niemand kann sagen, was gilt.<br>• **Struktur entsteht nur durch Nacharbeit — also gar nicht.** Verlinken, Duplikate zusammenführen, Seiten anlegen passiert nach dem Meeting und wird deshalb übersprungen.<br>• **Herkunft geht verloren.** Ein Wiki-Eintrag sagt *was* gilt, aber nicht, in welchem Treffen und aufgrund welcher Diskussion es entschieden wurde.<br>• **Vokabular passt nie ganz.** Generische Tools zwingen zu Freitext-Tags; spezialisierte Tools zwingen in ihr Domänenmodell (Jira kennt keinen NPC, ein DnD-Tool kennt kein API-Endpoint).<br>**Heutiger Workaround:** Obsidian-/Notion-Vault plus geteiltes Dokument plus Chat-Verlauf, kombiniert mit „einer schreibt Protokoll" — was die Last auf eine Person verlagert und trotzdem den Wissensgraphen nicht erzeugt. |
| **WHEN** | Der Schmerz hat zwei Momente:<br>**(1) Während des Treffens** — jemand nennt etwas Wichtiges (eine Entscheidung, eine Abhängigkeit, einen neuen Charakter), und die Person muss in derselben Sekunde entscheiden, ob sie mitschreibt, ordentlich strukturiert oder dem Gespräch folgt. Sie wählt fast immer das Gespräch.<br>**(2) Wochen später** — jemand fragt „warum haben wir das damals so entschieden?" oder „wie hieß dieser Kontakt nochmal?", und die Antwort liegt in einer Notiz, die niemand mehr findet oder die nie geteilt wurde. |
| **WHAT Job** | Als wiederkehrend zusammenarbeitende Gruppe **einen gemeinsamen, verlässlichen Wissensstand aufbauen, ohne dafür Zeit außerhalb der Treffen aufwenden zu müssen** — und zwar so, dass jederzeit klar ist, was verbindlich gilt, was noch persönliche Notiz ist, und aus welchem Treffen eine Information stammt. |
| **WHAT benefits for the customer** | • **Einmal schreiben statt zweimal.** Struktur entsteht im Schreibfluss (`@`-Erwähnung oder UI-Element), nicht in einer Nachbereitungssitzung.<br>• **Klarheit über den Status.** Drei Sichtbarkeitsstufen (privat / geteilt / kanonisch) machen sichtbar, was Meinung und was Beschluss ist.<br>• **Kontrolle über eigene Notizen.** Jede Person entscheidet selbst, was sie teilt; nur der Lead entscheidet, was verbindlich wird.<br>• **Nachvollziehbarkeit.** Jeder verbindliche Eintrag verweist auf die Notiz und das Treffen, aus dem er stammt.<br>• **Passendes Vokabular ohne Setup-Last.** Die Gruppe wählt beim Anlegen ein Preset und arbeitet in ihren eigenen Begriffen — ohne ein Schema modellieren zu müssen.<br>• **Kognitive Entlastung des Leads.** Kanonisierung läuft als Inbox ab (eine Entscheidung pro Bildschirm), nicht als Datenpflege. |
| **WHAT benefits for the company** | Als Open-Source-/Portfolio-Vorhaben mit späterer Produktoption sind die Ziele:<br>• **Fachlicher Nachweis (primär):** Ein zweites, fachfremdes Preset (TableTop) läuft vollständig **ohne eine Zeile Codeänderung** — messbar und binär überprüfbar.<br>• **Echte Nutzung (primär):** Die eigene Gruppe verwendet das Tool freiwillig über mindestens **5 aufeinanderfolgende Treffen** hinweg weiter, ohne parallel in ein Zweitwerkzeug auszuweichen.<br>• **Funktional & intuitiv:** Eine neue Teilnehmerin kann ohne Erklärung an einem Meeting teilnehmen und Notizen mit korrekter Sichtbarkeit erstellen — Zielmarke: **unter 3 Minuten bis zur ersten strukturierten Notiz**.<br>• **Vorzeigbarkeit:** Dokumentierte Architekturentscheidungen und lauffähige Demo als Abschluss-/Portfolioartefakt.<br>• **Optionswert:** Multi-Tenancy und Preset-Trennung sind so geschnitten, dass ein späterer SaaS-Betrieb (Freemium) möglich bleibt, ohne dass V1 dafür Aufwand trägt. |

---

## Bestätigte Rahmenentscheidungen

Diese Punkte sind im Dialog geklärt und gelten als Eingangsvoraussetzung für PRD und SRD.

| # | Entscheidung | Begründung / Konsequenz |
|---|---|---|
| E-01 | **Domain-Kontext kommt aus Presets** (Config-Files), importierbar in den Tool-Einstellungen. Beim Anlegen eines Projekts wählt der Lead ein vorhandenes Preset aus. | Der Lead trifft genau **eine** Entscheidung statt eines Konfigurations-Marathons. Erlaubt self-hosted (ein Preset im Repo) und SaaS (mehrere Presets parallel) mit demselben Mechanismus. |
| E-02 | **Presets definieren echtes Schema**, nicht nur Labels: Entitätstypen, deren Felder, erlaubte Beziehungstypen, Terminologie der Hierarchieebenen. Mitgelieferte Presets sind kopier- und erweiterbar. | Nur so lässt sich `Component/Endpoint` und `NPC/POI` sinnvoll abbilden. Der Kern kennt ausschließlich generische Entität + Beziehung. |
| E-03 | **Hierarchie fix 3-stufig:** Projekt → Arbeitsgruppe → Meeting → Notiz. Parallele Breakout-Gruppen sind Geschwister auf der Arbeitsgruppen-Ebene. Benennung der Ebenen kommt aus dem Preset. | Deckt das Breakout-Szenario ab, hält Navigation, Breadcrumbs und Berechtigungsvererbung einfach. Datenmodell bleibt trotzdem rekursionsfähig für spätere Tiefe. |
| E-04 | **Drei Sichtbarkeitsstufen:** privat / geteilt / kanonisch. Über *geteilt* entscheidet jeder Autor selbst, über *kanonisch* ausschließlich der Lead. | Ein Mechanismus für beide Domänen; Preset legt nur den Default fest (TableTop: privat, Business: geteilt). |
| E-05 | **Lead-Einsicht in private Notizen ist per Preset schaltbar**, mit einmaligem, dezentem Hinweis an die Teilnehmenden — kein dauerhaftes UI-Element. | Im DnD-Kontext erwartet, im Firmenkontext (DSGVO/Mitbestimmung) heikel. Transparenz ohne UI-Clutter. |
| E-06 | **Kein Live-Co-Editing.** Jede Person hat pro Meeting ihr eigenes Notizfeld; geteilte Notizen erscheinen bei den anderen als Live-Feed im Seitenpanel. Der Lead sieht den Feed vollständig (im Rahmen von E-05). | Vermeidet CRDT/OT-Komplexität vollständig, liefert aber das Gefühl eines gemeinsamen Protokolls. |
| E-07 | **Strukturierung sowohl per `@`/`#`-Inline-Erwähnung als auch per UI-Element** (Text markieren → Typ zuweisen). Beide Wege erzeugen dieselbe Datenstruktur. | Tastatur-Workflow für IT-Nutzende, mausbasierter Weg für alle anderen. Die Markier-Variante ist zugleich die spätere Andockstelle der AI-Extraktion. |
| E-08 | **Kanonisierung erzeugt Projekt-Entitäten**; die Ursprungsnotiz bleibt als Herkunftsnachweis verknüpft. | Erhält den Knowledge-Graph-Gedanken des Vorgängerdokuments und beantwortet „woher wissen wir das?". |
| E-09 | **Keine AI in V1.** Der Extraktions-Pfad wird architektonisch freigehalten: Ist in den Einstellungen ein API-Zugang hinterlegt, aktiviert sich die AI-Extraktion als zusätzlicher Vorschlagslieferant für dieselbe Review-Inbox. | Das Tool ist ohne AI vollständig nutzbar (wichtig für self-hosted und Datenschutz). Manuelle Vorschläge und AI-Vorschläge teilen sich Datenmodell und Workflow. |
| E-10 | **Beachhead: Business-/Meeting-Kontext.** TableTop ist V1-Zweitpreset und Machbarkeitsnachweis. | Größerer Anwendungsraum und näher am Ausbildungskontext. Risiko (starke Konkurrenz) siehe unten. |
| E-11 | **Betriebsmodell: self-hosted / Open Source zuerst**, SaaS-Freemium als spätere Option. | Keine Abrechnungslogik in V1, aber Mandantentrennung im Datenmodell von Anfang an. |
| E-12 | **Teilnehmerprofil auf Projektebene**, ein Account darf mehrere Profile im selben Projekt besitzen und ordnet jedes einer oder mehreren Arbeitsgruppen zu. | Deckt beide Muster ohne Sonderlogik ab: ein Teammitglied über alle Sprints hinweg, oder zwei Charaktere in zwei Kampagnen derselben Welt. Kein Preset-Flag nötig. |
| E-13 | **Der Beziehungs-Graph gehört in V1**, nicht ins Backlog — als eigene Phase V1.2. Preset-gesteuerte Knotenformen, -farben und Kantenstile. | Ohne Netzdarstellung bleibt die Beziehungsschicht unsichtbar und damit wertlos. Zugleich der unmittelbarste Nachweis der Domänenneutralität. Begründung siehe V1-Scope. |

---

## V1-Scope (bestätigt)

**Enthalten:**

1. Kern-Schleife: Projekte, Arbeitsgruppen, Meetings, Notizen mit drei Sichtbarkeitsstufen
2. Entity-Tagging (`@`-Erwähnung + UI-Weg) und Entitäten-Detailseiten mit Beziehungen und Herkunft
3. Review-Inbox für die Kanonisierung durch den Lead
4. Preset-Import plus zwei ausgelieferte Presets (Software-Projekt, TableTop)
5. **Beziehungs-Graph** — Darstellung des gesammelten Wissens als Netz aus Entitäten
   und Beziehungen, mit preset-gesteuerten Knotenformen und -farben, Typ- und Zeitfiltern,
   Fokusmodus und Kanten-Herkunft

**Nicht enthalten (Backlog):** AI-Extraktion, Karten, Zeitstrahl-Ansicht, Volltext- und
Semantiksuche über Domänen hinweg, Exporte und Backups, Abo- und Abrechnungslogik,
Live-Co-Editing, mobile App, Preset-Editor im UI, Pfadsuche und Clustering im Graph.

> **Warum der Graph nicht optional ist (E-13):** In einer früheren Fassung stand die
> Graph-Darstellung im Backlog. Das war ein Fehleinschätzung. Das Produktversprechen
> lautet, dass aus verstreuten Notizen ein *zusammenhängender* Wissensstand entsteht —
> und Zusammenhang lässt sich in einer Tabelle nicht zeigen. Eine Liste beantwortet
> „Was ist das?", nur die Netzdarstellung beantwortet „Wie hängt alles zusammen?".
> Ohne sie bleibt die gesamte Beziehungsschicht unsichtbar und damit praktisch wertlos:
> Man pflegt Verbindungen, ohne je etwas davon zu haben.
>
> Hinzu kommt der Nachweischarakter. Das primäre Erfolgsziel — „zweites Preset ohne
> Codeänderung" — wird im Graph in einer Sekunde sichtbar: dieselbe Karte, andere Formen,
> andere Farben, andere Verben an den Kanten, kein Codeunterschied. Kein anderer
> Bildschirm leistet das so unmittelbar.

> ⚠️ **Hinweis zum Umfang:** Fünf V1-Bausteine sind für ein Solo-Vorhaben ambitioniert —
> insbesondere die Punkte 2, 3 und 5 hängen an einem tragfähigen generischen Schema-Modell.
> PRD und SRD schneiden V1 deshalb in drei lauffähige Stufen: **V1.0** (nutzbare Schleife),
> **V1.1** (Wissensschicht) und **V1.2** (Beziehungs-Graph). Das SRD priorisiert innerhalb
> dieser Stufen zusätzlich nach Beweiskraft und stellt den Graph bewusst **vor** die
> Review-Inbox.

---

## Risiken & offene Spannungen

| # | Risiko | Auswirkung | Vorgeschlagene Gegenmaßnahme |
|---|--------|-----------|------------------------------|
| R-01 | **Generizität frisst Intuitivität.** Ein vollständig konfigurierbares Schema führt leicht zu einer UI, die nach Datenbank-Administration aussieht. | Kernversprechen „so intuitiv wie möglich" wird verfehlt. | Presets sind die einzige Konfigurationsoberfläche für Endnutzende. Kein Schema-Editor im UI in V1. Die Anwendung zeigt nie generische Begriffe wie „Entität", sondern immer die Preset-Terminologie. |
| R-02 | **Konkurrenzdichte im Business-Beachhead.** Notion, Confluence, Linear, Granola sind etabliert und kostenlos verfügbar. | Adoption durch fremde Teams unwahrscheinlich; Tool bleibt Portfolio-Artefakt. | Erfolg wird bewusst an der *eigenen* Gruppe und am Preset-Nachweis gemessen, nicht an Marktanteilen. Differenzierung liegt im Sichtbarkeits-/Kanonisierungs-Workflow, den keines der genannten Tools hat. |
| R-03 | **Kanonisierung wird zum Flaschenhals.** Wenn nur der Lead kanonisieren darf und die Inbox nach jedem Meeting voll ist, wird der Schritt übersprungen. | Der Wissensgraph bleibt leer, das Tool degradiert zum Notizspeicher. | Inbox-Batch-Aktionen, Vorschläge nach Konfidenz/Typ gruppiert, Möglichkeit den Kanonisierungsrechte an weitere Personen zu delegieren (Preset-Flag). Explizit im PRD zu spezifizieren. |
| R-04 | **Preset-Fehldesign wird teuer.** Ändert sich ein Preset nach produktiver Nutzung (Typ entfernt, Feld umbenannt), müssen bestehende Entitäten migriert werden. | Datenverlust oder blockierte Weiterentwicklung. | Presets versioniert, Schema-Änderungen additiv; Migrationsstrategie ist Pflichtkapitel im SRD. |
| R-05 | **Zwei Zielgruppen im selben V1.** Business-Beachhead plus TableTop-Preset bedeutet doppelten Validierungsaufwand. | Verzögerung, halbfertige Presets. | Das TableTop-Preset wird ausschließlich als *technischer* Nachweis behandelt (läuft ohne Codeänderung), nicht als nutzergetestete Erfahrung. |
| R-06 | **Solo-Kapazität vs. Umfang.** Vier V1-Bausteine, generisches Schema, zwei Presets. | Projekt bleibt unfertig. | Verbindlicher V1.0/V1.1-Schnitt im PRD; V1.0 muss ohne Review-Inbox demonstrierbar sein. |

---

## Nächster Schritt

→ **`02-PRD.md`** — konkrete Funktionsspezifikation: Datenmodell, Preset-Format,
Rollen- und Rechtematrix, Notiz- und Kanonisierungs-Workflow, Screens und Zustände,
V1.0/V1.1-Schnitt.
