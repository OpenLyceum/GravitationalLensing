# Implementation notes

- Each screen owns a separate model. The galaxy's alignment and Einstein radius
  are independent of the stellar event parameters.
- The galaxy view precomputes a source brightness texture. The canvas back-traces
  image pixels on alignment, radius, or projector palette changes. It reuses
  its pixel buffer and leaves the foreground galaxy and guides in the Scenery scene.
- The light curve is sampled into a Scenery path when the event parameters change.
  The current point and trajectory update with the playback clock or time slider.
- Lens dragging shares one model/view transform across mouse, touch, and keyboard.
  Pattern string properties expose the current alignment and magnification to screen readers.
