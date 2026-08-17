import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { DeviceEventEmitter } from 'react-native'
import {
  BifoldError,
  DispatchAction,
  EventTypes,
  isBiometricsActive,
  useAuth,
  useStore,
} from '@bifold/core'

import { Button, Heading, Screen, Text, VStack } from '../components/ui'
import PinEntry from '../components/PinEntry'

const PIN_LENGTH = 6

const ToggleBiometry: React.FC = () => {
  const navigation = useNavigation()
  const [store, dispatch] = useStore()
  const { checkWalletPIN, commitWalletToKeychain, disableBiometrics } = useAuth()
  const enabled = store.preferences.useBiometry
  const [available, setAvailable] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    isBiometricsActive().then(setAvailable).catch(() => setAvailable(false))
  }, [])

  const apply = useCallback(
    async (next: boolean) => {
      setBusy(true)
      try {
        if (next) {
          const ok = await commitWalletToKeychain(true)
          if (!ok) {
            throw new Error('Could not store the wallet key behind biometrics')
          }
        } else {
          await disableBiometrics()
        }
        await new Promise((resolve) => setTimeout(resolve, 400))
        dispatch({ type: DispatchAction.USE_BIOMETRY, payload: [next] })
        setVerifying(false)
        setPin('')
      } catch (err: unknown) {
        DeviceEventEmitter.emit(
          EventTypes.ERROR_ADDED,
          new BifoldError('Biometrics failed', 'Could not update biometrics', (err as Error).message, 1042)
        )
      } finally {
        setBusy(false)
      }
    },
    [commitWalletToKeychain, disableBiometrics, dispatch]
  )

  const onDigit = (digit: string) => {
    if (busy) {
      return
    }
    setError(undefined)
    const next = (pin + digit).slice(0, PIN_LENGTH)
    setPin(next)
    if (next.length === PIN_LENGTH) {
      setBusy(true)
      checkWalletPIN(next)
        .then((ok) => {
          if (!ok) {
            setError('Incorrect PIN')
            setPin('')
            return
          }
          return apply(!enabled)
        })
        .catch((err: unknown) => {
          DeviceEventEmitter.emit(
            EventTypes.ERROR_ADDED,
            new BifoldError('Unlock failed', 'Could not verify PIN', (err as Error).message, 1041)
          )
        })
        .finally(() => setBusy(false))
    }
  }

  if (verifying) {
    return (
      <PinEntry
        label="Biometrics"
        title="Enter PIN"
        detail="Confirm it is you before changing biometrics."
        filled={pin.length}
        error={error}
        onDigit={onDigit}
        onBackspace={() => setPin((value) => value.slice(0, -1))}
        leading={
          <Text tone="accent" accessibilityRole="button" onPress={() => setVerifying(false)}>
            Close
          </Text>
        }
      />
    )
  }

  return (
    <Screen>
      <VStack gap={20} style={{ flex: 1, padding: 20 }}>
        <Text tone="accent" accessibilityRole="button" onPress={() => navigation.goBack()}>
          Close
        </Text>
        <VStack gap={8}>
          <Text tone="label">Biometrics</Text>
          <Heading>{enabled ? 'Biometrics is on' : 'Unlock with biometrics'}</Heading>
          <Text tone="muted">
            {available
              ? 'Use Face ID or fingerprint after the PIN, so you do not have to type it every time.'
              : 'This device does not have biometrics available.'}
          </Text>
        </VStack>
        {available ? (
          <Button
            title={enabled ? 'Turn off biometrics' : 'Turn on biometrics'}
            variant={enabled ? 'secondary' : 'primary'}
            disabled={busy}
            onPress={() => {
              setError(undefined)
              setPin('')
              setVerifying(true)
            }}
          />
        ) : null}
      </VStack>
    </Screen>
  )
}

export default ToggleBiometry
