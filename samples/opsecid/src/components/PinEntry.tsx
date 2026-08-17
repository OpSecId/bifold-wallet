import React from 'react'
import { View } from 'react-native'

import { Heading, PinDots, Screen, Text, VStack } from './ui'
import Keypad from './ui/Keypad'

type Props = {
  label: string
  title: string
  detail?: string
  filled: number
  error?: string
  onDigit: (digit: string) => void
  onBackspace: () => void
  leading?: React.ReactNode
}

const PinEntry: React.FC<Props> = ({
  label,
  title,
  detail,
  filled,
  error,
  onDigit,
  onBackspace,
  leading,
}) => {
  return (
    <Screen>
      {leading ? (
        <View style={{ position: 'absolute', top: 12, left: 20, zIndex: 1 }}>{leading}</View>
      ) : null}
      <VStack gap={16} style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <VStack gap={6}>
          <Text tone="label">{label}</Text>
          <Heading size="md">{title}</Heading>
          {detail ? <Text tone="muted">{detail}</Text> : null}
        </VStack>
        <PinDots filled={filled} />
        <Text tone="danger" style={{ minHeight: 21 }}>
          {error ?? ' '}
        </Text>
        <Keypad onDigit={onDigit} onBackspace={onBackspace} />
      </VStack>
    </Screen>
  )
}

export default PinEntry
