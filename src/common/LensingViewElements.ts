/** Shared visual primitives for work areas and controls. */
import { type NumberProperty, PatternStringProperty, type TReadOnlyProperty } from "scenerystack/axon";
import { Dimension2, type Range, roundSymmetric, toFixed } from "scenerystack/dot";
import { Circle, HBox, Rectangle, Text, type TextOptions, VBox } from "scenerystack/scenery";
import { HSlider } from "scenerystack/sun";
import { Tandem } from "scenerystack/tandem";
import Colors from "../GravitationalLensingColors.js";
import { LAYOUT, PANEL_CORNER_RADIUS } from "../GravitationalLensingConstants.js";
import { GRAVITATIONAL_LENSING_SLIDER_OPTIONS } from "./GravitationalLensingControlOptions.js";

export function label(value: string | TReadOnlyProperty<string>, options: TextOptions = {}): Text {
  return new Text(value, { font: "15px sans-serif", fill: Colors.textColorProperty, ...options });
}

export function legend(
  value: TReadOnlyProperty<string>,
  colorProperty: TReadOnlyProperty<import("scenerystack/scenery").Color>,
): HBox {
  return new HBox({
    spacing: 7,
    children: [new Circle(4, { fill: colorProperty }), label(value, { font: "13px sans-serif", maxWidth: 175 })],
  });
}

export function workFrame(width: number, height: number): Rectangle {
  return new Rectangle(0, 0, width, height, {
    cornerRadius: PANEL_CORNER_RADIUS,
    fill: Colors.fieldColorProperty,
    stroke: Colors.panelBorderColorProperty,
  });
}

export function readout(
  valueProperty: TReadOnlyProperty<number>,
  digits: number,
  patternProperty: TReadOnlyProperty<string>,
): PatternStringProperty<{ value: TReadOnlyProperty<number> }> {
  return new PatternStringProperty(patternProperty, { value: valueProperty }, { decimalPlaces: digits });
}

export function sliderControl(
  valueProperty: NumberProperty,
  range: Range,
  titleProperty: TReadOnlyProperty<string>,
  accessibleNameProperty: TReadOnlyProperty<string>,
  step: number,
  digits: number,
  patternProperty: TReadOnlyProperty<string>,
  width: number,
  pause?: () => void,
): VBox {
  const track = new HSlider(valueProperty, range, {
    ...GRAVITATIONAL_LENSING_SLIDER_OPTIONS,
    trackSize: new Dimension2(width, 4),
    thumbSize: new Dimension2(18, 25),
    accessibleName: accessibleNameProperty,
    keyboardStep: step,
    shiftKeyboardStep: step / 5,
    constrainValue: (value) =>
      Math.max(range.min, Math.min(range.max, Number(toFixed(roundSymmetric(value / step) * step, digits)))),
    ...(pause ? { startDrag: pause, startInput: pause } : {}),
    tandem: Tandem.OPT_OUT,
  });
  const valueStringProperty = readout(valueProperty, digits, patternProperty);
  return new VBox({
    align: "left",
    spacing: 4,
    children: [
      new HBox({
        spacing: 9,
        children: [
          label(titleProperty, { maxWidth: width - 80 }),
          label(valueStringProperty, { font: "bold 15px sans-serif", fill: Colors.accentColorProperty }),
        ],
      }),
      track,
    ],
  });
}

export function sidebarOptions(x: number) {
  return {
    x,
    y: LAYOUT.workTop,
    minWidth: LAYOUT.sidebarWidth,
    xMargin: LAYOUT.panelInset,
    yMargin: LAYOUT.panelInset,
  };
}
