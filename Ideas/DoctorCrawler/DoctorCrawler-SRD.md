# SRD — DoctorCrawler

> Version: V0.1  
> Date: 2026-08-04  
> Author: Samuel Zink  

---

## 1. Customer

**Primäre Nutzer (Patienten-Seite):**
- Berufstätige, die tagsüber zu Öffnungszeiten nicht erreichbar sind
- Internationale Personen mit Sprachbarrieren oder Unvertrautheit mit dem deutschen Gesundheitssystem
- Erstpatienten ohne bestehende Patientenakte
- Allgemein: Menschen, die den aktuellen Prozess der Facharztsuche als zu aufwändig oder abschreckend empfinden

**Sekundäre Nutzer (Praxis-Seite):**
- Facharztpraxen und deren Sprechstundenhilfen / Verwaltungspersonal
- Praxen, die Terminkommunikation vereinfachen möchten, ohne ihr bestehendes System zu ersetzen

**Struktur:** Zweiseitiger Marktplatz (Two-sided Platform). Der Wert für Patienten steigt mit der Anzahl teilnehmender Praxen — und umgekehrt. Die Plattform muss daher beide Seiten gleichzeitig adressieren.

---

## 2. Job to be Done

**Patient:** Mit minimalem Aufwand passende Facharztpraxen in der Nähe finden und dort eine Terminanfrage stellen — ohne Recherche, Warteschleife oder Anruf während der Arbeitszeit.

**Praxis:** Eingehende Terminanfragen strukturiert und mit wenig Zusatzaufwand verwalten — als Ergänzung zum bestehenden Praxisalltag, nicht als Ersatz.

---

## 3. Benefit

### 3.1 Nutzernutzen (Patient)

- Drastische Reduktion von Zeit und Frustration bei der Facharztsuche
- Kein Anrufen während der Arbeitszeit notwendig
- Barrierearme Nutzung (Sprache, Prozess) für internationale Personen
- Zentrales Tracking aller Anfragen und Rückmeldungen in einer Übersicht
- Der gesamte Weg von „Ich brauche Hilfe" bis zum feststehenden Termin wird so reibungslos wie möglich gestaltet

### 3.2 Nutzernutzen (Praxis)

- Strukturierter Eingang von Terminanfragen statt unkoordinierter Anrufe
- Weniger Telefonbereitschaft notwendig
- Klarer Anreiz zur Registrierung: weniger Koordinationsaufwand, mehr Kontrolle
- Anonyme Kontaktoption schützt vor Werbe-Spam bei gleichzeitiger Erreichbarkeit

### 3.3 Gesellschaftlicher Wert (Company / Mission)

Die Plattform wird als gemeinnütziges Projekt betrieben. Monetarisierung ist für v1 bewusst ausgeklammert. Der primäre Wert liegt in der Verbesserung der Zugänglichkeit medizinischer Versorgung — insbesondere für vulnerable Gruppen. Langfristig bildet die Plattform die Basis für eine volldigitale, praxisseitig nutzbare Terminverwaltungslösung.

> ⚠️ TBD — Trägerschaftsmodell (Einzelperson, Verein, gGmbH) und mögliche Fördermodelle (z.B. Krankenkassen, öffentliche Hand) noch ungeklärt.

### 3.4 Markenpositionierung

DoctorCrawler positioniert sich als **neutraler, gemeinnütziger Middleware-Layer** — kein Konkurrent zu Praxissystemen, kein Werbeplattform, keine Provisionslösung. Vertrauen ist der zentrale Markenwert: bei Patienten (Datenschutz, Transparenz) wie bei Praxen (kein Mehraufwand, keine Abhängigkeit).

---

## 4. Problem

Die Suche nach einem Facharzttermin ist in Deutschland ein manueller, mehrstufiger Prozess mit mehreren Bruchstellen:

