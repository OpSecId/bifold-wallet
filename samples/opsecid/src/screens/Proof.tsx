import { useAgent, useConnectionById, useProofById } from '@bifold/react-hooks'
import React, { useCallback, useMemo, useState } from 'react'
import { DeviceEventEmitter, ScrollView } from 'react-native'
import {
  BifoldError,
  EventTypes,
  Screens,
  TabStacks,
  getConnectionName,
  useNetwork,
  useStore,
} from '@bifold/core'

import { Button, Card, Heading, Screen, Text, VStack, RiseIn } from '../components/ui'

type Props = {
  navigation: { getParent?: () => { navigate: (stack: string, params: object) => void } }
  proofId: string
}

const Proof: React.FC<Props> = ({ navigation, proofId }) => {
  const { agent } = useAgent()
  const proof = useProofById(proofId)
  const connection = useConnectionById(proof?.connectionId ?? '')
  const { assertNetworkConnected } = useNetwork()
  const [store] = useStore()
  const [busy, setBusy] = useState(false)
  const verifier = useMemo(
    () => getConnectionName(connection, store.preferences.alternateContactNames) || 'Verifier',
    [connection, store.preferences.alternateContactNames]
  )

  const share = useCallback(async () => {
    if (!(agent && proof && assertNetworkConnected())) {
      return
    }
    setBusy(true)
    try {
      await agent.modules.didcomm.proofs.acceptRequest({ proofExchangeRecordId: proof.id })
      navigation.getParent?.()?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
    } catch (err: unknown) {
      setBusy(false)
      DeviceEventEmitter.emit(
        EventTypes.ERROR_ADDED,
        new BifoldError('Share failed', 'Could not share this proof', (err as Error).message, 1027)
      )
    }
  }, [agent, assertNetworkConnected, navigation, proof])

  const decline = useCallback(async () => {
    if (!(agent && proof)) {
      return
    }
    setBusy(true)
    try {
      await agent.modules.didcomm.proofs.declineRequest({ proofExchangeRecordId: proof.id })
      if (proof.connectionId) {
        await agent.modules.didcomm.proofs.sendProblemReport({
          proofExchangeRecordId: proof.id,
          description: 'Declined',
        })
      }
      navigation.getParent?.()?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
    } catch (err: unknown) {
      setBusy(false)
      DeviceEventEmitter.emit(
        EventTypes.ERROR_ADDED,
        new BifoldError('Decline failed', 'Could not decline this proof', (err as Error).message, 1028)
      )
    }
  }, [agent, navigation, proof])

  return (
    <Screen>
      <RiseIn>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 40 }}>
        <Text tone="label">Proof request</Text>
        <Heading>Share information</Heading>
        <Text tone="muted">{verifier} wants you to share information.</Text>
        <Card>
          <Text tone="label">From</Text>
          <Heading size="md" style={{ marginTop: 8 }}>
            {verifier}
          </Heading>
        </Card>
        <Button title="Share" loading={busy} onPress={share} />
        <Button title="Decline" variant="ghost" disabled={busy} onPress={decline} />
      </ScrollView>
      </RiseIn>
    </Screen>
  )
}

export default Proof
