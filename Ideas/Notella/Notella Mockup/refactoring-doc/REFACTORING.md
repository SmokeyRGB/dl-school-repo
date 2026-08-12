# Notella Mockup — Refactored Structure

This folder contains the refactored Notella mockup component, split into modular, reusable pieces for better maintainability and development.

## 📁 Directory Structure

```
Notella Mockup/
├── components/          # Screen and layout components
├── utils/              # Shared utility functions
├── data/               # Configuration and screen metadata
├── styles/             # Reusable CSS
├── support.js          # External support library (unchanged)
├── Notella Mockup.dc.html    # Original file (backup)
└── [refactored files]  # Individual modular components
```

## 🗂️ File Organization

### `/data` — Configuration & Metadata

- **`screens.json`** — Screen definitions and routing metadata
  - Maps screen IDs (B1, B2, C1, etc.) to names and chrome type
  - Used for navigation and screen management

### `/styles` — Styling

- **`global.css`** — Global resets, typography, and animations
  - Includes keyframe animations: `npulse`, `nslide`, `nfade`, `nsvgin`, `nshim`
  - Base element styles and utility classes

### `/utils` — Utility Functions

- **`renderHelpers.js`** — Rendering and styling utilities
  - `tint()` — Apply alpha transparency to colors
  - `chipSt()` — Create badge/chip styles
  - `markSt()` — Create indicator marks
  - `avSt()` — Avatar circle styles
  - `segSt()` — Segment/tab button styles
  - `createIcon()` — Generate SVG icons
  - `shapePath()` — Create SVG shapes for graph visualization

- **`editorLogic.js`** — Editor interaction logic
  - `checkMention()` — Detect and parse `@` mentions
  - `analyzeAi()` — Generate AI suggestions for entity recognition
  - `insertMention()` — Insert mention badge into editor
  - `acceptAi()` — Accept AI suggestion
  - `flipY()` — Position popups correctly to avoid overflow
  - Handles mention autocomplete and AI tagging workflows

- **`stateManager.js`** — State management utilities
  - `ReviewManager` — Handles review workflow (decide, undo, ready check)
  - `NavBuilder` — Generates navigation structure from preset
  - `ScreenManager` — Screen visibility and metadata logic

### `/components` — To be created

Will contain individual screen and layout components:
- `NotellaMockup.dc.html` — Parent/router component
- `ScreenB1.dc.html`, `ScreenB2.dc.html`, etc. — Individual screens
- `Header.dc.html`, `NavSidebar.dc.html` — Shared layout components
- `Popovers.dc.html` — Mention and AI suggestion popovers

## 🔄 How the Refactored Code Works

### Original Structure
The original `Notella Mockup.dc.html` (2014 lines) contained:
- HTML markup (screens, components)
- Inline CSS (in `<style>`)
- Large JavaScript class (all logic)
- Preset data (embedded objects)

### Refactored Structure
1. **CSS extracted** → `styles/global.css`
2. **Data extracted** → `data/screens.json`
3. **Utilities extracted** → `utils/` folder
   - Reusable functions are pure and testable
   - No component dependencies
   - Easy to import and use in different contexts
4. **Components to be created** → `components/` folder
   - Each screen as separate `.dc.html` or `.html` file
   - Parent component handles routing and state
   - Child components receive data via props

## 🚀 Migration Path

### Phase 1 ✅ — Utilities & Configuration
- [x] Extract global CSS → `styles/global.css`
- [x] Extract screen metadata → `data/screens.json`
- [x] Extract render helpers → `utils/renderHelpers.js`
- [x] Extract editor logic → `utils/editorLogic.js`
- [x] Extract state management → `utils/stateManager.js`

### Phase 2 — Component Decomposition (Next)
- [ ] Create parent router component
- [ ] Extract screen B1 (all projects)
- [ ] Extract screen B2 (create project)
- [ ] Extract screen B3 (project overview)
- [ ] Extract screen C1 (meeting notes editor)
- [ ] Extract screen D2 (wiki articles)
- [ ] Extract screen D5 (relationship graph)
- [ ] Extract screen E1 (review inbox)
- [ ] Extract screen F3 (preset view)

### Phase 3 — Layout Components (Next)
- [ ] Create Header component
- [ ] Create DevBar component
- [ ] Create NavSidebar component
- [ ] Create Popovers component (mentions, AI suggestions)

### Phase 4 — Integration & Testing (Next)
- [ ] Wire parent-child communication
- [ ] Test screen navigation
- [ ] Validate keyboard shortcuts
- [ ] Performance optimization

## 📝 Usage Examples

### Using Render Helpers

```javascript
import { tint, chipSt, markSt, avSt } from './utils/renderHelpers.js';

// Create a colored badge
const badgeStyle = chipSt('#5340c4', false);

// Create a type indicator
const markStyle = markSt('#3f8f5f', 8);

// Tint a color
const transparentPurple = tint('#5340c4', 0.14);
```

### Using Editor Logic

```javascript
import { checkMention, analyzeAi, insertMention } from './utils/editorLogic.js';

// In editor input handler
const mention = checkMention(state, currentPreset);
const aiSug = analyzeAi(state, currentPreset);

// When user accepts suggestion
if (aiSug) {
  acceptAi(aiSug);
}
```

### Using State Management

```javascript
import { ReviewManager, NavBuilder } from './utils/stateManager.js';

const reviewMgr = new ReviewManager(presets);

// Make a decision
const newState = reviewMgr.decide(
  state.reviewIdx,
  preset.review,
  state,
  'primary'
);

// Build navigation
const navGroups = NavBuilder.buildNavGroups(
  preset,
  state,
  isLeadUser
);
```

## 🔗 Dependencies

### External
- `support.js` — DatoCMS component utilities (unchanged)
- React (for icon creation via JSX)
- Browser APIs: `document.getSelection()`, `execCommand()`, etc.

### Internal
- Utilities import from each other as needed
- No circular dependencies

## 📚 Next Steps

1. **Review this structure** — Ensure it aligns with your needs
2. **Create parent component** — Tie everything together
3. **Extract screens one by one** — Test each independently
4. **Integrate utilities** — Wire up logic to new components
5. **Test in DatoCMS** — Verify in actual environment

## 💡 Benefits of This Refactoring

✅ **Modularity** — Each utility is independent and testable  
✅ **Reusability** — Functions can be used in different contexts  
✅ **Maintainability** — Smaller files are easier to edit  
✅ **Scalability** — Easy to add new screens or features  
✅ **Performance** — Lazy-load components as needed  
✅ **Testability** — Utilities are pure functions (mostly)  

## 📞 Questions?

Refer to the individual file headers for detailed documentation of each utility and component.
