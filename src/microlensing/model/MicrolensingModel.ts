/** Time and trajectory controls for an isolated stellar microlensing event. */
import { BooleanProperty, DerivedProperty, NumberProperty } from "scenerystack/axon";
import { Range } from "scenerystack/dot";
import type { TModel } from "scenerystack/joist";
import { MICRO } from "../../GravitationalLensingConstants.js";
import { lensSeparation, pointMagnification } from "./PointLens.js";

export class MicrolensingModel implements TModel {
  public readonly impactProperty = new NumberProperty(MICRO.initialImpact, {
    range: new Range(MICRO.minImpact, MICRO.maxImpact),
  });
  public readonly einsteinDaysProperty = new NumberProperty(MICRO.initialEinsteinDays, {
    range: new Range(MICRO.minEinsteinDays, MICRO.maxEinsteinDays),
  });
  public readonly dayProperty = new NumberProperty(MICRO.initialDay, {
    range: new Range(-MICRO.halfWindowDays, MICRO.halfWindowDays),
  });
  public readonly isPlayingProperty = new BooleanProperty(false);
  public readonly magnificationProperty = new DerivedProperty(
    [this.dayProperty, this.impactProperty, this.einsteinDaysProperty],
    (day, impact, einsteinDays) => pointMagnification(lensSeparation(day, impact, einsteinDays)),
  );

  public constructor() {
    this.isPlayingProperty.lazyLink((playing) => {
      if (playing && this.dayProperty.value === MICRO.halfWindowDays) {
        this.dayProperty.value = -MICRO.halfWindowDays;
      }
    });
  }

  public step(dt: number): void {
    if (this.isPlayingProperty.value) {
      this.advanceDays(dt * MICRO.playbackDaysPerSecond);
    }
  }

  public advanceDays(days: number): void {
    this.dayProperty.value = Math.min(this.dayProperty.value + days, MICRO.halfWindowDays);
    if (this.dayProperty.value === MICRO.halfWindowDays) {
      this.isPlayingProperty.value = false;
    }
  }

  public reset(): void {
    this.isPlayingProperty.reset();
    this.dayProperty.reset();
    this.impactProperty.reset();
    this.einsteinDaysProperty.reset();
  }

  public dispose(): void {
    this.magnificationProperty.dispose();
    this.isPlayingProperty.dispose();
    this.dayProperty.dispose();
    this.impactProperty.dispose();
    this.einsteinDaysProperty.dispose();
  }
}
