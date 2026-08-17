import React from 'react'
import {
  Pressable,
  StyleSheet,
  Text as RNText,
  TextProps,
  View,
  ViewProps,
  type PressableProps,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { color, layout, motion, radius, type as typeTokens } from '../../design/tokens'
import { PulseCluster, ProgressRail } from './motion'

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.ink,
  },
  box: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stack: {},
  heading: {
    color: color.paper,
    fontFamily: typeTokens.display.fontFamily,
    fontSize: typeTokens.display.fontSize,
    fontWeight: typeTokens.display.fontWeight,
    letterSpacing: typeTokens.display.letterSpacing,
    lineHeight: typeTokens.display.lineHeight,
  },
  headingMd: {
    color: color.paper,
    fontFamily: typeTokens.title.fontFamily,
    fontSize: typeTokens.title.fontSize,
    fontWeight: typeTokens.title.fontWeight,
    letterSpacing: typeTokens.title.letterSpacing,
    lineHeight: typeTokens.title.lineHeight,
  },
  body: {
    color: color.paper,
    fontFamily: typeTokens.body.fontFamily,
    fontSize: typeTokens.body.fontSize,
    lineHeight: typeTokens.body.lineHeight,
  },
  muted: {
    color: color.fog,
    fontFamily: typeTokens.body.fontFamily,
    fontSize: 15,
    lineHeight: 21,
  },
  caption: {
    color: color.fog,
    fontFamily: typeTokens.caption.fontFamily,
    fontSize: typeTokens.caption.fontSize,
    lineHeight: typeTokens.caption.lineHeight,
  },
  label: {
    color: color.core,
    fontFamily: typeTokens.label.fontFamily,
    fontSize: typeTokens.label.fontSize,
    fontWeight: typeTokens.label.fontWeight,
    letterSpacing: typeTokens.label.letterSpacing,
    lineHeight: typeTokens.label.lineHeight,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: color.graphite,
    borderRadius: radius.card,
    padding: layout.gutter,
    borderWidth: 1,
    borderColor: color.hairline,
  },
  node: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: color.signal,
  },
  nodeWrap: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: color.fog,
    backgroundColor: color.slate,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: {
    borderColor: color.signal,
    backgroundColor: color.signalSoft,
  },
  checkNode: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  pinDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  pinDotOn: {
    backgroundColor: color.paper,
    borderColor: color.paper,
  },
  pinDotOff: {
    backgroundColor: 'transparent',
    borderColor: color.fog,
  },
  button: {
    minHeight: 52,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonPrimary: {
    backgroundColor: color.signal,
  },
  buttonSecondary: {
    backgroundColor: color.steel,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonDanger: {
    backgroundColor: color.fault,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontFamily: typeTokens.bodyStrong.fontFamily,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: color.ink,
  },
  buttonTextOnDark: {
    color: color.paper,
  },
})

type SpaceProps = {
  gap?: number
  p?: number
  px?: number
  py?: number
  mt?: number
  mb?: number
  style?: ViewProps['style']
  children?: React.ReactNode
}

const space = ({ gap, p, px, py, mt, mb }: SpaceProps) => ({
  ...(gap !== undefined ? { gap } : null),
  ...(p !== undefined ? { padding: p } : null),
  ...(px !== undefined ? { paddingHorizontal: px } : null),
  ...(py !== undefined ? { paddingVertical: py } : null),
  ...(mt !== undefined ? { marginTop: mt } : null),
  ...(mb !== undefined ? { marginBottom: mb } : null),
})

export const Screen = ({ children, style, ...rest }: ViewProps) => (
  <SafeAreaView style={[styles.screen, style]} edges={['top', 'left', 'right']} {...rest}>
    {children}
  </SafeAreaView>
)

export const Box = ({ children, style, ...rest }: ViewProps & SpaceProps) => (
  <View style={[styles.box, space(rest), style]} {...rest}>
    {children}
  </View>
)

export const VStack = ({ children, style, ...rest }: ViewProps & SpaceProps) => (
  <View style={[styles.stack, space(rest), style]}>{children}</View>
)

export const HStack = ({ children, style, ...rest }: ViewProps & SpaceProps) => (
  <View style={[styles.row, space(rest), style]}>{children}</View>
)

