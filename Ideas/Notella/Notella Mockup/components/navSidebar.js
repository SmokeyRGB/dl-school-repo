/**
 * Navigations-Sidebar (Darstellung).
 *
 * Die Struktur der Einträge kommt aus NavBuilder.buildNavGroups(); dieses
 * Modul macht daraus Markup und entscheidet anhand des chrome-Typs, ob die
 * Sidebar sichtbar bzw. dauerhaft offen ist. Ein- und Ausklappen bei Hover
 * erledigt styles/nav.css ohne JavaScript.
 */
import { NavBuilder } from '../utils/stateManager.js';
import { navIcon } from '../utils/icons.js';

const ICON_COLOR_ACTIVE = '#5340c4';
const ICON_COLOR_IDLE = '#7a7c86';

/** Statuspunkt-Farbe eines Meetings. */
function meetingDotColor(state) {
  if (state === 'läuft') return '#5340c4';
  if (state === 'geplant') return '#c9a227';
  return '#c4c3bd';
}

function renderBadge(badge) {
  return badge
    ? `<span class="nav-badge" style="font-size:10.5px;color:#8b8d97">${badge}</span>`
    : '';
}

/** Aufklappbare Arbeitsgruppe (Sprint / Spieltag). */
function renderCollapsible(item) {
  const chevron = navIcon('chev', { color: '#8b8d97', rotate: item.open ? 90 : 0 });
  return `
    <button class="nav-item ${item.on ? 'active' : ''}" onclick="app.toggleCollapsible('${item.label}', event)" title="${item.label}" style="font-size:12.5px">
      <span class="nav-icon">${chevron}</span>
      <span class="nav-label" style="flex:1">${item.label}</span>
      ${renderBadge(item.badge)}
    </button>
  `;
}

/** Meeting unterhalb einer Arbeitsgruppe. */
function renderNestedItem(item) {
  const dot = navIcon('stateDot', { dotColor: meetingDotColor(item.state) });
  const color = item.muted ? '#8b8d97' : (item.on ? '#16161a' : '#5a5c66');
  return `
    <button class="nav-item nav-item-nested ${item.on ? 'active' : ''}" onclick="app.go('${item.screen}')" title="${item.label}" style="font-size:12.5px;color:${color}">
      <span class="nav-icon">${dot}</span>
      <span class="nav-label">${item.label}</span>
    </button>
  `;
}

/** Regulärer Eintrag der obersten Ebene. */
function renderTopItem(item) {
  const icon = navIcon(item.iconName || 'default', {
    color: item.on ? ICON_COLOR_ACTIVE : ICON_COLOR_IDLE
  });
  return `
    <button class="nav-item ${item.on ? 'active' : ''}" onclick="app.go('${item.screen || 'B3'}')" title="${item.label}">
      <span class="nav-icon">${icon}</span>
      <span class="nav-label">${item.label}</span>
      ${renderBadge(item.badge)}
    </button>
  `;
}

function renderItem(item) {
  if (item.isCollapsible) return renderCollapsible(item);
  if (item.depth === 1) return renderNestedItem(item);
  return renderTopItem(item);
}

function renderGroup(group) {
  return `
    <div class="nav-group">
      <div class="nav-group-label">${group.label}</div>
      ${group.items.map(renderItem).join('')}
    </div>
  `;
}

/**
 * Schreibt die Sidebar in das übergebene Element.
 *
 * @param {HTMLElement} el      Container (#nav-sidebar)
 * @param {object} preset       Aktuelles Preset
 * @param {object} state        App-State
 * @param {string} chrome       'start' | 'orient' | 'focus'
 */
export function renderNavSidebar(el, preset, state, chrome) {
  // Einstiegsseiten (B1, B2) haben keine Projekt-Navigation.
  if (chrome === 'start') {
    el.style.display = 'none';
    el.classList.remove('open');
    el.innerHTML = '';
    return;
  }

  el.style.display = 'flex';
  // 'orient' = Überblick, Sidebar bleibt offen. 'focus' = eingeklappt,
  // Aufklappen bei Hover übernimmt das CSS.
  el.classList.toggle('open', chrome === 'orient');

  const groups = NavBuilder.buildNavGroups(preset, state, state.role === 'lead');
  el.innerHTML = groups.map(renderGroup).join('');
}
