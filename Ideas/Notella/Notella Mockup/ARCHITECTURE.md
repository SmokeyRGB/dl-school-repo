# Notella Mockup Utilities — Architecture Map

## 🗺️ Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA & CONFIG                             │
│  screens.json ─────────────────────────────────────────────────┐ │
│                                                                  │ │
└──────────────────────────────────────────────────────────────│──┘
                                                                 │
                        ┌────────────────┬────────────────┬──────┘
                        │                │                │
                        ▼                ▼                ▼
        ┌──────────────────────┐ ┌─────────────────┐ ┌─────────────┐
        │  RENDER HELPERS      │ │  EDITOR LOGIC   │ │STATE MANAGER│
        │                      │ │                 │ │             │
        │ • tint()             │ │ • checkMention()│ │ • Review    │
        │ • chipSt()           │ │ • analyzeAi()   │ │   Manager   │
        │ • markSt()           │ │ • insertMention │ │ • NavBuilder│
        │ • avSt()             │ │ • acceptAi()    │ │ • Screen    │
        │ • segSt()            │ │ • flipY()       │ │   Manager   │
        │ • createIcon()       │ │ • typeOf()      │ │             │
        │ • shapePath()        │ │ • tintColor()   │ │ Imports:    │
        │                      │ │                 │ │ - tintColor │
        │ Pure styling +       │ │ Imports:        │ │ - markSt    │
        │ DOM utilities        │ │ - tintColor     │ │             │
        │                      │ │ - typeOf (from  │ └─────────────┘
        │ No dependencies      │ │   own module)   │
        └──────────────────────┘ │                 │
                 ▲                │ DOM APIs        │
                 │                │ (getSelection,  │
                 │                │  execCommand)  │
                 └────────────────┴─────────────────┘
                        │
                        │ All export from index.js
                        │
                        ▼
        ┌──────────────────────────────────────┐
        │        utils/index.js                 │
        │  (Central hub with examples)          │
        │                                       │
        │ • Re-exports all utilities            │
        │ • Usage examples & patterns           │
        │ • Integration guide                   │
        │ • Quick reference                     │
        └──────────────────────────────────────┘
                        │
                        │
                        ▼
        ┌──────────────────────────────────────┐
        │    GLOBAL STYLES (CSS)                │
        │    styles/global.css                  │
        │                                       │
        │ • Animations (@keyframes)             │
        │ • Typography                          │
        │ • Base element styles                 │
        │ • Color system (via hex)              │
        └──────────────────────────────────────┘
```

---

## 🔗 Cross-Module Usage

### renderHelpers.js → Used By:
- **editorLogic.js** — Uses `tintColor()` for mention badges
- **stateManager.js** — Uses `markSt()` for nav indicators
- **All components** — Uses styling functions
- **index.js** — Re-exports for convenience

### editorLogic.js → Used By:
- **C1 screen** (Meeting notes editor)
- **Mention popup** (from Popovers component)
- **AI suggestion** (inline suggestion UI)

### stateManager.js → Used By:
- **Parent router** (screen navigation)
- **E1 screen** (Review workflow)
- **NavSidebar** (navigation structure)
- **B3 screen** (Project overview)

### screens.json → Used By:
- **stateManager.js** — ScreenManager queries config
- **Parent router** — Routes between screens
- **breadcrumbs** — Shows screen names
- **devBar** — Lists available screens

### global.css → Used By:
- **All HTML/templates** — Base styling
- **Render helpers** — Animations referenced in styles
- **Components** — Animation names via CSS classes

---

## 🎯 Usage Scenarios

### Scenario 1: Build Meeting Notes Editor (C1 Screen)

```
Editor Component (C1)
  │
  ├─ Import editorLogic.js
  │  ├─ checkMention() → popup position
  │  ├─ analyzeAi() → suggestion data
  │  ├─ insertMention() → badge insertion
  │  └─ acceptAi() → accept suggestion
  │
  ├─ Import renderHelpers.js
  │  ├─ chipSt() → style mention badges
  │  ├─ tint() → background colors
  │  └─ avSt() → avatar styles
  │
  ├─ Link to global.css
  │  └─ @keyframes for animations
  │
  └─ Result: Fully functional meeting notes with:
     • Mention popup with autocomplete
     • AI suggestions
     • Styled badges
     • Keyboard navigation
```

### Scenario 2: Build Review Workflow (E1 Screen)

```
Review Screen (E1)
  │
  ├─ Import stateManager.js
  │  ├─ ReviewManager.decide() → handle decisions
  │  ├─ ReviewManager.ready() → validate fields
  │  └─ ReviewManager.undoLast() → undo decision
  │
  ├─ Import renderHelpers.js
  │  ├─ chipSt() → style review cards
  │  ├─ markSt() → type indicators
  │  └─ avSt() → author avatars
  │
  └─ Result: Fully functional review with:
     • Decision workflow
     • Field validation
     • Progress tracking
     • Styled UI elements
```

### Scenario 3: Build Navigation Sidebar

```
NavSidebar Component
  │
  ├─ Import stateManager.js
  │  └─ NavBuilder.buildNavGroups() → structure
  │
  ├─ Import renderHelpers.js
  │  ├─ createIcon() → nav icons
  │  └─ avSt() → user avatars
  │
  ├─ Import data/screens.json
  │  └─ Screen names for labels
  │
  └─ Result: Dynamic navigation with:
     • Role-based visibility
     • Icon rendering
     • Active state tracking
     • Expandable sections
```

---

## 📊 Data Flow Through Utilities

### When User Types in Editor

```
User Input
    ▼
Editor onInput event
    ▼
[editorLogic] checkMention()
    ├─ Returns mention position OR null
    └─ Uses DOM APIs (getSelection, getRangeAt)
    