1. **Recherche:** Es gibt keine einheitliche, vollständige und aktuelle Quelle für Facharztpraxen in einer Region mit Verfügbarkeitsinformationen.
2. **Kontaktaufnahme:** Praxen sind häufig nur telefonisch erreichbar — zu Zeiten, in denen Berufstätige arbeiten. E-Mail-Adressen sind oft nicht öffentlich, um Spam zu verhindern.
3. **Absagen & Wartezeiten:** Die Rücklaufquote auf Anfragen liegt außerhalb der Kontrolle des Patienten. Lange Wartezeiten und Absagen sind bei Neupatienten häufig.
4. **GKV/PKV-Asymmetrie:** Privatpatienten erhalten häufig schneller Termine. Die Versicherungsart beeinflusst die Erfolgswahrscheinlichkeit erheblich.
5. **Fehlende Koordination auf Praxisseite:** Praxen verwalten Terminanfragen per Telefon und intern — ohne standardisierten digitalen Kanal.

**Resultat:** Der Prozess ist so abschreckend, dass viele Menschen die Suche abbrechen, bevor sie begonnen haben — mit direkten Folgen für die Gesundheitsversorgung.

**Bestehende Lösungen (Benchmark):** Doctolib, Jameda und ähnliche Plattformen setzen auf vollautomatische Terminvergabe als Ersatz praxisinterner Systeme. Das erfordert hohe Integrationsbereitschaft von Praxen und ist flächendeckend nicht verfügbar. DoctorCrawler setzt bewusst früher an: als Middleware für Kontaktaufnahme — ohne Systemintegration als Voraussetzung.

---

## 5. Solution

### 5.1 Benchmark-Analyse

| Plattform | Ansatz | Stärke | Schwäche |
|-----------|--------|--------|----------|
| Doctolib | Vollautomatische Terminvergabe, Kalenderintegration | Nahtlos für Praxen die mitmachen | Hohe Einstiegshürde, nicht flächendeckend |
| Jameda | Bewertungsportal + Terminbuchung | Große Reichweite | Fokus auf Marketing für Praxen, nicht auf Patientenbedürfnis |
| KV-Terminservicestellen | Kassenärztlich organisierte Terminvermittlung | Flächendeckend | Telefonbasiert, langsam, nur bestimmte Fälle |
| **DoctorCrawler** | Middleware: Suche + Kontaktaufnahme, keine Systemintegration nötig | Keine Abhängigkeit von Praxisintegration, privacy-first | Rücklaufrate nicht kontrollierbar |

### 5.2 Before / After

| Dimension | Heute (Before) | Mit DoctorCrawler (After) |
|-----------|---------------|--------------------------|
| Praxisrecherche | Manuell, lückenhaft, zeitaufwändig | Automatisiert, gefiltert nach Region, Fachgebiet, Versicherungsart |
| Kontaktaufnahme | Anruf zu Öffnungszeiten, oft erfolglos | Anfrage jederzeit per E-Mail / Formular / automatisiert |
| Verwaltung | Keine Übersicht, alles im Kopf | Dashboard: alle Anfragen, Status, Rückmeldungen |
| Praxis-Aufwand | Unstrukturierter Telefoneingang | Strukturierter digitaler Eingang (optional, keine Pflicht) |
| Datenschutz | Kontaktdaten öffentlich oder gar nicht verfügbar | Anonymisierte Kontaktierung möglich |

### 5.3 Scope (v1 — erstes produktionsreifes Release)

| In Scope | Out of Scope |
|----------|-------------|
| Automatisierte Suche nach Facharztpraxen (Crawler + öffentliche Quellen) | Automatisierte Telefonanrufe |
| Filterung nach Region, Fachgebiet, Entfernung, GKV/PKV | Vollautomatische Terminvergabe / Kalenderintegration |
| Terminanfrage via LLM-E-Mail, Kontaktformular, direkte Kontaktanzeige | Bewertungssystem für Praxen |
| Praxis-Registrierung mit Datenschutz-Optionen (anonym / transparent) | Interne Praxis-Verwaltungssoftware |
| Nutzer-Registrierung mit Identitäts- & Versicherungsstatusbestätigung | Monetarisierung jeglicher Art |
| Anfragen-Dashboard für Patienten (Status, Rückmeldungen, Terminbestätigung) | Multi-Sprachen-UI (zunächst Deutsch) |
| DSGVO-konforme Architektur inkl. DSFA | Mobile App (zunächst Web) |

