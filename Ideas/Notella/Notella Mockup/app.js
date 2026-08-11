/**
 * Einstiegspunkt des Mockups.
 *
 * Startet die App und zeigt Ladefehler im UI statt nur in der Konsole —
 * bei einem Mockup, das per Datei-Server läuft, ist ein stiller weißer
 * Bildschirm die häufigste Fehlerquelle.
 */
import { NotellaMockupApp } from './core/app.js';

function showFatalError(error) {
  console.error('Notella Mockup: Start fehlgeschlagen', error);
  const stage = document.getElementById('content-area');
  if (!stage) return;
  stage.innerHTML = `
    <div style="padding:40px;text-align:center;color:#c8553d">
      <h2>Die Anwendung konnte nicht geladen werden</h2>
      <p style="font-size:12px;color:#8b8d97">${error.message}</p>
    </div>
  `;
}

try {
  // Global, weil die Screens ihre Knöpfe über Inline-Handler verdrahten.
  window.app = new NotellaMockupApp();
} catch (error) {
  showFatalError(error);
}
