// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const { assetExts, sourceExts } = config.resolver;

// 1. Configure the transformer to use the Expo plugin variant
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};

// 2. Adjust the resolver extensions for SVGs
config.resolver = {
  ...config.resolver,
  assetExts: assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...sourceExts, 'svg'],
};

module.exports = config;
