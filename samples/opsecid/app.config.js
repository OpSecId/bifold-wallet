/* eslint-disable @typescript-eslint/no-var-requires */
const appJson = require('./app.json')
const pkg = require('./package.json')

module.exports = {
  expo: {
    name: appJson.displayName || appJson.name || 'OpSecId Wallet',
    slug: 'opsecid-wallet',
    version: pkg.version,
    platforms: ['ios', 'android'],
    autolinking: {
      exclude: ['@expo/app-integrity', 'expo-application', 'expo-crypto'],
    },
  },
}
