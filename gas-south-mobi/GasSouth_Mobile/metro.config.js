/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
module.exports = {
  resolver: {
    sourceExts: ['js', 'json', 'ts', 'tsx', 'cjs'], // Add 'cjs' as a source extension
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};