import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { Screens } from '@bifold/core'
import type { SettingStackParams } from '../../../../packages/core/src/types/navigators'

import { ridgePushOptions } from '../design/motion'
import Settings from '../screens/Settings'
import PINChange from '../screens/PINChange'
import PINChangeSuccess from '../screens/PINChangeSuccess'
import ToggleBiometry from '../screens/ToggleBiometry'
import AutoLock from '../screens/AutoLock'

const Stack = createStackNavigator<SettingStackParams>()

const SettingStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={ridgePushOptions}>
      <Stack.Screen name={Screens.Settings} component={Settings} />
      <Stack.Screen name={Screens.ToggleBiometry} component={ToggleBiometry} />
      <Stack.Screen name={Screens.ChangePIN} component={PINChange} />
      <Stack.Screen name={Screens.ChangePINSuccess} component={PINChangeSuccess} />
      <Stack.Screen name={Screens.AutoLock} component={AutoLock} />
    </Stack.Navigator>
  )
}

export default SettingStack
