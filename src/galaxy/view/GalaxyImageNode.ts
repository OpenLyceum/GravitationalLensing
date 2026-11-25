/** Backward ray-tracing of the extended source, one mapped sample per image pixel. */
import { Multilink } from "scenerystack/axon";
import { Bounds2 } from "scenerystack/dot";
import type { ModelViewTransform2 } from "scenerystack/phetcommon";
import { CanvasNode } from "scenerystack/scenery";
import Colors from "../../GravitationalLensingColors.js";
import { GALAXY } from "../../GravitationalLensingConstants.js";
import { sourcePlaneScale } from "../model/GalaxyLens.js";
import type { GalaxyLensingModel } from "../model/GalaxyLensingModel.js";

const TEXTURE_SIZE = 256;
const TEXTURE_HALF_SIZE = TEXTURE_SIZE / 2;
const GLOW_LIMIT = 1.3;

/** Intensity and core color weight of a stylized extended spiral in source-plane coordinates. */
function sourceTexture(): { intensity: Float32Array; core: Float32Array } {
  const intensity = new Float32Array(TEXTURE_SIZE * TEXTURE_SIZE);
  const core = new Float32Array(intensity.length);
  for (let row = 0; row < TEXTURE_SIZE; row++) {
    for (let column = 0; column < TEXTURE_SIZE; column++) {
      const aspectRatio = 0.85;
      const x = ((column + 0.5) / TEXTURE_HALF_SIZE - 1) * GLOW_LIMIT;
      const y = (((row + 0.5) / TEXTURE_HALF_SIZE - 1) * GLOW_LIMIT) / aspectRatio;
      const radius = Math.hypot(x, y);
      const angle = Math.atan2(y, x);
      const centralGlow = Math.exp(-16 * radius * radius);
      const spiralRidges = (0.5 + 0.5 * Math.cos(2 * angle - 6 * Math.log(radius + 0.21))) ** 4;
      const disk = 0.5 * Math.exp(-2.7 * radius * radius) * Math.max(0, 1 - (radius / GLOW_LIMIT) ** 3);
      const knots = 0.85 + 0.15 * Math.sin(38 * x + 24 * y) * Math.cos(31 * y - 14 * x);
      const index = row * TEXTURE_SIZE + column;
      intensity[index] = Math.min(1, 0.87 * centralGlow + disk * (0.65 + 1.15 * spiralRidges * knots));
      core[index] = 0.88 * centralGlow;
    }
  }
  return { intensity, core };
}

const texture = sourceTexture();

export class GalaxyImageNode extends CanvasNode {
  private readonly buffer = document.createElement("canvas");
  private readonly invalidateLink: Pick<ReturnType<typeof Multilink.multilink>, "dispose">;
  private dirty = true;

  public constructor(model: GalaxyLensingModel, transform: ModelViewTransform2, width: number, height: number) {
    super({ canvasBounds: Bounds2.rect(0, 0, width, height), pickable: false });
    this.buffer.width = width;
    this.buffer.height = height;

    const columns = Float64Array.from({ length: width }, (_, x) => transform.viewToModelX(x + 0.5));
    const rows = Float64Array.from({ length: height }, (_, y) => transform.viewToModelY(y + 0.5));
    const bufferContext = this.buffer.getContext("2d");
    const pixels = bufferContext?.createImageData(width, height);

    this.repaintBuffer = () => {
      if (!(pixels && bufferContext)) {
        return;
      }
      const lens = model.lensPositionProperty.value;
      const einsteinRadius = model.einsteinRadiusProperty.value;
      const outerColor = Colors.imageColorProperty.value;
      const coreColor = Colors.imageCoreColorProperty.value;
      const textureScale = TEXTURE_HALF_SIZE / (GALAXY.sourceRadius * GLOW_LIMIT);
      const rgba = pixels.data;
      rgba.fill(0);

      for (let row = 0; row < height; row++) {
        const ry = (rows[row] ?? 0) - lens.y;
        for (let column = 0; column < width; column++) {
          const rx = (columns[column] ?? 0) - lens.x;
          const factor = sourcePlaneScale(Math.sqrt(rx * rx + ry * ry), einsteinRadius);
          const mappedX = (lens.x + rx * factor) * textureScale + TEXTURE_HALF_SIZE;
          // Convert the mathematical source Y to texture rows.
          const mappedY = -(lens.y + ry * factor) * textureScale + TEXTURE_HALF_SIZE;
          if (mappedX < 0 || mappedX >= TEXTURE_SIZE || mappedY < 0 || mappedY >= TEXTURE_SIZE) {
            continue;
          }
          const sampleIndex = Math.floor(mappedY) * TEXTURE_SIZE + Math.floor(mappedX);
          const alpha = texture.intensity[sampleIndex] ?? 0;
          if (alpha < 0.012) {
            continue;
          }
          const fraction = texture.core[sampleIndex] ?? 0;
          const index = 4 * (row * width + column);
          rgba[index] = outerColor.red + fraction * (coreColor.red - outerColor.red);
          rgba[index + 1] = outerColor.green + fraction * (coreColor.green - outerColor.green);
          rgba[index + 2] = outerColor.blue + fraction * (coreColor.blue - outerColor.blue);
          rgba[index + 3] = 255 * alpha;
        }
      }
      bufferContext.putImageData(pixels, 0, 0);
    };

    this.invalidateLink = Multilink.multilink(
      [
        model.lensPositionProperty,
        model.einsteinRadiusProperty,
        Colors.imageColorProperty,
        Colors.imageCoreColorProperty,
      ],
      () => {
        this.dirty = true;
        this.invalidatePaint();
      },
    );
  }

  private readonly repaintBuffer: () => void;

  public override paintCanvas(context: CanvasRenderingContext2D): void {
    if (this.dirty) {
      this.repaintBuffer();
      this.dirty = false;
    }
    context.drawImage(this.buffer, 0, 0);
  }

  public override dispose(): void {
    this.invalidateLink.dispose();
    this.buffer.width = 0;
    this.buffer.height = 0;
    super.dispose();
  }
}
