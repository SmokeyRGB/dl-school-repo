# Problem Framing — Notella (Arbeitstitel)

### Domain-agnostische Note-Taking-Engine für gemeinsam arbeitende Gruppen

> **Status:** Entwurf v0.3 · 2026-08-13
> **Vorgänger:** `Legacy (TableTop-Worldbuilder)/TableTop-Worldbuilder-ProblemFraming.md` (DnD WorldBuilder, PRS)
> **Nachfolger:** `02-PRD.md` → `03-SRD.md` → `04-Screen-Inventar.md` → `05-Mockup.html`
>
> **Änderung ggü. v0.2 — die größte Überarbeitung bisher.** Nach einer Architektur-Reflexion
> über den Gesamtstand wurden mehrere bereits verankerte Festlegungen bewusst zurückgenommen.
> Kern: das **Leitbild „Versionskontrolle für Wissen"** (neu, siehe unten) · Notizen sind
> einzelne, unveränderliche Einträge statt eines Dokuments je Meeting (E-14, E-15) · zwei
> statt drei Sichtbarkeiten (E-04) · Presets werden ausgeliefert statt importiert (E-01) ·
> Kurator-Rolle und E-05 gestrichen · Review vor Graph (E-13) · KI wird eine eigene, zeitnahe
> Stufe V1.3 statt Backlog (E-09).
>
> **Lesehinweis:** Geänderte Zeilen der Entscheidungstabelle behalten ihre Nummer und tragen
> den Vermerk *v0.3*. Die ursprüngliche Begründung bleibt jeweils erkennbar — nachvollziehbar
> zu machen, *warum* etwas zurückgenommen wurde, ist für die Verteidigung so wichtig wie die
> Entscheidung selbst.

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

## Leitbild: Versionskontrolle für Wissen

> Neu in v0.3. Dieses Modell ist der Maßstab, an dem alle folgenden Entscheidungen
> gemessen werden — und der Grund, warum mehrere Festlegungen aus v0.2 zurückgenommen wurden.

Die Kernverantwortung von Notella lässt sich in einem Satz sagen:

> **Eine Beobachtung aus einem Moment — ein Gedanke, eine Idee, ein Beschluss — in
> verbindliches Gruppenwissen überführen, ohne dabei den Überblick zu verlieren, woher
> dieses Wissen stammt.**

Alles andere im Produkt dient diesem einen Übergang. Und dieser Übergang ist kein neues
Problem: Softwareentwicklung löst ihn seit Jahrzehnten mit Versionskontrolle. Notella
überträgt dieses Modell auf Notizen.

| Git | Notella |
|-----|---------|
| Commit | **Notiz-Version** — unveränderlich, datiert, mit Autor |
| Offener Änderungswunsch auf einem Branch | **Vorschlag** — eine Entität oder Beziehung, die noch nicht kanonisch ist |
| Pull Request | **Kuration** — der Lead geht die Notizen eines Treffens durch |
| Merge | **Kanonisierung** — der Vorschlag wird Teil des Projektwissens |
| Log | **Historie** — dauerhaft, nicht befristet, jederzeit zurückspulbar |
| Revert | eine **neue Änderung**, die einen alten Stand wiederherstellt — nichts wird gelöscht |
| Auto-Merge | **später (V1.3):** die KI kanonisiert selbstständig, der Mensch entscheidet nur bei Unsicherheit |

**Warum das trägt:** Das Modell beantwortet die drei Fragen, an denen Wissenswerkzeuge
sonst scheitern, ohne dass man sie einzeln lösen muss. *Was gilt?* — der kanonische Stand.
*Was ist bloß jemandes Notiz?* — alles, was noch nicht gemerged ist. *Woher wissen wir das?*
— die Herkunftskette zurück zur Notiz-Version, die es ausgelöst hat. Es ist außerdem für
alle, die je mit Git gearbeitet haben, sofort erklärbar, und für alle anderen als
Zeitstrahl darstellbar.

**Konsequenz für die Spezifikation:** Wo ein Abschnitt der folgenden Dokumente sich nicht
in dieser Sprache erklären lässt, ist er vermutlich noch nicht fertig gedacht. Das ist der
Prüfstein, an dem `02-PRD.md` und `03-SRD.md` in v0.3 gemessen wurden.

---

## Kernfelder

