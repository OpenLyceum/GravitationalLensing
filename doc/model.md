# Model

## Galaxy lensing

The foreground galaxy is a spherical singular isothermal lens. Given image position
`θ` relative to the lens center, back-trace at source position `β = θ − θE θ / |θ|`,
where `θE` is the angular Einstein radius. The source-plane brightness sampled at
`β` becomes the image-plane surface brightness. Separations and radii are in arcseconds.

An exactly aligned source center maps to a circle of radius `θE`. At separation
`0 < β < θE` the source center has two images, with the inner one on the opposite
side of the lens. At `β ≥ θE` one regular image remains. The controls describe the
multiplicity of the center because different parts of the finite source can cross
this boundary independently. The finite source width produces arcs with visible thickness.
The amber lens light is a visual reference. It has no effect on the back-tracing.

The group of guides marks the unlensed source and the tangential critical curve.
This spherical model has axial symmetry and omits tidal shear from nearby mass.

[Reference derivation (Appendix B)](https://academic.oup.com/mnras/article/445/2/1942/1411070)

## Stellar microlensing

For a point source moving in a straight line relative to a point lens, the
separation in Einstein radii is `u(t) = √[u₀² + (t/tE)²]`. Time zero is closest approach,
`u₀` is the minimum separation, and `tE` is the time required to move one Einstein radius.
The two unresolved images have a combined brightness of
`A(t) = (u² + 2)/(u √(u² + 4))` times the unlensed source brightness.
Smaller `u₀` raises the peak. Larger `tE` broadens the curve at fixed `u₀`.
The model assumes an isolated lens and omits the lens's own flux from the plotted measurement.

[Point-lens reference](https://www.physics.ox.ac.uk/system/files/file_attachments/ASTR_635_notes.pdf)
