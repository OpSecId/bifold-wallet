import { useAgent, useProofByState } from '@bifold/react-hooks'
import { DidCommProofState } from '@credo-ts/didcomm'
import { ProofCustomMetadata, ProofMetadata } from '@bifold/verifier'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import {
  ContactStack,
  NotificationStack,
  ProofRequestStack,
  Screens,
  Stacks,
  TOKENS,
  useDeepLinks,
  useDefaultStackOptions,
  useServices,
  useStore,
  useTheme,
} from '@bifold/core'
import type { RootStackParams } from '../../../../packages/core/src/types/navigators'

import CredentialDetails from '../screens/CredentialDetails'
import { ridgeCoverOptions, ridgeFadeOptions, ridgePushOptions } from '../design/motion'
import ConnectStack from './ConnectStack'
import DeliveryStack from './DeliveryStack'
import SettingStack from './SettingStack'
import TabStack from './TabStack'

const MainStack: React.FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [store] = useStore()
  const { agent } = useAgent()
  const defaultStackOptions = useDefaultStackOptions(theme)
  const [ScreenOptionsDictionary] = useServices([TOKENS.OBJECT_SCREEN_CONFIG])
  const declinedProofs = useProofByState([DidCommProofState.Declined, DidCommProofState.Abandoned])
  useDeepLinks()

  useEffect(() => {
    declinedProofs.forEach((proof) => {
      const meta = proof?.metadata?.get(ProofMetadata.customMetadata) as ProofCustomMetadata
      if (meta?.delete_conn_after_seen) {
        agent?.modules.didcomm.connections.deleteById(proof?.connectionId ?? '').catch(() => null)
        proof?.metadata.set(ProofMetadata.customMetadata, { ...meta, delete_conn_after_seen: false })
      }
    })
  }, [declinedProofs, agent, store.preferences.useDataRetention])

  const Stack = createStackNavigator<RootStackParams>()

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName={Stacks.TabStack}
        screenOptions={{
          ...defaultStackOptions,
          ...ridgePushOptions,
        }}
      >
        <Stack.Screen name={Stacks.TabStack} component={TabStack} />
        <Stack.Screen
          name={Screens.CredentialDetails}
          component={CredentialDetails}
          options={{
            title: t('Screens.CredentialDetails'),
            ...ridgePushOptions,
            ...ScreenOptionsDictionary[Screens.CredentialDetails],
            headerShown: false,
          }}
        />
        <Stack.Screen name={Stacks.ConnectStack} component={ConnectStack} options={ridgeCoverOptions} />
        <Stack.Screen
          name={Stacks.SettingStack}
          component={SettingStack}
          options={ridgeFadeOptions}
        />
        <Stack.Screen name={Stacks.ContactStack} component={ContactStack} />
        <Stack.Screen name={Stacks.NotificationStack} component={NotificationStack} />
        <Stack.Screen
          name={Stacks.ConnectionStack}
          component={DeliveryStack}
          options={{
            ...ridgeCoverOptions,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name={Stacks.ProofRequestsStack} component={ProofRequestStack} />
      </Stack.Navigator>
    </View>
  )
}

export default MainStack