| Feld | Beschreibung |
|------|--------------|
| **WHO** | **Primär (V1):** kleine, wiederkehrend zusammenarbeitende Arbeitsgruppen von 3–12 Personen mit einer klaren Leitungsrolle — Produkt-/Projektteams, Studien- und Kursgruppen, Nebenprojekt-Teams. Zwei Rollen: **Lead** (Projektleitung, entscheidet über den verbindlichen Stand) und **Member** (schreibt Notizen, entscheidet über die Sichtbarkeit der eigenen Notizen).<br>**Sekundär (V1, als Preset):** TableTop-/Pen-and-Paper-Runden mit Spielleitung (DM) und Spielenden — dieselben zwei Rollen, anderes Vokabular.<br>**Warum genau diese Gruppen:** Sie treffen sich wiederholt über Monate im selben Kontext, erzeugen also kumulatives Wissen, sind aber zu klein für Wissensmanagement-Prozesse mit eigener Rolle. Der Leidensdruck entsteht nicht im einzelnen Meeting, sondern beim zwanzigsten. |
| **WHAT Problem** | • **Notizen liegen verstreut und privat.** Jede Person schreibt in ihr eigenes Werkzeug; es gibt keinen gemeinsamen Ort, an dem der Gruppenstand entsteht.<br>• **Kein Unterschied zwischen Mitschrift und verbindlichem Stand.** In einem Wiki sieht eine spontane Idee genauso aus wie eine getroffene Entscheidung. Niemand kann sagen, was gilt.<br>• **Struktur entsteht nur durch Nacharbeit — also gar nicht.** Verlinken, Duplikate zusammenführen, Seiten anlegen passiert nach dem Meeting und wird deshalb übersprungen.<br>• **Herkunft geht verloren.** Ein Wiki-Eintrag sagt *was* gilt, aber nicht, in welchem Treffen und aufgrund welcher Diskussion es entschieden wurde.<br>• **Vokabular passt nie ganz.** Generische Tools zwingen zu Freitext-Tags; spezialisierte Tools zwingen in ihr Domänenmodell (Jira kennt keinen NPC, ein DnD-Tool kennt kein API-Endpoint).<br>**Heutiger Workaround:** Obsidian-/Notion-Vault plus geteiltes Dokument plus Chat-Verlauf, kombiniert mit „einer schreibt Protokoll" — was die Last auf eine Person verlagert und trotzdem den Wissensgraphen nicht erzeugt. |
| **WHEN** | Der Schmerz hat zwei Momente:<br>**(1) Während des Treffens** — jemand nennt etwas Wichtiges (eine Entscheidung, eine Abhängigkeit, einen neuen Charakter), und die Person muss in derselben Sekunde entscheiden, ob sie mitschreibt, ordentlich strukturiert oder dem Gespräch folgt. Sie wählt fast immer das Gespräch.<br>**(2) Wochen später** — jemand fragt „warum haben wir das damals so entschieden?" oder „wie hieß dieser Kontakt nochmal?", und die Antwort liegt in einer Notiz, die niemand mehr findet oder die nie geteilt wurde. |
| **WHAT Job** | Als wiederkehrend zusammenarbeitende Gruppe **einen gemeinsamen, verlässlichen Wissensstand aufbauen, ohne dafür Zeit außerhalb der Treffen aufwenden zu müssen** — und zwar so, dass jederzeit klar ist, was verbindlich gilt, was noch persönliche Notiz ist, und aus welchem Treffen eine Information stammt. |
| **WHAT benefits for the customer** | • **Einmal schreiben statt zweimal.** Struktur entsteht im Schreibfluss (`@`-Erwähnung oder Textmarkierung), nicht in einer Nachbereitungssitzung.<br>• **Klarheit über den Status.** Der Unterschied zwischen Mitschrift und Beschluss ist im Werkzeug abgebildet: solange etwas nicht kanonisiert ist, ist es ein Vorschlag — kein Beschluss.<br>• **Kontrolle darüber, was im Team ankommt.** Jede Person entscheidet je Notiz, ob sie im Team-Feed erscheint (*v0.3*).<br>• **Nachvollziehbarkeit über Jahre.** Jeder verbindliche Eintrag verweist auf die Notiz-Version und das Treffen, aus dem er stammt — und jede spätere Änderung bleibt auf dem Zeitstrahl sichtbar.<br>• **Passendes Vokabular ohne Setup-Last.** Die Gruppe wählt beim Anlegen ein Preset und arbeitet in ihren eigenen Begriffen — ohne ein Schema modellieren zu müssen.<br>• **Kognitive Entlastung des Leads.** Kuration läuft als geführter Durchgang ab, nicht als Datenpflege — und ist bewusst so gestaltet, dass sie sich lohnt statt zu ermüden (E-22). |
| **WHAT benefits for the company** | Als Open-Source-/Portfolio-Vorhaben mit späterer Produktoption sind die Ziele:<br>• **Fachlicher Nachweis (primär):** Ein zweites, fachfremdes Preset (TableTop) läuft vollständig **ohne eine Zeile Codeänderung** — messbar und binär überprüfbar.<br>• **Echte Nutzung (primär):** Die eigene Gruppe verwendet das Tool freiwillig über mindestens **5 aufeinanderfolgende Treffen** hinweg weiter, ohne parallel in ein Zweitwerkzeug auszuweichen.<br>• **Funktional & intuitiv:** Eine neue Teilnehmerin kann ohne Erklärung an einem Meeting teilnehmen und Notizen mit korrekter Sichtbarkeit erstellen — Zielmarke: **unter 3 Minuten bis zur ersten strukturierten Notiz**.<br>• **Vorzeigbarkeit:** Dokumentierte Architekturentscheidungen und lauffähige Demo als Abschluss-/Portfolioartefakt.<br>• **Optionswert:** Multi-Tenancy und Preset-Trennung sind so geschnitten, dass ein späterer SaaS-Betrieb (Freemium) möglich bleibt, ohne dass V1 dafür Aufwand trägt. |

