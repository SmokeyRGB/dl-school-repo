# Product-Audit — Notella (Arbeitstitel)

### Kernfunktion schärfen · Markt-Abgrenzung · USP herausstellen

> **Version:** V0.1 · 2026-08-17
> **Autor:** Sam (Digitale Leute School — AI Software Engineering)
> **Grundlage:** `01-Problem-Framing.md` (v0.3) · `02-PRD.md` (V0.9) · `03-SRD.md` (V0.4)
> **Zweck:** Schul-Verteidigung **und** Produktklarheit. Enthält frische Marktrecherche
> (Stand August 2026) und deckt bewusst auch Denkfehler und Positionierungslücken auf.
>
> ⚠️ **Dieses Dokument darf den Quell-Docs widersprechen.** Wo es das tut, ist der Widerspruch
> als bewusste Korrektur ausgewiesen (analog zum v0.3-Stil des Problem Framings). Änderungen an
> `03-SRD.md` §5.1 und `01-Problem-Framing.md` R-02 werden am Ende als Empfehlung vorgeschlagen,
> aber **nicht** ungefragt vorgenommen.

---

## 1. Zweck & Prüfstein

Dieses Audit beantwortet drei Fragen, an denen ein Produkt in der Verteidigung steht oder fällt:

1. **Was ist die Kernfunktion — in einem Satz, ohne Feature-Liste?**
2. **Wogegen grenzt sich Notella ab — und was davon hält 2026 einem echten Marktvergleich stand?**
3. **Was ist der belastbare USP — die eine Kombination, die im gesamten Feld leer ist?**

**Prüfstein bleibt das Leitbild aus dem Problem Framing: „Versionskontrolle für Wissen".**
Jede USP-Behauptung in diesem Dokument muss zwei Tests bestehen:

- **Leitbild-Test:** Lässt sie sich in der Git-Sprache erklären (Commit / Vorschlag / Merge / Log)?
- **V1-Test:** Verweist sie auf eine Funktion, die in **V1.0/V1.1** existiert — nicht auf V1.3
  (KI) oder V1.2 (Graph)? Alles andere ist ein *Versprechen*, kein *Beweis*, und wird als
  solches markiert.

---

## 2. Kernfunktion — sauber getrennt

Die Kernverantwortung ist unverändert **ein** Zustandsübergang (Problem Framing, verbatim):

> „Eine Beobachtung aus einem Moment — ein Gedanke, eine Idee, ein Beschluss — in verbindliches
> Gruppenwissen überführen, ohne dabei den Überblick zu verlieren, woher dieses Wissen stammt."

Das Audit trennt die Kernfunktion in **zwei USP-Ebenen**, die in den Quell-Docs vermischt sind
(siehe Denkfehler D-1). Diese Trennung ist die wichtigste Einzelaussage dieses Dokuments.

### 2.1 User-USP — was einen Nutzer wählen lässt (drei Säulen)

| Säule | Was sie ist | Warum sie zählt |
|-------|-------------|-----------------|
| **(a) Governance — moderierter, verbindlicher Stand** | Eine Leitung entscheidet in der Kuration, *was gilt* (Kanonisierung als Freigabe-Gate). Kein offenes „jeder schreibt/ändert frei". | Der schärfste Trennstrich gegen Obsidian, Notion, alle AI-Notetaker: Die sammeln oder speichern — aber **niemand entscheidet, was verbindlich ist**. |
| **(b) Meeting-Orchestrierung als Erstklasse-Konzept** | Treffen ansetzen/durchführen/beenden mit Zustandsmaschine (geplant→laufend→beendet), abrufbarer Feed. | Ein Wiki (Obsidian, Notion-als-Store, Anytype) kennt den *Ablauf* eines Treffens nicht. Das Treffen ist bei Notella das Gefäß, in dem Wissen entsteht. |
| **(c) Herkunft** | „Woher wissen wir das?" — Rückverweis auf Notiz-Version, Treffen und Person, erstklassig. | Beantwortet die Frage, die Wikis Wochen später nicht beantworten können. **Achtung:** 2026 nicht mehr alleinstehend (siehe D-7). |

