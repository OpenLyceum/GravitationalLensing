/** Layered sky view, with one input target for mouse, touch, and keyboard. */
import { Multilink } from "scenerystack/axon";
import { Bounds2, Random, Vector2 } from "scenerystack/dot";
import { Shape } from "scenerystack/kite";
import { ModelViewTransform2 } from "scenerystack/phetcommon";
import { Circle, Node, Path, RichDragListener } from "scenerystack/scenery";
import { workFrame } from "../../common/LensingViewElements.js";
import Colors from "../../GravitationalLensingColors.js";
import { GALAXY, LAYOUT, PANEL_CORNER_RADIUS } from "../../GravitationalLensingConstants.js";
import { StringManager } from "../../i18n/StringManager.js";
import type { GalaxyLensingModel } from "../model/GalaxyLensingModel.js";
import { GalaxyImageNode } from "./GalaxyImageNode.js";

export class GalaxyFieldNode extends Node {
  public readonly lens: Node;
  private readonly drag: RichDragListener;
  private readonly positionLink: Pick<ReturnType<typeof Multilink.multilink>, "dispose">;
  private readonly image: GalaxyImageNode;
  private readonly guides: Node;

  public constructor(model: GalaxyLensingModel) {
    const width = LAYOUT.workWidth;
    const height = LAYOUT.workHeight;
    const fieldCenter = new Vector2(width / 2, height / 2);
    const transform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      fieldCenter,
      fieldCenter.x / GALAXY.fieldHalfWidth,
    );
    const random = new Random({ seed: 37 });
    const stars = new Node({
      pickable: false,
      children: Array.from(
        { length: 156 },
        () =>
          new Circle(0.4 + 1.1 * random.nextDouble() ** 3, {
            x: random.nextDoubleBetween(9, width - 9),
            y: random.nextDoubleBetween(9, height - 9),
            fill: Colors.starsColorProperty,
            opacity: random.nextDoubleBetween(0.14, 0.65),
          }),
      ),
    });

    const text = StringManager.getInstance().getGalaxyLensingA11yStrings();
    const lens = new Node({
      tagName: "div",
      focusable: true,
      accessibleName: text.lensStringProperty,
      accessibleHelpText: text.lensHelpStringProperty,
      cursor: "grab",
      children: [
        new Circle(30, { fill: Colors.lensColorProperty, opacity: 0.05 }),
        new Path(Shape.ellipse(0, 0, 22, 13.5, -0.42), { fill: Colors.lensColorProperty, opacity: 0.3 }),
        new Path(Shape.ellipse(0, 0, 16, 8.5, -0.42), { fill: Colors.lensColorProperty, opacity: 0.65 }),
        new Path(Shape.ellipse(0, 0, 8, 5, -0.42), { fill: Colors.lensCenterColorProperty }),
        new Circle(28, { stroke: Colors.lensColorProperty, lineWidth: 1.35, lineDash: [4, 6] }),
      ],
    });
    lens.touchArea = Shape.circle(0, 0, 42);
    lens.mouseArea = Shape.circle(0, 0, 31);
    const criticalCurve = new Circle(1, { stroke: Colors.lensColorProperty, lineWidth: 1.5, lineDash: [6, 7] });
    const source = new Circle(transform.modelToViewDeltaX(GALAXY.sourceRadius), {
      translation: fieldCenter,
      stroke: Colors.imageColorProperty,
      lineDash: [2, 4],
      lineWidth: 2,
    });
    const guides = new Node({
      children: [criticalCurve, source],
      pickable: false,
      visibleProperty: model.showGuidesProperty,
    });
    const image = new GalaxyImageNode(model, transform, width, height);
    const content = new Node({
      clipArea: Shape.roundRectangle(0, 0, width, height, PANEL_CORNER_RADIUS, PANEL_CORNER_RADIUS),
      children: [workFrame(width, height), stars, image, guides, lens],
    });

    super({ children: [content] });
    this.lens = lens;
    this.image = image;
    this.guides = guides;
    const dragOptions = {
      positionProperty: model.lensPositionProperty,
      dragBoundsProperty: model.lensBoundsProperty,
      transform,
    };
    this.drag = new RichDragListener({
      dragListenerOptions: dragOptions,
      keyboardDragListenerOptions: { ...dragOptions, dragDelta: 8, shiftDragDelta: 2 },
    });
    lens.addInputListener(this.drag);
    this.positionLink = Multilink.multilink(
      [model.lensPositionProperty, model.einsteinRadiusProperty],
      (position, radius) => {
        const center = transform.modelToViewPosition(position);
        lens.translation = center;
        criticalCurve.radius = transform.modelToViewDeltaX(radius);
        criticalCurve.translation = center;
      },
    );
    // Explicit bounds keep the clipped sky from participating in control layout.
    this.localBounds = Bounds2.rect(0, 0, width, height);
  }

  public override dispose(): void {
    this.positionLink.dispose();
    this.lens.removeInputListener(this.drag);
    this.drag.dispose();
    this.lens.dispose();
    this.guides.dispose();
    this.image.dispose();
    super.dispose();
  }
}
