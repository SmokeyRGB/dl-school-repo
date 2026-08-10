# Phase 2 - Architecture Structure Fix

## Objective
Fix the sidebar navigation structure to match the original mockup's intended information architecture, properly implementing the three Chrome levels (Start, Orient, Focus) and correcting navigation entries.

## Changes Made

### 1. Fixed Navigation Structure (utils/stateManager.js)
- **Fixed primary navigation target**: Changed "Projekte" section to navigate to B3 (Project Dashboard) instead of B1
- **Added collapsible work groups**: Work groups (Sprints) now support expand/collapse functionality
- **Maintained correct section structure**:
  - Projekte (Project name)
  - Sprints & Meetings (Expandable work groups with nested meetings)
  - Projektwissen (Entries and Relationship Network)
  - Kuration (Review-Inbox) - Lead only
  - Verwaltung (Preset & Settings) - Lead only
  - Deine Teilnahme (Your Participation) - Member only

### 2. Implemented Chrome-Based Sidebar Behavior (index.html)

#### Start Chrome (B1, B2)
- Sidebar completely hidden
- Full width content area

#### Orient Chrome (B3)
- Sidebar always expanded (236px)
- Full navigation visible with all text labels
- Used for project overview/navigation screens

#### Focus Chrome (C1, D2, D5, E1, F3)
- Sidebar collapsed by default (52px icon-only)
- Expands to 236px on hover
- Collapses again when mouse leaves
- Provides immersive content viewing without removing navigation

### 3. Technical Implementation Details

#### Fixed Event Listener Accumulation
- Problem: Event listeners were being added multiple times on each render, causing sidebar to remain expanded
- Solution: Clone and replace the navbar element on each render to remove old listeners
- Result: Clean, predictable hover behavior on Focus screens

#### CSS Updates
- Added nested item styling (`.nav-item-nested`) for meeting entries under work groups
- Added collapsible arrow styling for work group headers
- State dots for meeting status (completed/running/planned)

#### JavaScript Updates
- Implemented `toggleCollapsible()` method to expand/collapse work groups
- Updated `renderNav()` to:
  - Detect chrome type for current screen
  - Show/hide sidebar based on chrome type
  - Apply correct CSS classes (`.open`) based on chrome type
  - Add/remove hover listeners appropriately

## Screen Chrome Mapping

| Screen | Chrome  | Sidebar State | Purpose |
|--------|---------|---------------|---------|
| B1     | Start   | Hidden        | All Projects list - no project selected yet |
| B2     | Start   | Hidden        | Create Project - preset selection |
| B3     | Orient  | Expanded      | Project Dashboard - navigation is primary task |
| C1     | Focus   | Collapsed     | Meeting Room - content immersion |
| D2     | Focus   | Collapsed     | Wiki Article - content immersion |
| D5     | Focus   | Collapsed     | Relationship Graph - content immersion |
| E1     | Focus   | Collapsed     | Review Inbox - content immersion |
| F3     | Focus   | Collapsed     | Settings - content immersion |

## Role-Based Visibility

### Lead
- Full access to all sections including Kuration (Review-Inbox) and Verwaltung (Settings)

### Member
- Access to Projekte, Sprints & Meetings, Projektwissen, and Deine Teilnahme
- No access to Kuration or Verwaltung (for data integrity/workflow)

## Verification Checklist

✅ B1 sidebar is hidden
✅ B3 sidebar is expanded (236px)
✅ C1 sidebar starts collapsed (52px) and expands on hover
✅ D2 sidebar starts collapsed (52px)
✅ E1 sidebar starts collapsed (52px)
✅ F3 sidebar starts collapsed (52px)
✅ Sidebar collapses when mouse leaves (Focus chrome)
✅ Work groups are expandable/collapsible
✅ Meeting entries show state dots (completed/running/planned)
✅ Lead role shows Kuration + Verwaltung sections
✅ Member role shows Deine Teilnahme section
✅ Project name correctly navigates to B3 (not B1)
✅ All nested meetings show correct status indicators

## Files Modified

1. **utils/stateManager.js**
   - Fixed project navigation target (B3 instead of B1)
   - Added `isCollapsible` flag to work group items
   - Maintained correct section labels and hierarchy

2. **index.html**
   - Updated `renderNav()` method to implement chrome-based logic
   - Added CSS for nested items and collapsible headers
   - Implemented proper event listener management
   - Added `toggleCollapsible()` method for work group expansion

## Next Steps

- [ ] Complete screen implementations for B2, D5, F3 (currently placeholder content)
- [ ] Implement interactive mentions system in C1
- [ ] Add AI suggestion workflow
- [ ] Implement merge/combine entity workflow in E1
- [ ] Add preset configuration UI in F3
- [ ] Test all preset configurations (Software/TableTop) thoroughly
