import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabStacks } from '@bifold/core'
import type { TabStackParams } from '../../../../packages/core/src/types/navigators'

import TabBar from '../components/TabBar'
import { color } from '../theme'
import CredentialStack from './CredentialStack'
import HomeStack from './HomeStack'

const Tab = createBottomTabNavigator<TabStackParams>()

const TabStack: React.FC = () => {
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'top']}>
      <Tab.Navigator
        initialRouteName={TabStacks.HomeStack}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.bar,
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tab.Screen name={TabStacks.HomeStack} component={HomeStack} />
        <Tab.Screen name={TabStacks.ConnectStack}>{() => <View />}</Tab.Screen>
        <Tab.Screen name={TabStacks.CredentialStack} component={CredentialStack} />
      </Tab.Navigator>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color.ink,
  },
  bar: {
    display: 'none',
  },
})

export default TabStack
