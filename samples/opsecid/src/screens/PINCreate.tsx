import React, { useCallback, useState } from 'react'
import { DeviceEventEmitter } from 'react-native'
import { BifoldError, DispatchAction, EventTypes, useAuth, useStore } from '@bifold/core'

import PinEntry from '../components/PinEntry'

const PIN_LENGTH = 6

type Props = {
  setAuthenticated: (status: boolean) => void
}

const PINCreate: React.FC<Props> = ({ setAuthenticated }) => {
  const [, dispatch] = useStore()
  const { setPIN } = useAuth()
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [stage, setStage] = useState<'create' | 'confirm'>('create')
  const [error, setError] = useState<string | undefined>()
  const [busy, setBusy] = useState(false)

  const finish = useCallback(
    async (value: string) => {
      setBusy(true)
      try {
        await setPIN(value)
        setAuthenticated(true)
        dispatch({ type: DispatchAction.DID_CREATE_PIN })
      } catch (err: unknown) {
        DeviceEventEmitter.emit(
          EventTypes.ERROR_ADDED,
          new BifoldError('PIN error', 'Could not save PIN', (err as Error).message, 1040)
        )
      } finally {
        setBusy(false)
      }
    },
    [dispatch, setAuthenticated, setPIN]
  )

  const onDigit = (digit: string) => {
    if (busy) {
      return
    }
    setError(undefined)
    if (stage === 'create') {
      const next = (pin + digit).slice(0, PIN_LENGTH)
      setPin(next)
      if (next.length === PIN_LENGTH) {
        setStage('confirm')
      }
      return
    }
    const next = (confirm + digit).slice(0, PIN_LENGTH)
    setConfirm(next)
    if (next.length === PIN_LENGTH) {
      if (next === pin) {
        finish(pin)
      } else {
        setError('PINs did not match. Try again.')
        setPin('')
        setConfirm('')
        setStage('create')
      }
    }
  }

  const onBackspace = () => {
    if (stage === 'create') {
      setPin((value) => value.slice(0, -1))
    } else {
      setConfirm((value) => value.slice(0, -1))
    }
  }

  const value = stage === 'create' ? pin : confirm

  return (
    <PinEntry
      label="PIN"
      title={stage === 'create' ? 'Create a PIN' : 'Confirm PIN'}
      detail={stage === 'create' ? 'Choose a 6-digit PIN to unlock this wallet.' : 'Enter the same PIN again.'}
      filled={value.length}
      error={error}
      onDigit={onDigit}
      onBackspace={onBackspace}
    />
  )
}

export default PINCreate
