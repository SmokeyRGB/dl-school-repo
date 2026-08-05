# PRD — DoctorCrawler

> Version: V0.1
> Date: 2026-08-05
> Author: Samuel Zink
> Related: problem-framing-doctorcrawler.md · srd-doctorcrawler.md

---

## 1. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| V0.1 | 2026-08-05 | Samuel Zink | Erstfassung |

---

## 2. Background

Die Suche nach Facharztterminen in Deutschland ist für viele Menschen ein mehrstufiger, frustrierender Prozess: Praxen recherchieren, Kontaktdaten heraussuchen, zu Öffnungszeiten anrufen — und meist trotzdem scheitern. DoctorCrawler adressiert dieses Problem als gemeinnützige Middleware-Plattform: kein Ersatz für praxisinterne Terminvergabesysteme, sondern eine Vereinfachung der Kontaktaufnahme zwischen Suchenden und Praxen. Das Produkt ist als zweiseitiger Marktplatz konzipiert — der Wert für Patienten steigt mit der Anzahl teilnehmender Praxen und umgekehrt.

Vollständige Problemanalyse und strategische Richtung: siehe Problem Framing und SRD.

---

## 3. Overview

| Field | Content |
|-------|---------|
| Platform | Web (Desktop + Mobile-responsive) |
| Language | Deutsch (i18n-fähige Architektur für spätere Erweiterung) |
| Zielgruppen | Patienten (GKV/PKV), Facharztpraxen (Registrierung optional) |
| Kernfunktion | Facharztpraxen suchen → Terminanfrage stellen → Rückmeldungen verwalten |
| Design | TBD (kein Figma-Link vorhanden) |
| Scope (v1) | Phase 1 + Phase 2 aus SRD-Phasing |

---

## 4. Product Requirements

### 4.0 User Flows

Zwei primäre Nutzergruppen mit getrennten Flows:

#### Flow A — Patient (Hauptflow)

| Schritt | Seite | Nutzeraktion | Verzweigung |
|---------|-------|-------------|-------------|
| 1 | Landing / Suche | Fachrichtung + Region eingeben | Ohne Konto möglich (Suche ist öffentlich) |
| 2 | Suchergebnisse | Praxen durchsuchen, filtern (Entfernung, GKV/PKV) | Kein Ergebnis → Empty State |
| 3 | Praxisdetail | Praxis auswählen, Kontaktoptionen ansehen | Abhängig von verfügbarem Kontaktkanal |
| 4 | Kontaktaufnahme | Anfragemodus wählen (LLM-E-Mail / Formular / direkte Anzeige) | Nicht registriert → Login-Gate vor Absenden |
| 5 | Anfrage absenden | Rahmenbedingungen angeben (Zeitraum, Präferenzen) | Automatisch: Massenanfrage möglich |
| 6 | Dashboard | Status aller Anfragen verfolgen, Rückmeldungen einsehen | — |
| 7 | Terminbestätigung | Passendes Angebot direkt annehmen | Ablehnung → Status aktualisieren |

**Seitenübergreifende Datenübergabe:**
- Suche → Ergebnisse: Region, Fachrichtung, Versicherungsart, Entfernung (Radius)
- Praxisdetail → Kontaktaufnahme: Praxis-ID, verfügbare Kontaktkanäle
- Anfrage → Dashboard: Anfrage-ID, Status, Praxis-Referenz
- Rahmenbedingungen (Zeitraum, GKV/PKV) werden bei Massenanfragen auf alle ausgewählten Praxen angewendet

#### Flow B — Praxis (Registrierung & Verwaltung)

| Schritt | Seite | Nutzeraktion | Verzweigung |
|---------|-------|-------------|-------------|
| 1 | Praxis-Landing | Registrierung starten | Bereits registriert → Login |
| 2 | Onboarding | Praxisdaten eingeben, Kontaktoptionen wählen | Anonyme Kontaktierung aktivierbar |
| 3 | Datenschutz-Einstellungen | Sichtbarkeit von Kontaktdaten konfigurieren | Anonym → nur Formular / LLM möglich |
| 4 | Anfragen-Inbox | Eingehende Terminanfragen einsehen | — |
| 5 | Antwort | Termin anbieten, ablehnen oder weiterleiten | Antwort löst Status-Update im Patienten-Dashboard aus |

---

### 4.1 Frontend Requirements

#### 4.1.1 Suchseite (Patient)

