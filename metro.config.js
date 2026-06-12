const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable Watchman to avoid file watcher limits on macOS
config.watchFolders = [];
config.resolver = config.resolver || {};
config.resolver.useWatchman = false;

module.exports = config;
