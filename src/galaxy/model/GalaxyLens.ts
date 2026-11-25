/** Thin lens for a spherical galaxy with a singular isothermal mass profile. */
/** Signed radial source coordinate from beta = theta - theta_E theta/|theta|. */
export function sourcePlaneScale(radius: number, einsteinRadius: number): number {
  return radius === 0 ? 1 : 1 - einsteinRadius / radius;
}

/** Image multiplicities of the source center, with the degenerate circle at perfect alignment. */
export function centerImagePattern(separation: number, einsteinRadius: number): "ring" | "two" | "one" {
  if (separation < 1e-9) {
    return "ring";
  }
  return separation < einsteinRadius ? "two" : "one";
}
