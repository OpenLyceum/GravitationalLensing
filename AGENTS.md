# AGENTS.md — Gravitational Lensing

This project is an OpenLyceum SceneryStack simulation. Follow the shared
[OpenLyceum guidance](https://github.com/OpenLyceum/.github/blob/main/AGENTS.md).

- `src/galaxy/model` implements the singular isothermal sphere in arcseconds.
  `GalaxyImageNode` maps image pixels through the lens equation into a fixed source texture.
- `src/microlensing/model` implements unresolved point-lens magnification and playback.
  Time is measured in days and separation in Einstein radii.
- `src/GravitationalLensingConstants.ts` defines model ranges, starter alignments, and layout dimensions.
- `tests` uses the fleet Vitest happy-dom setup. Run `npm test`,
  `npm run check`, `npm run lint`, and `npm run build` before submitting changes.
- `doc/model.md` describes the two approximations and their observable quantities.