### 5.4 Phasing

| Phase | Scope | Ziel | Abhängigkeit |
|-------|-------|------|-------------|
| **Phase 1 — Crawler MVP** | Automatisierte Praxissuche aus öffentlichen Quellen; Anzeige von Kontaktdaten; manuelle Kontaktaufnahme durch Nutzer | Proof-of-Concept: Ist die Datenbasis brauchbar? Ist der Suchprozess nutzbar? | Keine |
| **Phase 2 — Kontaktautomatisierung** | LLM-gestützte E-Mail-Anfragen; Kontaktformular-Integration; Anfragen-Dashboard für Patienten; Nutzerregistrierung mit GKV/PKV-Bestätigung | Kernprozess vollständig: Suchen → Anfragen → Verwalten | Phase 1 |
| **Phase 3 — Praxis-Onboarding** | Praxis-Registrierung; anonyme Kontaktoption; strukturierter Anfrageeingang für Praxen | Netzwerkeffekt aktivieren: Qualität der Plattform steigt mit Praxisbeteiligung | Phase 2 |
| **Phase 4 — Kalenderintegration** (langfristig) | Anbindung an Praxissoftware / Google Calendar / etc.; volldigitale Terminvergabe | Plattform als vollständige Terminverwaltungslösung für Praxen | Phase 3 + Marktforschung zur Praxisinfrastruktur |

---

## 6. Success Metrics

| Typ | Metrik | Zielwert / Richtung |
|-----|--------|---------------------|
| **Kernmetrik (Patient)** | Abschlussrate: Anteil Nutzer, die eine Anfrage bis zum Versand abschließen | Hoch; Baseline nach Phase 2 etablieren |
| **Kernmetrik (Praxis)** | Anzahl registrierter Praxen | Wachstum über Zeit; regionaler Fokus zuerst |
| **Qualität** | Rücklaufrate: Anteil Anfragen mit Praxisrückmeldung | Beobachtungsmetrik; nicht direkt beeinflussbar |
| **Nutzererlebnis** | Zeit von Suche bis gesendeter Anfrage | Möglichst kurz; qualitativ via User-Tests messbar |
| **Praxisnutzen** | Selbsteinschätzung der Praxen: hat die Plattform den Koordinationsaufwand reduziert? | Qualitativ; via Umfrage nach Registrierung |
| **Reichweite** | Abgedeckte Praxen pro Region (gecrawlt + registriert) | Flächendeckung als Qualitätsindikator |
| **Datenschutz** | Anzahl Datenschutzvorfälle | 0 |

> ⚠️ Konkrete Zielwerte (z.B. X registrierte Praxen in 6 Monaten) sind TBD — abhängig vom Rollout-Modell und ob Pilotregion definiert wird.

---

## 7. Risks & Mitigation