### 2.2 Builder-USP — was das Portfolio/den Prüfer beeindruckt

> **Die domänenneutrale Engine:** Der Kern kennt nur *Entität* und *Beziehung*; ein zweites,
> fachfremdes Preset (TableTop) läuft **ohne eine Zeile Codeänderung**. Binär überprüfbar
> (`grep` nach „NPC"/„Sprint" außerhalb der Preset-Dateien muss leer sein — SRD §11.2).

Der Builder-USP ist der **fachliche Nachweis** der These und ein starkes Portfolio-Artefakt.
Aber: Für den *Nutzer* ist er unsichtbar — er sieht nur sein eigenes Vokabular. **Er ist kein
Verkaufsargument, sondern ein Beweis.** Genau diese Verwechslung ist Denkfehler D-1.

---

## 3. Wettbewerbslandschaft (Recherche, August 2026)

Der Markt hat sich seit Abfassung von `03-SRD.md` §5.1 deutlich bewegt. Die dortige Benchmark
ist an mehreren Stellen **überholt** (siehe D-3). Dieses Kapitel ersetzt sie durch einen
aktuellen, breiteren Stand.

### 3.1 Vergleichsmatrix

Achsen bewusst so gewählt, dass sie auf den User-USP (§2.1) und die Betriebsfrage zielen.

**Legende:** ✓ = ja · ~ = teilweise/eingeschränkt · ✗ = nein · ? = nicht verifizierbar

| Produkt | Meeting-Zustände | **Governance / Freigabe-Gate** | Rollen (Lead/Member) | Sichtbarkeit je Notiz | Herkunft | Typ. Entitäten + Graph | Konfig. Schema | Domänen­neutral | KI-Extraktion | **Self-hosting / Datenhoheit** |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **Notella V1 (Ziel)** | ✓ | **✓** | ✓ | ✓ | ✓ | ✓ (manuell kuratiert; Graph-Bild V1.2) | ~ (Preset-fest, bewusst kein Editor) | ✓ | ✗ (erst V1.3) | **✓** |
| **Notella V1.3** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ~ | ✓ | ✓ (Vorschlags­lieferant) | ✓ |
| Granola | ~ | ✗ | ~ | ✓ | ~ | ✗ | ~ (Templates) | ~ | ✓ | ✗ |
| Fireflies / Otter | ✓ | ✗ | ~ | ~ | ✓ | ~ (Otter CKE: Auto-Graph) | ~ | ~ | ✓ | ✗ |
| Fellow | ✓ | ✗ | ~ | ~ | ✓ | ~ (feste Item-Typen) | ~ | ~ | ✓ | ✗ |
| Notion (+ AI Meeting Notes) | ~ | ✗ | ~ | ✓ | ✓ (Zitate seit 11/2025) | ✓ (DB-Relationen, manuell) | ✓ | ✓ | ✓ | ✗ |
| Tana | ✓ (Lifecycle) | ✗ (nur per-User-Approval) | ~ | ? | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Anytype | ✗ | ✗ | ✓ | ~ (je Space) | ✗ | ✓ | ✓ | ✓ | ✗ | **✓ (Open Source)** |
| Obsidian (+ Bases) | ✗ | ✗ | ✗ (flach, ≤20) | ✗ (je Vault) | ✗ | ~ (untypisiert) | ✓ | ✓ | ✗ (nativ) | **✓ (lokale Dateien)** |
| Reflect | ✗ | ✗ | ✗ | ~ | ✗ | ~ (Backlinks) | ✗ | ✗ | ~ | ~ (E2E, nicht self-host) |
| World Anvil | ~ (Session-Logs) | **~ (Draft→Publish + Editor-Freigabe)** | ✓ (4 Stufen) | ✓ (Secrets/Artikel) | ✗ | ~ | ~ | ~ (RPG-orientiert) | ✗ | ✗ |
| LegendKeeper / Kanka | ✗ | ✗ | ~ | ✓ | ✗ | ~ | ~ | ~ | ✗ | ~ (nur Kanka self-host) |

### 3.2 Was die Matrix zeigt

