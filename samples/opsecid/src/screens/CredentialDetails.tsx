import { useAgent } from '@bifold/react-hooks'
import { DidCommCredentialExchangeRecord } from '@credo-ts/didcomm'
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, ScrollView } from 'react-native'
import { buildFieldsFromAnonCredsCredential, Screens } from '@bifold/core'
import { getEffectiveCredentialName } from '../../../../packages/core/src/utils/credential'
import type { RootStackParams } from '../../../../packages/core/src/types/navigators'

import { Button, Card, Heading, Screen, Text, VStack } from '../components/ui'

const CredentialDetails: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute<RouteProp<RootStackParams, Screens.CredentialDetails>>()
  const { credentialId } = route.params
  const { agent } = useAgent()
  const [credential, setCredential] = useState<DidCommCredentialExchangeRecord>()
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const load = async () => {
      const record = await agent?.modules?.didcomm?.credentials?.getById?.(credentialId)
      setCredential(record)
    }
    load().catch(() => undefined)
  }, [agent, credentialId])

  const remove = useCallback(() => {
    Alert.alert('Remove credential', 'This card will be deleted from this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          if (!credential) {
            return
          }
          setBusy(true)
          try {
            await agent?.modules?.credentials?.deleteById?.(credential.id)
            navigation.goBack()
          } finally {
            setBusy(false)
          }
        },
      },
    ])
  }, [agent, credential, navigation])

  const fields = credential ? buildFieldsFromAnonCredsCredential(credential) : []
  const name = credential ? getEffectiveCredentialName(credential) : 'Credential'

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 48 }}>
        <Button title="Close" variant="ghost" onPress={() => navigation.goBack()} />
        <Card node style={{ minHeight: 160 }}>
          <Text tone="label">Credential</Text>
          <Heading size="md" style={{ marginTop: 12 }}>
            {name}
          </Heading>
        </Card>
        <VStack gap={10}>
          {fields.map((field) => (
            <VStack key={field.name} gap={4}>
              <Text tone="label">{field.label || field.name}</Text>
              <Text>{String(field.value ?? '')}</Text>
            </VStack>
          ))}
        </VStack>
        <Button title="Remove" variant="danger" loading={busy} onPress={remove} />
      </ScrollView>
    </Screen>
  )
}

export default CredentialDetails
