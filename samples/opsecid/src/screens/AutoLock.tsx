import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Pressable } from 'react-native'
import { DispatchAction, useStore } from '@bifold/core'
import { AutoLockTime } from '../../../../packages/core/src/contexts/activity'

import { Card, Heading, Screen, Text, VStack } from '../components/ui'

const OPTIONS: { label: string; value: number }[] = [
  { label: '5 minutes', value: AutoLockTime.FiveMinutes },
  { label: '3 minutes', value: AutoLockTime.ThreeMinutes },
  { label: '1 minute', value: AutoLockTime.OneMinute },
  { label: 'Never', value: AutoLockTime.Never },
]

const AutoLock: React.FC = () => {
  const navigation = useNavigation()
  const [store, dispatch] = useStore()
  const selected = store.preferences?.autoLockTime ?? AutoLockTime.FiveMinutes

  return (
    <Screen>
      <VStack gap={16} style={{ flex: 1, padding: 20 }}>
        <Text tone="accent" accessibilityRole="button" onPress={() => navigation.goBack()}>
          Close
        </Text>
        <VStack gap={8}>
          <Text tone="label">Auto-lock</Text>
          <Heading>Lock after inactivity</Heading>
          <Text tone="muted">The wallet locks after this much idle time. You will need your PIN or biometrics to open it again.</Text>
        </VStack>
        {OPTIONS.map((option) => {
          const on = selected === option.value
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              onPress={() => dispatch({ type: DispatchAction.AUTO_LOCK_TIME, payload: [option.value] })}
            >
              <Card node={on}>
                <Text style={{ paddingRight: 16 }}>{option.label}</Text>
              </Card>
            </Pressable>
          )
        })}
      </VStack>
    </Screen>
  )
}

export default AutoLock
