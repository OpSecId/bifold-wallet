import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useMemo } from 'react'
import { FlatList, Pressable } from 'react-native'
import {
  Screens,
  Stacks,
  TOKENS,
  useNotifications,
  useServices,
} from '@bifold/core'
import {
  DidCommCredentialExchangeRecord,
  DidCommProofExchangeRecord,
} from '@credo-ts/didcomm'
import type { RootStackParams } from '../../../../packages/core/src/types/navigators'

import { motion } from '../design/tokens'
import { Card, Heading, HStack, Screen, Text, VStack, RiseIn } from '../components/ui'

const Home: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>()
  const [{ useNotifications: useNotificationHook }] = useServices([TOKENS.NOTIFICATIONS])
  const notifications = (useNotificationHook ?? useNotifications)({})

  const items = useMemo(
    () =>
      notifications.filter(
        (item) => item instanceof DidCommCredentialExchangeRecord || item instanceof DidCommProofExchangeRecord
      ),
    [notifications]
  )

  return (
    <Screen>
      <VStack gap={20} style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
        <HStack style={{ justifyContent: 'space-between' }}>
          <Heading>Home</Heading>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings"
            onPress={() => navigation.navigate(Stacks.SettingStack, { screen: Screens.Settings })}
          >
            <Text tone="accent">Settings</Text>
          </Pressable>
        </HStack>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 12, paddingBottom: 40, flexGrow: 1 }}
          ListEmptyComponent={
            <RiseIn>
            <VStack gap={10} style={{ paddingTop: 48 }}>
              <Heading size="md">Nothing pending</Heading>
              <Text tone="muted">Scan a QR code to receive a credential or share a proof.</Text>
            </VStack>
            </RiseIn>
          }
          renderItem={({ item, index }) => {
            const isOffer = item instanceof DidCommCredentialExchangeRecord
            return (
              <RiseIn delay={Math.min(index, 6) * motion.stagger}>
                <Pressable
                  onPress={() =>
                    navigation.navigate(Stacks.ConnectionStack, {
                      screen: Screens.Connection,
                      params: isOffer ? { credentialId: item.id } : { proofId: item.id },
                    } as never)
                  }
                >
                  <Card node>
                    <Text tone="label">{isOffer ? 'Credential offer' : 'Proof request'}</Text>
                    <Heading size="md" style={{ marginTop: 6 }}>
                      {isOffer ? 'New credential' : 'Share information'}
                    </Heading>
                    <Text tone="muted" style={{ marginTop: 8 }}>
                      Tap to review
                    </Text>
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

export default Home
