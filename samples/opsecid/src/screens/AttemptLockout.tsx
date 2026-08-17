import React, { useCallback, useEffect, useRef, useState } from 'react'
import { DispatchAction, useStore } from '@bifold/core'
import moment from 'moment'

import { Button, Heading, Screen, Text, VStack } from '../components/ui'

const AttemptLockout: React.FC = () => {
  const [state, dispatch] = useStore()
  const [label, setLabel] = useState('')
  const [done, setDone] = useState(false)
  const lockoutDate = useRef(state.loginAttempt.lockoutDate)

  useEffect(() => {
    const tick = () => {
      const remaining = moment(lockoutDate.current).diff(moment())
      if (remaining <= 0) {
        setDone(true)
        setLabel('')
        return
      }
      const duration = moment.duration(remaining)
      setLabel(
        `${Math.floor(duration.asHours())}h ${duration.minutes()}m ${duration.seconds()}s`
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const unlock = useCallback(() => {
    dispatch({
      type: DispatchAction.ATTEMPT_UPDATED,
      payload: [{ loginAttempts: state.loginAttempt.loginAttempts, lockoutDate: undefined, servedPenalty: true }],
    })
  }, [dispatch, state.loginAttempt.loginAttempts])

  return (
    <Screen>
      <VStack gap={20} style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        <Heading>Temporarily locked</Heading>
        <Text tone="muted">Too many incorrect PIN attempts. Wait, then try again.</Text>
        {done ? (
          <Button title="Try again" onPress={unlock} />
        ) : (
          <Text>{label}</Text>
        )}
      </VStack>
    </Screen>
  )
}

export default AttemptLockout