**Verhalten:**
- Suche ohne Registrierung zugänglich
- Pflichtfelder: Fachrichtung (Freitext mit Autocomplete oder Dropdown), Region (PLZ oder Ortsname)
- Optionale Filter: Versicherungsart (GKV / PKV / Beide), Entfernung (Radius in km, Slider)
- Suche startet bei Submit (kein Live-Search für v1)

**Acceptance Criteria:**
- [ ] Fachrichtungsfeld bietet Autocomplete-Vorschläge ab 2 Zeichen
- [ ] Ungültige Region (nicht auflösbar) zeigt Inline-Fehlermeldung, kein Seitenabbruch
- [ ] Leere Suchergebnisse zeigen einen erklärenden Empty State mit Handlungsempfehlung (z.B. Radius vergrößern)
- [ ] Suchparameter sind in der URL kodiert und per Link teilbar

#### 4.1.2 Suchergebnisse (Patient)

**Verhalten:**
- Darstellung als Liste + Karte (Toggle oder Split-View)
- Je Ergebnis sichtbar: Praxisname, Fachrichtung, Adresse, Entfernung, Versicherungsart, verfügbare Kontaktkanäle (Icons)
- Sortierung: Default nach Entfernung; optional nach Relevanz (gecrawlt vs. registriert)
- Registrierte Praxen werden visuell hervorgehoben (Badge o.ä.)
- Massenanfrage: Mehrfachauswahl von Praxen möglich → „An alle ausgewählten anfragen"-Button

