# Compliance-Checkliste — Notella (Arbeitstitel)

### Datenschutz · Eigentum · Lizenzen · Haftung — rechtlich-ethischer Rahmen

> **Version:** V0.1 · 2026-08-17
> **Autor:** Sam (Digitale Leute School — AI Software Engineering)
> **Grundlage:** `01-Problem-Framing.md` (v0.3) · `02-PRD.md` (V0.9) · `03-SRD.md` (V0.4) · `06-Product-Audit.md` (V0.1)
> **Zweck:** Schul-Verteidigung **und** Produktklarheit. Beantwortet fünf rechtlich-ethische
> Kernfragen und liefert eine Checkliste aus offenen Risiken, Annahmen und Unbekannten.
>
> ⚠️ **Keine Rechtsberatung.** Dieses Dokument ist eine strukturierte Selbsteinschätzung zur
> Vorbereitung der Verteidigung und einer späteren fachlichen Prüfung. Es benennt Fragen und
> Risiken — es entscheidet sie nicht.
>
> ⚠️ **Dieses Dokument darf den Quell-Docs widersprechen.** Wo es das tut (v.a. der Konflikt
> zwischen `02-PRD.md` §4.5 und §6.4), ist der Widerspruch als bewusster Befund ausgewiesen.
> Änderungen an den Quell-Docs werden am Ende **vorgeschlagen**, nicht ungefragt vorgenommen.

---

## 0. Prüfstein & Rahmen

**Prüfstein:** *„Was würde eine Aufsichtsbehörde oder ein Anwalt zuerst fragen — und hält die
Spezifikation dieser Frage stand?"*

**Rechtsrahmen (Annahme, siehe §6):** Betrieb in Deutschland/EU → **DSGVO** und **BDSG**
sind maßgeblich; für den KI-Teil zusätzlich der **EU AI Act**; für Lizenzfragen deutsches
und EU-Urheberrecht.

**Was die Spezifikation bereits gut löst** (fair vorab festgehalten, damit die Risiken im
Verhältnis stehen):

- **Datenhoheit durch Self-hosting** — Notizen verlassen die Instanz nicht (`06` §4.3). Das
  ist zugleich das stärkste Datenschutz-Argument des Produkts.
- **Serverseitige Durchsetzung** von Sichtbarkeit und Autorisierung (`02` §4.4, §6.4).
- **Argon2id**, Ratenbegrenzung, signierte/ablaufende Einladungs- und Rücksetzlinks,
  kein freier Registrierungsweg (`02` §6.4, `03` §11.1, E-29).
- **Strikte Rendering-Bereinigung**, Preset-Werte werden wie Anzeigeinhalte maskiert (`02` §6.4).
- **Ehrlichkeitsregel** statt vorgetäuschter Vertraulichkeit (E-16) — rechtlich sauberer als
  ein Vertraulichkeitsversprechen, das ohnehin nicht zu halten wäre.
- **Anwendung vollständig hinter der Anmeldung**, nur Repository/Landingpage indexierbar (`02` §6.5).
- **DSGVO-Auskunft und -Löschung je Account** sind als Anforderung benannt (`02` §6.4, §4.5).

Die folgenden fünf Abschnitte arbeiten heraus, wo diese Basis noch nicht trägt.

---

## 1. Welche personenbezogenen Daten werden verarbeitet (direkt/indirekt)?

Notella ist im Kern eine Maschine zur **Verarbeitung von Freitext über Menschen** —
Datenschutz ist damit keine Randfrage, sondern berührt die Kernfunktion.

