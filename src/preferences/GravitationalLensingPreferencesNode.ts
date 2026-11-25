/**
 * GravitationalLensingPreferencesNode.ts
 *
 * Custom preferences UI shown in Preferences → Simulation. Add controls here
 * when the sim gains sim-specific preferences. The empty shell still wraps content
 * in GravitationalLensingPanel so the shared panel toolkit stays reachable.
 */
import { VBox } from "scenerystack/scenery";
import type { Tandem } from "scenerystack/tandem";
import { GRAVITATIONAL_LENSING_CHECKBOX_OPTIONS } from "../common/GravitationalLensingControlOptions.js";
import { GravitationalLensingPanel } from "../common/GravitationalLensingPanel.js";
import GravitationalLensingNamespace from "../GravitationalLensingNamespace.js";
import type { GravitationalLensingPreferencesModel } from "./GravitationalLensingPreferencesModel.js";

export class GravitationalLensingPreferencesNode extends VBox {
  public constructor(_preferencesModel: GravitationalLensingPreferencesModel, _tandem?: Tandem) {
    // Pattern for a preference control (skill: scenerystack-preferences). The dialog is
    // always white, so use the controlSurface colors, not textColorProperty.
    //
    //   const prefStrings = StringManager.getInstance().getPreferences();
    //   const showGridCheckbox = new Checkbox(
    //     preferencesModel.showGridProperty,
    //     new Text(prefStrings.showGridStringProperty, {
    //       font: new PhetFont(14),
    //       fill: GravitationalLensingColors.controlSurfaceTextColorProperty,
    //     }),
    //     {
    //       ...GRAVITATIONAL_LENSING_CHECKBOX_OPTIONS,
    //       checkboxColor: GravitationalLensingColors.controlSurfaceTextColorProperty,
    //       checkboxColorBackground: GravitationalLensingColors.controlSurfaceColorProperty,
    //       ...(tandem && { tandem: tandem.createTandem("showGridCheckbox") }),
    //     },
    //   );
    //
    // Add showGridCheckbox to the content children below.
    const content = new VBox({
      align: "left",
      spacing: GRAVITATIONAL_LENSING_CHECKBOX_OPTIONS.spacing,
      children: [],
    });
    // Transparent / borderless so the Preferences dialog stays visually empty.
    const panel = new GravitationalLensingPanel(content, {
      fill: "transparent",
      stroke: null,
      xMargin: 0,
      yMargin: 0,
    });
    super({
      align: "left",
      spacing: 12,
      children: [panel],
    });
  }
}

GravitationalLensingNamespace.register("GravitationalLensingPreferencesNode", GravitationalLensingPreferencesNode);