---

## Bestätigte Rahmenentscheidungen

Diese Punkte sind im Dialog geklärt und gelten als Eingangsvoraussetzung für PRD und SRD.

| # | Entscheidung | Begründung / Konsequenz |
|---|---|---|
| E-01 *(v0.3)* | **Domain-Kontext kommt aus Presets.** Presets werden **mit dem Deployment ausgeliefert**, nicht zur Laufzeit importiert. Beim Anlegen eines Projekts wählt der Lead eines der ausgelieferten Presets; danach ist es für dieses Projekt unveränderlich. | Der Lead trifft genau **eine** Entscheidung statt eines Konfigurations-Marathons. **Zurückgenommen in v0.3:** Import-Oberfläche, Preset-Verwaltung und additive Schema-Erweiterung zur Laufzeit. Ein Preset ist eine hochrangige Entwurfsaufgabe, keine Endnutzer-Funktion — wer es ändern will, ändert die Datei und liefert neu aus. Das streicht eine ganze Bildschirmfamilie, die gesamte Angriffsfläche fremder Konfigurationsdateien und die Versionierung der Preset-Bindung. Preset-Aktualisierungen über neue Releases müssen **abwärtskompatibel (rein additiv)** sein, damit bestehende Projekte weiterlaufen. |
| E-02 | **Presets definieren echtes Schema**, nicht nur Labels: Entitätstypen, deren Felder, erlaubte Beziehungstypen, Terminologie der Hierarchieebenen. Mitgelieferte Presets sind kopier- und erweiterbar. | Nur so lässt sich `Component/Endpoint` und `NPC/POI` sinnvoll abbilden. Der Kern kennt ausschließlich generische Entität + Beziehung. |
| E-03 | **Hierarchie fix 3-stufig:** Projekt → Arbeitsgruppe → Meeting → Notiz. Parallele Breakout-Gruppen sind Geschwister auf der Arbeitsgruppen-Ebene. Benennung der Ebenen kommt aus dem Preset. | Deckt das Breakout-Szenario ab, hält Navigation, Breadcrumbs und Berechtigungsvererbung einfach. Datenmodell bleibt trotzdem rekursionsfähig für spätere Tiefe. |
| E-04 *(v0.3)* | **Zwei Sichtbarkeiten je Notiz: „Für mich" / „Für Team".** *Kanonisch* ist **keine** Stufe der Notiz, sondern eine Eigenschaft der daraus abgeleiteten Entitäten. | **Zurückgenommen in v0.3:** die dreistufige Skala. Sie vermischte zwei verschiedene Dinge — wer eine Notiz sieht, und ob eine Aussage verbindlich ist — und war damit an mehreren Stellen widersprüchlich spezifiziert. Die Benennung ist bewusst „Für mich" statt „privat": Notella verspricht **keine** echte Privatsphäre (siehe E-16). Wer wirklich private Notizen braucht, soll ein Werkzeug benutzen, das darauf spezialisiert ist. Das Preset legt weiterhin nur den Default fest. |
| ~~E-05~~ *(v0.3 gestrichen)* | ~~Lead-Einsicht in private Notizen per Preset schaltbar, mit einmaligem Hinweis.~~ | **Ersatzlos gestrichen.** Mit E-04 und E-16 gibt es nichts mehr zu schalten: der Lead sieht in der Kuration ohnehin alle Notizen, und das wird einmal klar gesagt statt per Flag konfiguriert. Ein Schalter, der Privatsphäre nur *manchmal* zusagt, ist rechtlich und gestalterisch schlechter als eine ehrliche, unmissverständliche Aussage. |
| E-06 *(v0.3)* | **Kein Live-Co-Editing.** Jede Person schreibt ihre eigenen Notizen; für das Team freigegebene Notizen erscheinen bei den anderen in einem **abrufbaren Feed**. | Vermeidet CRDT/OT-Komplexität vollständig. **Präzisiert in v0.3:** der Feed wird nicht gepusht, sondern abgerufen (E-26) — und das Notizfeld ist kein Dokument mehr, sondern ein Block einzelner Einträge (E-14). |
| E-07 *(v0.3)* | **Strukturierung sowohl per `@`-Inline-Erwähnung als auch per Textmarkierung.** Beide Wege erzeugen dieselbe Datenstruktur, und **beide stehen beiden Rollen offen** — dem Schreibenden im Meeting wie dem Lead in der Kuration. | Tastatur-Workflow für die einen, mausbasierter Weg für die anderen. **Präzisiert in v0.3:** in v0.2 war implizit, dass der Markier-Weg vor allem später der KI dient; tatsächlich ist er für Menschen der wichtigere der beiden, weil man beim Schreiben selten schon weiß, dass ein Satz strukturrelevant ist. |
| E-08 | **Kanonisierung erzeugt Projekt-Entitäten**; die Ursprungsnotiz bleibt als Herkunftsnachweis verknüpft. | Erhält den Knowledge-Graph-Gedanken des Vorgängerdokuments und beantwortet „woher wissen wir das?". |
| E-09 *(v0.3)* | **Keine KI in V1 — aber KI ist V1.3, nicht Backlog.** Der Extraktions-Pfad wird nicht nur freigehalten, sondern als Schnittstelle der übernächsten Ausbaustufe geplant: die KI wird zu einem zweiten Vorschlagslieferanten für dieselbe Kuration. | Das Tool ist ohne KI vollständig nutzbar (wichtig für self-hosted und Datenschutz). **Höhergestuft in v0.3:** Genau die zwei unbequemsten Stellen des Produkts — beim Schreiben Hirnschmalz ins Taggen stecken, und danach lange nachkurieren — sind die, die eine KI abnehmen soll. Das auf unbestimmte Zeit ins Backlog zu schieben hieße, die Schwäche des Produkts zu konservieren. Architektonische Folge: Vorschlagserzeugung ist **von Anfang an ein Dienst mit einer Quellenangabe**, nicht ein fest verdrahteter Erwähnungs-Pfad. |
| E-10 | **Beachhead: Business-/Meeting-Kontext.** TableTop ist V1-Zweitpreset und Machbarkeitsnachweis. | Größerer Anwendungsraum und näher am Ausbildungskontext. Risiko (starke Konkurrenz) siehe unten. |
| E-11 | **Betriebsmodell: self-hosted / Open Source zuerst**, SaaS-Freemium als spätere Option. | Keine Abrechnungslogik in V1, aber Mandantentrennung im Datenmodell von Anfang an. |
| E-12 *(v0.3)* | **Teilnehmerprofil auf Projektebene**, ein Konto darf mehrere Profile im selben Projekt besitzen. | Deckt beide Muster ohne Sonderlogik ab: ein Teammitglied über alle Sprints hinweg, oder zwei Charaktere in zwei Kampagnen derselben Welt. **Begründung präzisiert in v0.3:** Der Mechanismus ist der Einladungslink — *ein Link erzeugt ein Profil*. Wer zwei Charaktere spielen soll, bekommt zwei Einladungen. Damit braucht es keine eigene Profilverwaltung, und es ist für die Plattform unerheblich, ob hinter zwei Profilen ein Mensch oder zwei stehen (siehe E-29). |
| E-13 *(v0.3)* | **Der Beziehungs-Graph bleibt in V1** — aber als Stufe **nach** der Kuration, nicht davor. | Ohne Netzdarstellung bleibt die Beziehungsschicht unsichtbar; das gilt weiterhin. **Korrigiert in v0.3:** In v0.2 stand der Graph aus Demo-Gründen *vor* der Kuration, und PRD und SRD widersprachen sich an dieser Stelle offen. Die Reihenfolge ist jetzt eindeutig: Der Graph zeigt Beziehungen — aber Beziehungen entstehen erst durch Kuration. Ein Graph über einem leeren Wissensstand beweist nichts. Funktion vor Bild. |

