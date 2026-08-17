import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Screens } from '@bifold/core'
import type { HomeStackParams } from '../../../../packages/core/src/types/navigators'

import Home from '../screens/Home'

const Stack = createStackNavigator<HomeStackParams>()

const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Screens.Home} component={Home} />
    </Stack.Navigator>
  )
}

export default HomeStack
