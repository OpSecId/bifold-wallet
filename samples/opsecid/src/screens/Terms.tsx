import React, { useCallback, useState } from 'react'
import { Pressable, ScrollView } from 'react-native'
import { DispatchAction, useStore } from '@bifold/core'

import { Button, Card, Check, Heading, HStack, Screen, Text, VStack } from '../components/ui'
import { color } from '../design/tokens'

export const TermsVersion = '1'

const TERMS = [
  'Credentials you accept are stored on this device, not on an OpSecId account.',
  'A PIN unlocks the wallet. Biometrics are optional and stay on this device.',
  'If you forget your PIN, the wallet cannot recover your credentials.',
  'You decide what to accept and what to share. Review every request before you continue.',
]

const Terms: React.FC = () => {
  const [, dispatch] = useStore()
  const [agreed, setAgreed] = useState(false)

  const accept = useCallback(() => {
    dispatch({
      type: DispatchAction.DID_AGREE_TO_TERMS,
      payload: [{ DidAgreeToTerms: TermsVersion }],
    })
  }, [dispatch])

  const back = useCallback(() => {
    dispatch({
      type: DispatchAction.DID_COMPLETE_TUTORIAL,
      payload: [{ didCompleteTutorial: false }],
    })
  }, [dispatch])

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <VStack gap={20}>
          <Text tone="label">Terms</Text>
          <Heading>Before you continue</Heading>
          <Text tone="muted">Please read these terms. Accepting them is required to set up a PIN.</Text>
          <Card>
            <VStack gap={12}>
              {TERMS.map((item) => (
                <Text key={item} tone="muted">
                  {item}
                </Text>
              ))}
            </VStack>
          </Card>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: agreed }}
            onPress={() => setAgreed((value) => !value)}
          >
            <Card style={agreed ? { borderColor: color.signal } : undefined}>
              <HStack gap={12} style={{ alignItems: 'center' }}>
                <Check checked={agreed} />
                <Text style={{ flex: 1 }}>I have read and agree to these terms</Text>
              </HStack>
            </Card>
          </Pressable>
          <Button title="Accept" disabled={!agreed} onPress={accept} />
          <Button title="Back" variant="secondary" onPress={back} />
        </VStack>
      </ScrollView>
    </Screen>
  )
}

export default Terms
