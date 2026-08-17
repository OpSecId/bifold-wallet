import React from 'react'
import { DispatchAction, useStore } from '@bifold/core'

import { Button, Heading, Screen, Text, VStack } from '../components/ui'

const Welcome: React.FC = () => {
  const [, dispatch] = useStore()

  return (
    <Screen>
      <VStack gap={20} style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <Text tone="label">OpSecId Wallet</Text>
        <Heading>Welcome</Heading>
        <Text tone="muted">
          Your digital credentials stay on this device. Only you can unlock them.
        </Text>
        <Button
          title="Next"
          onPress={() => dispatch({ type: DispatchAction.DID_COMPLETE_TUTORIAL })}
        />
      </VStack>
    </Screen>
  )
}

export default Welcome
