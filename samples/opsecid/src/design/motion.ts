import { Easing } from 'react-native'
import type { StackNavigationOptions, StackCardStyleInterpolator } from '@react-navigation/stack'
import { Easing as ReanimatedEasing } from 'react-native-reanimated'

import { color, motion } from './tokens'

export const ridgeEasing = Easing.bezier(
  motion.easing.out[0],
  motion.easing.out[1],
  motion.easing.out[2],
  motion.easing.out[3]
)

export const ridgeReanimatedEasing = ReanimatedEasing.bezier(
  motion.easing.out[0],
  motion.easing.out[1],
  motion.easing.out[2],
  motion.easing.out[3]
)

const timing = (duration: number) => ({
  animation: 'timing' as const,
  config: { duration, easing: ridgeEasing },
})

/** Push: short fade + 12% lateral slide — faster than iOS default. */
export const ridgePushInterpolator: StackCardStyleInterpolator = ({ current, layouts }) => ({
  cardStyle: {
    backgroundColor: color.ink,
    opacity: current.progress,
    transform: [
      {
        translateX: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [Math.round(layouts.screen.width * 0.1), 0],
        }),
      },
    ],
  },
})

/** Cover: sheets (Scan, DIDComm delivery, Settings). */
export const ridgeCoverInterpolator: StackCardStyleInterpolator = ({ current }) => ({
  cardStyle: {
    backgroundColor: color.ink,
    opacity: current.progress,
    transform: [
      {
        translateY: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [motion.enterY * 1.6, 0],
        }),
      },
    ],
  },
})

export const ridgeFadeInterpolator: StackCardStyleInterpolator = ({ current }) => ({
  cardStyle: {
    backgroundColor: color.ink,
    opacity: current.progress,
  },
})

export const ridgePushOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: color.ink },
  cardStyleInterpolator: ridgePushInterpolator,
  transitionSpec: {
    open: timing(motion.base),
    close: timing(motion.fast),
  },
}

export const ridgeCoverOptions: StackNavigationOptions = {
  headerShown: false,
  presentation: 'modal',
  cardStyle: { backgroundColor: color.ink },
  cardStyleInterpolator: ridgeCoverInterpolator,
  transitionSpec: {
    open: timing(motion.base),
    close: timing(motion.fast),
  },
}

export const ridgeFadeOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: color.ink },
  cardStyleInterpolator: ridgeFadeInterpolator,
  transitionSpec: {
    open: timing(motion.fast),
    close: timing(motion.instant),
  },
}