### Neue Festlegungen (v0.3)

Diese Punkte entstanden aus der Architektur-Reflexion und der anschließenden Produktdiskussion.
Sie sind gleichrangig zu E-01…E-13 und ebenso verbindlich für PRD und SRD.

**Notizen und Sichtbarkeit**

| # | Entscheidung | Begründung / Konsequenz |
|---|---|---|
| E-14 | **Eine Notiz ist ein einzelner Eintrag, kein Dokument je Treffen.** Ablauf: neue Notiz → schreiben → abschicken → nächste Notiz. Jede Notiz trägt ihre eigene Sichtbarkeit. | Die alte Fassung gab jeder Person *ein* Notizfeld je Meeting — damit war eine Sichtbarkeit je Notiz gar nicht möglich, obwohl E-04 genau das verlangte. „Ich muss an die Kaffeepause denken" und „Wir haben Postgres beschlossen" gehören nicht in dasselbe Dokument. Der Notizblock löst das, macht Notizen einzeln kuratierbar und ist zugleich die Voraussetzung für E-15. |
| E-15 | **Eine abgeschickte Notiz ist unveränderlich.** Bearbeiten erzeugt eine neue Version; die vorherige bleibt in der Historie. **Für Nutzende fühlt es sich wie normales Bearbeiten an** — angezeigt wird überall, auch in der Kuration, nur die neueste Version. | Der Commit-Gedanke aus dem Leitbild. Er löst drei Probleme kostenlos mit: kein Konflikt zwischen zwei Browser-Tabs oder nachgespieltem Offline-Puffer, keine nachträgliche Verfälschung eines Herkunftsnachweises, und kein serverseitiges Umschreiben fremder Notizen beim Löschen einer Entität. Der Nutzen für die schreibende Person bleibt trotzdem erhalten: aus *„Tom macht Datenbank, 1 Woche"* darf später *„Wir haben gemeinsam besprochen, dass Tom die Datenbank innerhalb der nächsten Woche übernimmt"* werden, ohne dass man beim ersten Tippen schon perfekt formulieren muss. |
| E-16 | **Der Lead sieht in der Kuration alle Notizen eines Treffens**, auch die mit „Für mich". Die Sichtbarkeit steuert ausschließlich, was **andere Teilnehmende** im Feed sehen. | Ehrlichkeit statt vorgetäuschter Privatsphäre. Notella ist ein Werkzeug für gemeinsames Gruppenwissen — eine Zusage echter Vertraulichkeit wäre ein rechtliches Minenfeld und technisch ohnehin nicht durchzuhalten, sobald aus einer Notiz Projektwissen wird. Wird beim Onboarding **einmal klar gesagt**, nicht als Dauerbanner. |
| E-17 | **Notiz-Historie ist während des Treffens nicht sichtbar.** In Kuration und Herkunftsansicht ist sie einsehbar, drängt sich aber nicht auf. | Bewusster Tauschhandel: die Schreibfläche soll volle Konzentration erlauben, und die neueste Version ist in nahezu allen Fällen die relevante. Nachvollziehbarkeit heißt „im Zweifel überprüfbar", nicht „ständig präsent". |

