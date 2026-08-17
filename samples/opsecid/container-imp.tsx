import {
  BifoldLogger,
  Container,
  defaultConfig,
  Locales,
  TokenMapping,
  TOKENS,
} from '@bifold/core'
import { DependencyContainer } from 'tsyringe'

import EmptyList from './src/EmptyList'
import HomeFooter from './src/HomeFooter'
import { useDidCommNotifications } from './src/hooks/useDidCommNotifications'
import { generateOpsecidOnboardingSteps } from './src/onboarding'
import useOpsecidAgentSetup from './src/useOpsecidAgentSetup'
import OnboardingStack from './src/navigators/OnboardingStack'
import Scan from './src/screens/Scan'
import Terms, { TermsVersion } from './src/screens/Terms'

export class AppContainer implements Container {
  private _container: DependencyContainer
  private log?: BifoldLogger

  public constructor(bifoldContainer: Container, log?: BifoldLogger) {
    this._container = bifoldContainer.container.createChildContainer()
    this.log = log
  }

  public get container(): DependencyContainer {
    return this._container
  }

  public init(): Container {
    this.log?.info(`Initializing App container`)

    this.container.registerInstance(TOKENS.HOOK_USE_AGENT_SETUP, useOpsecidAgentSetup)
    this.container.registerInstance(TOKENS.UTIL_LEDGERS, [])
    this.container.registerInstance(TOKENS.UTIL_PROOF_TEMPLATE, undefined)
    this.container.registerInstance(TOKENS.HISTORY_ENABLED, false)
    this.container.registerInstance(TOKENS.ONBOARDING, generateOpsecidOnboardingSteps)
    this.container.registerInstance(TOKENS.SCREEN_TERMS, { screen: Terms, version: TermsVersion })
    this.container.registerInstance(TOKENS.STACK_ONBOARDING, OnboardingStack)
    this.container.registerInstance(TOKENS.SCREEN_SCAN, Scan)
    this.container.registerInstance(TOKENS.COMPONENT_HOME_FOOTER, HomeFooter)
    this.container.registerInstance(TOKENS.COMPONENT_HOME_NOTIFICATIONS_EMPTY_LIST, () => null)
    this.container.registerInstance(TOKENS.COMPONENT_CRED_EMPTY_LIST, EmptyList)
    this.container.registerInstance(TOKENS.NOTIFICATIONS, {
      useNotifications: useDidCommNotifications,
    })
    this.container.registerInstance(TOKENS.CONFIG, {
      ...defaultConfig,
      enableChat: false,
      enableTours: false,
      preventScreenCapture: false,
      enableAttestation: false,
      showPreface: false,
      showPINExplainer: false,
      showScanHelp: false,
      showScanButton: true,
      whereToUseWalletUrl: undefined,
      supportedLanguages: [Locales.en],
    })

    return this
  }

  public resolve<K extends keyof TokenMapping>(token: K): TokenMapping[K] {
    return this._container.resolve(token)
  }
  public resolveAll<K extends keyof TokenMapping, T extends K[]>(
    tokens: [...T]
  ): { [I in keyof T]: TokenMapping[T[I]] } {
    return tokens.map((key) => this.resolve(key)!) as { [I in keyof T]: TokenMapping[T[I]] }
  }
}
