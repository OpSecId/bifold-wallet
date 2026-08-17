import { useAgent, useCredentialById } from '@bifold/react-hooks'
import React, { useCallback, useEffect, useState } from 'react'
import { DeviceEventEmitter, ScrollView } from 'react-native'
import {
  BifoldError,
  EventTypes,
  Screens,
  TabStacks,
  buildFieldsFromAnonCredsCredential,
  useCredentialConnectionLabel,
  useNetwork,
} from '@bifold/core'
import { getEffectiveCredentialName } from '../../../../packages/core/src/utils/credential'

import { Button, Card, Heading, Screen, Text, VStack, RiseIn } from '../components/ui'

type Props = {
  navigation: { getParent?: () => { navigate: (stack: string, params: object) => void } }
  credentialId: string
}

const Offer: React.FC<Props> = ({ navigation, credentialId }) => {
  const { agent } = useAgent()
  const credential = useCredentialById(credentialId)
  const { assertNetworkConnected } = useNetwork()
  const [busy, setBusy] = useState(false)
  const [attributes, setAttributes] = useState<{ name: string; label?: string; value?: unknown }[]>([])
  const issuer = useCredentialConnectionLabel(credential as never)

  useEffect(() => {
    if (!agent || !credential) {
      return
    }
    const load = async () => {
      try {
        const formatData = await agent.modules.didcomm.credentials.getFormatData(credential.id)
        if (formatData.offerAttributes) {
          setAttributes(
            formatData.offerAttributes.map((item: { name: string; value?: string }) => ({
              name: item.name,
              label: item.name,
              value: item.value,
            }))
          )
          return
        }
      } catch {
        // fall through to preview attributes
      }
      setAttributes(buildFieldsFromAnonCredsCredential(credential) as never)
    }
    load()
  }, [agent, credential])

  const accept = useCallback(async () => {
    if (!(agent && credential && assertNetworkConnected())) {
      return
    }
    setBusy(true)
    try {
      await agent.modules.didcomm.credentials.acceptOffer({ credentialExchangeRecordId: credential.id })
      navigation.getParent?.()?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
    } catch (err: unknown) {
      setBusy(false)
      DeviceEventEmitter.emit(
        EventTypes.ERROR_ADDED,
        new BifoldError('Accept failed', 'Could not accept this credential', (err as Error).message, 1024)
      )
    }
  }, [agent, assertNetworkConnected, credential, navigation])

  const decline = useCallback(async () => {
    if (!(agent && credential)) {
      return
    }
    setBusy(true)
    try {
      await agent.modules.didcomm.credentials.declineOffer({ credentialExchangeRecordId: credential.id })
      if (credential.connectionId) {
        await agent.modules.didcomm.credentials.sendProblemReport({
          credentialExchangeRecordId: credential.id,
          description: 'Declined',
        })
      }
      navigation.getParent?.()?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
    } catch (err: unknown) {
      setBusy(false)
      DeviceEventEmitter.emit(
        EventTypes.ERROR_ADDED,
        new BifoldError('Decline failed', 'Could not decline this credential', (err as Error).message, 1025)
      )
    }
  }, [agent, credential, navigation])

  const name = credential ? getEffectiveCredentialName(credential) : 'Credential'

  return (
    <Screen>
      <RiseIn>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}>
        <Text tone="label">Offer</Text>
        <Heading>{name}</Heading>
        <Text tone="muted">{issuer ? `From ${issuer}` : 'A credential is being offered to you.'}</Text>
        <Card>
          {attributes.map((field, index) => (
            <VStack key={field.name} gap={4} style={{ paddingTop: index === 0 ? 0 : 10 }}>
              <Text tone="caption">{field.label || field.name}</Text>
              <Text>{String(field.value ?? '')}</Text>
            </VStack>
          ))}
        </Card>
        <Button title="Accept credential" loading={busy} onPress={accept} />
        <Button title="Decline" variant="ghost" disabled={busy} onPress={decline} />
      </ScrollView>
      </RiseIn>
    </Screen>
  )
}

export default Offer