**Kuration und Kanonisierung**

| # | Entscheidung | Begründung / Konsequenz |
|---|---|---|
| E-18 | **Kuration hat zwei Phasen in einem Fluss.** *Phase 1:* die vorgetaggten Vorschläge abarbeiten — schnell, binäre Fragen. *Phase 2:* die Notizen durchgehen und prüfen, was zu taggen vergessen wurde. | Phase 1 allein reichte nicht: Man kann sich nicht darauf verlassen, dass Teilnehmende während eines Gesprächs sinnvoll taggen — und alles, was niemand getaggt hat, hätte das Projektwissen nie erreicht. Phase 2 ist das Sicherheitsnetz, Phase 1 bleibt der schnelle Normalfall. In V1.3 liefert die KI die Vorarbeit für Phase 1 (E-09). |
| E-19 | **Entitäten und Beziehungen werden in einem Durchgang bearbeitet.** Eine Notiz wird genau einmal angefasst. Der Lead schließt jede Notiz selbst ab — „fertig" ist eine bewusste Geste, kein abgeleitetes Kriterium. | Zwei getrennte Durchgänge je Notiz — erst Entitäten, dann Beziehungen — würden die Kuration verdoppeln und frustrieren. Für Beziehungen genügt eine schnelle Geste mit Suchfeld über das ganze Projekt; komplexere Verknüpfungsarbeit gehört ins Wiki und später in den Graph. |
| E-20 | **Kanonisierung passiert ausschließlich in der Kuration.** Kein direktes Kanonisieren aus der laufenden Notiz heraus. | War als Bequemlichkeit für den Lead gedacht, erzeugte aber Widersprüche auf mehreren Ebenen: Pflichtangaben und Beziehungen bleiben so ungeprüft, und in v0.2 war der Weg gleichzeitig spezifiziert *und* durch die Meeting-Zustandsmaschine verboten. Ein Weg, eine Regel. |
| E-21 | **Der Kurationszustand hängt an der Notiz, nicht am Treffen.** | Ein Treffen ist gemeinsames Brainstorming, kein abschließbarer Vorgang — Teilnehmenden fällt hinterher noch etwas ein. Nachgereichte Notizen sind schlicht weitere unkuratierte Notizen. Damit gibt es keine „abgeschlossene, aber trotzdem wachsende" Warteschlange. |
| E-22 | **Kuration muss sich lohnen — als Anforderung, nicht als Verzierung.** Jede abgeschlossene Notiz ist sichtbar belohnend gestaltet. | Die Kuration ist die Stelle, an der das Produkt steht oder fällt: Wird sie übersprungen, bleibt der Wissensstand leer (siehe R-03). Sie wird deshalb im PRD auf derselben Ebene geführt wie Leistungs- und Barrierefreiheitsziele — nicht als „nice to have", sondern als Funktionsanforderung. |
| E-23 | **Live-Taggen beim Schreiben muss sich sichtbar auszahlen.** | Der Fokus während eines Treffens liegt beim eigenen Schreiben. Getaggte Stellen sparen später Kurationsarbeit — und die Schreibfläche soll das spürbar machen, statt Taggen als zusätzliche Pflicht erscheinen zu lassen. |

