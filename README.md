# Gravitational Lensing

[Run Gravitational Lensing](https://openlyceum.github.io/GravitationalLensing/)

## Features

- **Galaxy Lensing** — Drag the foreground galaxy or use the alignment presets to explore one image,
  two images, distorted arcs, and a full Einstein ring. Adjust the Einstein radius and show alignment guides.
- **Microlensing** — Play, step, or scrub a stellar flyby. Change the minimum separation and Einstein crossing
  time and compare the relative brightness and peak.
- Keyboard controls, screen-reader summaries, projector mode, and English, French, and Spanish interfaces.

## Quick Start

With Node.js 26 or newer, run `npm ci` and `npm start`. Open the local link printed by Vite.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run check` | Type-check the sim, scripts, and tests |
| `npm run lint` | Check Biome style and conventions |
| `npm run check:architecture` | Check module boundaries |
| `npm run check:unused` | Check for unused code |
| `npm test` | Run model and lifecycle tests |
| `npm run build` | Build the installable web simulation |
| `npm run build:single` | Build an offline HTML file |
| `npm run test:fuzz:quick` | Run the quick browser fuzz check |

## Tech Stack

SceneryStack, TypeScript, Vite, and Vitest. See [the model notes](doc/model.md) for the lens equations and assumptions.

## License

AGPL-3.0-or-later. See the [OpenLyceum license](https://github.com/OpenLyceum/.github/blob/main/LICENSE).

## Contributing

See the [OpenLyceum contribution guide](https://github.com/OpenLyceum/.github/blob/main/CONTRIBUTING.md).
