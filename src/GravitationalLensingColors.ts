/**
 * GravitationalLensingColors.ts
 *
 * Defines all dynamic colors for the simulation using ProfileColorProperty.
 *
 * Each color has two profiles:
 *   - "default"   — used in standard (dark) mode
 *   - "projector" — used when the user enables Projector Mode in Preferences
 *
 * SceneryStack switches profiles automatically; no manual toggling is needed.
 *
 * ── Usage ─────────────────────────────────────────────────────────────────────
 * Import GravitationalLensingColors and pass properties directly to Node's fillProperty or
 * strokeProperty options:
 *
 *   import GravitationalLensingColors from "../../GravitationalLensingColors.js";
 *
 *   new Rectangle( 0, 0, 100, 50, {
 *     fillProperty: GravitationalLensingColors.backgroundColorProperty,
 *   });
 *
 * ── How to add a color ────────────────────────────────────────────────────────
 * Add a new ProfileColorProperty entry to the GravitationalLensingColors object below.
 * Always provide both "default" and "projector" values.
 */
import { ProfileColorProperty } from "scenerystack/scenery";
import GravitationalLensingNamespace from "./GravitationalLensingNamespace.js";

const GravitationalLensingColors = {
  /**
   * Background color for the simulation screen.
   * Deep navy in default mode; white in projector mode.
   */
  backgroundColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "background", {
    default: "#101722",
    projector: "#ffffff",
  }),

  /**
   * Primary accent color for highlights, selected items, and key UI elements.
   * Sky blue in default mode; dark navy in projector mode.
   */
  accentColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "accent", {
    default: "#82dfed",
    projector: "#101722",
  }),

  /**
   * Background fill for control panels and dialogs.
   * Deep blue in default mode; light gray in projector mode.
   */
  panelBackgroundColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "panelBackground", {
    default: "#182433",
    projector: "#f5f5f5",
  }),

  /**
   * Border/stroke color for control panels and dialogs.
   * Teal-navy in default mode; medium gray in projector mode.
   */
  panelBorderColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "panelBorder", {
    default: "#3a4d61",
    projector: "#999999",
  }),

  /**
   * Text color for labels, readouts, and general UI text.
   * Near-white in default mode; near-black in projector mode.
   */
  textColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "text", {
    default: "#edf4fa",
    projector: "#1a1a1a",
  }),

  mutedTextColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "mutedText", {
    default: "#a8bdce",
    projector: "#42566a",
  }),
  fieldColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "field", {
    default: "#070e19",
    projector: "#f3f8fc",
  }),
  starsColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "stars", {
    default: "#b1c7e3",
    projector: "#627789",
  }),
  imageColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "image", {
    default: "#80d8ff",
    projector: "#005788",
  }),
  imageCoreColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "imageCore", {
    default: "#ffffef",
    projector: "#662253",
  }),
  lensColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "lens", {
    default: "#f5b975",
    projector: "#8a4215",
  }),
  lensCenterColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "lensCenter", {
    default: "#fff0bd",
    projector: "#a36939",
  }),
  gridColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "grid", {
    default: "#304255",
    projector: "#c6d3de",
  }),
  curveColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "curve", {
    default: "#71d9ec",
    projector: "#006a85",
  }),
  peakColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "peak", {
    default: "#ffc48a",
    projector: "#a34e14",
  }),

  // ── Light control surfaces ───────────────────────────────────────────────────
  // White chrome (combo boxes, flat push buttons, editable input fields) stays light
  // in both profiles; its text stays dark. Same values in default and projector mode,
  // but defined here so every color lives in one themeable place.

  /** Fill of light control surfaces: combo-box button/list, editable input fields. */
  controlSurfaceColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "controlSurface", {
    default: "#ffffff",
    projector: "#ffffff",
  }),

  /** Fill of a disabled control surface (grayed-out editable input field). */
  controlSurfaceDisabledColorProperty: new ProfileColorProperty(
    GravitationalLensingNamespace,
    "controlSurfaceDisabled",
    {
      default: "#cccccc",
      projector: "#cccccc",
    },
  ),

  /** Text on light control surfaces: combo items, flat-button labels, field values, preferences. */
  controlSurfaceTextColorProperty: new ProfileColorProperty(GravitationalLensingNamespace, "controlSurfaceText", {
    default: "#1a1a1a",
    projector: "#1a1a1a",
  }),
};

export default GravitationalLensingColors;