**Datenhaltung und Betrieb**

| # | Entscheidung | Begründung / Konsequenz |
|---|---|---|
| E-24 | **Nur zwei Rollen: Lead und Member.** Die Kurator-Rolle wandert ins Backlog. | Sie war als Gegenmaßnahme gegen R-03 gedacht, war aber im gesamten Entwurf nur halb durchgezogen. Langfristig ist die Kurationslast für eine Person womöglich zu viel — dann lässt sich die Rolle nachrüsten, wenn Berechtigungen als Fähigkeiten statt als Rollenvergleiche geprüft werden. |
| E-25 | **Die Historie ist dauerhaft.** Keine 30-Tage-Frist, kein Umkehrfenster. Jede Änderung ist ein Punkt auf einem Zeitstrahl; Zurücknehmen ist eine neue Änderung, kein Löschen. | Eine Frist würde die Kernzusage zerstören: Wenn das Wissen über eine Änderung nach 30 Tagen verfällt, ist die Frage „woher wissen wir das?" nach einem Jahr nicht mehr beantwortbar. Nebeneffekt: kein Hintergrund-Job nötig, und die spätere **verschiebbare Zeitleiste** (wie sich ein Eintrag oder der Graph über Monate entwickelt hat) wird zur reinen Darstellungsfrage. |
| E-26 | **Feldtypen in V1: `text`, `select`, `date`, `reference`.** `longtext` bleibt erlaubt, aber **nie als Pflichtfeld**. `number` nur, wenn ein ausgeliefertes Preset es wirklich braucht. | Maßstab ist die Kuration: Ein Pflichtfeld muss in Sekunden beantwortbar sein. Das ausgelieferte Beispiel-Preset verlangte bisher eine Pflicht-*Begründung* als Freitext — unvereinbar mit dem eigenen Ziel von unter sechs Sekunden je Vorschlag. Weniger Feldtypen heißt außerdem: weniger Validierung, weniger Formularlogik, weniger Filterfälle. |
| E-27 | **Der Feed wird abgerufen, nicht gepusht.** Ein Aktualisieren-Symbol genügt; kein Server-Push. | Der Feed bleibt (er ist das, was ein Treffen gemeinsam macht), aber er muss nicht von selbst aufpoppen. Das erspart Kanalverwaltung, Wiederverbindungslogik, empfängerabhängige Filterung und eine Reverse-Proxy-Falle beim Self-Hosting — für eine Funktion, deren Anlass meistens schlicht Interesse ist. |
| E-28 | **Duplikatprüfung durch Normalisierung, nicht durch Ähnlichkeitswertung.** Groß-/Kleinschreibung, Zeichensetzung und Leerraum werden vereinheitlicht und abgeglichen — über Titel und Aliasse. | Doppeldefinitionen sollen auffallen; Tippfehlertoleranz ist dafür nicht nötig und kostet ein Zusatzmodul samt Kalibrierung. Die anspruchsvolle Bewertung übernimmt in V1.3 ohnehin die KI. |
| E-29 | **Zugang ausschließlich über Einladungslink; kein Mailversand.** Drei Ebenen: Betreiberkonto (beim Aufsetzen angelegt) → Teilnehmerkonto (per Einladung) → Profil (im Projekt angelegt und beim Beitritt gewählt). Passwort zurücksetzen = signierter Link vom Lead. | Wie ein Familienkonto mit einer Ebene mehr. Ohne Mailversand ist eine offene Selbstregistrierung nicht verantwortbar — und mit dem Einladungslink existiert das passende Mittel bereits. Erspart dem Self-Hoster die SMTP-Einrichtung vollständig. |
| E-30 | **V1 ist einsprachig (Deutsch) und ohne Zeitzonen-Logik** (CET). Kalenderdaten werden als Datum gespeichert, nicht als Zeitpunkt. | Mehrsprachigkeit und Zeitzonen sind echte Anforderungen — aber später. Zuerst muss gezeigt werden, dass das Werkzeug funktioniert. Nebeneffekt: die zweisprachige Terminologie im Preset entfällt, und ein Kalenderdatum kann nicht mehr um einen Tag verrutschen. |

---

## V1-Scope (bestätigt)

**Enthalten:**

1. Kern-Schleife: Projekte, Arbeitsgruppen, Treffen, **Notizblock mit versionierten
   Einzelnotizen** und zwei Sichtbarkeiten, abrufbarer Team-Feed
