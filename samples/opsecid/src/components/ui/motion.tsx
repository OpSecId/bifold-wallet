import React, { useEffect } from 'react'
import { StyleSheet, View, type ViewProps } from 'react-native'
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'

import { color, motion, radius } from '../../design/tokens'
import { ridgeReanimatedEasing } from '../../design/motion'

const pulseEasing = Easing.bezier(
  motion.easing.pulse[0],
  motion.easing.pulse[1],
  motion.easing.pulse[2],
  motion.easing.pulse[3]
)

const styles = StyleSheet.create({
  cluster: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    height: 36,
  },
  node: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.signal,
  },
  nodeSm: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.signal,
  },
  nodeOnSignal: {
    backgroundColor: color.ink,
  },
  rail: {
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: color.steel,
    overflow: 'hidden',
    width: '100%',
  },
  railFill: {
    height: '100%',
    backgroundColor: color.signal,
    borderRadius: radius.pill,
  },
  skeleton: {
    backgroundColor: color.graphite,
    borderRadius: radius.card,
    overflow: 'hidden',
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: color.steel,
  },
})

const PulseDot = ({
  delay,
  small,
  onSignal,
}: {
  delay: number
  small?: boolean
  onSignal?: boolean
}) => {
  const t = useSharedValue(0)

  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: motion.hold, easing: pulseEasing }), -1, true)
    )
  }, [delay, t])

  const style = useAnimatedStyle(() => ({
    opacity: 0.28 + t.value * 0.72,
    transform: [{ scale: 0.7 + t.value * 0.45 }],
  }))

  return (
    <Animated.View
      style={[small ? styles.nodeSm : styles.node, onSignal && styles.nodeOnSignal, style]}
    />
  )
}

/** Three Signal nodes — the fingerprint contacts, used whenever the agent is waiting. */
export const PulseCluster = ({ small, onSignal }: { small?: boolean; onSignal?: boolean }) => (
  <View style={styles.cluster} accessibilityLabel="Working">
    <PulseDot delay={0} small={small} onSignal={onSignal} />
    <PulseDot delay={140} small={small} onSignal={onSignal} />
    <PulseDot delay={280} small={small} onSignal={onSignal} />
  </View>
)

export const ProgressRail = () => {
  const width = useSharedValue(0.08)

  useEffect(() => {
    width.value = withSequence(
      withTiming(0.72, { duration: 1100, easing: ridgeReanimatedEasing }),
      withTiming(0.88, { duration: 2400, easing: Easing.linear })
    )
  }, [width])

  const fill = useAnimatedStyle(() => ({
    width: `${Math.round(width.value * 100)}%`,
  }))

  return (
    <View style={styles.rail} accessibilityRole="progressbar">
      <Animated.View style={[styles.railFill, fill]} />
    </View>
  )
}

export const RiseIn = ({
  children,
  delay = 0,
  style,
}: ViewProps & { delay?: number }) => (
  <Animated.View
    entering={FadeInDown.duration(motion.base).delay(delay).easing(ridgeReanimatedEasing)}
    style={style}
  >
    {children}
  </Animated.View>
)

export const Skeleton = ({ height = 88, style }: { height?: number; style?: ViewProps['style'] }) => {
  const t = useSharedValue(0.35)
  useEffect(() => {
    t.value = withRepeat(withTiming(0.7, { duration: 900, easing: pulseEasing }), -1, true)
  }, [t])
  const shimmer = useAnimatedStyle(() => ({ opacity: t.value }))
  return (
    <View style={[styles.skeleton, { height }, style]}>
      <Animated.View style={[styles.shimmer, shimmer]} />
    </View>
  )
}
