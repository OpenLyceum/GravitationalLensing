/** Localized live description of the observed image pattern and the alignment. */
import { DerivedProperty, PatternStringProperty } from "scenerystack/axon";
import { ScreenSummaryContent } from "scenerystack/sim";
import { StringManager } from "../../i18n/StringManager.js";
import { centerImagePattern } from "../model/GalaxyLens.js";
import type { GalaxyLensingModel } from "../model/GalaxyLensingModel.js";

export function imagePatternProperty(model: GalaxyLensingModel) {
  const strings = StringManager.getInstance().getGalaxyLensingStrings();
  return new DerivedProperty(
    [
      model.lensPositionProperty,
      model.einsteinRadiusProperty,
      strings.ringStateStringProperty,
      strings.twoStateStringProperty,
      strings.oneStateStringProperty,
    ],
    (position, radius, ring, two, one) => ({ ring, two, one })[centerImagePattern(position.magnitude, radius)],
  );
}

export class GalaxyLensingScreenSummaryContent extends ScreenSummaryContent {
  public constructor(model: GalaxyLensingModel) {
    const a11y = StringManager.getInstance().getGalaxyLensingA11yStrings();
    super({
      playAreaContent: a11y.screenSummary.playAreaStringProperty,
      controlAreaContent: a11y.screenSummary.controlAreaStringProperty,
      interactionHintContent: a11y.screenSummary.interactionHintStringProperty,
      currentDetailsContent: new PatternStringProperty(
        a11y.detailsStringProperty,
        {
          pattern: imagePatternProperty(model),
          x: new DerivedProperty([model.lensPositionProperty], (position) => position.x),
          y: new DerivedProperty([model.lensPositionProperty], (position) => position.y),
          offset: new DerivedProperty([model.lensPositionProperty], (position) => position.magnitude),
          radius: model.einsteinRadiusProperty,
        },
        { decimalPlaces: 2 },
      ),
    });
  }
}
