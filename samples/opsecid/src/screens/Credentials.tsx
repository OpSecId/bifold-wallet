import { AnonCredsCredentialMetadataKey } from '@credo-ts/anoncreds'
import { useCredentialByState } from '@bifold/react-hooks'
import { DidCommCredentialState } from '@credo-ts/didcomm'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { FlatList, Pressable } from 'react-native'
import { Screens, TOKENS, useServices, useStore } from '@bifold/core'
import { getEffectiveCredentialName } from '../../../../packages/core/src/utils/credential'
import type { GenericCredentialExchangeRecord } from '../../../../packages/core/src/types/credentials'
import type { RootStackParams } from '../../../../packages/core/src/types/navigators'

import { Card, Heading, Screen, Text, VStack, RiseIn } from '../components/ui'
import { color, motion } from '../design/tokens'

const Credentials: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>()
  const [store] = useStore()
  const [{ credentialHideList }] = useServices([TOKENS.CONFIG])
  const received = useCredentialByState(DidCommCredentialState.CredentialReceived)
  const done = useCredentialByState(DidCommCredentialState.Done)

  let credentials: GenericCredentialExchangeRecord[] = [...received, ...done]

  if (!store.preferences.developerModeEnabled) {
    credentials = credentials.filter((record) => {
      const credDefId = record.metadata?.get?.(AnonCredsCredentialMetadataKey)?.credentialDefinitionId
      return !credentialHideList?.includes(credDefId)
    })
  }

  credentials = [...credentials].sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())

  return (
    <Screen>
      <VStack gap={16} style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
        <Heading>Cards</Heading>
        <FlatList
          data={credentials}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 14, paddingBottom: 48, flexGrow: 1 }}
          ListEmptyComponent={
            <VStack gap={8} style={{ paddingTop: 48 }}>
              <Heading size="md">No cards yet</Heading>
              <Text tone="muted">Credentials you accept will show up here.</Text>
            </VStack>
          }
          renderItem={({ item, index }) => {
            const name = getEffectiveCredentialName(item as never)
            const palette = [color.graphite, color.steel, color.slate]
            return (
              <RiseIn delay={Math.min(index, 6) * motion.stagger}>
                <Pressable
                  onPress={() => {
                    navigation.navigate(Screens.CredentialDetails, { credentialId: item.id })
                  }}
                >
                  <Card node style={{ backgroundColor: palette[index % palette.length], minHeight: 140 }}>
                    <Text tone="label">Credential</Text>
                    <Heading size="md" style={{ marginTop: 12 }}>
                      {String(name)}
                    </Heading>
                  </Card>
                </Pressable>
              </RiseIn>
            )
          }}
        />
      </VStack>
    </Screen>
  )
}

export default Credentials
