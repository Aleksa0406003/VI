const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro mora da zna da .tflite fajl tretira kao binarni asset,
 * inače će pokušati da ga parsira kao JS/JSON i pući će.
 */
const config = {
  resolver: {
    assetExts: [
      ...getDefaultConfig(__dirname).resolver.assetExts,
      'tflite',
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
