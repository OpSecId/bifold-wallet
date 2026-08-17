/**
 * OpSecId Ridge — mobile design tokens.
 * Source of truth for color, type, space, and motion.
 * Visual gallery: samples/opsecid/design-system/index.html
 */

export const color = {
  ink: '#0B0B0F',
  slate: '#16161C',
  graphite: '#1C1C24',
  steel: '#2A2A32',
  signal: '#F89038',
  signalMuted: '#C46E28',
  signalSoft: 'rgba(248, 144, 56, 0.18)',
  core: '#A8B8B8',
  fog: '#8E8E93',
  mist: '#C7C7CC',
  paper: '#F5F5F7',
  fault: '#FF453A',
  live: '#30D158',
  hairline: 'rgba(245, 245, 247, 0.08)',
  overlay: 'rgba(11, 11, 15, 0.72)',
} as const

/** Back-compat aliases used by existing screens. */
export const opsecidColors = {
  bg: color.ink,
  surface: color.slate,
  card: color.graphite,
  elevated: color.steel,
  accent: color.signal,
  accentMuted: color.signalMuted,
  text: color.paper,
  muted: color.fog,
  danger: color.fault,
  success: color.live,
  white: '#FFFFFF',
  black: '#000000',
} as const

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const

export const radius = {
  control: 16,
  card: 20,
  pill: 999,
  node: 36,
} as const

export const type = {
  display: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  title: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  body: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 22,
  },
  bodyStrong: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 22,
  },
  caption: {
    fontFamily: 'Outfit-Regular',
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  label: {
    fontFamily: 'IBMPlexMono-Medium',
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 1.4,
    lineHeight: 14,
  },
  pin: {
    fontFamily: 'IBMPlexMono-Medium',
    fontSize: 28,
    fontWeight: '500' as const,
    letterSpacing: 10,
    lineHeight: 34,
  },
} as const

/**
 * Ridge motion — snappy on tap, calm while the agent works.
 * Instant / tap: press scale. Base: screen enter. Hold: DIDComm wait loops.
 */
export const motion = {
  instant: 90,
  fast: 140,
  base: 220,
  slow: 360,
  hold: 900,
  stagger: 42,
  pressScale: 0.97,
  enterY: 18,
  easing: {
    /** Tap / enter — overshoot-free snap */
    out: [0.2, 0.9, 0.2, 1] as const,
    /** Dismiss */
    in: [0.4, 0, 1, 1] as const,
    /** Wait loops */
    pulse: [0.45, 0, 0.55, 1] as const,
  },
} as const

export const layout = {
  gutter: space[5],
  tabHeight: 64,
  scanNode: 72,
  maxReadable: 390,
} as const
