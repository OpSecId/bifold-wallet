import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { getBuildNumber, getVersion } from 'react-native-device-info'
import { ScrollView } from 'react-native'
import { LockoutReason, Screens, useAuth, useStore } from '@bifold/core'
import { AutoLockTime } from '../../../../packages/core/src/contexts/activity'
import type { SettingStackParams } from '../../../../packages/core/src/types/navigators'

import { Button, Card, Heading, HStack, Screen, Text, VStack } from '../components/ui'

const Row = ({
  label,
  value,
  onPress,
}: {
  label: string
  value?: string
  onPress?: () => void
}) => (
  <Card>
    <HStack style={{ justifyContent: 'space-between' }}>
      <VStack gap={4} style={{ flex: 1 }}>
        <Text>{label}</Text>
        {value ? <Text tone="muted">{value}</Text> : null}
      </VStack>
      {onPress ? (
        <Text tone="accent" onPress={onPress}>
          Edit
        </Text>
      ) : null}
    </HStack>
  </Card>
)

const Settings: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<SettingStackParams>>()
  const [store] = useStore()
  const { lockOutUser } = useAuth()
  const autoLock = store.preferences?.autoLockTime ?? AutoLockTime.FiveMinutes
  const autoLockLabel = autoLock === AutoLockTime.Never ? 'Never' : `${autoLock} min`

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 48 }}>
        <Heading>Settings</Heading>
        <Row label="PIN" value="Change your unlock PIN" onPress={() => navigation.navigate(Screens.ChangePIN)} />
        <Row
          label="Biometrics"
          value={store.preferences.useBiometry ? 'On' : 'Off'}
          onPress={() => navigation.navigate(Screens.ToggleBiometry)}
        />
        <Row
          label="Auto-lock"
          value={autoLockLabel}
          onPress={() => navigation.navigate(Screens.AutoLock)}
        />
        <Button title="Lock wallet" variant="secondary" onPress={() => lockOutUser(LockoutReason.Timeout)} />
        <Text tone="label" style={{ marginTop: 12 }}>
          Version {getVersion()} ({getBuildNumber()})
        </Text>
      </ScrollView>
    </Screen>
  )
}

export default Settings
