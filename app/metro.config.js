const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  // @formvision/core is a local file: dependency (symlinked); Metro must watch it.
  watchFolders: [path.resolve(__dirname, '../packages/core')],
  // Files under packages/core must resolve dependencies (e.g. @babel/runtime) from the app.
  // Ubuntu's watchman 4.9 misses file changes here, serving stale bundles; use Node's watcher.
  resolver: { nodeModulesPaths: [path.resolve(__dirname, 'node_modules')], useWatchman: false },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
