import { describe, expect, it } from "vitest";
import { MICRO } from "../src/GravitationalLensingConstants.js";
import { centerImagePattern, sourcePlaneScale } from "../src/galaxy/model/GalaxyLens.js";
import { GalaxyLensingModel } from "../src/galaxy/model/GalaxyLensingModel.js";
import { MicrolensingModel } from "../src/microlensing/model/MicrolensingModel.js";
import { lensSeparation, pointMagnification } from "../src/microlensing/model/PointLens.js";

describe("spherical galaxy lens", () => {
  it("maps the Einstein radius to the aligned source and reverses the inner image", () => {
    const radius = 1.15;
    expect(sourcePlaneScale(radius, radius)).toBe(0);
    expect(1.65 * sourcePlaneScale(1.65, radius)).toBeCloseTo(0.5);
    expect(-0.65 * sourcePlaneScale(0.65, radius)).toBeCloseTo(0.5);
  });

  it("keeps the one-, two-image and aligned presets valid as radius changes", () => {
    const model = new GalaxyLensingModel();
    for (const radius of [model.einsteinRadiusProperty.range.min, model.einsteinRadiusProperty.range.max]) {
      model.einsteinRadiusProperty.value = radius;
      model.selectPreset("single");
      expect(centerImagePattern(model.lensPositionProperty.value.magnitude, radius)).toBe("one");
      model.selectPreset("double");
      expect(centerImagePattern(model.lensPositionProperty.value.magnitude, radius)).toBe("two");
      model.selectPreset("ring");
      expect(centerImagePattern(model.lensPositionProperty.value.magnitude, radius)).toBe("ring");
    }
    model.dispose();
  });
});

describe("stellar microlensing", () => {
  it("peaks at closest approach and approaches the unlensed baseline in both wings", () => {
    const flux = (day: number, impact = 0.3, duration = 15) =>
      pointMagnification(lensSeparation(day, impact, duration));
    expect(flux(0)).toBeCloseTo(3.445);
    expect(flux(-10)).toBe(flux(10));
    expect(flux(1e4)).toBeCloseTo(1);
    expect(flux(0, 0.2)).toBeGreaterThan(flux(0));
    expect(flux(20, 0.3, 30)).toBeGreaterThan(flux(20));
  });

  it("stops at the end, rewinds on replay, and resets both trajectory controls", () => {
    const model = new MicrolensingModel();
    model.impactProperty.value = 0.5;
    model.einsteinDaysProperty.value = 24;
    model.dayProperty.value = MICRO.halfWindowDays - 1;
    model.isPlayingProperty.value = true;
    model.step(1);
    expect(model.dayProperty.value).toBe(MICRO.halfWindowDays);
    expect(model.isPlayingProperty.value).toBe(false);
    model.isPlayingProperty.value = true;
    expect(model.dayProperty.value).toBe(-MICRO.halfWindowDays);
    model.reset();
    expect(model.dayProperty.value).toBe(MICRO.initialDay);
    expect(model.impactProperty.value).toBe(MICRO.initialImpact);
    expect(model.einsteinDaysProperty.value).toBe(MICRO.initialEinsteinDays);
    model.dispose();
  });
});
