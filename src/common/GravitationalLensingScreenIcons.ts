/** Vector screen thumbnails for the navigation bar and home screen. */
import { Shape } from "scenerystack/kite";
import { Circle, Node, Path, Rectangle } from "scenerystack/scenery";
import { ScreenIcon } from "scenerystack/sim";
import Colors from "../GravitationalLensingColors.js";

function screenIcon(children: Node[]): ScreenIcon {
  return new ScreenIcon(
    new Node({
      children: [new Rectangle(0, 0, 548, 373, { fill: Colors.fieldColorProperty }), ...children],
    }),
    {
      maxIconWidthProportion: 1,
      maxIconHeightProportion: 1,
      fill: Colors.fieldColorProperty,
    },
  );
}

export function createGalaxyLensingIcon(): ScreenIcon {
  const ring = new Shape().arc(274, 186, 123, -2.67, 0.6).newSubpath().arc(274, 186, 123, 0.8, 3.4);
  return screenIcon([
    new Path(ring, { stroke: Colors.curveColorProperty, lineWidth: 27, lineCap: "round" }),
    new Path(Shape.ellipse(274, 186, 56, 33, -0.45), { fill: Colors.lensColorProperty }),
    new Path(Shape.ellipse(274, 186, 25, 15, -0.45), { fill: Colors.lensCenterColorProperty }),
  ]);
}

export function createMicrolensingIcon(): ScreenIcon {
  const profile = new Shape()
    .moveTo(60, 283)
    .cubicCurveTo(195, 283, 200, 265, 232, 185)
    .cubicCurveTo(261, 56, 287, 56, 316, 185)
    .cubicCurveTo(348, 265, 353, 283, 488, 283);
  return screenIcon([
    new Path(new Shape().moveTo(60, 298).lineTo(488, 298), { stroke: Colors.mutedTextColorProperty, lineWidth: 8 }),
    new Path(profile, { stroke: Colors.curveColorProperty, lineWidth: 18, lineCap: "round" }),
    new Circle(19, { x: 274, y: 88, fill: Colors.peakColorProperty }),
  ]);
}
