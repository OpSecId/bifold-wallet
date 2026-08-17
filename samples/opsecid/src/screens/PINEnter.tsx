import React, { useCallback, useEffect, useState } from 'react'
import { AppState, DeviceEventEmitter, InteractionManager } from 'react-native'
import {
  BifoldError,
  DispatchAction,
  EventTypes,
  isBiometricsActive,
  useAuth,
  useStore,
} from '@bifold/core'

import { useLockout } from '../../../../packages/core/src/hooks/lockout'
import PinEntry from '../components/PinEntry'

const PIN_LENGTH = 6

type Props = {
  setAuthenticated: (status: boolean) => void
}

const PINEnter: React.FC<Props> = ({ setAuthenticated }) => {
  const { checkWalletPIN, getWalletSecret, disableBiometrics } = useAuth()
  const [store, dispatch] = useStore()
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [busy, setBusy] = useState(false)
  const { attemptLockout, getLockoutPenalty, unMarkServedPenalty } = useLockout()

  const succeed = useCallback(() => {
    dispatch({ type: DispatchAction.ATTEMPT_UPDATED, payload: [{ loginAttempts: 0 }] })
    dispatch({ type: DispatchAction.LOCKOUT_UPDATED, payload: [{ displayNotification: false }] })
    setAuthenticated(true)
  }, [dispatch, setAuthenticated])

  useEffect(() => {
    if (!store.preferences.useBiometry) {
      return
    }
    let running = false
    const check = async () => {
      if (running) {
        return
      }
      running = true
      try {
        const active = await isBiometricsActive()
        if (!active) {
          await disableBiometrics()
          dispatch({ type: DispatchAction.USE_BIOMETRY, payload: [false] })
          return
        }
        const secret = await getWalletSecret()
        if (secret) {
          succeed()
        }
      } catch {
        // User cancelled the prompt, or keychain failed — stay on PIN.
      } finally {
        running = false
      }
    }
    const task = InteractionManager.runAfterInteractions(check)
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        check()
      }
    })
    return () => {
      task.cancel()
      sub.remove()
    }
  }, [disableBiometrics, dispatch, getWalletSecret, store.preferences.useBiometry, succeed])

  const unlock = useCallback(
    async (value: string) => {
      setBusy(true)
      try {
        if (store.loginAttempt.servedPenalty) {
          unMarkServedPenalty()
        }
        const ok = await checkWalletPIN(value)
        if (!ok) {
          const attempts = store.loginAttempt.loginAttempts + 1
          dispatch({ type: DispatchAction.ATTEMPT_UPDATED, payload: [{ loginAttempts: attempts }] })
          const penalty = getLockoutPenalty(attempts)
          if (penalty) {
            attemptLockout(penalty)
            return
          }
          setError('Incorrect PIN')
          setPin('')
          return
        }
        succeed()
      } catch (err: unknown) {
        DeviceEventEmitter.emit(
          EventTypes.ERROR_ADDED,
          new BifoldError('Unlock failed', 'Could not verify PIN', (err as Error).message, 1041)
        )
      } finally {
        setBusy(false)
      }
    },
    [
      attemptLockout,
      checkWalletPIN,
      dispatch,
      getLockoutPenalty,
      store.loginAttempt.loginAttempts,
      store.loginAttempt.servedPenalty,
      succeed,
      unMarkServedPenalty,
    ]
  )

  const onDigit = (digit: string) => {
    if (busy) {
      return
    }
    setError(undefined)
    const next = (pin + digit).slice(0, PIN_LENGTH)
    setPin(next)
    if (next.length === PIN_LENGTH) {
      unlock(next)
    }
  }

  return (
    <PinEntry
      label="Unlock"
      title="Enter PIN"
      filled={pin.length}
      error={error}
      onDigit={onDigit}
      onBackspace={() => setPin((value) => value.slice(0, -1))}
    />
  )
}

export default PINEnter
