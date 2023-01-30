import { colord } from "colord";

export function getPixels(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

function grayscale(pixels: ImageData) {
  const d = pixels.data;
  let max = 0;
  let min = 255;
  for (let i=0; i < d.length; i+=4) {
    // Fetch maximum and minimum pixel values
    if (d[i] > max) { max = d[i]; }
    if (d[i] < min) { min = d[i]; }
    // Grayscale by averaging RGB values
    const r = d[i];
    const g = d[i+1];
    const b = d[i+2];
    const v = 0.3333*r + 0.3333*g + 0.3333*b;
    d[i] = v; 
    d[i+1] = v; 
    d[i+2] = v;
  }
  for (let i=0; i < d.length; i+=4) {
    // Normalize each pixel to scale 0-255
    const v = (d[i] - min) * 255/(max-min);
    d[i] = v; 
    d[i+1] = v; 
    d[i+2] = v;
  }
  return pixels;
};

function gradientMap(tone1: string, tone2: string) {
  const rgb1 = colord(tone1).toRgb();
  const rgb2 = colord(tone2).toRgb();
  const gradient = [];
  for (let i = 0; i < (256*4); i += 4) {
    gradient[i] = ((256-(i/4))*rgb1.r + (i/4)*rgb2.r)/256;
    gradient[i+1] = ((256-(i/4))*rgb1.g + (i/4)*rgb2.g)/256;
    gradient[i+2] = ((256-(i/4))*rgb1.b + (i/4)*rgb2.b)/256;
    gradient[i+3] = 255;
  }
  return gradient;
};

export function duotone(pixels: ImageData, tone1:string, tone2:string) {
  const greypixels = grayscale(pixels);
  const gradient = gradientMap(tone1, tone2);
  const d = greypixels.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = gradient[d[i]*4];
    d[i+1] = gradient[d[i+1]*4 + 1];
    d[i+2] = gradient[d[i+2]*4 + 2];
  }
  return pixels;
};

export function cloneData(pixels: ImageData):ImageData {
  const imageDataCopy = new ImageData(
    new Uint8ClampedArray(pixels.data),
    pixels.width,
    pixels.height
  )
  return imageDataCopy;
}