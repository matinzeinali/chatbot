export interface Palette {
  /** Accent used for switches, primary buttons, etc. */
  glow: string;
  /** Very dark tint used for the dimming layer and the glass panels. */
  ink: string;
}

const SAMPLE_W = 64;
const SAMPLE_H = 40;

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Dominant hue of the image, weighted toward saturated, mid-lightness pixels.
// Near-grayscale images yield a neutral palette.
export function paletteFromPixels(data: Uint8ClampedArray): Palette {
  let x = 0;
  let y = 0;
  let satSum = 0;
  let weightSum = 0;

  for (let i = 0; i < data.length; i += 4) {
    const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
    const weight = s * Math.max(0.05, 1 - Math.abs(l - 0.5) * 1.6);
    const rad = (h * Math.PI) / 180;
    x += Math.cos(rad) * weight;
    y += Math.sin(rad) * weight;
    satSum += s * weight;
    weightSum += weight;
  }

  const pixels = data.length / 4;
  const avgWeight = weightSum / pixels;
  if (avgWeight < 0.02) {
    return { glow: "hsl(0 0% 28%)", ink: "hsl(0 0% 7%)" };
  }

  const hue = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  const sat = satSum / weightSum;
  return {
    glow: `hsl(${hue.toFixed(0)} ${(clamp(sat, 0.25, 0.6) * 100).toFixed(0)}% 28%)`,
    ink: `hsl(${hue.toFixed(0)} ${(clamp(sat * 0.5, 0.08, 0.4) * 100).toFixed(0)}% 8%)`,
  };
}

const cache = new Map<string, Palette>();

export function extractPalette(src: string): Promise<Palette> {
  const cached = cache.get(src);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = SAMPLE_W;
      canvas.height = SAMPLE_H;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return reject(new Error("Canvas is not available"));
      ctx.drawImage(img, 0, 0, SAMPLE_W, SAMPLE_H);
      const palette = paletteFromPixels(ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data);
      cache.set(src, palette);
      resolve(palette);
    };
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });
}
