/**
 * GalaxyLensingScreen.ts
 *
 * The top-level Screen component. It wires together the model and view
 * factories and passes screen-level options (name, background color, tandem)
 * to the parent Screen class.
 *
 * Registered in the screens array in src/main.ts. Its home-screen and navigation-bar
 * icons come from createGalaxyLensingIcon() in src/common/GravitationalLensingScreenIcons.ts
 * (see doc/multi-screen.md).
 */
import { type EmptySelfOptions, optionize } from "scenerystack/phet-core";
import type { ScreenOptions } from "scenerystack/sim";
import { Screen } from "scenerystack/sim";
import type { Tandem } from "scenerystack/tandem";
import { createGalaxyLensingIcon } from "../common/GravitationalLensingScreenIcons.js";
import GravitationalLensingColors from "../GravitationalLensingColors.js";
import { GalaxyLensingModel } from "./model/GalaxyLensingModel.js";
import { GalaxyLensingKeyboardHelpContent } from "./view/GalaxyLensingKeyboardHelpContent.js";
import { GalaxyLensingScreenView } from "./view/GalaxyLensingScreenView.js";

// Require tandem to be explicit — accidental omission would break PhET-iO.
type GalaxyLensingScreenOptions = ScreenOptions & { tandem: Tandem };

export class GalaxyLensingScreen extends Screen<GalaxyLensingModel, GalaxyLensingScreenView> {
  public constructor(options: GalaxyLensingScreenOptions) {
    super(
      // Model factory — called once when the screen is first shown
      () => new GalaxyLensingModel(),
      // View factory — receives the model instance
      (model) =>
        new GalaxyLensingScreenView(model, {
          tandem: options.tandem.createTandem("view"),
        }),
      optionize<GalaxyLensingScreenOptions, EmptySelfOptions, ScreenOptions>()(
        {
          backgroundColorProperty: GravitationalLensingColors.backgroundColorProperty,
          createKeyboardHelpNode: () => new GalaxyLensingKeyboardHelpContent(),
          homeScreenIcon: createGalaxyLensingIcon(),
          navigationBarIcon: createGalaxyLensingIcon(),
        },
        options,
      ),
    );
  }
}
