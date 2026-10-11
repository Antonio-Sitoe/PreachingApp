const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer/expo');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.assetExts.push('wasm');
config.resolver.sourceExts.push('svg', 'sql');

module.exports = withNativeWind(config, { input: './src/app/global.css', inlineRem: 16 });
