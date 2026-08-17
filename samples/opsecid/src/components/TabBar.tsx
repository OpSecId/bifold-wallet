import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Screens, Stacks, TabStacks, useNetwork } from '@bifold/core'
import type { TabStackParams } from '../../../../packages/core/src/types/navigators'

import { color, layout, radius, type as typeTokens } from '../design/tokens'
import { Text } from './ui'

const TabBar: React.FC<BottomTabBarProps> = ({ state, navigation: tabNav }) => {
  const { assertNetworkConnected } = useNetwork()
  const navigation = useNavigation<StackNavigationProp<TabStackParams>>()
  const scanScale = useSharedValue(1)
  const scanStyle = useAnimatedStyle(() => ({ transform: [{ scale: scanScale.value }] }))

  return (
    <SafeAreaView edges={['bottom']} style={styles.barWrap}>
      <View style={styles.barInner}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Home"
          onPress={() => tabNav.navigate(TabStacks.HomeStack)}
          style={styles.tab}
        >
          <Text style={[styles.tabLabel, state.index === 0 && styles.tabLabelActive]}>Home</Text>
          <View style={[styles.mark, state.index === 0 && styles.markOn]} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Scan"
          onPressIn={() => {
            scanScale.value = withSpring(0.92, { damping: 16, stiffness: 420 })
          }}
          onPressOut={() => {
            scanScale.value = withSpring(1, { damping: 14, stiffness: 280 })
          }}
          onPress={() => {
            if (!assertNetworkConnected()) {
              return
            }
            navigation.navigate(Stacks.ConnectStack as never, { screen: Screens.Scan } as never)
          }}
          style={styles.scanWrap}
        >
          <Animated.View style={[styles.scan, scanStyle]}>
            <Text style={styles.scanLabel}>Scan</Text>
          </Animated.View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cards"
          onPress={() => tabNav.navigate(TabStacks.CredentialStack)}
          style={styles.tab}
        >
          <Text style={[styles.tabLabel, state.index === 2 && styles.tabLabelActive]}>Cards</Text>
          <View style={[styles.mark, state.index === 2 && styles.markOn]} />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  barWrap: {
    backgroundColor: color.slate,
  },
  barInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingTop: 10,
    minHeight: layout.tabHeight,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  tabLabel: {
    color: color.fog,
    fontFamily: typeTokens.bodyStrong.fontFamily,
    fontSize: 14,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: color.signal,
  },
  mark: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  markOn: {
    backgroundColor: color.signal,
  },
  scanWrap: {
    alignItems: 'center',
    marginTop: -28,
  },
  scan: {
    width: layout.scanNode,
    height: layout.scanNode,
    borderRadius: radius.node,
    backgroundColor: color.signal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLabel: {
    color: color.ink,
    fontFamily: typeTokens.bodyStrong.fontFamily,
    fontWeight: '700',
    fontSize: 14,
  },
})

export default TabBar
