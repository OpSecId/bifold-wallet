import { StackScreenProps } from '@react-navigation/stack'
import React, { useCallback, useState } from 'react'
import { DeviceEventEmitter } from 'react-native'
import { BifoldError, EventTypes, Screens, useAuth, useStore } from '@bifold/core'
import { useAgent } from '@bifold/react-hooks'
import type { SettingStackParams } from '../../../../packages/core/src/types/navigators'

import { Text } from '../components/ui'
import PinEntry from '../components/PinEntry'

const PIN_LENGTH = 6

type Stage = 'current' | 'next' | 'confirm'

const PINChange: React.FC<StackScreenProps<SettingStackParams, Screens.ChangePIN>> = ({ navigation }) => {
  const { checkWalletPIN, rekeyWallet } = useAuth()
  const { agent } = useAgent()
  const [store] = useStore()
  const [stage, setStage] = useState<Stage>('current')
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [busy, setBusy] = useState(false)

  const value = stage === 'current' ? current : stage === 'next' ? next : confirm

  const finish = useCallback(
    async (oldPin: string, newPin: string) => {
      if (!agent) {
        setError('Wallet is not ready. Try again in a moment.')
        return
      }
      setBusy(true)
      try {
        const success = await rekeyWallet(agent, oldPin, newPin, store.preferences.useBiometry)
        if (!success) {
          setError('Could not change PIN. Check the current PIN and try again.')
          setStage('current')
          setCurrent('')
          setNext('')
          setConfirm('')
          return
        }
        navigation.navigate(Screens.ChangePINSuccess)
      } catch (err: unknown) {
        DeviceEventEmitter.emit(
          EventTypes.ERROR_ADDED,
          new BifoldError('PIN error', 'Could not change PIN', (err as Error).message, 1049)
        )
      } finally {
        setBusy(false)
      }
    },
    [agent, navigation, rekeyWallet, store.preferences.useBiometry]
  )

  const onDigit = (digit: string) => {
    if (busy) {
      return
    }
    setError(undefined)
    if (stage === 'current') {
      const updated = (current + digit).slice(0, PIN_LENGTH)
      setCurrent(updated)
      if (updated.length === PIN_LENGTH) {
        setBusy(true)
        checkWalletPIN(updated)
          .then((ok) => {
            if (!ok) {
              setError('Incorrect PIN')
              setCurrent('')
              return
            }
            setStage('next')
          })
          .catch((err: unknown) => {
            DeviceEventEmitter.emit(
              EventTypes.ERROR_ADDED,
              new BifoldError('PIN error', 'Could not verify PIN', (err as Error).message, 1049)
            )
          })
          .finally(() => setBusy(false))
      }
      return
    }
    if (stage === 'next') {
      const updated = (next + digit).slice(0, PIN_LENGTH)
      setNext(updated)
      if (updated.length === PIN_LENGTH) {
        setStage('confirm')
      }
      return
    }
    const updated = (confirm + digit).slice(0, PIN_LENGTH)
    setConfirm(updated)
    if (updated.length === PIN_LENGTH) {
      if (updated !== next) {
        setError('PINs did not match. Try again.')
        setNext('')
        setConfirm('')
        setStage('next')
        return
      }
      finish(current, next)
    }
  }

  const onBackspace = () => {
    if (stage === 'current') {
      setCurrent((value) => value.slice(0, -1))
    } else if (stage === 'next') {
      setNext((value) => value.slice(0, -1))
    } else {
      setConfirm((value) => value.slice(0, -1))
    }
  }

  const title =
    stage === 'current' ? 'Enter current PIN' : stage === 'next' ? 'Choose a new PIN' : 'Confirm new PIN'
  const body =
    stage === 'current'
      ? 'Verify it is you before replacing the unlock PIN.'
      : stage === 'next'
        ? 'Choose a 6-digit PIN to unlock this wallet.'
        : 'Enter the same PIN again.'

  return (
    <PinEntry
      label="PIN"
      title={title}
      detail={body}
      filled={value.length}
      error={error}
      onDigit={onDigit}
      onBackspace={onBackspace}
      leading={
        <Text tone="accent" accessibilityRole="button" onPress={() => navigation.goBack()}>
          Close
        </Text>
      }
    />
  )
}

export default PINChange
