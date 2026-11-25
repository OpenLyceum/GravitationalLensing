/** Interactive light curve, sky diagram, and playback controls for the point lens. */
import { DerivedProperty } from "scenerystack/axon";
import { Range } from "scenerystack/dot";
import { HBox, Node, RichText, VBox } from "scenerystack/scenery";
import { ResetAllButton, TimeControlNode } from "scenerystack/scenery-phet";
import { ScreenView, type ScreenViewOptions } from "scenerystack/sim";
import { Tandem } from "scenerystack/tandem";
import {
  FLAT_PLAY_PAUSE_STEP_BUTTON_OPTIONS,
  FLAT_RESET_ALL_BUTTON_OPTIONS,
} from "../../common/GravitationalLensingButtonOptions.js";
import { GravitationalLensingPanel } from "../../common/GravitationalLensingPanel.js";
import { label, legend, readout, sidebarOptions, sliderControl } from "../../common/LensingViewElements.js";
import Colors from "../../GravitationalLensingColors.js";
import { LAYOUT, MICRO, SCREEN_VIEW_MARGIN } from "../../GravitationalLensingConstants.js";
import { StringManager } from "../../i18n/StringManager.js";
import type { MicrolensingModel } from "../model/MicrolensingModel.js";
import { pointMagnification } from "../model/PointLens.js";
import { LightCurveNode } from "./LightCurveNode.js";
import { MicrolensingScreenSummaryContent } from "./MicrolensingScreenSummaryContent.js";
import { StarTrajectoryNode } from "./StarTrajectoryNode.js";

export class MicrolensingScreenView extends ScreenView {
  public constructor(model: MicrolensingModel, options?: ScreenViewOptions) {
    super({ ...options, screenSummaryContent: new MicrolensingScreenSummaryContent(model) });
    const manager = StringManager.getInstance();
    const strings = manager.getMicrolensingStrings();
    const a11y = manager.getMicrolensingA11yStrings();
    const left = this.layoutBounds.minX + SCREEN_VIEW_MARGIN;
    const sidebarX = this.layoutBounds.maxX - SCREEN_VIEW_MARGIN - LAYOUT.sidebarWidth;
    this.addChild(
      label(manager.getScreenNames().microlensingStringProperty, {
        font: "bold 35px sans-serif",
        left,
        top: 20,
      }),
    );
    this.addChild(
      label(strings.subtitleStringProperty, {
        font: "17px sans-serif",
        fill: Colors.mutedTextColorProperty,
        left,
        top: 63,
        maxWidth: this.layoutBounds.width - 2 * left,
      }),
    );
    const graph = new LightCurveNode(model);
    this.addChild(graph);
    graph.left = left;
    graph.top = LAYOUT.workTop;

    const impactControl = sliderControl(
      model.impactProperty,
      new Range(MICRO.minImpact, MICRO.maxImpact),
      strings.impactStringProperty,
      a11y.impactStringProperty,
      0.02,
      2,
      strings.thetaStringProperty,
      246,
    );
    const durationControl = sliderControl(
      model.einsteinDaysProperty,
      new Range(MICRO.minEinsteinDays, MICRO.maxEinsteinDays),
      strings.timeScaleStringProperty,
      a11y.timeScaleStringProperty,
      1,
      0,
      strings.daysStringProperty,
      246,
    );
    const peakFluxProperty = new DerivedProperty([model.impactProperty], pointMagnification);
    const stats = new VBox({
      align: "left",
      spacing: 6,
      children: [
        new HBox({
          spacing: 8,
          children: [
            label(strings.currentStringProperty, { fill: Colors.mutedTextColorProperty, maxWidth: 184 }),
            label(readout(model.magnificationProperty, 2, strings.fluxStringProperty), {
              font: "bold 17px sans-serif",
              fill: Colors.curveColorProperty,
            }),
          ],
        }),
        new HBox({
          spacing: 8,
          children: [
            label(strings.peakFluxStringProperty, { fill: Colors.mutedTextColorProperty, maxWidth: 184 }),
            label(readout(peakFluxProperty, 2, strings.fluxStringProperty), {
              font: "bold 17px sans-serif",
              fill: Colors.peakColorProperty,
            }),
          ],
        }),
      ],
    });
    this.addChild(
      new GravitationalLensingPanel(
        new VBox({
          align: "left",
          spacing: 9,
          children: [
            label(strings.trajectoryStringProperty, { font: "bold 18px sans-serif", maxWidth: 268 }),
            new StarTrajectoryNode(model),
            new HBox({
              spacing: 11,
              children: [
                legend(strings.sourceStringProperty, Colors.imageColorProperty),
                legend(strings.lensStringProperty, Colors.lensColorProperty),
              ],
            }),
            impactControl,
            durationControl,
            stats,
            new RichText(strings.hintStringProperty, {
              font: "14px sans-serif",
              fill: Colors.mutedTextColorProperty,
              lineWrap: 268,
            }),
          ],
        }),
        sidebarOptions(sidebarX),
      ),
    );

    const timeControl = new TimeControlNode(model.isPlayingProperty, {
      tandem: options?.tandem?.createTandem("timeControlNode") ?? Tandem.OPT_OUT,
      playPauseStepButtonOptions: {
        ...FLAT_PLAY_PAUSE_STEP_BUTTON_OPTIONS,
        stepForwardButtonOptions: {
          ...FLAT_PLAY_PAUSE_STEP_BUTTON_OPTIONS.stepForwardButtonOptions,
          listener: () => model.advanceDays(MICRO.stepDays),
        },
      },
    });
    const eventSlider = sliderControl(
      model.dayProperty,
      new Range(-MICRO.halfWindowDays, MICRO.halfWindowDays),
      strings.timeStringProperty,
      a11y.timeStringProperty,
      1,
      0,
      strings.daysStringProperty,
      389,
      () => {
        model.isPlayingProperty.value = false;
      },
    );
    this.addChild(
      new GravitationalLensingPanel(
        new HBox({
          children: [timeControl, eventSlider],
          spacing: 32,
        }),
        {
          left,
          top: graph.bottom + 14,
          minWidth: LAYOUT.workWidth,
          yMargin: 7,
        },
      ),
    );

    const reset = new ResetAllButton({
      ...FLAT_RESET_ALL_BUTTON_OPTIONS,
      listener: () => model.reset(),
      right: this.layoutBounds.maxX - SCREEN_VIEW_MARGIN,
      bottom: this.layoutBounds.maxY - SCREEN_VIEW_MARGIN,
    });
    this.addChild(reset);
    this.addChild(new Node({ pdomOrder: [timeControl, eventSlider, impactControl, durationControl, reset] }));
  }
}
