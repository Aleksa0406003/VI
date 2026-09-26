import { Skia, AlphaType, ColorType } from '@shopify/react-native-skia';

// Model očekuje ulaz oblika [1, 3, 640, 640] => NCHW (kanali prvi),
// float32, vrednosti normalizovane na [0, 1].
export const MODEL_INPUT_SIZE = 640;

export async function preprocessImage(uri) {
  const data = await fetch(uri);
  const arrayBuffer = await data.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  const skData = Skia.Data.fromBytes(bytes);
  const image = Skia.Image.MakeImageFromEncoded(skData);

  if (!image) {
    throw new Error('Nije moguće dekodirati sliku. Proveri format fajla.');
  }

  const originalWidth = image.width();
  const originalHeight = image.height();

  const surface = Skia.Surface.MakeOffscreen(
    MODEL_INPUT_SIZE,
    MODEL_INPUT_SIZE,
  );
  const canvas = surface.getCanvas();
  const paint = Skia.Paint();

  canvas.drawImageRect(
    image,
    { x: 0, y: 0, width: originalWidth, height: originalHeight },
    { x: 0, y: 0, width: MODEL_INPUT_SIZE, height: MODEL_INPUT_SIZE },
    paint,
  );

  surface.flush();
  const snapshot = surface.makeImageSnapshot();

  const pixels = snapshot.readPixels(0, 0, {
    width: MODEL_INPUT_SIZE,
    height: MODEL_INPUT_SIZE,
    colorType: ColorType.RGBA_8888,
    alphaType: AlphaType.Unpremul,
  });

  const numPixels = MODEL_INPUT_SIZE * MODEL_INPUT_SIZE;
  // NCHW layout: prvo svi R pikseli (cela ravan), pa svi G, pa svi B.
  const inputTensor = new Float32Array(numPixels * 3);

  for (let p = 0; p < numPixels; p++) {
    const i = p * 4;
    inputTensor[p] = pixels[i] / 255; // R plane
    inputTensor[numPixels + p] = pixels[i + 1] / 255; // G plane
    inputTensor[2 * numPixels + p] = pixels[i + 2] / 255; // B plane
  }

  image.dispose();
  snapshot.dispose();

  return {
    inputTensor,
    originalWidth,
    originalHeight,
  };
}