2. Strukturierung im Schreibfluss (`@`-Erwähnung **und** Textmarkierung) sowie
   Entitäten-Detailseiten mit Beziehungen und Herkunft
3. **Kuration** — zweiphasiger Durchgang durch die Notizen eines Treffens, in dem der Lead
   Vorschläge bestätigt, Übersehenes nachträgt und kanonisiert
4. Zwei ausgelieferte Presets (Software-Projekt, TableTop) — vollständig, dokumentiert,
   ohne Codeunterschied austauschbar
5. **Beziehungs-Graph** — Darstellung des gesammelten Wissens als Netz, mit
   preset-gesteuerten Knotenformen und -farben, Typ- und Zeitfiltern, Fokusmodus und
   Kanten-Herkunft

**Zeitnah danach (V1.3, kein Backlog):** KI-Extraktion als Vorschlagslieferant,
automatisches Kanonisieren mit Rückfrage nur bei Unsicherheit, Zusammenführen von Duplikaten
mit Ähnlichkeitsbewertung.

**Nicht enthalten (Backlog):** Preset-Import und Community-Kuratierung, Preset-Editor als
eigenes Werkzeug, Kurator-Rolle, Stapelaktionen, Mehrsprachigkeit und Zeitzonen, Mailversand,
Server-Push für den Feed, verschiebbare Zeitleiste, Karten, Suche über Projekte hinweg,
Exporte, Abo- und Abrechnungslogik, Live-Co-Editing, mobile App, Pfadsuche und Clustering
im Graph.

> **Warum der Graph dazugehört — und warum er trotzdem zuletzt kommt (E-13):**
> Das Produktversprechen lautet, dass aus verstreuten Notizen ein *zusammenhängender*
> Wissensstand entsteht — und Zusammenhang lässt sich in einer Tabelle nicht zeigen. Eine
> Liste beantwortet „Was ist das?", nur die Netzdarstellung beantwortet „Wie hängt alles
> zusammen?". Hinzu kommt der Nachweischarakter: Das primäre Erfolgsziel „zweites Preset ohne
> Codeänderung" wird im Graph in einer Sekunde sichtbar — dieselbe Karte, andere Formen,
> andere Farben, andere Verben an den Kanten.
>
> **Korrektur gegenüber v0.2:** Daraus wurde dort geschlossen, den Graph *vor* die Kuration
> zu ziehen, weil er die stärkere Demo ist. Das war falsch herum gedacht. Die Kanten, die der
> Graph zeigt, entstehen erst in der Kuration — ohne sie zeichnet er ein leeres Netz. Ein
> beeindruckendes Bild über einem leeren Wissensstand wäre eine Demo, kein Produkt.

> ⚠️ **Hinweis zum Umfang:** Fünf V1-Bausteine sind für ein Solo-Vorhaben ambitioniert.
> PRD und SRD schneiden V1 deshalb in Stufen: **V1.0 — Die Schleife**, **V1.1 — Die
> Wissensschicht** (*hier liegt der eigentliche Nachweis*), **V1.2 — Beziehungs-Graph**
> (Streckziel), **V1.3 — KI übernimmt das Unbequeme**. Wichtig und in v0.2 anders:
> **V1.0 allein ist kein Nachweis
> der These.** Ein funktionierendes Notizwerkzeug ohne Wissensschicht zeigt nichts, was es
> nicht schon gäbe. Wenn die Zeit knapp wird, wird innerhalb von V1.1 gekürzt — nicht V1.1
> als Ganzes.

---

## Risiken & offene Spannungen

