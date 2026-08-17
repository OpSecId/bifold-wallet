import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Screens } from '@bifold/core'
import type { CredentialStackParams } from '../../../../packages/core/src/types/navigators'

import Credentials from '../screens/Credentials'

const Stack = createStackNavigator<CredentialStackParams>()

const CredentialStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.Credentials} component={Credentials} />
    </Stack.Navigator>
  )
}

export default CredentialStack