If mention found:
    ▼
[renderHelpers] tint(), chipSt()
    ├─ Create mention badge styles
    └─ Return CSS strings
    
If AI suggestion found:
    ▼
[editorLogic] analyzeAi()
    ├─ Analyzes text for patterns
    ├─ Queries preset entities
    └─ Returns suggestion data
    
User accepts (Tab key):
    ▼
[editorLogic] acceptAi()
    ├─ Deletes typed text
    ├─ Inserts styled mention badge
    └─ Uses DOM execCommand()
```

### When User Reviews Items

```
App starts Review mode (E1)
    ▼
[stateManager] ReviewManager initialized
    ├─ Tracks current card index
    ├─ Tracks decisions log
    └─ Tracks field responses (rf)
    
User fills required fields:
    ▼
[stateManager] ReviewManager.ready()
    ├─ Checks if all fields completed
    └─ Returns boolean
    
User makes decision:
    ▼
[stateManager] ReviewManager.decide()
    ├─ Updates reviewIdx
    ├─ Adds to log
    └─ Returns new state
    
User hits "Undo":
    ▼
[stateManager] ReviewManager.undoLast()
    ├─ Reverts reviewIdx
    ├─ Removes from log
    └─ Returns previous state
```

### When App Navigates

```
User clicks navigation item
    ▼
[stateManager] NavBuilder.buildNavGroups()
    ├─ Checks user role (lead/member)
    ├─ Builds nav structure
    └─ Marks current screen active
    
[stateManager] ScreenManager.shouldShow()
    ├─ Checks if screen should be visible
    └─ Returns boolean
    
[data/screens.json] ScreenManager.getScreen()
    ├─ Looks up screen metadata
    └─ Returns chrome type, name
    
Screen renders:
    ▼
[renderHelpers] for styled elements
[editorLogic] for interactions (if editor)
[global.css] for animations
```

---

## 🎨 Styling Pipeline

```
Global Styles (CSS)
        ▼
    global.css
    ├─ @keyframes definitions
    ├─ Base element styles
    ├─ Font stack
    └─ Color reset
        ▼
Component needs a badge
        ▼
[renderHelpers.chipSt()]
    ├─ Takes color (hex)
    ├─ Takes dashed flag
    └─ Returns CSS string with:
       - display:inline-flex
       - background: tinted color
       - border: dashed or solid
       - Animations reference
        ▼
Applied to HTML element
        ▼
Browser renders with:
    ├─ Base styles from global.css
    ├─ Component styles from chipSt()
    └─ Animations from @keyframes
```

---

## 🔄 Circular Dependency Check

✅ **No circular dependencies detected**

- `renderHelpers.js` — Standalone (imports: none)
- `editorLogic.js` — Depends on: `renderHelpers.js` (one-way)
- `stateManager.js` — Depends on: `renderHelpers.js` (one-way)
- `index.js` — Central hub (imports all, no reverse deps)
- `data/` — Configuration (imports: none)
- `styles/` — Styling (imports: none)

**Dependency flow is unidirectional: Helpers → Logic → Managers**

---

## 📦 Import Paths (From Components)

### From a screen component in `components/ScreenB1.html`

```javascript
// Option 1: Import specific utilities
import { chipSt, tint } from '../utils/renderHelpers.js';
import { ReviewManager } from '../utils/stateManager.js';
import screens from '../data/screens.json' assert { type: 'json' };

// Option 2: Import via hub
import {
  chipSt, tint,
  ReviewManager,
  screens: screensConfig
} from '../utils/index.js';

// Link CSS
// <link rel="stylesheet" href="../styles/global.css">
```

### From a utility within utils/

```javascript
// Within editorLogic.js
import { tint, chipSt } from './renderHelpers.js';

// Within stateManager.js
import { markSt } from './renderHelpers.js';
```

---

## ⚡ Performance Implications

### Bundle Size
- Each utility is small (5-6 KB)
- Tree-shaking possible with modern bundlers
- Only import what you use

### Execution
- Functions are pure → no side effects
- Can be parallelized if needed
- Minimal overhead (mostly DOM operations)

### Caching
- Utilities can be cached (long TTL)
- Global CSS cached separately
- Config data can be pre-loaded

---

## 🧪 Testing Strategy

### Unit Tests (Per Module)

```javascript
// test/renderHelpers.test.js
describe('renderHelpers', () => {
  test('tint applies alpha', () => {
    expect(tint('#5340c4', 0.14)).toBe('rgba(83,64,196,0.14)');
  });
});

// test/editorLogic.test.js
describe('editorLogic', () => {
  test('checkMention detects @', () => {
    // Mock document.getSelection()
    // Test mention detection
  });
});

// test/stateManager.test.js
describe('ReviewManager', () => {
  test('decide updates state correctly', () => {
    const mgr = new ReviewManager(preset);
    const newState = mgr.decide(0, cards, state, 'primary');
    expect(newState.reviewIdx).toBe(1);
  });
});
```

### Integration Tests

```javascript
// test/integration.test.js
describe('Meeting Editor Integration', () => {
  test('mention + styling works together', () => {
    const mention = checkMention(state, preset);
    const style = chipSt(typeColor, false);
    expect(mention).toBeDefined();
    expect(style).toContain('background:');
  });
});
```

---

## 📖 Summary

**Key Points:**
1. ✅ Utilities are **pure functions** (mostly)
2. ✅ **One-way dependencies** (no circular)
3. ✅ **Modular** (import only what needed)
4. ✅ **Testable** (easy unit & integration tests)
5. ✅ **Scalable** (easy to add new utilities)

**Next Phase:**
- Create component layer that uses these utilities
- Wire up state management
- Integrate with parent router

---

**Generated:** 2026-08-10 14:32:48 UTC
