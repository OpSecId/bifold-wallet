import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { Screens } from '@bifold/core'
import type { SettingStackParams } from '../../../../packages/core/src/types/navigators'

import { Button, Heading, Screen, Text, VStack } from '../components/ui'

const PINChangeSuccess: React.FC<StackScreenProps<SettingStackParams, Screens.ChangePINSuccess>> = ({
  navigation,
}) => {
  return (
    <Screen>
      <VStack gap={20} style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <Text tone="label">PIN</Text>
        <Heading>PIN updated</Heading>
        <Text tone="muted">Use the new PIN the next time you unlock this wallet.</Text>
        <Button title="Back to settings" onPress={() => navigation.navigate(Screens.Settings)} />
      </VStack>
    </Screen>
  )
}

export default PINChangeSuccess
