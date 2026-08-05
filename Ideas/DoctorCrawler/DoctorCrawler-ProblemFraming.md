# Problem Framing — DoctorCrawler

## Problem Statement

In Deutschland stellt die Suche nach einem Facharzttermin für viele Menschen eine erhebliche Belastung dar — insbesondere für Berufstätige, die während der Praxis-Öffnungszeiten arbeiten, sowie für internationale Personen mit sprachlichen Hürden. Wer einen Facharzt braucht, muss heute in mehreren Schritten vorgehen: zunächst eigenständig Praxen recherchieren, Kontaktdaten zusammentragen, dann wiederholt anrufen — oft ohne Erfolg, mit langen Warteschleifen und Absagen. Als Erstpatient ohne bestehende Akte verschlechtert sich die Situation zusätzlich. Das eigentliche Problem ist nicht das Gesundheitssystem an sich, sondern das Fehlen einer niedrigschwelligen Schnittstelle zwischen Suchenden und Praxen: ein Middleware-Layer, der die Kontaktaufnahme vereinfacht, ohne das praxisinterne Terminvergabesystem zu ersetzen. DoctorCrawler soll diese Lücke schließen — als gemeinnützige Plattform, die das Recht auf Zugang zu medizinischer Versorgung für alle zugänglicher macht.

---

| Field | Description |
|-------|-------------|
| **WHO** | Primär: Personen in Deutschland, die einen Facharzttermin suchen — insbesondere Berufstätige (eingeschränkte Erreichbarkeit tagsüber), Internationals (Sprachbarrieren, Unvertrautheit mit dem System) und Erstpatienten ohne bestehende Patientenakte. Sekundär: Facharztpraxen, die als kooperative Partner in die Plattform eingebunden werden. |
| **WHAT Problem** | Die Terminsuche bei Fachärzten ist heute ein manueller, mehrstufiger Prozess: (1) Praxen recherchieren (oft lückenhafte oder veraltete Daten online), (2) Kontaktdaten heraussuchen — häufig gar nicht öffentlich zugänglich, (3) zu Öffnungszeiten anrufen, (4) Absagen oder sehr lange Wartezeiten hinnehmen. Als Erstpatient ist die Hürde noch höher. Praxen veröffentlichen Kontaktdaten teils bewusst nicht, um Werbe-Spam zu vermeiden. Bestehende Plattformen (Doctolib, Jameda) setzen auf vollautomatische Terminvergabe als Ersatz praxisinterner Systeme — was eine hohe Einstiegshürde für Praxen bedeutet und flächendeckend nicht verfügbar ist. |
| **WHEN** | Wenn eine Person einen Facharzt aufsuchen muss und nicht weiß, welche Praxen in der Nähe verfügbar, erreichbar und für Neupatienten offen sind — und dann versucht, Kontakt aufzunehmen. |
| **WHAT Job** | Mit möglichst wenig Aufwand herausfinden, welche Facharztpraxen in der Region in Frage kommen, und dort eine Terminanfrage stellen — ohne selbst recherchieren, anrufen oder warten zu müssen. |
| **WHAT benefits for the customer** | Deutlich reduzierter Zeitaufwand und Frustration bei der Terminsuche. Keine Notwendigkeit, während der Arbeitszeit anzurufen. Barrierearme Nutzung auch für Nicht-Muttersprachler. Zentrales Tracking aller laufenden Anfragen und Rückmeldungen. |
| **WHAT benefits for the company** | Gemeinnütziger Impact: Verbesserung der Zugänglichkeit medizinischer Versorgung — besonders für vulnerable Gruppen. Monetarisierungsstrategie bewusst ausgeklammert (v1); Plattform wird als Public Good positioniert. Langfristig: strategische Basis für eine volldigitale Terminverwaltungslösung, sobald Praxis-Adoption ausreichend ist. |

---

## Scope-Abgrenzung (v1 — erstes produktionsreifes Release)

**In Scope:**
- Automatisierte Suche nach Facharztpraxen anhand von Fachrichtung, Standort und Rahmenbedingungen (Entfernung, GKV/PKV)
- Darstellung von Praxisinformationen inkl. verfügbarer Kontaktdaten
- Terminanfrage via: (a) automatisierte LLM-E-Mail, (b) Kontaktformular, (c) Anzeige direkter Kontaktdaten für manuelle Kontaktaufnahme
- Praxis-Registrierung mit Option zur anonymen Kontaktierung (kein Datenleak von E-Mail/Telefonnummer)
- Nutzer-Registrierung mit Identitäts- und Versicherungsstatusbestätigung (GKV/PKV)
- Ergebnisübersicht: Status aller gestellten Anfragen, Möglichkeit zur direkten Bestätigung passender Terminangebote

**Out of Scope (v1):**
- Vollautomatische Terminvergabe / Kalenderintegration in Praxissysteme
- Telefonische Kontaktaufnahme (automatisiert oder manuell via Plattform)
- Monetarisierung

---

## Risiken & Fallstricke

| Risiko | Beschreibung | Mitigation |
|--------|-------------|------------|
| **Praxis-Kooperation** | Viele Praxen publizieren Kontaktdaten bewusst nicht; Rücklaufquote auf Anfragen nicht kontrollierbar | Praxis-Registrierung mit klaren Datenschutz-Optionen; Crawler nur als Fallback |
| **Kontaktkanal-Verfügbarkeit** | E-Mail nicht flächendeckend verfügbar; automatisierte Anrufe technisch möglich aber unerwünscht | Mehrkanal-Ansatz; automatisierte Anrufe explizit Out of Scope für v1 |
| **DSGVO Art. 9** | Gesundheitsdaten sind besondere personenbezogene Daten — höchste Schutzstufe | Privacy-by-Design-Architektur zwingend; kein unnötiges Speichern von Diagnosedaten; Anonymisierungsoption für Praxen |
| **Datenleak Praxis-Kontaktdaten** | Kontaktdaten könnten für Werbe-Spam missbraucht werden | Opt-in für Datensichtbarkeit; anonyme Kontaktierung als Default-Option für registrierte Praxen |
| **Qualität der gecrawlten Daten** | Veraltete oder falsche Praxisdaten aus öffentlichen Quellen | Praxis-seitige Datenpflege über Registrierung; Aktualitätsmarkierung |

---

## Regulatorisches Umfeld

- **DSGVO Art. 9** (besondere Kategorien personenbezogener Daten): Gesundheitsbezogene Anfragen fallen hierunter — explizite Einwilligung, Zweckbindung und Datensparsamkeit sind Pflicht.
- **GKV/PKV-Unterscheidung**: Praxen dürfen Privatpatienten bevorzugen; die Plattform muss den Versichertenstatus korrekt erfassen und weitergeben, ohne Diskriminierung zu ermöglichen.
- **Impressumspflicht & Telemediengesetz** (TMG): Als öffentlich zugängliche Plattform anwendbar.
- **Heilmittelwerbegesetz (HWG)**: Relevant falls Praxen Profilinhalte bewerben.

> ⚠️ TBD — Rechtsberatung empfohlen vor Go-Live, insbesondere zu Datenschutz-Folgenabschätzung (DSFA nach Art. 35 DSGVO).