/** Angular and time ranges for the two lens models, and screen layout in pixels. */

import GravitationalLensingNamespace from "./GravitationalLensingNamespace.js";

export const SCREEN_VIEW_MARGIN = 24;

/** Corner radius shared by the simulation panels. @public */
export const PANEL_CORNER_RADIUS = 12;

export const GALAXY = {
  // All angles in arcseconds. The background galaxy is centered at the origin.
  fieldHalfWidth: 3.6,
  lensLimitX: 1.93,
  lensLimitY: 1.25,
  sourceRadius: 0.31,
  minEinsteinRadius: 0.55,
  maxEinsteinRadius: 1.45,
  initialEinsteinRadius: 1.15,
  presets: {
    single: { x: -1.86, y: 0.14 },
    double: { x: -0.72, y: 0.24 },
    arcs: { x: -0.22, y: 0.13 },
    ring: { x: 0, y: 0 },
  },
} as const;

export const MICRO = {
  // Time in days; angular distances in units of the Einstein radius.
  halfWindowDays: 60,
  minImpact: 0.1,
  maxImpact: 1.5,
  initialImpact: 0.28,
  minEinsteinDays: 5,
  maxEinsteinDays: 30,
  initialEinsteinDays: 16,
  initialDay: -32,
  stepDays: 1,
  playbackDaysPerSecond: 16,
} as const;

export const LAYOUT = {
  workTop: 108,
  workWidth: 646,
  workHeight: 399,
  sidebarWidth: 304,
  sectionSpacing: 12,
  panelInset: 17,
} as const;

GravitationalLensingNamespace.register("GravitationalLensingConstants", { GALAXY, LAYOUT, MICRO });
