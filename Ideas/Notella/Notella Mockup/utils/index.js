/**
 * Notella Mockup — Utility Module Index
 *
 * This file demonstrates how to import and use all extracted utilities.
 * Each utility is a pure function or class that can be used independently.
 */

// ============ RENDER HELPERS ============
// Use these to create consistent styling across components

import {
  tint,               // Apply alpha transparency to hex colors
  markSt,             // Create colored indicator mark styles
  chipSt,             // Create badge/pill styles
  avSt,               // Create avatar circle styles
  segSt,              // Create segment/tab button styles
  createIcon,         // Generate SVG icon elements
  shapePath,          // Create SVG paths for shapes (circle, diamond, hexagon, etc.)
} from './renderHelpers.js';

// ============ EDITOR LOGIC ============
// Use these for text editor interactions (mentions, AI suggestions)

import {
  checkMention,       // Detect @ mentions in editor
  analyzeAi,          // Generate AI suggestions for entity recognition
  insertMention,      // Insert mention badge into editor
  acceptAi,           // Accept an AI suggestion
  flipY,              // Position popups to avoid overflow
  typeOf,             // Get type info by key
  tintColor,          // Tint a color with alpha (alternate export)
} from './editorLogic.js';

// ============ STATE MANAGEMENT ============
// Use these for workflow logic, navigation, and screen management

import {
  ReviewManager,      // Handles review/curation workflow
  NavBuilder,         // Builds navigation structure from preset
  ScreenManager,      // Manages screen visibility and metadata
} from './stateManager.js';

// ============ CONFIGURATION ============
// Screens configuration - defines all available screens
const screensConfig = {
  SCREENS: {
    "B1": { "name": "Alle Projekte", "chrome": "start" },
    "B2": { "name": "Projekt anlegen", "chrome": "start" },
    "B3": { "name": "Projektübersicht", "chrome": "orient" },
    "C1": { "name": "Meeting-Raum", "chrome": "focus" },
    "D2": { "name": "Wiki-Artikel", "chrome": "focus" },
    "D5": { "name": "Beziehungs-Graph", "chrome": "focus" },
    "E1": { "name": "Review-Inbox", "chrome": "focus" },
    "F3": { "name": "Preset-Ansicht", "chrome": "focus" }
  }
};

// ============ GLOBAL STYLES ============
// Import global CSS for fonts, animations, resets
// In HTML: <link rel="stylesheet" href="./styles/global.css">

// ============ EXAMPLE USAGE ============

/**
 * Example: Using utilities in a component
 */
class NotellaMockupExample {
  constructor(presetData, screensConfig) {
    this.preset = presetData;
    this.screens = screensConfig;
    this.reviewMgr = new ReviewManager(presetData);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      screen: 'B1',
      role: 'lead',
      mode: 'normal',
      presetId: 'software',
      reviewIdx: 0,
      log: [],
      rf: {},
      hidden: [],
      mention: null,
      aiSug: null,
      navExp: {},
      railOpen: false,
      focus: null,
      zoom: 1,
      originTab: 'origin',
      drawer: false,
      origin: false,
      vis: null,
      hintOpen: true,
      aiMode: false,
      newPreset: 'software',
    };
  }

  // -------- Styling Examples --------

  exampleStyling() {
    // Create a badge for entity type
    const typeBadge = chipSt('#5340c4', false);
    // → "display:inline-flex;align-items:center;...background:rgba(83,64,196,0.13);..."

    // Create an avatar
    const avatar = avSt(0);
    // → "width:24px;height:24px;border-radius:50%;...margin-left:0"

    // Create a mark indicator
    const mark = markSt('#3f8f5f', 9);
    // → "width:9px;height:9px;border-radius:3px;background:#3f8f5f;..."

    // Tint a color for background
    const bgColor = tint('#5340c4', 0.14);
    // → "rgba(83,64,196,0.14)"

    // Create toggle button styles
    const active = segSt(true);   // → "padding:5px 11px;...background:#f4f4f2;font-weight:600"
    const inactive = segSt(false); // → "padding:5px 11px;...color:#a3a3ab"
  }

  // -------- Editor Examples --------

  onEditorInput() {
    // Check for mentions
    const mention = checkMention(this.state, this.preset);
    if (mention) {
      this.setState({ mention, mentionIdx: 0 });
    }

    // Check for AI suggestions
    const aiSug = analyzeAi(this.state, this.preset);
    if (aiSug) {
      this.setState({ aiSug });
    }
  }

  onEditorKeyDown(event) {
    // Handle mention navigation
    if (this.state.mention) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        // Move to next suggestion
      } else if (event.key === 'Enter') {
        event.preventDefault();
        // Insert selected mention
        insertMention('Entity Name', '#5340c4', this.state);
        this.setState({ mention: null });
      }
    }

    // Handle AI suggestion
    if (this.state.aiSug) {
      if (event.key === 'Tab') {
        event.preventDefault();
        acceptAi(this.state.aiSug);
        this.setState({ aiSug: null, undo: 'As suggested marked' });
      } else if (event.key === 'Escape') {
        event.preventDefault();
        this.setState({ aiSug: null });
      }
    }
  }

  // -------- Review Workflow Examples --------

  onReviewDecision(which) {
    const cards = this.preset.review;
    const newState = this.reviewMgr.decide(
      this.state.reviewIdx,
      cards,
      this.state,
      which // 'primary', 'secondary', or 'later'
    );
    this.setState(newState);
  }

  onUndoReview() {
    const newState = this.reviewMgr.undoLast(
      this.state.reviewIdx,
      this.state.log
    );
    this.setState(newState);
  }

  resetReview() {
    const newState = this.reviewMgr.resetReview();
    this.setState(newState);
  }

  // -------- Navigation Examples --------

  buildNavigation() {
    const navGroups = NavBuilder.buildNavGroups(
      this.preset,
      this.state,
      this.state.role === 'lead'
    );
    return navGroups;
  }

  // -------- Screen Management Examples --------

  getScreenInfo(screenId) {
    const screen = ScreenManager.getScreen(
      screenId,
      this.screens
    );
    return screen;
  }

  shouldShowScreen(screenId, blocked) {
    const show = ScreenManager.shouldShow(
      screenId,
      this.state,
      blocked
    );
    return show;
  }

  // -------- Helper Methods --------

  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.render();
  }

  render() {
    console.log('Render with state:', this.state);
    // Implementation depends on view framework
  }
}

// ============ EXPORT EVERYTHING ============

export {
  // Render
  tint,
  markSt,
  chipSt,
  avSt,
  segSt,
  createIcon,
  shapePath,
  // Editor
  checkMention,
  analyzeAi,
  insertMention,
  acceptAi,
  flipY,
  typeOf,
  tintColor,
  // State
  ReviewManager,
  NavBuilder,
  ScreenManager,
  // Config
  screensConfig,
};

export default NotellaMockupExample;