| Datenkategorie | direkt / indirekt | Kandidat-Rechtsgrundlage | Besonderheit |
|---|---|---|---|
| **Zugangsdaten** — Benutzername, Passwort-**Hash** (Argon2id) | direkt | Art. 6 (1) b (Nutzungsverhältnis) | Sicher gehasht (`03` §11.1). Benutzername ggf. Klarname |
| **Teilnehmerprofil (Participant)** — Name, Rolle/Klasse, Feldwerte | direkt | Art. 6 (1) b / f | Ist selbst eine **Entität** mit Beziehungen; bei Account-Löschung anonymisierbar (`02` §4.5) |
| **Notiz-Freitext (NoteVersion)** — beliebiger Inhalt | direkt **und** indirekt | Art. 6 (1) f (berechtigtes Interesse) — zu begründen | **Offenes Feld:** kann besondere Kategorien (Art. 9: Gesundheit, Weltanschauung, …) und **Daten Dritter** enthalten. Unveränderlich, **nie gelöscht** (E-25) |
| **Autorschaft + Zeitstempel** je Notiz/Version | direkt | Art. 6 (1) b / f | Ergibt in Summe ein **Aktivitäts- und Anwesenheitsprofil** → potenzielle Leistungskontrolle |
| **ChangeEntry-Historie** — handelnde Person + vollständiger Schnappschuss | direkt | Art. 6 (1) f | **Dauerhaft, nie gelöscht** (`02` §4.5, §4.4.3). Trägt die Kern-These, ist aber der schärfste Löschungs-Konflikt |
| **Sichtbarkeits-Flag** je Notiz | indirekt (Metadatum) | — | „Für mich" schützt **nicht** vor Lead-Einsicht (E-16) |
| **Beziehungen zwischen Personen-Entitäten** | indirekt | Art. 6 (1) f | Bildet ein **soziales/organisatorisches Netz** ab — im Graph sichtbar |
| **Einladungs- / Rücksetz-Token** | indirekt | Art. 6 (1) b | Signiert, ablaufend, widerrufbar (E-29, `02` §6.4) |
| **Session-, Login-, Ratenbegrenzungs-Daten**; ggf. **IP / Server-Logs** | indirekt | Art. 6 (1) f | Zähler in DB (`02` §6.4). **IP-/Log-Speicherung und -Aufbewahrung sind nicht spezifiziert** → siehe Unbekannte |

**Kernbefund:** Der wesentliche Datenschutz-Hebel liegt nicht in den strukturierten Feldern,
sondern im **unstrukturierten Notiz-Freitext**. Dort landen — von der Anwendung unkontrolliert —
potenziell Art.-9-Daten und Aussagen über Personen, die das Tool selbst nie nutzen.

---

## 2. Wem gehört der erzeugte Output?

**„Output" = kanonisches Projektwissen (Entitäten, Beziehungen, Graph)** — nicht Quellcode
(dazu §3) und nicht die Roh-Notizen (die bleiben beim Autor, bis kuratiert wird).

- **Faktische Datenhoheit:** Bei Self-hosting liegen Rohdaten **und** abgeleitetes Wissen
  vollständig beim **Betreiber / der Gruppe**. Kein Anbieter erhält Zugriff oder Rechte — das
  ist bewusst der USP (`06` §4.3, F6).
- **Urheberrecht:** Kurze, typisierte Einträge (Titel + Felder) erreichen selten die
  Schöpfungshöhe. „Eigentum" ist hier praktisch **Datenhoheit** plus, für die *Sammlung* als
  Ganzes, das **Datenbankherstellerrecht** (§ 87a UrhG) — dieses steht dem Betreiber zu, der
  die Investition trägt.
- **Intern (Lead ↔ Member):** Das Produkt behandelt kanonisiertes Wissen als **Projekt-/
  Gruppeneigentum**, nicht als Eigentum eines Einzelnen; die zugrunde liegende **Notiz** bleibt
  dem Autor zugeordnet (Sichtbarkeit + Herkunft). Ein Ausscheiden anonymisiert den Autor, lässt
  das kanonische Wissen aber bestehen (`02` §4.5) — konsistent mit „Gruppenwissen".
