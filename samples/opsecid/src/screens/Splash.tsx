import React, { useEffect, useRef } from 'react'
import { DeviceEventEmitter } from 'react-native'
import { BifoldError, EventTypes, TOKENS, useAuth, useServices, useStore, type SplashProps } from '@bifold/core'
import { RemoteOCABundleResolver } from '@bifold/oca/build/legacy'

import { Screen, VStack, Heading, Text, PulseCluster } from '../components/ui'

const Splash: React.FC<SplashProps> = ({ initializeAgent }) => {
  const { walletSecret } = useAuth()
  const [store] = useStore()
  const initializing = useRef(false)
  const [logger, ocaBundleResolver] = useServices([TOKENS.UTIL_LOGGER, TOKENS.UTIL_OCA_RESOLVER])

  useEffect(() => {
    if (initializing.current || !store.authentication.didAuthenticate) {
      return
    }
    if (!walletSecret) {
      throw new Error('Wallet secret is missing')
    }

    initializing.current = true
    const run = async () => {
      try {
        await (ocaBundleResolver as RemoteOCABundleResolver).checkForUpdates?.()
        await initializeAgent(walletSecret)
      } catch (err: unknown) {
        DeviceEventEmitter.emit(
          EventTypes.ERROR_ADDED,
          new BifoldError('Could not start wallet', 'Agent initialization failed', (err as Error)?.message ?? String(err), 1045)
        )
        logger.error((err as Error)?.message ?? err)
      }
    }
    run()
  }, [initializeAgent, ocaBundleResolver, logger, walletSecret, store.authentication.didAuthenticate])

  return (
    <Screen>
      <VStack gap={20} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28 }}>
        <PulseCluster />
        <Heading>OpSecId Wallet</Heading>
        <Text tone="muted">Starting…</Text>
      </VStack>
    </Screen>
  )
}

export default Splash
