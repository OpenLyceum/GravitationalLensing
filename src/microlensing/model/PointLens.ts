/** Unresolved magnification of a point source by a point mass, with rectilinear relative motion. */

/** Separation in Einstein radii at the given time relative to closest approach. */
export function lensSeparation(day: number, impact: number, einsteinDays: number): number {
  return Math.hypot(impact, day / einsteinDays);
}

/** Sum of the absolute magnifications of the two point-mass images. */
export function pointMagnification(separation: number): number {
  const squaredSeparation = separation * separation;
  return (squaredSeparation + 2) / (separation * Math.sqrt(squaredSeparation + 4));
}