- **V1.3 (KI-Vorschläge):** Reiner **LLM-Output** ist mangels menschlicher Schöpfung i.d.R.
  **nicht** urheberrechtlich geschützt; nach menschlicher Kuration entsteht das schützbare
  Arrangement ohnehin durch den Menschen. Herkunft ist über `source = ai` und
  `producer_version` nachweisbar (`03` §11.9). **Zu prüfen:** die AGB des KI-Anbieters
  (wem gehören Eingaben/Ausgaben, Trainingsnutzung) — siehe §3.

---

## 3. Welche Lizenzen gelten?

### 3.1 Trainingsdaten

- **V1.0–V1.2:** **keine KI** (E-09) → **nicht anwendbar**.
- **V1.3, Cloud-KI:** Die Trainingsdaten des Anbieters sind **intransparent** und Gegenstand
  laufender urheberrechtlicher Auseinandersetzungen. Der Betreiber hat darauf keinen Einfluss.
  Entscheidend und **steuerbar** ist der umgekehrte Weg: ob die **übermittelten Notizen zum
  Training genutzt** werden. Ein **Trainings-Opt-out** (bzw. ein Anbieter/Tarif ohne
  Trainingsnutzung) ist Voraussetzung und gehört in den AVV (§4).
- **V1.3, lokales Modell:** Eure Daten fließen in kein Fremd-Training. Die Trainingsdaten des
  Basismodells bleiben ebenso intransparent — hier ist aber nicht die Trainingsdaten-, sondern
  die **Modelllizenz** der relevante Hebel (§3.2).

### 3.2 Modelllizenz (nur lokaler Pfad, V1.3)

Nicht jedes „offene" Modell ist frei nutzbar. **Llama-Community-Lizenz** und **Gemma Terms**
enthalten Nutzungsgrenzen und Namensnennungs-/Schwellenklauseln; echte OSS-Lizenzen
(**Apache-2.0**, z.B. Mistral, Teile von Qwen, OLMo) sind unkritischer. **Empfehlung:** für ein
selbst-hostbares OSS-Werkzeug ein permissiv lizenziertes Modell wählen und die Modelllizenz in
die Betriebsanleitung aufnehmen.

### 3.3 „Generierter Code" — zwei Lesarten, sauber getrennt

1. **Notella erzeugt selbst keinen Code.** Der Output sind Wissenseinträge, kein Programmcode.
   Für das *Produkt* ist die Frage **gegenstandslos**.
