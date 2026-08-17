import 'fast-text-encoding' // polyfill for TextEncoder and TextDecoder
import 'react-native-gesture-handler'
import 'react-native-url-polyfill/auto'
import 'reflect-metadata'
import '@openwallet-foundation/askar-react-native'
import '@formatjs/intl-getcanonicallocales/polyfill'
import '@formatjs/intl-locale/polyfill'
import '@formatjs/intl-pluralrules/polyfill'
import '@formatjs/intl-pluralrules/locale-data/en'

// Used to decode base64 in Credo and other sub-modules
import { decode, encode } from 'base-64'

if (!global.btoa) {
  global.btoa = encode
}

if (!global.atob) {
  global.atob = decode
}

import { Buffer } from 'buffer'

if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer
}

import { initLanguages, translationResources, MainContainer } from '@bifold/core'
import { AppRegistry } from 'react-native'
import { container } from 'tsyringe'

import { name as appName } from './app.json'
import { AppContainer } from './container-imp'
import createOpsecidApp from './src/App'

initLanguages({ en: translationResources.en })
const bifoldContainer = new MainContainer(container.createChildContainer(), undefined, {
  enableOpenIDCredentialRefresh: false,
}).init()
const appContainer = new AppContainer(bifoldContainer).init()
const App = createOpsecidApp(appContainer)
AppRegistry.registerComponent(appName, () => App)
