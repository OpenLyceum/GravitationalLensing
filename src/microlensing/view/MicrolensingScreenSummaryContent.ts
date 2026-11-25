/** Live numerical description of the light curve and its current marker. */
import { DerivedProperty, PatternStringProperty } from "scenerystack/axon";
import { ScreenSummaryContent } from "scenerystack/sim";
import { StringManager } from "../../i18n/StringManager.js";
import type { MicrolensingModel } from "../model/MicrolensingModel.js";
import { pointMagnification } from "../model/PointLens.js";

export class MicrolensingScreenSummaryContent extends ScreenSummaryContent {
  public constructor(model: MicrolensingModel) {
    const a11y = StringManager.getInstance().getMicrolensingA11yStrings();
    super({
      playAreaContent: a11y.screenSummary.playAreaStringProperty,
      controlAreaContent: a11y.screenSummary.controlAreaStringProperty,
      interactionHintContent: a11y.screenSummary.interactionHintStringProperty,
      currentDetailsContent: new PatternStringProperty(
        a11y.detailsStringProperty,
        {
          day: model.dayProperty,
          current: model.magnificationProperty,
          peak: new DerivedProperty([model.impactProperty], pointMagnification),
          impact: model.impactProperty,
          duration: model.einsteinDaysProperty,
        },
        { decimalPlaces: 2 },
      ),
    });
  }
}
