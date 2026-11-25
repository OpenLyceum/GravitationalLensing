/**
 * Memory-leak regression suite (fleet standard).
 *
 * List every model/view object that links Properties, adds listeners, or owns child
 * nodes, with a factory that builds a fresh instance. The shared harness in
 * tests/helpers/memoryLeak.ts (template-owned) checks that each one is garbage
 * collected after dispose() and leaves no survivors across repeated cycles
 * (idempotentDispose: true also checks a second dispose()). Add sim-specific leak
 * tests below using forceGC().
 */

import { Vector2 } from "scenerystack/dot";
import { ModelViewTransform2 } from "scenerystack/phetcommon";
import { GalaxyLensingModel } from "../src/galaxy/model/GalaxyLensingModel.js";
import { GalaxyFieldNode } from "../src/galaxy/view/GalaxyFieldNode.js";
import { GalaxyImageNode } from "../src/galaxy/view/GalaxyImageNode.js";
import { MicrolensingModel } from "../src/microlensing/model/MicrolensingModel.js";
import { LightCurveNode } from "../src/microlensing/view/LightCurveNode.js";
import { StarTrajectoryNode } from "../src/microlensing/view/StarTrajectoryNode.js";
import { describeDisposalLeaks } from "./helpers/memoryLeak.js";

const galaxyModel = new GalaxyLensingModel();
const stellarModel = new MicrolensingModel();

describeDisposalLeaks([
  { name: "GalaxyFieldNode", create: () => new GalaxyFieldNode(galaxyModel) },
  {
    name: "GalaxyImageNode",
    create: () =>
      new GalaxyImageNode(
        galaxyModel,
        ModelViewTransform2.createSinglePointScaleInvertedYMapping(Vector2.ZERO, Vector2.ZERO, 1),
        32,
        24,
      ),
  },
  { name: "LightCurveNode", create: () => new LightCurveNode(stellarModel) },
  { name: "StarTrajectoryNode", create: () => new StarTrajectoryNode(stellarModel) },
  { name: "GalaxyLensingModel", create: () => new GalaxyLensingModel() },
  { name: "MicrolensingModel", create: () => new MicrolensingModel() },
]);
