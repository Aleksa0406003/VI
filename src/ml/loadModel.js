import { loadTensorflowModel } from 'react-native-fast-tflite';

// Model mora biti u src/assets/queen_bee_model.tflite i registrovan
// kao asset ekstenzija u metro.config.js (već podešeno).
//
// NAPOMENA O VERZIJI: react-native-fast-tflite je ovdje FIKSIRAN na 1.6.1
// (vidi package.json - bez '^') jer ta verzija koristi "stari" JSI API:
//   - model.run(...) / model.runSync(...) prima niz TypedArray-eva
//     (npr. [floatArray]), NE sirove ArrayBuffer-e.
//   - Izlaz je isto niz TypedArray-eva, spreman za čitanje (nema potrebe
//     za ručnim "wrap-ovanjem" u TypedArray).
// Ako se ikad uradi upgrade na v3.x (Nitro Modules), ovaj API se menja i
// potrebno je prilagoditi loadModel.js / DetectionScreen.js.

let cachedModel = null;

export async function getModel() {
  if (cachedModel) {
    return cachedModel;
  }

  const model = await loadTensorflowModel(
    require('../assets/queen_bee_model.tflite'),
  );

  console.log('TFLite model inputs:', JSON.stringify(model.inputs));
  console.log('TFLite model outputs:', JSON.stringify(model.outputs));

  cachedModel = model;
  return cachedModel;
}
