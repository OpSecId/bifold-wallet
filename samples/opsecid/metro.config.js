/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const path = require('path')
const escape = require('escape-string-regexp')

const exclusionList = (additionalExclusions = []) => {
  const defaults = [
    /\/__tests__\/.*/,
    /\/android\/build\/.*/,
    /\/android\/\.gradle\/.*/,
    /\/ios\/build\/.*/,
    /\/ios\/Pods\/.*/,
    /\/\.cxx\/.*/,
    /\/\.cache\/metro\/.*/,
  ]

  const escapeRegExp = (pattern) => {
    if (pattern instanceof RegExp) {
      return pattern.source.replace(/\/|\\\//g, `\\${path.sep}`)
    }
    if (typeof pattern === 'string') {
      const escaped = pattern.replace(/[\-\[\]\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
      return escaped.replaceAll('/', `\\${path.sep}`)
    }
    throw new Error(`Expected exclusionList to be called with RegExp or string, got: ${typeof pattern}`)
  }

  return new RegExp(`(${additionalExclusions.concat(defaults).map(escapeRegExp).join('|')})$`)
}

const packageDirs = [
  path.resolve(__dirname, '../../packages/core'),
  path.resolve(__dirname, '../../packages/oca'),
  path.resolve(__dirname, '../../packages/react-hooks'),
  path.resolve(__dirname, '../../packages/verifier'),
]

const watchFolders = [...packageDirs]

const extraExclusionList = []
const extraNodeModules = {}
const localPackageEntryPoints = {
  '@bifold/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
  '@bifold/react-hooks': path.resolve(__dirname, '../../packages/react-hooks/src/index.ts'),
}

const packageStubs = {
  '@credo-ts/indy-vdr': path.resolve(__dirname, 'metro-stubs/credo-indy-vdr'),
  '@hyperledger/indy-vdr-react-native': path.resolve(__dirname, 'metro-stubs/indy-vdr-react-native'),
  '@hyperledger/indy-vdr-shared': path.resolve(__dirname, 'metro-stubs/indy-vdr-shared'),
  'react-native-tcp-socket': path.resolve(__dirname, 'metro-stubs/tcp-socket'),
  'react-native-screenguard': path.resolve(__dirname, 'metro-stubs/screenguard'),
  'react-native-gifted-chat': path.resolve(__dirname, 'metro-stubs/gifted-chat'),
  '@expo/app-integrity': path.resolve(__dirname, 'metro-stubs/expo-app-integrity'),
  'expo-crypto': path.resolve(__dirname, 'metro-stubs/expo-crypto'),
  '@credo-ts/payments': path.resolve(__dirname, 'metro-stubs/optional-empty'),
  '@ajna-inc/payments': path.resolve(__dirname, 'metro-stubs/optional-empty'),
  '@ajna-inc/poe': path.resolve(__dirname, 'metro-stubs/optional-empty'),
}

const fallbackResolveRequest = (context, moduleName, platform) => {
  if (context.resolveRequest) {
    return context.resolveRequest(context, moduleName, platform)
  }

  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const { resolve } = require('metro-resolver')
  return resolve(context, moduleName, platform)
}

for (const packageDir of packageDirs) {
  const pak = require(path.join(packageDir, 'package.json'))
  const modules = Object.keys({
    ...pak.dependencies,
    ...pak.peerDependencies,
    ...pak.devDependencies,
  })
  extraExclusionList.push(...modules.map((m) => path.join(packageDir, 'node_modules', m)))

  modules.reduce((acc, name) => {
    if (!(name in acc)) {
      acc[name] = path.join(__dirname, 'node_modules', name)
    }
    return acc
  }, extraNodeModules)
}

Object.assign(extraNodeModules, packageStubs)

const defaultConfig = getDefaultConfig(__dirname)
const {
  resolver: { sourceExts, assetExts },
} = defaultConfig

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const combinedWatchFolders = Array.from(new Set([...(defaultConfig.watchFolders || []), ...watchFolders]))

const metroCacheRoot = path.join(__dirname, '.cache', 'metro')
let cacheStores = defaultConfig.cacheStores
try {
  // Persist Metro's transform cache in the project so WSL/tmp wipes and
  // `yarn start --reset-cache` are the only ways to drop it.
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const { FileStore } = require('metro-cache')
  cacheStores = [new FileStore({ root: metroCacheRoot })]
} catch {
  cacheStores = defaultConfig.cacheStores
}

const config = mergeConfig(defaultConfig, {
  cacheStores,
  cacheVersion: 'opsecid-wallet-5',
  resetCache: false,
  transformer: {
    ...defaultConfig.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    ...defaultConfig.resolver,
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName in localPackageEntryPoints) {
        return {
          type: 'sourceFile',
          filePath: localPackageEntryPoints[moduleName],
        }
      }

      const stubName = Object.keys(packageStubs).find(
        (name) => moduleName === name || moduleName.startsWith(`${name}/`)
      )
      if (stubName) {
        return {
          type: 'sourceFile',
          filePath: path.join(packageStubs[stubName], 'index.js'),
        }
      }

      return fallbackResolveRequest(context, moduleName, platform)
    },
    blockList: exclusionList(extraExclusionList.map((m) => new RegExp(`^${escape(m)}[/\\\\].*$`))),
    extraNodeModules: {
      ...(defaultConfig.resolver.extraNodeModules || {}),
      ...extraNodeModules,
    },
    tslib: path.join(__dirname, 'node_modules/tslib'),
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg', 'cjs', 'mjs'],
    unstable_enablePackageExports: true,
    unstable_conditionNames: ['react-native', 'browser', 'require'],
  },
  watchFolders: combinedWatchFolders,
})

try {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const { withNativeWind } = require('nativewind/metro')
  module.exports = withNativeWind(config, { input: './global.css' })
} catch {
  module.exports = config
}
