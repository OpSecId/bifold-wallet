import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Screens } from '@bifold/core'
import type { ConnectStackParams } from '../../../../packages/core/src/types/navigators'

import { ridgeCoverOptions } from '../design/motion'
import Scan from '../screens/Scan'

const Stack = createStackNavigator<ConnectStackParams>()

const ConnectStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={ridgeCoverOptions}>
      <Stack.Screen name={Screens.Scan} component={Scan} />
    </Stack.Navigator>
  )
}

export default ConnectStack