**Acceptance Criteria:**
- [ ] Jede Ergebniskarte zeigt mindestens: Name, Fachrichtung, Entfernung, mind. einen Kontaktkanal
- [ ] Registrierte Praxen sind klar von gecrawlten unterscheidbar (z.B. „Verifiziert"-Badge)
- [ ] Bei Auswahl mehrerer Praxen für Massenanfrage erscheint eine Zusammenfassung vor dem Absenden
- [ ] Kartenansicht zeigt Pins für alle Ergebnisse; Klick auf Pin öffnet Kurzinfo
- [ ] Paginierung oder Infinite Scroll bei > 20 Ergebnissen

#### 4.1.3 Praxisdetailseite

**Verhalten:**
- Vollständige Praxisinformationen: Name, Adresse, Fachrichtung, Öffnungszeiten (falls verfügbar), Versicherungsarten
- Kontaktoptionen als klar unterscheidbare CTAs:
  - **LLM-Anfrage** (falls E-Mail vorhanden und nicht anonym): „Automatisch anfragen"
  - **Kontaktformular**: „Formular ausfüllen"
  - **Direkte Kontaktanzeige** (falls Praxis nicht anonym): „Kontakt anzeigen" (E-Mail / Telefon)
- Datenherkunft transparent: „Daten aus öffentlichen Quellen" vs. „Von Praxis bestätigt"

**Acceptance Criteria:**
- [ ] Mindestens ein Kontaktkanal ist immer sichtbar (kein Ergebnis ohne Handlungsoption)
- [ ] Anonyme Praxen zeigen keine Kontaktdaten direkt, nur Formular/LLM-Optionen
- [ ] Datenherkunft ist je Datenfeld ersichtlich (Label oder Tooltip)
- [ ] „Kontakt anzeigen" erfordert Anmeldung (verhindert automatisiertes Scraping der Kontaktdaten)

#### 4.1.4 Kontaktaufnahme / Anfrage-Flow

**Verhalten:**
- Vor Absenden: Nutzer gibt Rahmenbedingungen an: gewünschter Zeitraum, Flexibilität, kurze Beschreibung des Anliegens (kein Diagnosefeld — nur freier Text)
- LLM-Modus: Generiert E-Mail-Entwurf, der dem Nutzer zur Bestätigung angezeigt wird, bevor er gesendet wird
- Formular-Modus: Strukturiertes Formular mit den gleichen Feldern, das direkt an die Praxis weitergeleitet wird
- Massenanfrage: Gleiche Rahmenbedingungen werden auf alle ausgewählten Praxen angewendet; Nutzer sieht Zusammenfassung

**Acceptance Criteria:**
- [ ] LLM-generierter E-Mail-Entwurf wird vor dem Senden immer angezeigt und ist editierbar
- [ ] Absenden ohne Zeitraum-Angabe nicht möglich (Pflichtfeld)
- [ ] Diagnosedaten werden nicht abgefragt; Freitextfeld hat klaren Hinweis auf Datensparsamkeit
- [ ] Nach Absenden erscheint Bestätigungsscreen mit Link zum Dashboard
- [ ] Massenanfrage zeigt Anzahl der Praxen und ermöglicht Einzelabwahl vor finalem Senden

#### 4.1.5 Patienten-Dashboard

**Verhalten:**
- Übersicht aller gestellten Anfragen mit Status: Gesendet / Antwort erhalten / Termin bestätigt / Abgelehnt / Keine Antwort (nach X Tagen)
- Je Anfrage: Praxisname, Datum der Anfrage, Status, letzte Rückmeldung
- Bei Terminangebot: CTA „Termin annehmen" → sendet Bestätigung an Praxis, Status wechselt auf „Bestätigt"
- Abgelehnte oder zeitlich abgelaufene Anfragen werden archiviert, nicht gelöscht

**Acceptance Criteria:**
- [ ] Status jeder Anfrage ist auf einen Blick erkennbar (Farbkodierung + Label)
- [ ] „Termin annehmen" erfordert eine Bestätigungsabfrage vor Absenden
- [ ] Anfragen ohne Rückmeldung nach 14 Tagen erhalten automatisch Status „Keine Antwort" und eine Hinweismeldung
- [ ] Dashboard ist auch auf mobiler Darstellung (responsive) vollständig nutzbar

#### 4.1.6 Nutzerregistrierung & Profil

**Verhalten (v1):**
- Pflichtfelder: Name, E-Mail, Passwort, Versicherungsart (GKV / PKV / Selbstzahler)
- Versicherungsbestätigung v1: Manuelle Eingabe der Versicherungsnummer (Honour System, keine harte Prüfung)
- Versicherungsbestätigung Zielzustand (v2+): Foto-Upload der Versichertenkarte mit OCR-Validierung
- Profilseite: Bearbeitung aller Felder, Übersicht gesendeter Anfragen

**Acceptance Criteria:**
- [ ] Registrierung ohne Versicherungsangabe nicht abschließbar
- [ ] E-Mail-Verifikation per Bestätigungslink vor erster Nutzung der Anfragefunktion
- [ ] Versicherungsnummer wird verschlüsselt gespeichert, nie im Klartext in Logs oder UI
- [ ] Profilseite zeigt klar: welche Daten gespeichert sind, wie sie genutzt werden (DSGVO-Transparenz)

#### 4.1.7 Praxis-Portal (Registrierung & Inbox)

**Verhalten:**
- Registrierung: Praxisname, Adresse, Fachrichtung(en), Kontaktdaten, Öffnungszeiten
- Datenschutz-Einstellung: Toggle „Kontaktdaten öffentlich anzeigen" (Default: aus)
  - Aus → nur LLM-E-Mail an hinterlegte Adresse und/oder Formular möglich
  - An → Kontaktdaten direkt sichtbar (nach Nutzer-Login)
- Anfragen-Inbox: Liste eingehender Terminanfragen mit Patientenname (anonymisiert: Vorname + erster Buchstabe Nachname), Zeitraumwunsch, Anliegen
- Antwortoptionen: Termin anbieten (Datum + Uhrzeit), ablehnen (mit optionalem Hinweis), weiterleiten

**Acceptance Criteria:**
- [ ] Kontaktdaten-Toggle ist beim Onboarding explizit zu setzen (kein impliziter Default ohne Nutzerentscheidung)
- [ ] Eingehende Anfragen enthalten keine vollständigen Patientendaten — nur die für die Terminvergabe relevanten Felder
- [ ] Antwort auf eine Anfrage löst automatisch eine Benachrichtigung an den Patienten aus (E-Mail)
- [ ] Praxis kann Verfügbarkeit in Profil angeben (z.B. „Nimmt keine Neupatienten an") — wird in Suchergebnissen angezeigt

---

### 4.2 Data & Business Logic

#### Crawler-Logik

- **Quellen (kombiniert):**
  - Öffentliche APIs: Google Maps Places API (Praxisname, Adresse, Öffnungszeiten, ggf. Telefon), KBV-Arztsuche (LANR, Fachgebiet, Adresse)
  - Web Scraping: Jameda, Doctolib, Praxiswebsites (Kontaktseiten) — für E-Mail-Adressen und zusätzliche Infos
- **Crawler-Priorität:** Registrierte Praxis-Daten überschreiben gecrawlte Daten immer
- **Aktualität:** Gecrawlte Daten werden mit Timestamp versehen; Praxen können Daten selbst korrigieren
- **Rate Limiting:** Crawler operiert innerhalb der ToS der jeweiligen Quelle; Scraping-Verhalten respektiert `robots.txt`

> ⚠️ Rechtliche Prüfung erforderlich: Scraping von Jameda und ähnlichen Plattformen muss auf ToS-Konformität geprüft werden.

#### Kontaktkanal-Logik (Fallback-Kette)

```
Registrierte Praxis mit öffentlicher E-Mail → LLM-E-Mail + Formular + direkte Anzeige
Registrierte Praxis, anonym               → LLM-E-Mail (an hinterlegte Adresse) + Formular
Gecrawlte Praxis mit E-Mail               → LLM-E-Mail + direkte Anzeige
Gecrawlte Praxis, nur Telefon             → Direkte Anzeige (manuell durch Nutzer)
Gecrawlte Praxis, kein Kontakt gefunden   → Hinweis + Formular (falls Praxis Webseite hat)
```

#### LLM-Anfrage-Logik

- Modell generiert E-Mail-Entwurf auf Basis von: Patientenname, Versicherungsart, Wunschzeitraum, Freitext-Anliegen
- Entwurf wird dem Nutzer zur Prüfung vorgelegt — kein automatisches Senden ohne Bestätigung
- Keine Diagnoseinformationen werden in den Prompt eingespeist
- Sprache der generierten E-Mail: Deutsch (v1)

#### Anfrage-Status-Maschine

```
GESENDET → ANTWORT_ERHALTEN → TERMIN_BESTÄTIGT
                            → ABGELEHNT
         → KEINE_ANTWORT (automatisch nach 14 Tagen ohne Rückmeldung)
```

#### GKV/PKV-Filterlogik

- Nutzer-Versicherungsart wird bei der Suche als Filter angeboten
- Praxen können im Portal angeben, welche Versicherungsarten sie annehmen
- Gecrawlte Praxen: Versicherungsart TBD (öffentlich oft nicht maschinenlesbar)

---

### 4.3 Admin / CMS

> ⚠️ v1: Kein vollständiges Admin-Panel geplant. Grundlegende Admin-Funktionen:

- Manuelle Praxis-Verifizierung (Freischaltung nach Registrierung)
- Crawler-Job-Monitoring: Status, Fehler, letzte Ausführung
- Reporting: Anzahl Anfragen, registrierte Praxen, Nutzer (aggregiert, kein Personenbezug)
- Datenpflegetool: Manuelle Korrektur gecrawlter Praxisdaten

---

### 4.4 Backend / API Requirements

**PM-Ebene (Business Logic):**

| Bereich | Anforderung |
|---------|------------|
| Suche | Facharztpraxen nach Region (Geocoding), Fachrichtung, Versicherungsart und Radius filtern und sortieren |
| Crawler | Hintergrund-Job: neue Praxen erfassen, bestehende aktualisieren; Quelle und Timestamp je Datensatz speichern |
| Kontaktaufnahme | E-Mail-Versand via LLM (Entwurf → Nutzerbestätigung → Senden); Formular-Weiterleitung; Rate Limiting je Nutzer |
| Anfragen-Management | Status-Tracking; automatischer Status-Wechsel nach 14 Tagen ohne Praxisantwort; Benachrichtigungs-E-Mails |
| Authentifizierung | Nutzer-Auth (Patient + Praxis getrennte Rollen); E-Mail-Verifikation; Session-Management |
| Datenschutz | Verschlüsselte Speicherung sensibler Felder; Lösch-API (DSGVO Art. 17); Audit-Log für Datenzugriffe |

> ⚠️ Technische Details (API-Design, Datenbankschema, Caching, externe Services) werden vom Dev Lead ergänzt.

---

### 4.5 Lokalisierung

- v1: Deutsch vollständig
- Architektur: i18n-fähig (z.B. i18next oder äquivalent) — alle Strings externalisiert, keine Hard-coded Texte
- Zukünftige Sprachen: Englisch als erste Erweiterung (relevant für internationale Zielgruppe)
- Datums- und Adressformate: Deutsch / DE-Standard

---

## 5. Analytics

### 5.1 Tracking Events (v1 — Minimalset)

| Event | Trigger | Zweck |
|-------|---------|-------|
| `search_submitted` | Nutzer startet Suche | Suchvolumen, häufige Fachrichtungen |
| `search_result_empty` | Keine Ergebnisse gefunden | Datenlücken identifizieren |
| `contact_mode_selected` | Nutzer wählt Kontaktkanal | Kanalnutzung verstehen |
| `request_sent` | Anfrage abgeschickt | Kernmetrik: Abschlussrate |
| `request_confirmed` | Termin angenommen | Erfolgsrate end-to-end |
| `practice_registered` | Neue Praxis registriert | Wachstum Praxis-Seite |

> Alle Events ohne Personenbezug; keine Gesundheitsdaten in Analytics-Payload.

---

## 6. Non-Functional Requirements

### 6.1 Performance

- Suchanfrage: Antwort < 2 Sekunden (p95) bei bis zu 500 gleichzeitigen Nutzern
- Seitenaufbau (LCP): < 2,5 Sekunden auf durchschnittlicher Mobilverbindung
- LLM-Entwurfsgenerierung: < 10 Sekunden; Ladeindikator während Generierung
- Crawler: Läuft als Hintergrund-Job, kein Impact auf Antwortzeiten der Hauptanwendung

### 6.2 Fallback & Fehlertoleranz

| Szenario | Verhalten |
|----------|-----------|
| Crawler-Datenquelle nicht erreichbar | Job schlägt fehl, Retry nach Intervall; bestehende Daten bleiben gültig |
| LLM-Service nicht erreichbar | Fehlermeldung + Fallback auf manuelles Formular |
| E-Mail-Versand fehlgeschlagen | Retry (3x), danach Fehlerbenachrichtigung an Nutzer + Status „Fehler" im Dashboard |
| Praxis antwortet nicht in 14 Tagen | Automatischer Status-Wechsel + Hinweis-E-Mail an Patient |
| Kein Suchergebnis | Erklärender Empty State mit konkreten Handlungsoptionen (Radius erweitern, andere Fachrichtung) |

### 6.3 Sicherheit & Datenschutz

- **DSGVO Art. 9:** Gesundheitsbezogene Daten (Versicherungsart, Anfrageninhalt) mit erhöhten Schutzmaßnahmen
- **DSFA:** Datenschutz-Folgenabschätzung nach Art. 35 DSGVO vor Go-Live zwingend erforderlich
- **Datensparsamkeit:** Keine Diagnosedaten erfassen; Freitextfelder mit explizitem Hinweis auf Datensparsamkeit
- **Verschlüsselung:** Sensible Felder (Versicherungsnummer, Kontaktdaten) at rest verschlüsselt (AES-256 oder äquivalent); Transport via TLS 1.3
- **Kontaktdaten-Schutz:** Praxis-E-Mail/Telefon niemals im Frontend-Payload wenn anonym konfiguriert; serverseitige Weiterleitung
- **Rate Limiting:** Anfragen pro Nutzer begrenzt (z.B. max. 20 Anfragen / Tag); Anti-Spam-Maßnahmen
- **Authentifizierung:** Passwörter gehasht (bcrypt/argon2); Session-Tokens kurzlebig; CSRF-Schutz
- **Audit-Log:** Alle Datenzugriffe auf personenbezogene Daten protokolliert
- **Löschrecht:** DSGVO Art. 17 — vollständige Datenlöschung auf Nutzerantrag innerhalb von 30 Tagen

### 6.4 Accessibility

- WCAG 2.1 AA als Zielstandard
- Alle interaktiven Elemente per Tastatur navigierbar
- ARIA-Labels für Icons und Status-Badges
- Kontrastanforderungen eingehalten (besonders Status-Farbkodierung im Dashboard)

---

## 7. Launch Strategy

| Field | Content |
|-------|---------|
| Rollout | Geschlossener Testbetrieb (PoC); kein öffentlicher Launch in v1 |
| Abhängigkeiten | Crawler-Datenqualität validiert; DSGVO-Prüfung abgeschlossen; E-Mail-Versandinfrastruktur aufgesetzt |
| Rechtsberatung | Vor Go-Live: DSFA, Scraping-ToS, Impressumspflicht, ggf. Heilmittelwerbegesetz |
| Rollback | Feature Flags je Modul (Crawler, LLM-Anfrage, Praxis-Portal) — Module einzeln deaktivierbar |
| Zieldatum | TBD |

---

## Responsibility Matrix

| Section | PM/Autor | Design | Dev |
|---------|:--------:|:------:|:---:|
| 1. Revision History | R | — | — |
| 2. Background | R | C | I |
| 3. Overview | R | C | I |
| 4.0 User Flows | R | C | C |
| 4.1 Frontend | R | R | C |
| 4.2 Data/Business Logic | R | I | C |
| 4.3 Admin/CMS | R | C | C |
| 4.4 Backend (Business) | R | I | C |
| 4.4 Backend (Technical) | I | I | R |
| 4.5 Lokalisierung | R | C | C |
| 5.1 Analytics | R | I | C |
| 6.1 Performance | C | I | R |
| 6.2 Fallback | C | I | R |
| 6.3 Sicherheit & Datenschutz | R | I | R |
| 6.4 Accessibility | C | R | C |
| 7. Launch | R | I | C |

R = verantwortlich · C = konsultiert · I = informiert