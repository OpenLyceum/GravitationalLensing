/** Telescope view, alignment presets, and controls for the foreground galaxy. */
import { DerivedProperty } from "scenerystack/axon";
import { Range } from "scenerystack/dot";
import { HBox, Node, RichText, VBox } from "scenerystack/scenery";
import { ResetAllButton } from "scenerystack/scenery-phet";
import { ScreenView, type ScreenViewOptions } from "scenerystack/sim";
import { Checkbox, RectangularPushButton } from "scenerystack/sun";
import {
  FLAT_PANEL_PUSH_BUTTON_OPTIONS,
  FLAT_RESET_ALL_BUTTON_OPTIONS,
  LIGHT_SURFACE_TEXT_FILL,
} from "../../common/GravitationalLensingButtonOptions.js";
import { GRAVITATIONAL_LENSING_CHECKBOX_OPTIONS } from "../../common/GravitationalLensingControlOptions.js";
import { GravitationalLensingPanel } from "../../common/GravitationalLensingPanel.js";
import { label, legend, readout, sidebarOptions, sliderControl } from "../../common/LensingViewElements.js";
import Colors from "../../GravitationalLensingColors.js";
import { GALAXY, LAYOUT, SCREEN_VIEW_MARGIN } from "../../GravitationalLensingConstants.js";
import { StringManager } from "../../i18n/StringManager.js";
import type { GalaxyLensingModel } from "../model/GalaxyLensingModel.js";
import { GalaxyFieldNode } from "./GalaxyFieldNode.js";
import { GalaxyLensingScreenSummaryContent, imagePatternProperty } from "./GalaxyLensingScreenSummaryContent.js";

export class GalaxyLensingScreenView extends ScreenView {
  public constructor(model: GalaxyLensingModel, options?: ScreenViewOptions) {
    super({ ...options, screenSummaryContent: new GalaxyLensingScreenSummaryContent(model) });

    const stringManager = StringManager.getInstance();
    const strings = stringManager.getGalaxyLensingStrings();
    const left = this.layoutBounds.minX + SCREEN_VIEW_MARGIN;
    const sidebarX = this.layoutBounds.maxX - SCREEN_VIEW_MARGIN - LAYOUT.sidebarWidth;
    const sky = new GalaxyFieldNode(model);
    this.addChild(sky);
    sky.left = left;
    sky.top = LAYOUT.workTop;

    this.addChild(
      label(stringManager.getScreenNames().galaxyStringProperty, {
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
    this.addChild(
      label(strings.skyStringProperty, {
        font: "bold 15px sans-serif",
        fill: Colors.textColorProperty,
        left: left + 14,
        top: LAYOUT.workTop + 12,
      }),
    );
    this.addChild(
      label(strings.dragHintStringProperty, {
        font: "13px sans-serif",
        fill: Colors.mutedTextColorProperty,
        right: sky.right - 14,
        top: LAYOUT.workTop + 14,
        maxWidth: 240,
      }),
    );

    const sourceKey = legend(strings.legendSourceStringProperty, Colors.imageColorProperty);
    sourceKey.visibleProperty = model.showGuidesProperty;
    this.addChild(
      new HBox({
        left,
        top: sky.bottom + 14,
        spacing: 18,
        children: [
          legend(strings.legendLensStringProperty, Colors.lensColorProperty),
          legend(strings.legendImageStringProperty, Colors.imageColorProperty),
          sourceKey,
        ],
      }),
    );

    const presetLabels = {
      single: strings.singleStringProperty,
      double: strings.doubleStringProperty,
      arcs: strings.arcsStringProperty,
      ring: strings.ringStringProperty,
    };
    const buttons = (Object.keys(presetLabels) as (keyof typeof presetLabels)[]).map(
      (preset) =>
        new RectangularPushButton({
          ...FLAT_PANEL_PUSH_BUTTON_OPTIONS,
          accessibleName: presetLabels[preset],
          listener: () => model.selectPreset(preset),
          minWidth: 116,
          yMargin: 7,
          content: label(presetLabels[preset], { fill: LIGHT_SURFACE_TEXT_FILL, maxWidth: 105 }),
        }),
    );
    const presets = new VBox({
      align: "left",
      spacing: 7,
      children: [
        new HBox({ spacing: 7, children: buttons.slice(0, 2) }),
        new HBox({ spacing: 7, children: buttons.slice(2) }),
      ],
    });
    const radiusControl = sliderControl(
      model.einsteinRadiusProperty,
      new Range(GALAXY.minEinsteinRadius, GALAXY.maxEinsteinRadius),
      strings.strengthStringProperty,
      strings.strengthStringProperty,
      0.05,
      2,
      strings.angularValueStringProperty,
      246,
    );
    const guides = new Checkbox(model.showGuidesProperty, label(strings.guideLabelStringProperty, { maxWidth: 235 }), {
      ...GRAVITATIONAL_LENSING_CHECKBOX_OPTIONS,
      accessibleName: strings.guideLabelStringProperty,
    });
    const offsetProperty = new DerivedProperty([model.lensPositionProperty], (position) => position.magnitude);
    const separation = new HBox({
      spacing: 8,
      children: [
        label(strings.offsetStringProperty, { fill: Colors.mutedTextColorProperty, maxWidth: 182 }),
        label(readout(offsetProperty, 2, strings.angularValueStringProperty), { font: "bold 16px sans-serif" }),
      ],
    });
    const panel = new GravitationalLensingPanel(
      new VBox({
        align: "left",
        spacing: LAYOUT.sectionSpacing,
        children: [
          label(strings.alignmentStringProperty, { font: "bold 20px sans-serif", maxWidth: 265 }),
          presets,
          radiusControl,
          guides,
          separation,
          label(imagePatternProperty(model), {
            font: "bold 17px sans-serif",
            fill: Colors.accentColorProperty,
            maxWidth: 267,
          }),
          new RichText(strings.hintStringProperty, {
            font: "15px sans-serif",
            fill: Colors.mutedTextColorProperty,
            lineWrap: 265,
          }),
        ],
      }),
      sidebarOptions(sidebarX),
    );
    this.addChild(panel);

    const reset = new ResetAllButton({
      ...FLAT_RESET_ALL_BUTTON_OPTIONS,
      listener: () => model.reset(),
      right: this.layoutBounds.maxX - SCREEN_VIEW_MARGIN,
      bottom: this.layoutBounds.maxY - SCREEN_VIEW_MARGIN,
    });
    this.addChild(reset);
    this.addChild(new Node({ pdomOrder: [sky.lens, ...buttons, radiusControl, guides, reset] }));
  }
}