- **Notellas Zeile ist die einzige, die Meeting-Zustände + Governance + Sichtbarkeit je Notiz +
  Herkunft + Domänenneutralität + Self-hosting gleichzeitig trägt.** Jede andere Zeile hat eine
  Lücke genau bei **Governance** und/oder **Self-hosting**.
- **Governance (Freigabe-Gate) ist die empirisch leerste Achse.** Kein Meeting-/AI-Tool hat sie.
  Ausgerechnet ein **TableTop-Wiki (World Anvil)** kommt Notellas Kanonisierung am nächsten —
  über sein Draft→Publish-Modell mit Editor-Freigabe. Das ist ein wichtiger, unbequemer Befund:
  Die Governance-Idee ist real und wertvoll, aber der nächste Verwandte steht in der *Spiel*-Ecke,
  nicht im Business-Beachhead.
- **Self-hosting/Datenhoheit ist die zweite leere Achse.** Von den Business-Werkzeugen bietet es
  **keines** (Granola, Notion, Fellow, Tana, Fireflies, Otter — alle Cloud). Nur Obsidian,
  Anytype (Open Source) und Kanka sind souverän betreibbar — und denen fehlt Meeting + Governance.
- **Umgekehrt schlägt der Markt Notella bei KI und Automatik.** KI-Extraktion strukturierter
  Elemente ist 2026 **Standard**, nicht Vorsprung. Und der Graph wird zunehmend *automatisch*
  aufgebaut (Tana, Otter CKE), während Notella ihn bewusst durch menschliche Kuration erzeugt.

### 3.3 Die schärfsten Bedrohungen (nah an Notellas These)

| Rang | Produkt | Warum nah | Wo es scheitert (Notellas Lücke) |
|---|---|---|---|
| **1** | **Tana** | Einziges Tool mit Meeting-Lifecycle-Zuständen **+** typisiertem, konfigurierbarem Graph **+** fortgeschrittener KI-Extraktion. Trifft ~2,5 der drei Säulen. | Kein **moderierter kanonischer Stand** (Approval ist per-User, nicht gruppenverbindlich). Cloud, closed-source. Komplex — hohe Einstiegshürde. |
| **2** | **Notion (+ AI Meeting Notes)** | Typisierte DB-Relationen + konfigurierbares Schema + KI-Extraktion + **Herkunfts-Zitate** (seit 11/2025). Der strukturell nächste „Wissensgraph". | Keine Meeting-Zustände, **kein Freigabe-Gate** (offenes Co-Editing), Graph rein manuell, keine Datenhoheit. Für ein Team, das schon in Notion lebt, dennoch der reale Gegner. |
| **3** | **Otter.ai — Conversational Knowledge Engine** (Launch 04/2026) | Vermarktet explizit einen „longitudinal knowledge graph", der Entscheidungen mit Urhebern/Kontext verknüpft — die Vision überlappt stark. | Auto-akkretierter Graph **ohne** menschliche Moderation, Enterprise-only, Cloud, laut Dritten „unbewiesen". Keine Governance, kein Self-hosting. |
| 4 | **Anytype** | Self-hosting + Open Source + typisierter Graph + echte Rollen — Notellas Betriebs- und Graph-Hälfte. | Kein Meeting-Begriff, keine KI, **kein Freigabe-Gate**. Müsste zwei der drei Säulen erst bauen. |

### 3.4 Build-vs-Buy-Risiko: der Graph kommoditisiert

Eine eigene Infrastruktur-Schicht macht Wissensgraphen zur Ware: **Zep/Graphiti** (Open-Source
temporaler KG), **Mem0** (Series A 10/2025), **Trace**, **Graphon AI**, **Extend AI**. Das heißt:
Die *Graph-Technik* ist kein Burggraben mehr — jeder kann sie einkaufen oder open-source einbauen.
**Konsequenz:** Notellas Verteidigung darf nicht auf „wir haben einen Wissensgraphen" ruhen,
sondern auf **dem Workflow und der Governance darüber** (siehe D-7).

---

## 4. USP-Herausstellung

### 4.1 Stresstest der drei SRD-§5.1-Elemente

