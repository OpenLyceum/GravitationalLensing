/** State and physical controls for strong galaxy lensing. */
import { BooleanProperty, NumberProperty, Property } from "scenerystack/axon";
import { Bounds2, Range, Vector2, Vector2Property } from "scenerystack/dot";
import type { TModel } from "scenerystack/joist";
import { GALAXY } from "../../GravitationalLensingConstants.js";

export class GalaxyLensingModel implements TModel {
  public readonly lensPositionProperty = new Vector2Property(
    new Vector2(GALAXY.presets.double.x, GALAXY.presets.double.y),
  );
  public readonly lensBoundsProperty = new Property(
    new Bounds2(-GALAXY.lensLimitX, -GALAXY.lensLimitY, GALAXY.lensLimitX, GALAXY.lensLimitY),
  );
  public readonly einsteinRadiusProperty = new NumberProperty(GALAXY.initialEinsteinRadius, {
    range: new Range(GALAXY.minEinsteinRadius, GALAXY.maxEinsteinRadius),
  });
  public readonly showGuidesProperty = new BooleanProperty(false);

  /** Set the relative alignment while preserving the selected Einstein radius. */
  public selectPreset(preset: keyof typeof GALAXY.presets): void {
    const { x, y } = GALAXY.presets[preset];
    const scale = preset === "double" ? this.einsteinRadiusProperty.value / GALAXY.initialEinsteinRadius : 1;
    this.lensPositionProperty.value = new Vector2(x * scale, y * scale);
  }

  public reset(): void {
    this.lensPositionProperty.reset();
    this.einsteinRadiusProperty.reset();
    this.showGuidesProperty.reset();
  }

  public dispose(): void {
    this.lensPositionProperty.dispose();
    this.lensBoundsProperty.dispose();
    this.einsteinRadiusProperty.dispose();
    this.showGuidesProperty.dispose();
  }
}