| # | Risiko | Auswirkung | Vorgeschlagene Gegenmaßnahme |
|---|--------|-----------|------------------------------|
| R-01 | **Generizität frisst Intuitivität.** Ein vollständig konfigurierbares Schema führt leicht zu einer UI, die nach Datenbank-Administration aussieht. | Kernversprechen „so intuitiv wie möglich" wird verfehlt. | Presets sind die einzige Konfigurationsoberfläche für Endnutzende. Kein Schema-Editor im UI in V1. Die Anwendung zeigt nie generische Begriffe wie „Entität", sondern immer die Preset-Terminologie. |
| R-02 | **Konkurrenzdichte im Business-Beachhead.** Notion, Confluence, Linear, Granola sind etabliert und kostenlos verfügbar. | Adoption durch fremde Teams unwahrscheinlich; Tool bleibt Portfolio-Artefakt. | Erfolg wird bewusst an der *eigenen* Gruppe und am Preset-Nachweis gemessen, nicht an Marktanteilen. Differenzierung liegt im Sichtbarkeits-/Kanonisierungs-Workflow, den keines der genannten Tools hat. |
| R-03 *(v0.3 neu bewertet)* | **Kuration wird zum Flaschenhals.** Wenn nur der Lead kanonisieren darf und nach jedem Treffen ein Stapel wartet, wird der Schritt übersprungen. **In v0.3 verschärft:** Die bisherigen Gegenmaßnahmen sind entfallen — die Kurator-Delegation ist im Backlog (E-24), Stapelaktionen sind gestrichen — und Phase 2 (E-18) legt sogar noch Arbeit dazu. | Der Wissensstand bleibt leer, das Werkzeug degradiert zum Notizspeicher. **Das ist das wichtigste Produktrisiko überhaupt.** | Drei Maßnahmen statt der weggefallenen: **(1)** Kuration wird als belohnende Erfahrung gestaltet und im PRD als Anforderung geführt, nicht als Verzierung (E-22). **(2)** Vorarbeit im Treffen zahlt sich sichtbar aus, damit Phase 1 den Großteil trägt und Phase 2 kurz bleibt (E-23). **(3)** Die eigentliche Entlastung ist die KI — deshalb ist sie V1.3 und kein Backlog-Eintrag (E-09). Bis dahin gilt die bewusste Annahme: bei einer Gruppe von 3–12 Personen und wöchentlichen Treffen ist die Last für eine Person tragbar. Diese Annahme wird an der eigenen Gruppe gemessen; hält sie nicht, wird die Kurator-Rolle vorgezogen. |
| R-04 *(v0.3 entschärft)* | **Preset-Fehldesign wird teuer.** Ändert sich ein Preset nach produktiver Nutzung (Typ entfernt, Feld umbenannt), müssen bestehende Entitäten migriert werden. | Datenverlust oder blockierte Weiterentwicklung. | Deutlich kleineres Risiko seit E-01: Presets sind kuratierte Dateien im Repository, keine Laufzeit-Konfiguration. Es gibt keinen Weg, über den ein Preset im laufenden Betrieb kaputtgeändert werden kann. Bleibende Regel: Preset-Aktualisierungen über neue Releases sind **rein additiv**; die Konfigurationssprache selbst trägt eine Formatversion. |
| R-05 | **Zwei Zielgruppen im selben V1.** Business-Beachhead plus TableTop-Preset bedeutet doppelten Validierungsaufwand. | Verzögerung, halbfertige Presets. | Das TableTop-Preset wird ausschließlich als *technischer* Nachweis behandelt (läuft ohne Codeänderung), nicht als nutzergetestete Erfahrung. **Ergänzung v0.3:** Beide ausgelieferten Presets müssen trotzdem vollständig, verständlich und dokumentiert sein — sie sind zugleich die Vorlage für alle späteren Community-Presets. |
| R-06 *(v0.3 neu bewertet)* | **Solo-Kapazität vs. Umfang.** | Projekt bleibt unfertig. | Der Umfang wurde in v0.3 spürbar reduziert (Preset-Import, Kurator, Stapelaktionen, Mehrsprachigkeit, Mailversand, Server-Push, unscharfe Suche — alle gestrichen oder verschoben). Verbindlicher Stufenschnitt im PRD. **Korrektur gegenüber v0.2:** Dort galt „V1.0 muss ohne Kuration demonstrierbar sein" als Sicherheitsnetz — das ist kein Nachweis der These. Gekürzt wird innerhalb von V1.1, nicht V1.1 als Ganzes. |
| R-07 *(neu, v0.3)* | **Der Notizblock verändert das Schreibgefühl.** Einzelne, abzuschickende Notizen statt eines fortlaufenden Dokuments könnten sich zerstückelt anfühlen und Menschen zum Ausweichen auf ein Zweitwerkzeug bringen. | Die Kernkennzahl „fünf aufeinanderfolgende Treffen ohne Zweitwerkzeug" wird verfehlt. | Bewusstes Wagnis, weil es die Voraussetzung für Sichtbarkeit je Notiz und für Kuration je Notiz ist. Gegenmaßnahme: die Schreibfläche bekommt im PRD dieselbe Detailtiefe wie die Kuration — sie ist die Nutzerseite desselben Vorgangs. Wird an der eigenen Gruppe früh geprüft. |

---

## Nächster Schritt

→ **`02-PRD.md`** — konkrete Funktionsspezifikation: Datenmodell, Preset-Format,
Rollen- und Rechtematrix, Notizblock und Kurations-Workflow, Screens und Zustände,
Stufenschnitt V1.0 bis V1.3.

Die beiden Abschnitte mit dem größten Gewicht sind **§4.4.1 (Notizblock)** und
**§4.4.2 (Kuration)**. Sie beschreiben zwei Seiten desselben Vorgangs und werden deshalb
gemeinsam und in gleicher Tiefe spezifiziert — die eine Seite entscheidet darüber, wie viel
Arbeit auf der anderen anfällt.
