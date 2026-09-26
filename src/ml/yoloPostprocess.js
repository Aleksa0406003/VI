import { MODEL_INPUT_SIZE } from './preprocess';

const CONFIDENCE_THRESHOLD = 0.4;
const IOU_THRESHOLD = 0.45;
const NUM_CLASSES = 1;
const LABELS = ['matica'];

// Izlaz modela je oblika [1, 5, 8400]:
//   5 = 4 koordinate bbox-a (cx, cy, w, h) + 1 skor klase (matica)
//   8400 = broj kandidata (anchor tačaka)
export function parseYoloOutput(output, originalWidth, originalHeight) {
  const raw = output[0];
  console.log('raw[0..3]:', raw[0], raw[1], raw[2], raw[3]);

  const numAttributes = 4 + NUM_CLASSES;
  const numCandidates = raw.length / numAttributes;

  const candidates = [];

  for (let i = 0; i < numCandidates; i++) {
    const xCenter = raw[i];
    const yCenter = raw[numCandidates + i];
    const width = raw[2 * numCandidates + i];
    const height = raw[3 * numCandidates + i];

    let bestClassScore = 0;
    let bestClassIndex = 0;
    for (let c = 0; c < NUM_CLASSES; c++) {
      const score = raw[(4 + c) * numCandidates + i];
      if (score > bestClassScore) {
        bestClassScore = score;
        bestClassIndex = c;
      }
    }

    if (bestClassScore < CONFIDENCE_THRESHOLD) {
      continue;
    }

const boxWidth = width * originalWidth;
const boxHeight = height * originalHeight;
const x = (xCenter - width / 2) * originalWidth;
const y = (yCenter - height / 2) * originalHeight;

    candidates.push({
      x,
      y,
      width: boxWidth,
      height: boxHeight,
      score: bestClassScore,
      label: LABELS[bestClassIndex] ?? 'nepoznato',
    });
  }

  return nonMaxSuppression(candidates, IOU_THRESHOLD);
}

function iou(a, b) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  const y2 = Math.min(a.y + a.height, b.y + b.height);

  const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const areaA = a.width * a.height;
  const areaB = b.width * b.height;
  const union = areaA + areaB - intersection;

  return union <= 0 ? 0 : intersection / union;
}

function nonMaxSuppression(boxes, iouThreshold) {
  const sorted = [...boxes].sort((a, b) => b.score - a.score);
  const selected = [];

  while (sorted.length > 0) {
    const current = sorted.shift();
    selected.push(current);

    for (let i = sorted.length - 1; i >= 0; i--) {
      if (iou(current, sorted[i]) > iouThreshold) {
        sorted.splice(i, 1);
      }
    }
  }

  return selected;
}
