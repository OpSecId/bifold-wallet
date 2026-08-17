import React, { useCallback, useEffect, useState } from 'react'
import { DeviceEventEmitter } from 'react-native'
import { BifoldError, DispatchAction, EventTypes, isBiometricsActive, useAuth, useStore } from '@bifold/core'

import { Button, Heading, Screen, Text, VStack } from '../components/ui'

const Biometry: React.FC = () => {
  const [, dispatch] = useStore()
  const { commitWalletToKeychain } = useAuth()
  const [available, setAvailable] = useState(true)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    isBiometricsActive().then(setAvailable).catch(() => setAvailable(false))
  }, [])

  const finish = useCallback(
    async (useBiometrics: boolean) => {
      setBusy(true)
      try {
        const ok = await commitWalletToKeychain(useBiometrics)
        if (!ok && useBiometrics) {
          throw new Error('Could not store the wallet key behind biometrics')
        }
        // Let the system biometric activity finish before we remount screens.
        await new Promise((resolve) => setTimeout(resolve, 400))
        dispatch({ type: DispatchAction.USE_BIOMETRY, payload: [useBiometrics] })
      } catch (err: unknown) {
        DeviceEventEmitter.emit(
          EventTypes.ERROR_ADDED,
          new BifoldError('Biometrics failed', 'Could not save biometrics preference', (err as Error).message, 1042)
        )
      } finally {
        setBusy(false)
      }
    },
    [commitWalletToKeychain, dispatch]
  )

  return (
    <Screen>
      <VStack gap={20} style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <Text tone="label">Biometrics</Text>
        <Heading>Unlock faster next time</Heading>
        <Text tone="muted">
          {available
            ? 'Use Face ID or fingerprint after you set a PIN. You can change this later in Settings.'
            : 'This device does not have biometrics. Continue with PIN only.'}
        </Text>
        {available ? (
          <Button title="Use biometrics" disabled={busy} onPress={() => finish(true)} />
        ) : null}
        <Button
          title={available ? 'Not now' : 'Continue'}
          variant={available ? 'secondary' : 'primary'}
          disabled={busy}
          onPress={() => finish(false)}
        />
      </VStack>
    </Screen>
  )
}

export default Biometry