`03-SRD.md` §5.1 nennt drei Elemente, „die zusammen kein anderes Produkt hat". Der Marktvergleich
prüft jedes einzeln:

| SRD-Element | Hält? | Befund |
|---|---|---|
| **1. Sichtbarkeit je Notiz + Kanonisierung als eigener Vorgang** | **Ja, die Kanonisierungs-Hälfte trägt** | Sichtbarkeit je Notiz gibt es teilweise (Granola, Notion). Aber **Kanonisierung als moderiertes Freigabe-Gate hat im Business-Feld niemand** — das ist der Kern-Differenzierer. (Nur World Anvil kommt nahe, aus der Spiel-Ecke.) |
| **2. Herkunft als Erstklasse-Konzept** | **Überholt** | 2026 bieten Notion (Zitate), Fellow (Ask Fellow), Fireflies/Otter (Speaker+Timestamp) und Tana Herkunft. **Nicht mehr alleinstehend.** Bleibt notwendige Stützsäule, ist aber kein Differenzierer mehr. → Korrektur an SRD §5.1 nötig (D-3/D-7). |
| **3. Domänenschema als austauschbares Config-File** | **Teils — mit Twist** | Konfigurierbare Schemata bieten Notion, Tana, Anytype, Obsidian/Bases. Notellas Unterschied ist **nicht** „konfigurierbar", sondern **ausgeliefert & kuratiert = null Modellierungslast** für den Nutzer + Governance darüber. Als „wir sind die Einzigen mit Schema" ist es falsch; als „Zero-Setup + Nachweis der Abstraktion" hält es. |

### 4.2 Der belastbare USP: die Kombination

Kein Einzelelement trägt allein. Der USP ist die **Bündelung**, die im gesamten Feld leer ist:

> **Moderierter, verbindlicher Stand (Governance)** · **+ Datenhoheit (self-hosted)** ·
> **+ Sichtbarkeit je Notiz** · **+ domänenneutrales, ausgeliefertes Preset (Zero-Setup)** —
> für **kleine, wiederkehrend zusammenarbeitende Gruppen**.

Die beiden Achsen, die im Business-Feld **komplett leer** sind — **Governance** und
**Self-hosting** — tragen die Abgrenzung. Alles andere (Herkunft, Graph, konfigurierbares Schema,
KI) ist entweder Stützsäule oder vom Markt eingeholt.

### 4.3 USP-Statement (verteidigungsfest, ein Satz)

> **Notella ist das einzige selbst-hostbare Werkzeug, in dem eine Gruppe während des Treffens
> frei mitschreibt und eine Leitung anschließend entscheidet, was davon zum verbindlichen,
> herkunftsnachweisbaren Gruppenwissen wird — im eigenen Vokabular, ohne dass die Notizen je
> das Haus verlassen.**

**Positionierungssatz:**

> Für kleine, wiederkehrend zusammenarbeitende Gruppen, die einen *verbindlichen* gemeinsamen
> Wissensstand aufbauen und ihren Daten nicht die Cloud anvertrauen wollen — dort, wo
> AI-Notetaker (Granola, Otter, Fireflies) automatisch protokollieren, aber **niemand entscheidet,
> was gilt**, und wo Wikis (Notion, Obsidian) speichern, aber den **moderierten Übergang von
> Notiz zu Beschluss** nicht kennen.

### 4.4 Kategorie-Frame

Der Markt bildet gerade eine Kategorie: „team memory" / „company brain" / „conversational
knowledge engine" — durchweg **automatisch akkretierend, cloud-basiert, individuell**. Notella
sollte sich nicht *in* diese Kategorie stellen (dort verliert es gegen KI-Budgets), sondern das
**Gegenmodell** besetzen:

> **„Versionskontrolle für Wissen" — moderiert, herkunftsnachweisbar, selbst gehostet.**

Der Git-Rahmen ist stark, weil er (a) bereits das Leitbild ist, (b) als einziger die Bündelung
Moderation + Herkunft + Historie in *einem* vertrauten Bild trägt und (c) vor einem technischen
Schulpublikum sofort verständlich ist. Empfehlung: diesen Rahmen aktiv als Kategorie führen,
nicht die Negativ-Definition „Lücke zwischen Wiki und Meeting-Tool" (D-6).

