/**
 * MicrolensingScreen.ts
 *
 * The top-level Screen component. It wires together the model and view
 * factories and passes screen-level options (name, background color, tandem)
 * to the parent Screen class.
 *
 * Registered in the screens array in src/main.ts. Its home-screen and navigation-bar
 * icons come from createMicrolensingIcon() in src/common/GravitationalLensingScreenIcons.ts
 * (see doc/multi-screen.md).
 */
import { type EmptySelfOptions, optionize } from "scenerystack/phet-core";
import type { ScreenOptions } from "scenerystack/sim";
import { Screen } from "scenerystack/sim";
import type { Tandem } from "scenerystack/tandem";
import { createMicrolensingIcon } from "../common/GravitationalLensingScreenIcons.js";
import GravitationalLensingColors from "../GravitationalLensingColors.js";
import { MicrolensingModel } from "./model/MicrolensingModel.js";
import { MicrolensingKeyboardHelpContent } from "./view/MicrolensingKeyboardHelpContent.js";
import { MicrolensingScreenView } from "./view/MicrolensingScreenView.js";

// Require tandem to be explicit — accidental omission would break PhET-iO.
type MicrolensingScreenOptions = ScreenOptions & { tandem: Tandem };

export class MicrolensingScreen extends Screen<MicrolensingModel, MicrolensingScreenView> {
  public constructor(options: MicrolensingScreenOptions) {
    super(
      // Model factory — called once when the screen is first shown
      () => new MicrolensingModel(),
      // View factory — receives the model instance
      (model) =>
        new MicrolensingScreenView(model, {
          tandem: options.tandem.createTandem("view"),
        }),
      optionize<MicrolensingScreenOptions, EmptySelfOptions, ScreenOptions>()(
        {
          backgroundColorProperty: GravitationalLensingColors.backgroundColorProperty,
          createKeyboardHelpNode: () => new MicrolensingKeyboardHelpContent(),
          homeScreenIcon: createMicrolensingIcon(),
          navigationBarIcon: createMicrolensingIcon(),
        },
        options,
      ),
    );
  }
}
