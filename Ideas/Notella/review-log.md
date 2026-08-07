# Review-Log — Requirements Notella

## Durchgang 1 — 2026-08-07 (Problem Framing, PRD V0.2, SRD V0.1)

### Multi-Rollen-Review

**🎯 Produkt**

| Prüfpunkt | Befund |
|-----------|--------|
| Problem klar? | ✅ Fünf benannte Probleme mit zwei konkreten Schmerzmomenten |
| Kennzahlen messbar? | ✅ Drei Kernkennzahlen mit Zielwerten, sieben Beobachtungskennzahlen mit Erhebungsweg |
| Scope abgegrenzt? | ✅ In/Out-Tabelle mit 14 Zeilen, dazu V1.0/V1.1/V2-Phasierung |
| Nutzerwert belegt? | ✅ Sechs Nutzenpunkte, jeweils an einen Mechanismus gekoppelt |
| **Lücke** | ⚠️ Keine Baseline-Erhebung durchgeführt. §8.3 des SRD definiert sie, aber sie muss **vor** dem ersten Einsatz stattfinden, sonst ist der Vorher/Nachher-Vergleich verloren |
| **Lücke** | ⚠️ Der Umfang bleibt auch nach dem Schnitt groß (~138 PT). O-08 ist die wichtigste offene Produktentscheidung |

**🎨 Design**

| Prüfpunkt | Befund |
|-----------|--------|
| Szenarien konkret genug? | ✅ Hauptfluss über 12 Schritte mit Verzweigungen und Datenübergabe |
| Zustände abgedeckt? | ✅ Laden / Leer / Fehler / Keine Berechtigung als Pflicht je Screen; Leerzustandstexte je Screen benannt |
| Responsives Verhalten? | ✅ Drei Breakpoints mit konkretem Verhalten je Kernscreen |
| Barrierefreiheit? | ✅ ARIA-Combobox, Tastaturbedienung, Kontrast, keine reine Farbcodierung |
| **Lücke** | ⚠️ Keine visuelle Sprache definiert (Typografie, Farbe, Dichte, Icons) — bewusst dem Mockup vorbehalten |
| **Lücke** | ⚠️ Nicht spezifiziert, wie sich ein Preset-*Wechsel* für Nutzende anfühlt — derzeit ausgeschlossen (O-05), aber die Erwartung ist ungeprüft |
| **Lücke** | ⚠️ Onboarding beim allerersten Login ist nicht beschrieben. Die Kernkennzahl „< 3 Min bis zur ersten strukturierten Notiz" hängt genau daran |

**🔧 Engineering**

| Prüfpunkt | Befund |
|-----------|--------|
| Datenmodell klar? | ✅ Neun Kernobjekte, Gültigkeitsbereiche, Ablageentscheidung O-02 begründet |
| Schnittstellen benannt? | 🟡 Fachlich vollständig, technisch bewusst offen — gehört in die Feature-Spezifikationen (O-09) |
| Nichtfunktionale Anforderungen? | ✅ Leistung, Ausfallsicherheit, Barrierefreiheit, Sicherheit mit konkreten Zielwerten |
| Technische Risiken? | ✅ Fünf technische Risiken, jedes mit Gegenmaßnahme; zwei davon architektonisch gelöst (§11.3, §11.4) |
| Aufwand einschätzbar? | ✅ Nach Position aufgeschlüsselt, mit Wochenumrechnung und Notausgang |
| **Lücke** | ⚠️ Kein Sicherungs-/Wiederherstellungskonzept für Self-Hoster — bei einem Werkzeug, dessen Wert kumulativ wächst, ist Datenverlust der schlimmste Fall. Gehört in V1.0, nicht in V2 |
| **Lücke** | ⚠️ Keine Ratenbegrenzung für den Live-Feed spezifiziert (viele Teilnehmende × häufiges Autosave) |
| **Lücke** | ⚠️ Teststrategie nur implizit (Feldtyp-Prüfmatrix, Sichtbarkeitstests). Kein explizites Kapitel |

### Retrospektive

**Dünnste Abschnitte und warum**

1. **Markenwirkung (SRD §3.3)** — als TBD markiert. Für ein self-hosted Open-Source-Vorhaben
   ohne Marktziel gibt es dazu ehrlicherweise nichts zu sagen. Bewusste Lücke, kein Versäumnis.
2. **A/B-Testing (SRD §8.2)** — nicht anwendbar bei einstelliger Nutzerzahl. Durch die
   Telemetrie-Verhältnisse ersetzt.
3. **Schnittstellen-Verträge (PRD §4.6)** — bewusst auf die fachliche Ebene beschränkt,
   weil die Detailtiefe in eigene Feature-Spezifikationen gehört (Wunsch des Autors).
4. **Onboarding-Fluss** — nicht spezifiziert, obwohl eine Kernkennzahl daran hängt. Echte
   Lücke, im Screen-Inventar nachzuholen.
5. **Sicherung und Wiederherstellung** — echte Lücke, siehe Engineering-Befund.

**Welche Fragen hätten früher gestellt werden sollen**

| Was zu spät kam | Wirkung | Lehre |
|-----------------|---------|-------|
| Die Frage nach dem Beachhead (Business vs. TableTop) kam erst in Runde 4 | Die ersten drei Runden argumentierten implizit aus der TableTop-Perspektive, weil das Vorgängerdokument von dort kam | Bei einem Abstraktions-Vorhaben zuerst fragen: „für wen muss es zuerst gut sein?" — das ordnet alle weiteren Antworten |
| Die Frage nach dem realen Zeitfenster wurde nie gestellt | Der V1-Umfang wurde festgelegt, bevor bekannt war, wie viel Zeit tatsächlich zur Verfügung steht. Deshalb steht O-08 jetzt offen | Bei Solo-Vorhaben gehört „wie viel Zeit hast du wirklich?" in die erste Fragerunde, nicht in die Risikobetrachtung |
| Die Rückfrage zur Hierarchie-Tiefe brauchte zwei Runden | Erste Antwort („konfigurierbare Tiefe") war mit „Breakout-Gruppen" begründet — ein Bedarf, den fixe Tiefe bereits deckt | Wenn eine Anforderung mit einem *Beispiel* begründet wird, das Beispiel gegen die einfachere Option prüfen, bevor die komplexere übernommen wird. Hat hier gut funktioniert und sollte Standard sein |
| Der Participant-Scope wurde als Konflikt behandelt, war aber keiner | Eine überflüssige Runde plus ein unnötiges Preset-Flag im PRD-Entwurf | Vor dem Vorschlagen eines Konfigurationsschalters prüfen, ob die einfachere Regel („mehrere Profile erlaubt") den Fall schon abdeckt. Schalter sind teurer als sie aussehen |

**Was gut lief**

- Die Entscheidungstabelle E-01…E-12 macht jede Festlegung im Nachhinein auffindbar und
  begründbar — nützlich für die Verteidigung des Abschlussvorhabens.
- Technische Risiken wurden nicht nur benannt, sondern zwei davon (Feldablage,
  Positionsstabilität der Erwähnungen) direkt im SRD architektonisch entschieden.
- Der Notausgang „Kern-Demo" gibt dem Vorhaben einen definierten Mindesterfolg.
