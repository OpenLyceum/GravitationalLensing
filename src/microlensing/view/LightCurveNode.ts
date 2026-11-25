/** Relative brightness versus time, with a moving marker and fixed closest-approach guide. */
import { Multilink } from "scenerystack/axon";
import { Bounds2, toFixed } from "scenerystack/dot";
import { Shape } from "scenerystack/kite";
import { ModelViewTransform2 } from "scenerystack/phetcommon";
import { Circle, HBox, Node, Path } from "scenerystack/scenery";
import { label, legend, workFrame } from "../../common/LensingViewElements.js";
import Colors from "../../GravitationalLensingColors.js";
import { LAYOUT, MICRO } from "../../GravitationalLensingConstants.js";
import { StringManager } from "../../i18n/StringManager.js";
import type { MicrolensingModel } from "../model/MicrolensingModel.js";
import { lensSeparation, pointMagnification } from "../model/PointLens.js";

const PLOT_BOUNDS = new Bounds2(64, 74, LAYOUT.workWidth - 25, LAYOUT.workHeight - 57);
const SAMPLES = 480;
const TIME_INTERVAL = 15;
const FLUX_DIVISIONS = 4;

export class LightCurveNode extends Node {
  private readonly curveLink: Pick<ReturnType<typeof Multilink.multilink>, "dispose">;
  private readonly markerLink: Pick<ReturnType<typeof Multilink.multilink>, "dispose">;

  public constructor(model: MicrolensingModel) {
    const strings = StringManager.getInstance().getMicrolensingStrings();
    const frame = workFrame(LAYOUT.workWidth, LAYOUT.workHeight);
    const plotLeft = PLOT_BOUNDS.minX;
    const plotRight = PLOT_BOUNDS.maxX;
    const plotBottom = PLOT_BOUNDS.maxY;
    const plotTop = PLOT_BOUNDS.minY;
    const timeGrid = new Shape();
    const timeLabels = new Node();
    const gridTransform = ModelViewTransform2.createRectangleInvertedYMapping(
      new Bounds2(-MICRO.halfWindowDays, 1, MICRO.halfWindowDays, 5),
      PLOT_BOUNDS,
    );
    for (let day = -MICRO.halfWindowDays; day <= MICRO.halfWindowDays; day += TIME_INTERVAL) {
      const x = gridTransform.modelToViewX(day);
      timeGrid.moveTo(x, plotBottom).lineTo(x, plotTop);
      timeLabels.addChild(
        label(String(day), {
          centerX: x,
          top: plotBottom + 7,
          font: "12px sans-serif",
          fill: Colors.mutedTextColorProperty,
        }),
      );
    }
    const fluxLabels = Array.from({ length: FLUX_DIVISIONS + 1 }, () =>
      label("", { font: "12px sans-serif", fill: Colors.mutedTextColorProperty }),
    );
    const horizontalGrid = new Path(null, { stroke: Colors.gridColorProperty, lineWidth: 1 });
    const filledCurve = new Path(null, { fill: Colors.curveColorProperty, opacity: 0.13 });
    const curve = new Path(null, { stroke: Colors.curveColorProperty, lineWidth: 3, lineJoin: "round" });
    const closestX = gridTransform.modelToViewX(0);
    const closest = new Path(new Shape().moveTo(closestX, plotTop).lineTo(closestX, plotBottom), {
      stroke: Colors.peakColorProperty,
      lineWidth: 1.5,
      lineDash: [5, 6],
      opacity: 0.85,
    });
    const marker = new Circle(5.5, {
      fill: Colors.curveColorProperty,
      stroke: Colors.fieldColorProperty,
      lineWidth: 2,
    });
    const markerGuide = new Path(null, { stroke: Colors.curveColorProperty, lineWidth: 1.2, lineDash: [3, 4] });
    const baseline = new Path(new Shape().moveTo(plotLeft, plotBottom).lineTo(plotRight, plotBottom), {
      stroke: Colors.mutedTextColorProperty,
      lineWidth: 1.35,
    });

    super({
      children: [
        frame,
        label(strings.curveStringProperty, { font: "bold 17px sans-serif", left: 15, top: 12 }),
        label(strings.magnificationStringProperty, { left: plotLeft, bottom: plotTop - 10 }),
        new Path(timeGrid, { stroke: Colors.gridColorProperty, lineWidth: 1 }),
        horizontalGrid,
        ...fluxLabels,
        timeLabels,
        filledCurve,
        closest,
        curve,
        baseline,
        markerGuide,
        marker,
        label(strings.timeAxisStringProperty, { centerX: PLOT_BOUNDS.centerX, top: plotBottom + 28 }),
        new HBox({
          spacing: 16,
          right: plotRight,
          top: 15,
          children: [
            legend(strings.peakStringProperty, Colors.peakColorProperty),
            legend(strings.baselineStringProperty, Colors.mutedTextColorProperty),
          ],
        }),
      ],
    });

    let transform = gridTransform;
    this.curveLink = Multilink.multilink([model.impactProperty, model.einsteinDaysProperty], (impact, einsteinDays) => {
      const peak = pointMagnification(impact);
      const rawTick = (peak - 1) / FLUX_DIVISIONS;
      const step = [0.25, 0.5, 1, 2, 3].find((size) => size > rawTick) ?? 3;
      transform = ModelViewTransform2.createRectangleInvertedYMapping(
        new Bounds2(-MICRO.halfWindowDays, 1, MICRO.halfWindowDays, 1 + FLUX_DIVISIONS * step),
        PLOT_BOUNDS,
      );
      const grid = new Shape();
      fluxLabels.forEach((tickLabel, index) => {
        const value = 1 + index * step;
        const y = transform.modelToViewY(value);
        tickLabel.string = String(Number(toFixed(value, 2)));
        tickLabel.right = plotLeft - 9;
        tickLabel.centerY = y;
        grid.moveTo(plotLeft, y).lineTo(plotRight, y);
      });
      horizontalGrid.shape = grid;
      const graph = new Shape();
      const area = new Shape().moveTo(plotLeft, plotBottom);
      for (let sample = 0; sample <= SAMPLES; sample++) {
        const day = -MICRO.halfWindowDays + (2 * MICRO.halfWindowDays * sample) / SAMPLES;
        const flux = pointMagnification(lensSeparation(day, impact, einsteinDays));
        const x = transform.modelToViewX(day);
        const y = transform.modelToViewY(flux);
        if (sample === 0) {
          graph.moveTo(x, y);
        } else {
          graph.lineTo(x, y);
        }
        area.lineTo(x, y);
      }
      curve.shape = graph;
      filledCurve.shape = area.lineTo(plotRight, plotBottom).close();
    });

    // Observe the controls too so the marker is transformed even when its flux stays constant.
    this.markerLink = Multilink.multilink(
      [model.dayProperty, model.magnificationProperty, model.impactProperty, model.einsteinDaysProperty],
      (day, flux) => {
        marker.center = transform.modelToViewXY(day, flux);
        markerGuide.shape = new Shape().moveTo(marker.x, plotBottom).lineTo(marker.x, marker.y);
      },
    );
  }

  public override dispose(): void {
    this.curveLink.dispose();
    this.markerLink.dispose();
    super.dispose();
  }
}