export const Text = ({
  children,
  tone = 'default',
  style,
  ...rest
}: TextProps & { tone?: 'default' | 'muted' | 'caption' | 'accent' | 'danger' | 'label' }) => (
  <RNText
    style={[
      tone === 'muted'
        ? styles.muted
        : tone === 'caption'
          ? styles.caption
          : tone === 'label'
            ? styles.label
            : styles.body,
      tone === 'accent' ? { color: color.signal } : null,
      tone === 'danger' ? { color: color.fault } : null,
      style,
    ]}
    {...rest}
  >
    {children}
  </RNText>
)

export const Label = ({ children, style, ...rest }: TextProps) => (
  <RNText style={[styles.label, style]} {...rest}>
    {children}
  </RNText>
)

export const Heading = ({
  children,
  size = 'lg',
  style,
  ...rest
}: TextProps & { size?: 'md' | 'lg' }) => (
  <RNText style={[size === 'md' ? styles.headingMd : styles.heading, style]} {...rest}>
    {children}
  </RNText>
)

export const Node = ({ style }: ViewProps) => <View style={[styles.node, style]} />

export const Check = ({ checked }: { checked: boolean }) => (
  <View
    style={[styles.check, checked ? styles.checkOn : null]}
    accessibilityElementsHidden
    importantForAccessibility="no"
  >
    {checked ? <Node style={styles.checkNode} /> : null}
  </View>
)

export const PinDots = ({ filled, length = 6 }: { filled: number; length?: number }) => (
  <View style={styles.pinRow} accessibilityLabel={`${filled} of ${length} digits entered`}>
    {Array.from({ length }).map((_, index) => (
      <View key={index} style={[styles.pinDot, index < filled ? styles.pinDotOn : styles.pinDotOff]} />
    ))}
  </View>
)

export const Card = ({
  children,
  node,
  style,
  ...rest
}: ViewProps & SpaceProps & { node?: boolean }) => (
  <View style={[styles.card, space(rest), style]} {...rest}>
    {node ? (
      <View style={styles.nodeWrap}>
        <Node />
      </View>
    ) : null}
    {children}
  </View>
)

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export const Button = ({
  children,
  title,
  variant = 'primary',
  disabled,
  loading,
  style,
  ...rest
}: PressableProps & {
  title?: string
  variant?: ButtonVariant
  loading?: boolean
  children?: React.ReactNode
}) => {
  const variantStyle =
    variant === 'secondary'
      ? styles.buttonSecondary
      : variant === 'ghost'
        ? styles.buttonGhost
        : variant === 'danger'
          ? styles.buttonDanger
          : styles.buttonPrimary
  const textStyle = variant === 'primary' ? styles.buttonTextPrimary : styles.buttonTextOnDark

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        variantStyle,
        disabled || loading ? styles.buttonDisabled : null,
        pressed && !disabled && !loading ? { opacity: 0.92, transform: [{ scale: motion.pressScale }] } : null,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <PulseCluster small onSignal={variant === 'primary'} />
      ) : (
        children ?? <RNText style={[styles.buttonText, textStyle]}>{title}</RNText>
      )}
    </Pressable>
  )
}

export const ButtonText = ({ children, style, ...rest }: TextProps) => (
  <RNText style={[styles.buttonText, styles.buttonTextPrimary, style]} {...rest}>
    {children}
  </RNText>
)

export { PulseCluster, ProgressRail, RiseIn, Skeleton } from './motion'

export const Processing = ({
  title,
  detail,
  onCancel,
}: {
  title: string
  detail?: string
  onCancel?: () => void
}) => (
  <Screen>
    <VStack gap={28} style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 28 }}>
      <PulseCluster />
      <VStack gap={8} style={{ alignItems: 'center' }}>
        <Text tone="label">Working</Text>
        <Heading style={{ textAlign: 'center' }}>{title}</Heading>
        {detail ? (
          <Text tone="muted" style={{ textAlign: 'center' }}>
            {detail}
          </Text>
        ) : null}
      </VStack>
      <ProgressRail />
      {onCancel ? <Button title="Cancel" variant="ghost" onPress={onCancel} /> : null}
    </VStack>
  </Screen>
)