2. **KI-assistiert gebauter Quellcode** (`03` §11.8, „2,5× mit Agenten"): Hier ist das Thema
   real. KI-Codegeneratoren können lizenzpflichtige Fremd-Schnipsel reproduzieren
   (Provenienz-/Attributionsrisiko). **Maßnahmen:** das ohnehin vorgesehene menschliche Review
   (`03` §11.6), keine bewusste Übernahme großer Fremdblöcke, und eine **Lizenzprüfung der
   Abhängigkeiten** — Next.js (MIT), PostgreSQL (PostgreSQL-Lizenz), Auth.js (ISC), Drizzle
   (Apache-2.0), Cytoscape.js (MIT) sind unkritisch; **Achtung bei TipTap**, dessen Pro-/
   Cloud-Erweiterungen teils kostenpflichtig und gesondert lizenziert sind.

### 3.4 Projekt-Lizenz (offen — „Open Source" wird behauptet, aber nicht benannt)

Die Docs sprechen durchgängig von „Open Source", **ohne eine Lizenz zu nennen**. Ohne Lizenz
ist Code rechtlich *nicht* frei nutzbar — die Behauptung ist derzeit ungedeckt.

- **Empfehlung: AGPL-3.0.** Sie passt zur Self-hosting-Haltung und schützt die Offenheit auch
  im späteren SaaS-Fall (Netzwerk-Copyleft — ein Dritter kann keine geschlossene gehostete
  Variante bauen, ohne seine Änderungen offenzulegen).
- **Alternative: MIT/Apache-2.0**, wenn maximale Verbreitung/Adoption das Ziel ist —
  Trade-off: ein Dritter dürfte eine **closed-source-SaaS** darauf aufsetzen.
- **Entscheidung fällig** vor der ersten öffentlichen Auslieferung (koppelbar an O-04, Name).

---

## 4. Wer haftet, wenn die KI (oder das Produkt) Schaden verursacht?

- **DSGVO-Verantwortlicher ist der Betreiber, nicht der Entwickler.** Wer die Instanz betreibt
  (die Gruppe/Organisation), ist **Verantwortlicher** i.S.d. Art. 4 Nr. 7 DSGVO. Der Entwickler
  liefert nur Software und verarbeitet **keine** Daten — er ist damit **kein**
  Auftragsverarbeiter. Genau das macht die **Self-hosting-erst-Haltung haftungsmindernd**.
- **Kippt bei SaaS.** Sobald eine gehostete Variante angeboten wird (spätere Option, E-11),
  wird der Anbieter selbst Verantwortlicher bzw. Auftragsverarbeiter — mit AVV-Pflicht
  gegenüber Kunden, TOMs, Transferregeln. Ein **eigenes** Pflichtenheft, das V1 bewusst
  nicht trägt.
- **Software-/Produkthaftung:** OSS wird „as is" ohne Gewähr geliefert (Lizenz-Disclaimer).
  Grenzen: Haftungsausschlüsse greifen nicht bei Vorsatz/grober Fahrlässigkeit; die neue
  **EU-Produkthaftungsrichtlinie (2024)** erfasst Software grundsätzlich. Für ein
  nichtkommerzielles Portfolio-/Eigenbedarfs-Projekt ist das Risiko **gering, aber nicht null**.
- **KI-Schaden (V1.3):** Fehlerhafte Extraktion oder Auto-Kanonisierung erzeugt **falsches
  „Projektwissen"** → Fehlentscheidungen. Der zentrale haftungsmindernde Faktor ist die
  **menschliche Freigabe (Governance)**: Die KI *schlägt vor*, der Mensch *entscheidet*. Das
  Restrisiko liegt im **Auto-Merge bei hoher Konfidenz** (`03` §11.9, Punkt 7) — dieser sollte
  konservativ eingestellt und jederzeit rücknehmbar sein, was die dauerhafte Historie (E-25)
  technisch bereits leistet.
- **EU AI Act:** Notella ist **kein Hochrisiko-System** (keine Biometrie, kein HR-/Kredit-
  Scoring). Die KI-Funktion ist Text-Extraktion/-Zusammenfassung → **minimales Risiko**,
  vorrangig **Transparenzpflicht** (Nutzende erkennen KI-Vorschläge — über `source = ai`
  bereits erfüllbar). Kurz einordnen, aber unkritisch.

---

## 5. Was würde ein Regulierer / Anwalt zuerst fragen? (gerankt)

1. **Rechtsgrundlage je Verarbeitung (Art. 6)?** Im **Beschäftigtenkontext** ist § 26 BDSG
   bzw. eine *freiwillige* Einwilligung heikel (Freiwilligkeit im Arbeitsverhältnis fraglich).
2. **Recht auf Löschung (Art. 17)** — *die schärfste Frage:* Wie werden **Personendaten im
   Notiz-Freitext** entfernt, wenn Versionen unveränderlich und dauerhaft sind? Die
   Anonymisierung des **Autors** (`02` §4.5) genügt **nicht** für Personendaten, die **im Text
   selbst** stehen. → direkter Konflikt §4.5 ⟂ §6.4.
3. **„Für mich" + Lead-Einsicht + Autorschaftshistorie = Verhaltens-/Leistungskontrolle?**
   Bei Angestellten löst das **Mitbestimmung des Betriebsrats** aus (§ 87 Abs. 1 Nr. 6 BetrVG)
   → Betriebsvereinbarung nötig.
4. **Daten Dritter** — Notizen über Personen, die das Tool nicht nutzen: Rechtsgrundlage und
   **Informationspflicht (Art. 14)**?
5. **Verzeichnis von Verarbeitungstätigkeiten (Art. 30)** vorhanden? (Betreiberpflicht.)
6. **Auftragsverarbeitung / Drittlandtransfer** bei V1.3-Cloud-KI: **AVV (Art. 28)**,
   Transfer-Instrument (Art. 44 ff., SCC), **Trainings-Opt-out**?
7. **TOMs / Verschlüsselung at rest (Art. 32)** — DB- und Backup-Schutz? In der SRD **nicht**
   spezifiziert.
8. **Datenschutzerklärung / Informationspflichten (Art. 13)** — existiert eine? Aktuell nein.
9. **Datenpannen-Meldeprozess (Art. 33/34)** definiert?
10. **DSFA-Auslöser (Art. 35)?** Systematische Auswertung + ggf. Beschäftigtendaten — Schwelle
    prüfen (vermutlich nicht klar erreicht, aber dokumentiert entscheiden).

---

## 6. Compliance-Checkliste

### 6.1 Offene Risiken

- [ ] **Löschung ⟂ Unveränderlichkeit.** `02` §6.4 sagt „DSGVO-Löschung", `02` §4.5 sagt
      NoteVersions/Historie werden „**nie** gelöscht". Für im Freitext eingebettete
      Personendaten ist echte Löschung derzeit **nicht vorgesehen** — der schwerste Einzelpunkt.
- [ ] **Anonymisierung ist womöglich nur Pseudonymisierung.** Nach Account-Löschung behalten
      `ChangeEntry` (handelnde Person) und Schnappschüsse Kontext, der eine **Re-Identifikation**
      erlauben kann. Für „echt anonym" (Art. 17 / Erwägungsgrund 26) womöglich unzureichend.
- [ ] **Daten Dritter im Freitext** ohne Rechtsgrundlage und ohne Erfüllung der
      Informationspflicht (Art. 14).
- [ ] **Beschäftigtenkontext:** Autorschaftshistorie + Lead-Einsicht sind
      **mitbestimmungspflichtige** Verhaltens-/Leistungskontrolle; keine Betriebsvereinbarung
      vorgesehen.
- [ ] **Keine Verschlüsselung at rest / kein TOM-Konzept** in der SRD.
- [ ] **Kein Datenschutz-Beipack:** keine Datenschutzerklärung, kein VVT, kein Pannenprozess
      im Doku-Set.
- [ ] **V1.3-Cloud:** Drittlandtransfer + mögliche Trainingsnutzung der Notizen **ohne AVV**.
- [ ] **Erwartungsrisiko „Für mich":** ehrlich benannt (E-16), aber ersetzt keine
      Rechtsgrundlage — und „Für mich" kann trotz Hinweis eine falsche Vertraulichkeitserwartung
      wecken.
- [ ] **OSS-Lizenz nicht benannt** → „Open Source"-Behauptung derzeit ungedeckt;
      Abhängigkeits-/TipTap-Pro-Lizenzen ungeprüft.

### 6.2 Annahmen

- [x] Betrieb in **DE/EU** → DSGVO + BDSG (+ EU AI Act für V1.3) anwendbar.
- [x] **Betreiber der Instanz = Verantwortlicher**; Entwickler = reiner Software-Lieferant,
      kein Auftragsverarbeiter.
- [x] Gruppen sind **klein, freiwillig, mit gemeinsamem Ziel**; V1 **ohne KI**, **lokal-erst**.
- [x] **Keine Art.-9-Daten beabsichtigt** — der Freitext lässt sie aber technisch zu.
- [x] **Portfolio-/Eigenbedarf**, kein kommerzieller SaaS in V1 → geringere Pflichtenlast.
- [x] Die Nutzung durch die **eigene Schul-/Projektgruppe ist reale personenbezogene
      Verarbeitung** — kein „Testdaten"-Freibrief.

### 6.3 Unbekannte

- [ ] **V1.3-KI-Anbieter** (Cloud vs. lokal) — bestimmt die gesamte Transfer-/AVV-Frage.
- [ ] **OSS-Lizenzwahl** (AGPL-3.0 vs. MIT/Apache).
- [ ] **Ob/wann fremde Teams produktiv nutzen** — ändert Rollen und Verantwortlichkeit.
- [ ] **IP-/Server-Log-Speicherung und -Aufbewahrungsfristen** (nicht spezifiziert).
- [ ] **Rolle der Digitale Leute School** — Auftraggeber, Mitverantwortliche oder nur
      Ausbildungsrahmen?
- [ ] **Zielt Notella je auf Beschäftigten-Einsatz bei Dritten?** Dann wird die
      Betriebsrats-Mitbestimmung verbindlich, nicht nur möglich.

---

## 7. Empfehlungen (priorisiert)

1. **(hoch) Löschkonzept schärfen.** Definieren, wie Personendaten im Freitext **auf Verlangen**
   entfernt werden — z.B. eine protokollierte **harte Redaktion** einer NoteVersion, die die
   Unveränderlichkeit bewusst und nachvollziehbar durchbricht (Tombstone statt spurlosem
   Verschwinden). Den Widerspruch §4.5 ⟂ §6.4 ausdrücklich auflösen.
2. **(hoch) Datenschutz-Beipack** als Teil des Self-hosting-Produkts (der „Installationsvorgang
   ist Teil des Produkts", `03` §1): Muster-Datenschutzerklärung, VVT-Vorlage, Pannen-Kurzprozess.
3. **(hoch) OSS-Lizenz festlegen** (Empfehlung **AGPL-3.0**) und Abhängigkeits-Lizenzliste
   inkl. **TipTap-Pro** prüfen.
4. **(mittel) Beschäftigten-Hinweis** in der Doku: produktiver Einsatz mit Angestellten löst
   **Mitbestimmung/Betriebsvereinbarung** aus.
5. **(mittel) V1.3-KI:** bei Cloud **Trainings-Opt-out + AVV + Transfer-Instrument** als harte
   Voraussetzung; **lokal-erst** empfehlen; Transparenzhinweis (`source = ai`) beibehalten.
6. **(mittel) TOM:** Verschlüsselung at rest und Backup-Schutz in die Betriebsanleitung
   (an O-10 / O-17 andocken).
7. **(niedrig) Dritt-Daten-Hinweis** im Onboarding, neben der bestehenden „keine
   Vertraulichkeit"-Aussage.

**Vorschlag zum Nachziehen der Quell-Docs** *(nur nach Freigabe — dieses Dokument ändert sie
nicht selbst)*:

- `01-Problem-Framing.md`: neues Risiko **R-08 — Rechts-/Datenschutzrisiko** (Löschung ⟂
  Historie, Dritt-Daten, Beschäftigten-Mitbestimmung).
- `02-PRD.md` §6.4: um **Löschkonzept** und ein **TOM-Kapitel** erweitern; den Widerspruch zu
  §4.5 auflösen.
- `03-SRD.md`: offener Punkt **O-18 — Verschlüsselung at rest & Backup-Schutz**, gekoppelt an
  O-10/O-17.

---

## Anhang — Belastbarkeit

Stand 2026-08-17. Diese Einschätzung stützt sich auf die vorliegenden Notella-Docs und
allgemeine Kenntnis von DSGVO/BDSG/EU AI Act — **nicht** auf eine anwaltliche Prüfung des
konkreten Betriebs. Verbindliche Aussagen (v.a. zu Art. 17, § 26 BDSG, Betriebsrat-
Mitbestimmung und Drittlandtransfer) sind vor einem **produktiven** Einsatz mit realen,
fremden Nutzenden fachlich abzusichern. Für die **Schul-Verteidigung** ist der Zweck erfüllt,
wenn die offenen Risiken benannt und die Annahmen transparent sind — nicht, wenn jede Frage
abschließend gelöst ist.