| Risikotyp | Beschreibung | Gegenmaßnahme |
|-----------|-------------|--------------|
| **Regulatorisch** | DSGVO Art. 9: Gesundheitsdaten unterliegen höchster Schutzstufe; DSFA nach Art. 35 vermutlich Pflicht | Privacy-by-Design von Beginn; externe Rechtsberatung vor Go-Live |
| **Praxis-Adoption** | Praxen sehen keinen Anreiz zur Registrierung; Netzwerkeffekt kommt nicht in Gang | Klarer Mehrwert kommunizieren (weniger Telefon, strukturierter Eingang); kein Zwang zur Integration |
| **Datenbasis** | Gecrawlte Kontaktdaten veraltet, unvollständig, oder nicht vorhanden | Praxis-Registrierung als Qualitätssteigerung; Aktualitätsstempel; Community-Korrekturen |
| **Missbrauch** | Plattform wird für automatisierten Spam an Praxen genutzt | Rate-Limiting; Nutzer-Verifikation; Anfrage-Limits pro Nutzer/Zeitraum |
| **Kanalverfügbarkeit** | E-Mail nicht bei allen Praxen verfügbar; Kontaktformulare technisch heterogen | Mehrkanal-Fallback-Logik; Kontaktformular als strukturierter Default |
| **Abhängigkeit von Praxisrückmeldung** | Rücklaufrate liegt außerhalb der Plattformkontrolle | Transparentes Erwartungsmanagement im UI; Status-Tracking für Nutzer |
| **Technisch** | Crawler-Stabilität bei Änderungen öffentlicher Quellen (Google Maps, Jameda, etc.) | Modulare Crawler-Architektur; manuelle Fallbacks; Praxis-Daten priorisieren |
| **Trägerschaft** | Kein klares Betreibermodell → Betrieb langfristig nicht gesichert | Trägerschaftsfrage früh klären (gGmbH, Förderantrag, etc.) |

---

## 8. Feedback Loops

### 8.1 Stakeholder-Feedback

- **Patienten:** Usability-Tests nach Phase 2; Feedback-Mechanismus im Dashboard
- **Praxen:** Kurze Umfrage nach Registrierung; direkte Interviews in Pilotregion
- **Regulatorik:** Abstimmung mit Datenschutzbeauftragtem vor Go-Live

### 8.2 A/B Testing

> ⚠️ TBD — Für v1 nicht geplant. Potenzielle Hypothesen für Phase 3: Welche Formulierung einer automatisierten Anfrage erzielt höhere Rücklaufrate? Welche Registrierungs-Onboarding-Variante führt zu mehr Praxis-Abschlüssen?

### 8.3 Before/After Daten

- Baseline-Erhebung nach Phase 1: Welche Datenqualität liefert der Crawler?
- Nach Phase 2: Abschlussrate, Anfragen/Nutzer, Zeit bis Anfrage
- Nach Phase 3: Praxiswachstum, Rücklaufrate registrierter vs. gecrawlter Praxen

---

## 9. Product Requirements (Zusammenfassung)

1. **Suchmaschine:** Facharztpraxen nach Region, Fachgebiet, Entfernung, Versicherungsart durchsuchbar
2. **Kontaktaufnahme:** Drei Modi — automatisierte LLM-E-Mail, Kontaktformular, manuelle Anzeige
3. **Anfragen-Dashboard (Patient):** Status aller Anfragen; Rückmeldungen; direkte Terminbestätigung
4. **Praxis-Registrierung:** Selbstverwaltung von Kontaktdaten; Datenschutz-Optionen (anonym/transparent)
5. **Nutzerregistrierung:** Identitäts- & GKV/PKV-Verifikation
6. **Datenschutz-Architektur:** DSGVO Art. 9-konform; kein unnötiges Speichern von Diagnosedaten; DSFA

---

## 10. UI/UX Requirements (Zusammenfassung)

- **Sucheinstieg:** Einfach, schnell, wenige Pflichtfelder — kein Onboarding-Overhead vor der ersten Suche
- **Ergebnisdarstellung:** Karte + Liste; klare Distanzangabe, Versicherungsart-Filter, Kontaktmöglichkeiten auf einen Blick
- **Kontaktauswahl:** Klar unterscheidbare Modi; Nutzer versteht sofort, was passiert wenn er eine Option wählt
- **Dashboard:** Strukturiert, übersichtlich; Status je Anfrage auf einen Blick; Terminbestätigung mit einem Klick
- **Praxis-Portal:** Intuitiv für Nicht-Techniker; minimaler Onboarding-Aufwand; klare Datenschutz-Einstellungen
- **Sprache:** Zunächst Deutsch; Architektur sollte i18n-fähig sein für spätere Erweiterung