# Screen-Inventar — Notella (Arbeitstitel)

> **Version:** V0.2 · 2026-08-13
> **Vorgänger:** `01-Problem-Framing.md` (v0.3), `02-PRD.md` (V0.9), `03-SRD.md` (V0.4)
> **Nachfolger:** Klickbares Low-Fi-Mockup
> **Zweck:** Vollständige Liste aller Bildschirme mit Zweck, Zugriff, Kernelementen,
> Zuständen und Phasenzuordnung. Vorstufe zum Mockup und zugleich Arbeitsvorlage für
> Umsetzungsaufträge.
>
> ⚠️ **V0.2 zieht das Inventar auf E-14…E-30 nach.** Entfallen: Preset-Import und
> Preset-Erweiterung (F4, F5), freie Registrierung (A1), die Kurator-Rolle. Neu geschrieben:
> C1 als Notizblock, E1 als zweiphasige Kuration. Zählangaben und die IDs des C-Blocks
> korrigiert.

---

## Legende

| Kürzel | Bedeutung |
|--------|-----------|
| **L / M** | Lead / Member — wer diesen Bildschirm sieht |
| **V1.0 … V1.3** | Phasenzuordnung nach SRD §5.4 |
| 🎨 | Der Bildschirm rendert vollständig oder teilweise aus dem Preset-Schema |
| ⚡ | Kernbildschirm — hier entscheidet sich das Produkterlebnis |

**Zustände.** Die Anwendung soll solide sein: Laden, Leere, Fehler und fehlende Berechtigung
werden überall behandelt. Das Verhalten ist **einmal hier** festgelegt und je Bildschirm nur
dort ausgeführt, wo es inhaltlich abweicht — etwa beim Leerzustand, dessen Text aus dem Preset
kommt.

