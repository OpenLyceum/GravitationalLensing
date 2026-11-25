/**
 * GravitationalLensingPanel.ts
 *
 * A pre-themed Panel that automatically uses GravitationalLensingColors for background and
 * border. Use this for all control panels and info boxes in the sim so that
 * default / projector mode switching is handled automatically.
 *
 * ── Basic usage ───────────────────────────────────────────────────────────────
 *
 *   import { GravitationalLensingPanel } from "../../common/GravitationalLensingPanel.js";
 *   import { VBox, Text } from "scenerystack/scenery";
 *
 *   const content = new VBox({
 *     children: [ new Text("label"), slider ],
 *     spacing: 8,
 *   });
 *   const panel = new GravitationalLensingPanel(content);
 *
 * ── Overriding defaults ───────────────────────────────────────────────────────
 *
 *   // Wider margins, sharper corners, custom stroke
 *   const panel = new GravitationalLensingPanel(content, { xMargin: 20, cornerRadius: 0 });
 *
 *   // Transparent background (decorative border only)
 *   const panel = new GravitationalLensingPanel(content, { fill: "transparent" });
 */

import { type EmptySelfOptions, optionize } from "scenerystack/phet-core";
import type { Node } from "scenerystack/scenery";
import { Panel, type PanelOptions } from "scenerystack/sun";
import GravitationalLensingColors from "../GravitationalLensingColors.js";
import { PANEL_CORNER_RADIUS } from "../GravitationalLensingConstants.js";

/** @public */
export type GravitationalLensingPanelOptions = PanelOptions;

/** Pre-themed Panel wrapper for control panels and info boxes. @public */
export class GravitationalLensingPanel extends Panel {
  public constructor(content: Node, providedOptions?: GravitationalLensingPanelOptions) {
    const options = optionize<GravitationalLensingPanelOptions, EmptySelfOptions, PanelOptions>()(
      {
        fill: GravitationalLensingColors.panelBackgroundColorProperty,
        stroke: GravitationalLensingColors.panelBorderColorProperty,
        cornerRadius: PANEL_CORNER_RADIUS,
        xMargin: 12,
        yMargin: 10,
      },
      providedOptions,
    );
    super(content, options);
  }
}
