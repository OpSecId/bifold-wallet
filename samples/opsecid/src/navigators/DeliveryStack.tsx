import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Screens } from '@bifold/core'
import type { DeliveryStackParams } from '../../../../packages/core/src/types/navigators'

import { ridgeCoverOptions } from '../design/motion'
import Connection from '../screens/Connection'

const Stack = createStackNavigator<DeliveryStackParams>()

const DeliveryStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={Screens.Connection}
      screenOptions={{
        ...ridgeCoverOptions,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name={Screens.Connection} component={Connection} />
    </Stack.Navigator>
  )
}

export default DeliveryStack