| Zustand | Standard |
|---------|----------|
| **Laden** | Platzhalter in der Form des erwarteten Inhalts. Nie Vollbild-Ladezeichen, nie Layoutsprung |
| **Leer** | Ein Satz, was hier normalerweise steht, plus die eine sinnvolle Handlung. Wo die Domäne den Begriff bestimmt, kommt der Satz **ganz** aus dem Preset (`texts.*`, PRD §4.7) |
| **Fehler** | Was schiefging in einem Satz ohne Fachjargon, „Erneut versuchen", und die Zusicherung, dass nichts verloren ging |
| **Keine Berechtigung** | Erklärung **warum** plus wer helfen kann („Nur die Projektleitung kann das — frag Sam") statt einer bloßen Sperre |

> **Geändert in V0.2:** Bis V0.1 galten die vier Zustände als **Pflichtmatrix je Bildschirm** —
> bei 27 Bildschirmen also 108 einzeln zu spezifizierende und zu bauende Fälle. Das lädt dazu
> ein, sie 27-mal neu zu erfinden. Sie sind jetzt vier gemeinsam genutzte Bausteine plus die
> Zustandsdateien, die das Framework je Route ohnehin vorsieht. Der Qualitätsanspruch bleibt
> unverändert; nur die Erwartung an die Dokumentation ändert sich.

---

## Übersicht

**Chrome-Stufen** (PRD §4.4.0) — *Rahmenwerk dient dem Wechseln; wer nicht wechseln will,
braucht es nicht:*

| Stufe | Rahmenwerk |
|:-----:|-----------|
| **Start** | Nur Kopfzeile. Keine Seitenleiste — es ist noch kein Projekt gewählt |
| **Orient.** | Ebenenband + Breadcrumb + ausgeklappte Seitenleiste. Navigieren **ist** hier die Aufgabe |
| **Fokus** | Breadcrumb + Seitenleiste als Symbolleiste (52 px), fährt beim Überfahren **über** den Inhalt — ohne ihn zu verschieben |

> **Ein Rückweg für alle Fokus-Bildschirme.** Meeting-Raum, Wiki, Graph und Kuration
> teilen dieselbe Symbolleiste an derselben Stelle. Immersion entsteht durch eine randlose
> **Inhaltsfläche**, nicht durch das Entfernen der Navigation.

| # | Bildschirm | Rollen | Phase | Chrome | Preset |
|---|-----------|:------:|:-----:|:------:|:------:|
| **A — Zugang** |
| A1 | Anmeldung | alle | V1.0 | Start | — |
| A2 | Einladung einlösen (Konto anlegen oder anmelden) | alle | V1.0 | Start | 🎨 |
| A3 | Profil wählen oder anlegen | alle | V1.0 | Start | 🎨 |
| A4 | Passwort ändern / per Lead-Link zurücksetzen | alle | V1.0 | Start | — |
| **B — Navigation** |
| B1 | **Alle Projekte** (Startseite) | alle | V1.0 | **Start** | 🎨 |
| B2 | Projekt anlegen (Preset-Auswahl) | L | V1.0 | Start | 🎨 |
| B3 | **Projekt-Dashboard** | alle | V1.0 | **Orient.** | 🎨 |
| B4 | Arbeitsgruppen-Übersicht | alle | V1.0 | **Orient.** | 🎨 |
| B5 | Arbeitsgruppe anlegen / bearbeiten | L | V1.0 | Orient. | 🎨 |
| B6 | Treffen anlegen / planen | L | V1.0 | Orient. | 🎨 |
| **C — Kern** |
| C1 | ⚡ **Meeting-Raum (Notizblock)** | alle | V1.0 | **Fokus** | 🎨 |
| C2 | ⚡ Typisierungs-Auswahl (Overlay) | alle | V1.1 | — | 🎨 |
| C3 | Entität schnell anlegen (Overlay) | alle | V1.1 | — | 🎨 |
| C4 | Team-Notizen (Schublade) | alle | V1.0 | — | 🎨 |
| **D — Wissen** |
| D1 | **Projektwissen — Wiki** (Baum + Artikel) | alle | V1.1 | **Fokus** | 🎨 |
| D2 | ⚡ Wiki-Artikel + Herkunfts-Panel | alle | V1.1 | Fokus | 🎨 |
| D3 | Beziehung hinzufügen (Overlay) | L | V1.1 | — | 🎨 |
| D4 | Profil-Detail | alle | V1.0 | Orient. | 🎨 |
| D5 | ⚡ Beziehungs-Graph | alle | V1.2 | **Fokus** | 🎨 |
| **E — Kuration** |
| E1 | ⚡ **Kuration Phase 1** (Vorschläge) | L (M lesend) | V1.1 | **Fokus** | 🎨 |
| E2 | ⚡ **Kuration Phase 2** (Notizen durchsehen) | L | V1.1 | **Fokus** | 🎨 |
| E3 | Zusammenführen | L | V1.1 | Fokus | 🎨 |
| E4 | Herkunft & Verlauf (Panel) | alle | V1.1 | — | 🎨 |
| **F — Verwaltung** |
| F1 | Projekteinstellungen — Allgemein | L | V1.0 | Fokus | 🎨 |
| F2 | Projekteinstellungen — Mitglieder & Einladungen | L | V1.0 | Fokus | — |
| F3 | Projekteinstellungen — Preset-Ansicht (schreibgeschützt) | L | V1.0 | Fokus | 🎨 |
| F4 | Kontoeinstellungen | alle | V1.0 | Start | — |

**27 Bildschirme, davon 23 preset-abhängig und 6 Kernbildschirme.**
Verteilung nach Chrome-Stufe: 7 × Start · 5 × Orientierung · 10 × Fokus · 5 Overlays und
Panels ohne eigene Stufe.
**V1.0 umfasst 17, V1.1 weitere 9, V1.2 einen.**

> **Korrekturen in V0.2:**
> - Der C-Block trug bis V0.1 die **Chrome-Stufe in der ID-Spalte**, wodurch C1–C3 gar keine
>   IDs hatten — obwohl sie im ganzen Dokument als Kennung benutzt werden. Behoben.
> - Die Zählangaben stimmten nicht mit der Tabelle überein (Text: 27 / 18 / 17, Tabelle:
>   28 / 23 / 18). Jetzt ausgezählt.
> - **Entfallen:** A1 *Registrierung* (es gibt keinen freien Registrierungsweg mehr, E-29),
>   F4 *Preset erweitern* und F5 *Preset-Verwaltung / Import* (E-01). Die Kurator-Spalte ist
>   überall zu „L" geworden (E-24).
> - **Neu:** C4 (Team-Notizen als Schublade — war bisher nur im PRD beschrieben) und E2
>   (Phase 2 der Kuration). E1 heißt nicht mehr „Review-Inbox".

---

## A — Zugang

### A2 · Einladung einlösen

| | |
|---|---|
| **Zweck** | Erster Kontakt mit dem Produkt. Vertrauen herstellen und die Domäne in einem Satz erklären |
| **Zugang** | Signierter Link, ohne Anmeldung erreichbar. **Der einzige Weg zu einem Konto** (E-29) |
| **Phase** | V1.0 |

**Kernelemente**

- Projektname und Name der einladenden Person
- **Terminologie-Satz aus dem Preset:** „Du wirst Teil von *Produktteam Nord*. Ihr arbeitet in **Sprints** und haltet **Meetings** ab."
- Anzahl bereits beigetretener Mitglieder
- Konto anlegen: **Benutzername, Passwort, Anzeigename** — keine E-Mail-Verifikation
- Sekundär „Ich habe schon ein Konto" → Anmeldung, danach direkt weiter zu A3

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Fehler — Link abgelaufen | „Diese Einladung ist am 3. August abgelaufen. Bitte den Ersteller um einen neuen Link." Mit Namen der einladenden Person |
| Fehler — Link widerrufen | Gleiche Form, anderer Grund. Kein Hinweis auf Projektinhalte |
| Sonderfall — bereits Mitglied | Direkter Sprung ins Projekt statt Beitrittsablauf |

---

### A3 · Profil wählen oder anlegen 🎨

| | |
|---|---|
| **Zweck** | Das fachliche Profil im Projekt wählen oder anlegen (Teammitglied / Charakter) |
| **Zugang** | Nach dem Beitritt, oder beim Beitritt zu einer weiteren Arbeitsgruppe |
| **Phase** | V1.0 |

**Kernelemente**

- **Zuerst die Auswahl**, falls in diesem Projekt bereits Profile dieses Kontos existieren:
  Kartenliste mit `texts.join_existing` („Als Thalia Windmar beitreten")
- Darunter der Anlage-Weg mit `texts.join_new_profile` („Neuen Charakter erstellen").
  Existiert noch kein Profil, erscheint dieser Schritt ohne Rückfrage
- Beim Anlegen: **nur Pflichtfelder** des Participant-Typs, gerendert vom `SchemaForm`-Baustein
- Optionale Felder eingeklappt hinter „Mehr Angaben"
- Zuordnung zu Arbeitsgruppen, wenn mehr als eine existiert

> **Warum die Auswahl vor der Anlage steht:** Ein Konto darf mehrere Profile im selben Projekt
> besitzen (E-12), und der Mechanismus dafür ist der Einladungslink — *ein Link, ein Profil*.
> Wer eine zweite Einladung einlöst, will fast immer ein zweites Profil; wer aus der
> Arbeitsgruppen-Übersicht kommt, meist ein bestehendes.

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer | Entfällt — es gibt immer mindestens den Anlage-Weg |
| Fehler — Validierung | Fehler am Feld, nicht in einem Sammelbanner. Erstes fehlerhaftes Feld wird fokussiert |

> **Testfall für die Abstraktion:** Dieser Bildschirm muss für das TableTop-Preset
> Klasse/Stufe/Hintergrund zeigen und für das Software-Preset Rolle/Schwerpunkt —
> aus derselben Komponente, ohne Fallunterscheidung.

---

## B — Navigation

### B1 · Dashboard 🎨

| | |
|---|---|
| **Zweck** | Einstiegspunkt. Die Frage beantworten: „Wo geht es gerade weiter?" |
| **Phase** | V1.0 |

**Kernelemente**

- **Laufende Meetings** ganz oben, visuell hervorgehoben, mit Direkteinstieg
- Projektkarten mit Preset-Kennzeichnung, Anzahl Arbeitsgruppen, letzte Aktivität
- Offene Notizen zur Kuration mit Zähler — **nur für den Lead**, und **nie in Warnfarbe** (E-22)
- Zuletzt geöffnet
- „Projekt anlegen"

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer | Zwei gleichwertige Wege: „Projekt anlegen" und „Auf eine Einladung warten — schick deiner Projektleitung deine E-Mail-Adresse" |

---

### B2 · Projekt anlegen (Preset-Auswahl) 🎨

| | |
|---|---|
| **Zweck** | Die einzige Konfigurationsentscheidung, die ein Lead treffen muss — und die weitreichendste |
| **Phase** | V1.0 |

**Kernelemente**

- Projektname und Beschreibung
- **Preset-Auswahl als Karten**, nie als Auswahlliste. Je Karte:
  - Name und ein Satz Beschreibung
  - **Ebenenkette** als Kette dargestellt: `Projekt → Sprint → Meeting`
  - Die drei häufigsten Entitätstypen als Chips
  - Standard-Sichtbarkeit als Hinweiszeile
- Warnhinweis unter der Auswahl: **„Das Preset lässt sich später nicht wechseln."** (E-01)

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer | Kann nicht auftreten — zwei Presets sind immer ausgeliefert |
| Fehler — Preset ungültig | Kann nicht auftreten: Presets werden beim Start geprüft, und die Anwendung startet bei einem Fehler gar nicht erst (SRD §11.1). Ein ungültiges Preset ist ein Betriebsfehler, kein Nutzerfall |

---

### B3 · Projektübersicht 🎨

| | |
|---|---|
| **Zweck** | Zustand des Projekts erfassen und in eine Arbeitsgruppe einsteigen |
| **Phase** | V1.0 |

**Kernelemente**

- Projektkopf mit Namen, Preset-Kennzeichnung und Vorschlagszähler (V1.1)
- **Arbeitsgruppen als Karten** — parallele Gruppen gleichrangig nebeneinander (E-03): Name, Anzahl Meetings, letzte Aktivität, Mitglieder als Avatarstapel, laufendes Meeting hervorgehoben
- Kurzstatistik des Projektwissens nach Entitätstyp (V1.1) — zugleich Einstieg in D1
- Aktionen für den Lead: Arbeitsgruppe anlegen, Einladen, Einstellungen

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer (Lead) | „Noch keine **Sprints**. Der erste ist schnell angelegt." mit Primärhandlung |
| Leer (Member) | „Deine Projektleitung hat noch keinen **Sprint** angelegt." — kein toter Knopf |

---

### B4 · Arbeitsgruppen-Übersicht 🎨

| | |
|---|---|
| **Zweck** | Meetings der Gruppe überblicken und ins aktuelle einsteigen |
| **Phase** | V1.0 |

**Kernelemente**

- Meeting-Liste chronologisch absteigend mit deutlicher Zustandskennzeichnung: `geplant` · `läuft` (animiert) · `beendet`
- Je Meeting: Titel, Datum, Teilnehmerzahl, Anzahl Notizen, Anzahl offener Vorschläge (V1.1)
- Teilnehmerprofile der Gruppe als Kartenreihe → D4
- Aktionen für den Lead: Treffen anlegen, laufendes starten oder beenden, Kuration öffnen
- Je Treffen der Kurationsfortschritt („4 von 12 Notizen durchgesehen"), zurückhaltend dargestellt

---

## C — Kern

### C1 · Meeting-Raum — Notizblock ⚡ 🎨

> **In V0.2 neu geschrieben (E-14, E-15, E-23).**

| | |
|---|---|
| **Zweck** | **Der wichtigste Bildschirm des Produkts.** Schreiben, ohne im Schreiben unterbrochen zu werden — und dabei so viel Struktur mitnehmen, dass die Kuration kurz bleibt |
| **Phase** | V1.0 (Notizblock, Sichtbarkeit, Feed) · V1.1 (Erwähnungen) |

**Aufbau — eine zentrierte Spalte (max. ~840 px). Der Bildschirm ist die Schreibfläche.**

| Element | Ort |
|---------|-----|
| Titel des Treffens + Zustandspille (`geplant` · `läuft · 24 min` · `beendet`) | Kopf der Spalte |
| Bilanz „12 Notizen · 7 markiert" | dezent daneben |
| **Feed-Umschalter** mit Avatar-Stapel | rechts in derselben Zeile |
| **Notizstrom** — eigene Notizen, chronologisch, älteste oben, Erwähnungen als Chip | mittlerer Bereich, scrollt |
| **Verfasser** — Eingabefeld, Sichtbarkeits-Umschalter, Kürzel-Fußzeile | fest am unteren Rand |

**Der Notizstrom.** Je Eintrag: Text der neuesten Version mit aufgelösten Chips, Zeitstempel,
Sichtbarkeit als Wort, bei Bedarf „bearbeitet" und „nachträglich ergänzt". Ein Klick macht
den Eintrag an Ort und Stelle bearbeitbar — intern entsteht eine neue Version, sichtbar ist
davon nichts außer der Markierung. **Kein Versionswähler, keine Historie** (E-17).

**Der Verfasser.** `Enter` schickt ab, `Shift+Enter` erzeugt eine neue Zeile. Der
Sichtbarkeits-Umschalter gilt für die entstehende Notiz und steht auf
`default_note_visibility`; beide Werte sind als **Wort** lesbar, nie nur Farbe oder Symbol.

**Gestrichen gegenüber früheren Entwürfen** — je Element mit Begründung:

| Element | Warum weg |
|---------|-----------|
| Ein Notizfeld je Person und Treffen | Machte Sichtbarkeit je Notiz unmöglich und Kuration je Notiz ebenso (E-14) |
| Teilnehmerliste als Spalte | Anwesenheit steckt im Avatar-Stapel des Feed-Umschalters |
| „Gehört zu **Sprint 14**" | Steht im Breadcrumb, eine Zeile darüber |
| „Frühere **Meetings**" | Reine Navigation — steht in der Symbolleiste. Zweite Liste derselben Einträge = Dopplung |
| Dauerhafter Feed | Konkurriert mit der Aufmerksamkeit, die Zuhören und Mitschreiben brauchen |

**Zustandsabhängigkeit:** bei `geplant` ist der Verfasser gesperrt mit Begründung; bei
`beendet` erscheint darüber „Dieses Treffen ist beendet — Ergänzungen werden markiert".

**Einmalige Hinweise beim ersten Besuch, gemeinsam:** der Markierungs-Hinweis („Tipp `@` oder
markiere Text") und die Ehrlichkeitsaussage („Die Projektleitung sieht alle Notizen. »Für mich«
bestimmt, was im Team-Feed erscheint.").

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Laden | Verfasser sofort bedienbar; der Notizstrom lädt darüber nach |
| Leer (Strom) | „Noch keine Notiz. Schreib den ersten Gedanken auf — er muss nicht perfekt sein." |
| Fehler (Abschicken) | „Nicht gesendet — die Notiz liegt lokal und wird übertragen, sobald die Verbindung steht." Der Eintrag bleibt sichtbar und ist als nicht gesendet gekennzeichnet |
| Keine Berechtigung | Kann nicht auftreten; Nichtmitglieder erreichen den Bildschirm nicht |

---

### C4 · Team-Notizen (Schublade) 🎨

| | |
|---|---|
| **Zweck** | Sehen, was die anderen geteilt haben — **auf Abruf, nicht aufgedrängt** |
| **Phase** | V1.0 |

Der Umschalter öffnet eine von rechts einfahrende Schublade — **dieselbe Komponente wie die
Herkunftsansicht im Wiki** (D1/D2). Ein Muster, zwei Anwendungen.

- Zeigt den Stand **beim Öffnen**, mit **Aktualisieren-Symbol**. Kein Server-Push, kein
  automatisches Nachladen (E-27)
- Eine Zählmarke neuer Beiträge ist erwünscht, aber nicht verpflichtend — nur wenn sie ohne
  Zusatzaufwand aus der ohnehin nötigen Abfrage abfällt
- Neue Beiträge erzeugen auf dem Hauptbildschirm **keine** Bewegung, kein Aufblitzen, keinen
  Vorschautext
- Zeigt ausschließlich Notizen mit „Für Team". Es gibt hier **keinen** Filter für „Für mich"-
  Notizen anderer — dieser Einblick existiert nur in der Kuration und nur für den Lead (E-16)
- `Esc` schließt sie

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer | „Noch hat niemand etwas geteilt. Was du auf *Für Team* stellst, erscheint hier bei allen." |
| Fehler | „Aktualisierung fehlgeschlagen · Erneut versuchen" — der zuletzt geladene Stand bleibt sichtbar, der Notizblock voll funktionsfähig |

---

### C2 · Erwähnungs-Auswahl (Overlay) ⚡ 🎨

| | |
|---|---|
| **Zweck** | Typisierung im Schreibfluss, ohne die Hände von der Tastatur zu nehmen |
| **Auslöser** | `@` (alle Typen) · `#` (auf einen Typ eingeschränkt) · Textmarkierung + Leiste |
| **Phase** | V1.1 |

**Kernelemente**

- Erscheint direkt an der Cursorposition, maximal 8 Treffer
- **Reihenfolge:** bestehende Entitäten (unscharfe Suche über Titel und Aliasse) zuerst,
  darunter abgetrennt „Neu anlegen als …" je Entitätstyp aus dem Preset
- Je Treffer: Typ-Symbol, Titel, ein Feld mit `show_in_list: true` als Unterzeile,
  bei Alias-Treffern „Alias von *Kanonischer Name*"
- Vollständige Tastaturbedienung: ↑ ↓ Enter Esc, Tab wechselt in die Typ-Einschränkung
- ARIA-Combobox mit `aria-activedescendant`

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Laden | Kommt bei < 150 ms nicht vor; darüber eine Zeile Skeleton — die Liste springt nicht |
| Leer | „Kein Treffer für *Falkenstein*" plus direkt die Anlage-Optionen. **Nie eine Sackgasse** |
| Fehler | Auswahl schließt lautlos, der getippte Text bleibt als Klartext stehen. Ein Suchfehler darf niemals den Schreibfluss unterbrechen |

---

### C3 · Entität schnell anlegen (Overlay) 🎨

| | |
|---|---|
| **Zweck** | Neue Entität anlegen, ohne den Meeting-Raum zu verlassen |
| **Phase** | V1.1 |

**Kernelemente**

- Titel vorbelegt aus dem markierten oder getippten Text
- **Nur Pflichtfelder** des gewählten Typs, gerendert vom `SchemaForm`-Baustein
- **Duplikathinweis** oberhalb der Felder, wenn Ähnlichkeit ≥ 80 %: „Es gibt schon
  *The Dancing Pony* — meintest du den?" mit den beiden Wegen „Diesen verwenden" und
  „Trotzdem neu anlegen"
- Hinweis auf den Zustand: „Wird als Vorschlag angelegt — deine Projektleitung entscheidet über die Übernahme". **Auch für den Lead** — es gibt keine Direktübernahme (E-20)
- **Pflichtfelder werden hier nicht verlangt.** Ein Vorschlag darf mit Titel und Typ existieren; die Vollständigkeit wird erst in der Kuration geprüft (PRD §4.4.2.6)

---

## D — Wissen

### D1/D2 · Projektwissen — das Wiki ⚡ 🎨

| | |
|---|---|
| **Zweck** | Das gesammelte Wissen lesen, durchsuchen und nachvollziehen. Beantwortet „Was ist das?" — der Graph (D5) beantwortet „Wie hängt alles zusammen?" |
| **Chrome** | **Fokus** — die globale Seitenleiste ist auf Symbole reduziert, weil der **Wissensbaum die Navigation übernimmt**. Zwei Navigationslisten nebeneinander sind der Normalfall von Unübersichtlichkeit (§4.4.0, Regel 6) |
| **Phase** | V1.1 |

**Zweispaltig**

| Spalte | Inhalt |
|--------|--------|
| **Links — Wissensbaum** (~250 px) | Suchfeld · Bestand nach Entitätstyp aus dem Preset gegliedert, je Typ alphabetisch, mit Zähler. Vorschläge gedämpft und gekennzeichnet |
| **Rechts — Artikel** (Lesebreite ~740 px) | Der Eintrag als **Dokument**, nicht als Formular |

**Zwei Gliederungen desselben Bestands** — Umschalter über dem Baum:

| Modus | Gliederung | Beantwortet |
|-------|-----------|-------------|
| **Nach Eintrag** (Standard) | nach Entitätstyp, alphabetisch | *„Was gibt es?"* |
| **Nach Zeitpunkt** | chronologisch nach Meeting; je Meeting die Einträge, die daraus **entstanden oder dort geändert** wurden, mit Kennzeichnung `neu` / `geändert` / `Vorschlag` | *„Was haben wir wann besprochen und beschlossen?"* — Herkunft wird damit zur **abfragbaren Dimension** statt zur Fußnote |

**Artikelaufbau — für jeden Typ identisch**

1. Typ-Kennzeichnung, Zustand, Aliasse
2. Titel
3. **Herkunftszeile**: *„Aus 2 Notizen · zuletzt geändert heute von Sam"* — öffnet das Panel
4. **Steckbrief**: Preset-Felder als Definitionsliste. Kein Formular — Bearbeiten erst auf Klick am Feld
5. **Beschreibung**: `longtext`-Feld als Fließtext in Lesebreite
6. **Beziehungen**: nach Beziehungstyp gruppiert, als Pillen mit Typfarbe. Darunter „Umgebung im Netz ansehen" → D5
7. **Verweist hierher**: Rückverweise. Wird **nicht gerendert**, wenn es keine gibt

**Herkunfts-Panel** — statt einer dritten Spalte, die den Artikel schmal machen würde,
fährt es **von rechts über den Inhalt** und bricht den Artikel nicht um. Zwei Reiter:

| Reiter | Inhalt |
|--------|--------|
| **Herkunft · woher?** | Jede Ursprungsnotiz mit Meeting, Arbeitsgruppe, Autor, Datum und dem Wortlaut als Momentaufnahme. Sprung an die Textstelle. Nachträglich geänderte Quellen gekennzeichnet |
| **Verlauf · wann?** | Jede Änderung mit Zeitpunkt, Person, Feld vorher/nachher, **Auslöser** (Kanonisierung / Bearbeitung / Zusammenführung) und Verweis auf Notiz und Meeting |

`Esc` schließt das Panel, bevor es die Chrome-Stufe wechselt.

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer (Projekt neu) | „Hier entsteht euer **Projektwissen** — aus dem, was ihr in **Meetings** schreibt." mit Verweis ins nächste Meeting |
| Leer (Suche) | „Kein Treffer" plus Zurücksetzen |
| Leer (Beziehungen) | Abschnitt wird nicht gerendert |
| Keine Berechtigung | Felder schreibgeschützt, einmaliger Hinweis: „Nur die Projektleitung kann das **Projektwissen** ändern" |

---

### D3 · Beziehung hinzufügen (Overlay) 🎨

| | |
|---|---|
| **Zweck** | Zwei Entitäten typkonform verbinden |
| **Phase** | V1.1 |

**Kernelemente**

- Quelle ist vorbelegt (die Entität, von der aus geöffnet wurde)
- **Beziehungstyp-Auswahl zeigt nur passende Typen** — gefiltert über `source`/`target`
  des Presets. Das ist der Mechanismus, der Generizität intuitiv macht
- Ziel-Auswahl entsprechend eingeschränkt auf erlaubte Zieltypen
- Vorschau des Ergebnissatzes in natürlicher Sprache: „*Gorm* **lebt in** *Falkenstein*"
- Hinweis auf die Gegenrichtung: „Bei *Falkenstein* erscheint das als **Bewohner**"

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer (keine passenden Typen) | „Für **Risiken** sind mit diesem Typ keine Verbindungen vorgesehen." Ohne Handlungsangebot — Beziehungstypen kommen aus dem ausgelieferten Preset und sind zur Laufzeit nicht ergänzbar (E-01) |

---

### D5 · Beziehungs-Graph ⚡ 🎨

| | |
|---|---|
| **Zweck** | Das Wiki beantwortet „Was ist das?", der Graph „Wie hängt alles zusammen?" — zweite Projektion derselben Daten, keine eigene Datenhaltung |
| **Zugang** | Aus dem Projekt-Dashboard und aus jedem Wiki-Artikel („Umgebung im Netz ansehen") |
| **Chrome** | **Fokus.** Die Inhaltsfläche ist randlos und füllt den Bildschirm — ein erforschbares Universum. Filterleiste und Zoom schweben über der Leinwand. Der Rückweg ist dieselbe Symbolleiste wie auf jedem anderen Fokus-Bildschirm |
| **Phase** | V1.2 |

**Aufbau**

| Bereich | Inhalt |
|---------|--------|
| **Links** (einklappbar, ~230 px) | Suche · **Typ-Filter aus dem Preset** mit Anzahl und Form-/Farbmarke je Typ · Kennzahl „18 Einträge · 24 Verbindungen" · Zeit-/Gruppenfilter („Alle **Sprints**") · Umschalter „nur kanonisch / auch Vorschläge" |
| **Leinwand** | Unendliche Fläche, Zoom, Verschieben, Knoten ziehbar, kräftebasiertes Layout mit stabiler Anordnung |
| **Unten rechts** | Zoom + / − · Ansicht zurücksetzen · Layout-Umschalter |
| **Rechts im Fokusmodus** | Kurzfassung des gewählten Knotens: Typ, Felder mit `show_in_list: true`, Anzahl Herkünfte, „Detailseite öffnen" → D2, „Nachbarschaft erweitern" |

**Preset-Abhängigkeit** — der Punkt, an dem sich die Abstraktion visuell beweist:

| Element | Quelle |
|---------|--------|
| Knotenform | `entity_types[].graph.shape` |
| Knotenfarbe | `entity_types[].graph.color` |
| Kantenstil und -stärke | `relation_types[].graph.style` / `.weight` |
| Kantenbeschriftung | `relation_types[].label` bzw. `.inverse_label` je Richtung |
| Filterliste | `entity_types[]` — vollständig, ohne feste Verdrahtung |

Fehlt der `graph`-Block, leitet die Anwendung Form und Farbe deterministisch aus dem
Typschlüssel ab. Ein Preset ohne Grafikangaben bleibt voll funktionsfähig.

**Fokusmodus** — Klick auf einen Knoten: gewählter Knoten und direkte Nachbarn bleiben
hervorgehoben, alles Übrige wird stark abgedunkelt, **aber nicht entfernt** — der Kontext
tritt zurück, statt zu verschwinden. Kantenbeschriftungen der sichtbaren Verbindungen
werden eingeblendet. Doppelklick öffnet D2. Esc verlässt den Modus.

**Kante auswählen** → zeigt die Notiz(en), aus denen die Verbindung stammt. Dieselbe
Herkunftslogik wie in D2. Das macht den Graph belegbar statt dekorativ.

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Laden | Filterleiste sofort bedienbar, Leinwand mit dezenter Aufbauanimation — nie ein leeres Rechteck |
| Leer (kein Wissen) | „Hier entsteht die Karte eures **Projektwissens**, sobald ihr in **Meetings** Einträge markiert." |
| Leer (keine Verbindungen) | Knoten verstreut sichtbar plus Hinweis: „Noch keine Verbindungen — Beziehungen entstehen beim Übernehmen oder auf den Detailseiten." |
| Leer (Filter) | „Kein Eintrag mit diesen Filtern" plus Zurücksetzen |
| **Zu groß** | Über 1 500 sichtbare Knoten: Aufforderung zum Filtern **bevor** das Layout gerechnet wird. Kein stiller Abbruch, keine hängende Oberfläche |
| Fehler | Rückfall auf D1 mit Hinweis „Die Karte konnte nicht geladen werden — die Liste zeigt dieselben Daten" |

**Barrierefreiheit** — der schwierigste Punkt dieses Bildschirms: Tab wandert zwischen
Knoten in stabiler Reihenfolge, Enter fokussiert, Esc verlässt. Typunterscheidung immer
über **Form und** Farbe, nie über Farbe allein. Zusätzlich ist D1 die vollwertige,
gleichwertige Alternative für alle Inhalte des Graphen.

---

## E — Kuration

> **In V0.2 zweigeteilt (E-18).** E1 ist der bisherige Schnelldurchlauf und bleibt der
> Normalfall. E2 ist neu: die Durchsicht der Notizen, ohne die alles ungetaggte Wissen das
> Projektwissen nie erreicht. Beide gehören zu **einem** Fluss — der Lead wechselt zwischen
> ihnen, ohne den Bildschirm zu verlassen.

### E1 · Kuration Phase 1 — Vorschläge ⚡ 🎨

| | |
|---|---|
| **Zweck** | Vorgetaggte Vorschläge in Projektwissen überführen — als Abarbeitung, nicht als Datenpflege |
| **Zugang** | Lead mit Aktionen · Member schreibgeschützt (Transparenz) |
| **Phase** | V1.1 |
| **Zielmarke** | Median **unter 6 Sekunden** je Vorschlag bei Tastaturbedienung |

**Aufbau — kein Liste-plus-Detail, sondern Vollflächen-Durchlauf**

| Bereich | Inhalt |
|---------|--------|
| **Kopfleiste** | Arbeitsgruppe › Treffen › Datum · **segmentierter Fortschrittsbalken**, ein Segment je Vorschlag · Umschalter zu Phase 2 |
| **Hauptspalte** (max. ~720 px) | Immer dieselbe Reihenfolge: Belegstelle → Vorschlag → offene Frage → Handlung |
| **Kontextspalte** (~240 px, **rahmenlos und gedämpft**) | Herkunft, Häufigkeit, vorhandene Einträge desselben Typs. Bewusst visuell leise, damit sie nicht mit der Entscheidung konkurriert |
| **Fußleiste** | Tastenkürzel, dauerhaft sichtbar |

**Drei Kartenarten — je eine binäre Frage.** Welche erscheint, ergibt die Datenlage;
der Lead wählt nie aus.

| Art | Frage | Primär | Sekundär |
|-----|-------|--------|----------|
| **A · Neu** | Gehört das ins Projektwissen? | Übernehmen | Ablehnen (Text) · Später (klein) |
| **B · Duplikat** | Ist das derselbe Eintrag? | Ist dasselbe → zusammenführen | Ist etwas anderes → neu anlegen (gleichwertig sichtbar) |
| **C · Ergänzung** | Soll das zum vorhandenen Eintrag hinzukommen? | Übernehmen | Verwerfen (Text) |

Kartenart B wird durch **normalisierte Übereinstimmung** von Titel oder Alias ausgelöst, nicht
durch einen Ähnlichkeitswert (E-28).

**Kontext ohne Klick sichtbar** (PRD §4.4.2.5): der umgebende **Absatz** statt nur des
Satzes · **Häufigkeit und Streuung** („3 Erwähnungen · 2 Treffen", aufklappbar) · Autor,
Arbeitsgruppe, Treffen, Zeitpunkt · bis zu 5 vorhandene Einträge desselben Typs.

**Pflichtfelder als Chip-Reihe** statt Auswahlliste — ein Klick oder eine Zifferntaste.
Optionale Felder erscheinen hier **gar nicht**. Die Begründung für einen inaktiven
Primärknopf steht unmittelbar am Knopf. Ein Vorschlag **darf** unvollständig existieren;
geprüft wird erst beim Übergang nach kanonisch (PRD §4.4.2.6).

**Nach der Entscheidung:** keine Bestätigungsdialoge · Rückgängig-Hinweis für 8 s ·
automatisch weiter.

**Bewusst nicht enthalten:** Stapelaktionen. Jede Übernahme bleibt eine Einzelentscheidung —
die Entlastung kommt aus Geschwindigkeit, nicht aus Bündelung.

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer | Kein kahler Bildschirm, sondern der Übergang: „Alle Vorschläge bearbeitet. Weiter zur Durchsicht — 12 Notizen." |
| Leer (Member) | „Hier arbeitet die Projektleitung Vorschläge ab. Deine Vorschläge aus **Sprint-Planung KW 32** stehen noch an." |
| Keine Berechtigung | Für Member: Karten sichtbar, Handlungsschaltflächen **nicht vorhanden** — nicht ausgegraut. ⚠️ Das ist eine Darstellungsregel, **keine** Berechtigungsprüfung (SRD §11.2a) |

---

### E2 · Kuration Phase 2 — Notizen durchsehen ⚡ 🎨

| | |
|---|---|
| **Zweck** | Prüfen, was im Treffen zu markieren vergessen wurde — und jede Notiz bewusst abschließen |
| **Zugang** | nur Lead |
| **Phase** | V1.1 |
| **Zielmarke** | Median **unter 10 Sekunden** je Notiz |

**Die Notiz ist die Karte.** Chronologisch, eine nach der anderen, wieder bildschirmfüllend.

| Bereich | Inhalt |
|---------|--------|
| **Kopfleiste** | Treffen · Fortschritt in Notizen („Notiz 4 von 12") · Autor der aktuellen Notiz · Umschalter zu Phase 1 |
| **Hauptfläche** | Vollständiger Text der **neuesten** Notiz-Version, gut lesbar gesetzt. Bestätigte Stellen als Chip in Typfarbe, offene Vorschläge als Chip mit Umriss |
| **Fußleiste** | Tastenkürzel und Abschlussknopf |

**Was hier möglich ist:** lesen (der Hauptzweck) · Text markieren und typisieren (dieselbe
Geste wie im Meeting-Raum) · Beziehungen ergänzen (D3, aus der Notiz heraus) · offene
Vorschläge dieser Notiz entscheiden · **die Notiz abschließen**.

**Der Abschluss ist die einzige Stelle, an der eine Notiz „fertig" wird** (E-19/E-21). Auch
wenn alle ihre Vorschläge in Phase 1 entschieden wurden, bleibt sie offen, bis der Lead sie
gesehen hat — Phase 1 kann nichts darüber aussagen, was **nicht** getaggt wurde.

**Notizen mit „Für mich" erscheinen hier ebenfalls** (E-16), gekennzeichnet, damit der Lead
einordnen kann, dass die schreibende Person sie nicht für die Gruppe gedacht hatte.

**Belohnung als Anforderung (E-22):** Jeder Abschluss gleitet sichtbar in einen
Erledigt-Zustand und füllt ein Segment des Fortschritts — kurz und ruhig, ohne Konfetti.
Zähler offener Notizen erscheinen **nie** in Warnfarbe. Zwischen zwei Notizen ist jederzeit
ein sauberer Ausstieg möglich.

**Abweichende Zustände**

| Zustand | Verhalten |
|---------|-----------|
| Leer | **Bilanz statt kahler Fläche:** „12 Notizen durchgesehen · 5 neue Einträge · 3 Beziehungen · 2 zusammengeführt · 7 davon waren schon im Treffen markiert", mit Sprung ins Wiki (ab V1.2 zusätzlich in den Graph) |
| Nachtrag | Kommen nach dem Durchgang weitere Notizen hinzu, erscheinen sie schlicht als weitere offene Notizen. Es gibt **keinen** Zustand „Treffen durchkuriert", der dadurch ungültig würde (E-21) |

---

### E2 · Zusammenführen 🎨

| | |
|---|---|
| **Zweck** | Duplikate zusammenführen, ohne Informationsverlust |
| **Phase** | V1.1 |

**Kernelemente**

- Zwei Spalten nebeneinander: Vorschlag und Zielentität
- Feldweise Vorschau des Ergebnisses. Regel sichtbar gemacht: **leere Zielfelder werden
  gefüllt, gefüllte nie überschrieben**; abweichende Werte werden markiert und sind manuell auflösbar
- Titel des Vorschlags wird als **Alias** übernommen — sichtbar dargestellt
- Beziehungen und Herkünfte werden vereinigt, Duplikate verworfen
- Hinweis: „Bleibt in der Historie nachvollziehbar" — **kein Umkehrfenster** (E-25).
  Ein Zusammenführen lässt sich später durch eine neue Änderung revidieren, die einen
  früheren Stand wiederherstellt; nichts wird gelöscht und nichts verfällt

---

### E4 · Herkunft & Verlauf (Panel) 🎨

| | |
|---|---|
| **Zweck** | „Woher wissen wir das — und wer hat wann was geändert?" |
| **Phase** | V1.1 |

**Kernelemente**

- Zwei Reiter: **Herkunft** (aus welchen Notiz-Versionen der Eintrag entstand) und
  **Verlauf** (Zeitstrahl seiner Änderungen)
- Herkunft je Eintrag: Autor, Arbeitsgruppe › Treffen, Zeitpunkt, der belegende Absatz im
  Wortlaut der **damaligen Notiz-Version**. Existiert inzwischen eine neuere Version, wird
  das gekennzeichnet und verlinkt — der Beleg selbst bleibt unverändert (PRD §4.5)
- Verlauf je Eintrag: Zeitpunkt, Person, Vorher/Nachher der geänderten Felder,
  **Auslöser-Kennzeichnung** (Kanonisierung / Bearbeitung / Zusammenführung / Rücknahme)
  und, sofern vorhanden, Verweis auf Notiz-Version, Treffen und Arbeitsgruppe
- Filter nach Auslöser
- **Zurückhaltend**: der Verlauf ist einsehbar, drängt sich aber nicht auf. Die neueste
  Fassung ist in nahezu allen Fällen die relevante (E-17)

> **Entwurfsanforderung für später:** Der Verlauf beruht auf vollständigen Schnappschüssen
> (SRD §11.4a), damit „Zustand zum Zeitpunkt T" eine einzige Abfrage ist. Das ist die
> Voraussetzung für die spätere verschiebbare Zeitleiste — die Ansicht muss dafür nicht
> umgebaut, nur ergänzt werden.

---

## F — Verwaltung

### F2 · Projekteinstellungen — Mitglieder & Einladungen

| | |
|---|---|
| **Zweck** | Mitglieder verwalten, Einladungen und Zugänge steuern |
| **Phase** | V1.0 |

**Kernelemente**

- Mitgliederliste mit Rolle, Beitrittsdatum und den verknüpften Profilen dieses Kontos
- Leitung übertragen, mit Bestätigung
- **Einladungslink erzeugen** — mit dem Hinweis, dass ein Link zu genau einem Profil führt:
  „Für einen zweiten Charakter derselben Person: einen zweiten Link erzeugen" (E-12/E-29)
- Aktive Einladungslinks mit Ablaufdatum und Widerruf
- **Passwort-Rücksetzlink ausstellen** — dasselbe Primitiv wie die Einladung, weil es keinen
  Mailversand gibt (E-29)
- Mitglied entfernen, mit Hinweis auf den Verbleib der Notizen (Anonymisierung)

> **Entfallen in V0.2:** Die Rollenvergabe. Es gibt nur noch Lead und Member (E-24); eine
> Beförderung existiert nicht mehr, nur die Übertragung der Leitung.

---

### F3 · Projekteinstellungen — Preset-Ansicht 🎨

| | |
|---|---|
| **Zweck** | Transparenz darüber, wie das Projekt konfiguriert ist. **Schreibgeschützt** |
| **Phase** | V1.0 |

**Kernelemente**

- Preset-Name, **Formatversion und Inhaltsrevision getrennt ausgewiesen** — es sind zwei
  verschiedene Dinge (PRD §4.1.1)
- Terminologie-Tabelle (generisch ↔ Anzeigebegriff) — **hier erscheinen generische Begriffe
  bewusst**, es ist der einzige Ort dafür
- Entitätstypen mit ihren Feldern, schreibgeschützt
- Beziehungstypen mit Quelle und Ziel
- Der Sichtbarkeits-Default im Klartext
- **Die Ehrlichkeitsaussage im Wortlaut, für alle Mitglieder einsehbar** (PRD §4.2.3): „Die
  Projektleitung sieht in der Kuration alle Notizen dieses Projekts. »Für mich« bestimmt, was
  im Team-Feed erscheint."

> **Entfallen in V0.2:** Die Schaltfläche „Erweitern" und der gesamte Bildschirm dahinter.
> Presets werden ausgeliefert, nicht zur Laufzeit verändert (E-01). Wer etwas ändern will,
> ändert die Datei im Repository und liefert neu aus — und zwar rein additiv, damit
> bestehende Projekte weiterlaufen.

---

> **Entfallen in V0.2: F4 (Preset erweitern) und F5 (Preset-Verwaltung / Import).**
>
> Beide Bildschirme setzten voraus, dass Presets zur Laufzeit hochgeladen und verändert
> werden. Mit E-01 ist das nicht mehr der Fall. Damit entfallen zugleich zwei Anforderungen,
> die technisch teuer waren: die **zeilengenaue Validierungsausgabe** (sie hätte einen
> positionserhaltenden Parser plus Rückabbildung der Prüfpfade gebraucht — keine der
> vorgesehenen Techniken kann das ab Werk) und die **Vorschau der Auswirkungen** einer
> Schemaänderung auf bestehende Daten.
>
> An ihre Stelle tritt Werkzeugunterstützung **außerhalb** des Produkts: Aus dem
> Prüf-Schema wird ein JSON Schema erzeugt und in der Preset-Datei referenziert, sodass beim
> Schreiben eines Presets Autovervollständigung und Fehlermarkierung direkt im Editor
> erscheinen (SRD §11.1).
>
> **Zurück kommen sie** mit dem kuratierten Community-Prozess im Backlog — dann als eigene
> Ausbaustufe mit eigenem Bedrohungsmodell, zusammen mit einem eigenständigen Preset-Editor.

---

## Abhängigkeiten und Baureihenfolge

```text
SchemaForm-Baustein  ─────┬──▶ A3 Profil anlegen
(die härteste Stelle)     ├──▶ C3 Schnellanlage
                          ├──▶ D2 Wiki-Artikel
                          └──▶ E1 Kuration Phase 1 (Pflichtfeld-Chips)

Preset-Auflösung  ────────▶ jeder mit 🎨 markierte Bildschirm

Datenzugriff mit Fähigkeitsprüfung ─┬──▶ C1/C4 Sichtbarkeitsfilterung
(SRD §11.2a)                        ├──▶ E1/E2 Kanonisierung
                                    └──▶ F2 Mitgliederverwaltung

Kanonisierungs-Dienst ────┬──▶ E1 Phase 1
(SRD §11.7, Schritt 8)    ├──▶ E2 Phase 2
                          └──▶ (V1.3) KI-Auto-Merge

C1 Notizblock ──▶ C2 Typisierung ──▶ D1/D2 Wiki ──▶ E1 ──▶ E2 ──▶ D5 Graph
```

**Der `SchemaForm`-Baustein speist vier Bildschirme.** Er ist zugleich die schwierigste
und die folgenreichste Stelle — deshalb steht er in SRD §11.7 an erster Position.

**Der Kanonisierungs-Dienst speist beide Kurationsphasen und später die KI.** Er wird
**vor** E1 gebaut, damit V1.3 ein zweiter Aufrufer wird und keine zweite Pipeline (SRD §11.9).

---

## Für das Mockup ausgewählte Bildschirme

Vier Bildschirme genügen, um die Produktthese sichtbar zu machen — **jeweils in beiden
Presets nebeneinander**:

| Bildschirm | Was er beweisen soll |
|-----------|----------------------|
| **C1 Notizblock** | Der Schreibfluss funktioniert, Einzelnotizen fühlen sich richtig an, und die zwei Sichtbarkeiten sind selbsterklärend |
| **E1 + E2 Kuration** | Kuration fühlt sich wie eine Entscheidung an, nicht wie Datenpflege — und der Durchgang lohnt sich sichtbar |
| **D2 Wiki-Artikel** | Der Herkunftsnachweis ist das Alleinstellungsmerkmal — und für jeden Typ derselbe Aufbau |
| **D5 Beziehungs-Graph** | Preset-Neutralität in einer Sekunde sichtbar: dieselbe Karte, andere Formen, Farben und Beschriftungen |

Dazu ein **Preset-Umschalter** im Mockup, der zwischen Software-Projekt und TableTop
wechselt, ohne dass sich das Layout ändert. Genau dieser Umschalter ist die visuelle
Fassung des Erfolgskriteriums „zweites Preset ohne Codeänderung".

> **Zum vorhandenen Mockup:** Es entstand in der Findungsphase und bildet den Stand **vor**
> dieser Überarbeitung ab — insbesondere den Meeting-Raum als Dokument statt als Notizblock,
> drei Sichtbarkeitsstufen und die einphasige Review-Inbox. Es war ein Werkzeug zur frühen
> Anforderungsfindung und ist **keine Codebasis**; die Umsetzung beginnt spec-getrieben neu.