---

## 5. Denkfehler & Spannungen

> Bewusst kritischer Teil. Jeder Punkt mit konkreter Empfehlung.

| # | Denkfehler / Spannung | Befund | Empfehlung |
|---|---|---|---|
| **D-1** | **USP-Verwechslung: Builder- vs. User-USP.** Das Framing führt die domänenneutrale Engine als *primäres* Erfolgsziel. | Für den Nutzer ist Preset-Generizität unsichtbar. Der markt-relevante USP ist der dreisäulige User-USP (§2.1), v.a. Governance + Datenhoheit. | Extern **mit Governance + Datenhoheit** führen. Engine als *Beweis/Optionswert* dahinter, nicht als Verkaufsargument. |
| **D-2** | **Der Kern-USP hängt an einem Vorgang, dessen Entlastung erst V1.3 kommt.** Kuration ist erklärtes Top-Risiko (R-03); die Entlastung ist KI (V1.3). Verschärfend: **KI-Extraktion ist bei allen Konkurrenten schon heute Standard.** | Notella kommt bei der Automatik strukturell *spät*. Wenn die Kuration ohne KI zu mühsam ist, bricht der USP an seiner eigenen schwächsten Stelle. | KI **nicht** als „Aufholen gegenüber Granola" rahmen, sondern als **Vorschlagslieferant für die moderierte Kuration** (E-09). Der Differenzierer bleibt die menschliche Freigabe — die ist V1.0/V1.1, nicht V1.3. Kurations-UX früh an der eigenen Gruppe testen (R-03/R-07). |
| **D-3** | **AI-Notetaker unterschätzt.** SRD §5.1 tut Granola/Otter mit „erzeugt Text, keine typisierten Entitäten" ab. | Überholt: Otters „Conversational Knowledge Engine" (04/2026) ist explizit ein *knowledge graph*; Notion liefert Herkunfts-Zitate; Fireflies „Ask Fred" durchsucht die ganze Historie. | SRD §5.1 aktualisieren. Der *durable* Unterschied ist **Governance + Datenhoheit + Sichtbarkeit je Notiz**, nicht „die machen nur Text". |
| **D-4** | **„Konfigurierbares Schema" als USP angreifbar.** | Notion-DBs, Tana-Supertags, Anytype-Objekte, Obsidian-Bases sind ebenfalls user-konfigurierbar. | Umformulieren: nicht „konfigurierbar", sondern **„ausgeliefertes Preset = null Setup-Last + Governance darüber"**. Das ist der eigentliche Vorteil. |
| **D-5** | **Zwei Zielgruppen verwässern die externe Positionierung.** Business-Beachhead + TableTop. | Fürs Markt-USP muss **eine** Story führen. Ironischerweise ist der Governance-Verwandte (World Anvil) im Spiel-Lager — das kann verwirren. | Extern **Business/Wissensarbeit** führen. TableTop strikt als *technischen Abstraktionsbeweis* behandeln (R-05), nicht als zweite Zielgruppe im Pitch. |
| **D-6** | **Kategorie nur negativ definiert** („Lücke zwischen Wiki und Meeting-Tool"). | Eine Negativ-Definition ist in der Verteidigung schwach. | Aktiv die Kategorie **„Versionskontrolle für Wissen"** besetzen (§4.4). |
| **D-7** | **Graph & Herkunft werden als Differenzierer überschätzt.** SRD §5.1 nennt „Herkunft als Erstklasse-Konzept, kein anderes Produkt" und stellt den Graph prominent heraus. | Herkunft bieten heute mehrere; Graph-Technik kommoditisiert (Zep/Graphiti/Mem0, Auto-Graph bei Tana/Otter). | Herkunfts-**Allein**stellung aus den Docs streichen. Graph als **Nachweis-Bild** (V1.2) behalten — er zeigt die Domänenneutralität in einer Sekunde — aber nicht als USP verkaufen. |

---

## 6. Verteidigungs-Argumentarium

> Die härtesten zu erwartenden Fragen — mit belastbaren, ehrlichen Antworten.

**F1 — „Warum nicht einfach Notion (mit AI Meeting Notes)?"**
Notion speichert exzellent und hat seit 2025 KI-Protokolle und Herkunfts-Zitate. Aber: Es kennt
**keine Meeting-Zustände**, **kein Freigabe-Gate** (jede Seite ist offen editierbar — „was gilt"
ist Konvention, nicht Systemzustand) und **kein Self-hosting**. Notellas Wette ist nicht „bessere
Notizen", sondern der *moderierte Übergang* und die *Datenhoheit*. Ehrlich: Für ein Team, das
schon in Notion lebt, ist Notion der reale Gegner — deshalb muss die Governance-/Souveränitäts-
Geschichte klar sein, sonst gewinnt Bequemlichkeit.

**F2 — „Granola/Otter machen das doch bald automatisch mit KI."**
Ja — und bei der reinen Extraktion sind sie Notella heute voraus. Aber sie **akkretieren
automatisch**; niemand *entscheidet*, was verbindlich ist, und alles liegt in der Cloud mit
Audiozugriff. Notellas Gegenmodell ist die **menschliche Freigabe** und die **Souveränität**.
KI ist bei Notella (V1.3) *Vorschlagslieferant für genau diese Freigabe* — nicht der
Differenzierer selbst. Das dreht den späten KI-Start von einer Schwäche in eine konsistente
Haltung.

**F3 — „Ist die domänenneutrale Engine nicht Over-Engineering für ein Portfolio?"**
Sie ist der *Nachweis der These* und binär überprüfbar (zweites Preset ohne Codeänderung, SRD
§11.2). Ehrlich: Für den Endnutzer ist sie unsichtbar — deshalb ist sie **Builder-USP, nicht
User-USP** (D-1). Im Pitch nicht als Nutzerversprechen führen, sondern als Beleg für saubere
Architektur und als Optionswert (späteres SaaS/Community-Presets).

**F4 — „Euer USP hängt an V1.3 (KI)."**
Nein. Der USP ist die **menschliche Governance-Schleife** — schreiben, kuratieren, kanonisieren
— und die ist V1.0/V1.1. KI entlastet nur den Flaschenhals (R-03). Zugegeben: Ob die Kuration
*ohne* KI tragbar bleibt, ist das größte offene Produktrisiko; es wird an der eigenen Gruppe
gemessen (5 aufeinanderfolgende Treffen).

**F5 — „Herkunft habt ihr doch nicht als Einzige?"**
Korrekt — und das steht in den Docs zu absolut (D-7). Herkunft haben 2026 auch Notion und die
Notetaker. Notellas Beitrag ist die **Bündelung** von Herkunft mit moderierter Kanonisierung und
Datenhoheit, nicht Herkunft allein.

**F6 — „Self-hosting — will das überhaupt jemand?"**
Der self-hostende technische Nutzer ist eine ausdrücklich benannte Kundengruppe (SRD §1: „der
Installationsvorgang ist Teil des Produkts"). Und es ist die **einzige Achse, die im gesamten
Business-Feld leer ist**. Für datensensible Gruppen (Recht, Forschung, interne Strategie) ist
„die Notizen verlassen nie das Haus" ein echtes Kaufargument, das Granola & Co. strukturell nicht
liefern können.

---

## 7. Empfehlungen & offene Entscheidungen

**Priorisiert:**

1. **Externe Positionierung umstellen (hoch).** Mit **Governance + Datenhoheit für kleine
   wiederkehrende Gruppen** führen (§4.3). Nicht mit „domänenneutrale Engine" (Builder-USP) und
   nicht mit „Herkunft" (nicht mehr unique).
2. **Kategorie aktiv besetzen (hoch):** „Versionskontrolle für Wissen" als Rahmen, nicht die
   Negativ-Definition (§4.4, D-6).
3. **`03-SRD.md` §5.1 korrigieren (hoch):** (a) Granola/Otter-Zeile aktualisieren — sie leisten
   heute strukturierte Extraktion und (Otter) Graph-Aufbau; (b) „Herkunft als einziges Produkt"
   streichen; (c) Tana, Anytype und Otter-CKE als Zeilen aufnehmen; (d) Self-hosting als eigene
   Achse ergänzen. *(Nur nach deiner Freigabe — dieses Audit ändert die Quell-Docs nicht selbst.)*
4. **`01-Problem-Framing.md` R-02 schärfen (mittel):** Die Differenzierung nicht nur am
   „Sichtbarkeits-/Kanonisierungs-Workflow" festmachen, sondern zusätzlich an **Datenhoheit** —
   der einzigen im Business-Feld leeren Betriebsachse.
5. **KI-Narrativ festzurren (mittel):** KI (V1.3) konsequent als *Vorschlagslieferant für die
   moderierte Kuration* kommunizieren, nie als Wettlauf mit Notetaker-Extraktion (D-2).
6. **Graph-USP herunterstufen (niedrig):** Graph als Nachweis-Bild behalten (V1.2), nicht als
   Differenzierer verkaufen (D-7).

**Offene Entscheidungen fürs Audit-Gespräch:**

- **O-A:** Soll TableTop im *externen* Pitch überhaupt erwähnt werden, oder rein intern als
  Abstraktionsbeweis bleiben? (Empfehlung: intern.) Beißt sich mit dem Befund, dass der
  Governance-Verwandte (World Anvil) im Spiel-Lager steht.
- **O-B:** Reicht „Governance + Datenhoheit" als Kaufgrund für eine *fremde* Gruppe, oder bleibt
  Notella bewusst Portfolio-/Eigenbedarfs-Artefakt (R-02)? Diese Frage ehrlich vorab beantworten,
  bevor sie in der Verteidigung gestellt wird.

---

## Anhang — Quellen & Belastbarkeit der Recherche

**Stand:** August 2026. Recherche über Web-Suche; wo nur Hersteller-Blogs als Quelle vorlagen,
ist der Befund entsprechend vorsichtig zu lesen (v.a. Tanas Approval-/„Receipts"-Claims stammen
überwiegend aus Tana-eigenem Marketing und ließen sich nicht neutral verifizieren).

**Was dieses Audit NICHT beweist:** Ein „kein Tool hat X" ist stets *Abwesenheit von Belegen*,
nicht Herstellerdementi — ein Stealth-/Enterprise-Produkt kann existieren. Preis- und
Funktionsangaben können driften. Die Governance-Lücke im Business-Feld ist mit hoher, aber nicht
zertifizierter Sicherheit belegt.

**Wichtigste Quellen (Auswahl, Stand 08/2026):**

- Granola — Team Folders / „chat with meetings" / MCP: granola.ai/updates, help.granola.ai
- Notion AI Meeting Notes (Launch 05/2025, Herkunfts-Zitate 11/2025): notion.com/product/ai-meeting-notes, techcrunch.com (2025-05-13)
- Fellow — Ask Fellow / AI chief of staff: fellow.ai/features, fellow.ai/blog/ask-fellow
- Tana — Meeting Agent / Supertags / $25M (02/2025): outliner.tana.inc/learn/features/meeting-agent, techcrunch.com (2025-02-03)
- Otter.ai — Conversational Knowledge Engine (04/2026): otter.ai/blog, businesswire.com (2026-04-28)
- Fireflies vs. Otter (Extraktion, Self-hosting): bluedothq.com, sybill.ai, fireflies.ai/security
- Anytype — AnySync / Rollen / AI-Status (02/2026): doc.anytype.io, blog.anytype.io, business.anytype.io
- Obsidian — Sync-Kollaboration (≤20, kein Live-Co-Editing), Bases: obsidian.md/help/sync/collaborate, practicalpkm.com
- World Anvil — Co-Author-Stufen / Draft→Publish / Secrets: worldanvil.com/learn/access-rights, worldanvil.com/pricing
- LegendKeeper / Kanka (self-host): legendkeeper.com, char-gen.com/alternatives
- Infra-Schicht (Build-vs-Buy): Zep/Graphiti (neo4j.com/blog), Mem0 (mem0.ai), Trace (techcrunch.com 2026-02)
