/** Relative motion of the background star past the fixed foreground lens. */
import { Multilink } from "scenerystack/axon";
import { Vector2 } from "scenerystack/dot";
import { Shape } from "scenerystack/kite";
import { ModelViewTransform2 } from "scenerystack/phetcommon";
import { Circle, Node, Path } from "scenerystack/scenery";
import { workFrame } from "../../common/LensingViewElements.js";
import Colors from "../../GravitationalLensingColors.js";
import { MICRO } from "../../GravitationalLensingConstants.js";
import type { MicrolensingModel } from "../model/MicrolensingModel.js";

const WIDTH = 268;
const HEIGHT = 108;

export class StarTrajectoryNode extends Node {
  private readonly trajectoryLink: Pick<ReturnType<typeof Multilink.multilink>, "dispose">;

  public constructor(model: MicrolensingModel) {
    const lens = new Circle(6, { fill: Colors.lensColorProperty, stroke: Colors.fieldColorProperty, lineWidth: 1.5 });
    const separationLine = new Path(null, { stroke: Colors.peakColorProperty, lineDash: [3, 3] });
    const path = new Path(null, { stroke: Colors.gridColorProperty, lineWidth: 2 });
    const source = new Circle(5, {
      fill: Colors.imageColorProperty,
      stroke: Colors.fieldColorProperty,
      lineWidth: 1.5,
    });
    super({ children: [workFrame(WIDTH, HEIGHT), path, separationLine, lens, source] });

    this.trajectoryLink = Multilink.multilink(
      [model.dayProperty, model.impactProperty, model.einsteinDaysProperty, model.magnificationProperty],
      (day, impact, duration, flux) => {
        // Set both scales from the x range so that equal distances on the sky have equal lengths.
        const horizontalRange = Math.max(2.6, MICRO.halfWindowDays / duration);
        const scale = (WIDTH - 24) / (2 * horizontalRange);
        const transform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
          Vector2.ZERO,
          new Vector2(WIDTH / 2, HEIGHT - 15),
          scale,
        );
        lens.center = transform.modelToViewXY(0, 0);
        const trackY = transform.modelToViewY(impact);
        path.shape = new Shape().moveTo(12, trackY).lineTo(WIDTH - 12, trackY);
        separationLine.shape = new Shape().moveTo(lens.x, lens.y).lineTo(lens.x, trackY);
        source.center = transform.modelToViewXY(day / duration, impact);
        source.radius = 4 + Math.min(5, Math.sqrt(flux) - 1);
      },
    );
  }

  public override dispose(): void {
    this.trajectoryLink.dispose();
    super.dispose();
  }
}
