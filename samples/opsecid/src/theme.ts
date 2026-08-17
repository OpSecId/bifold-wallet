import { ThemeBuilder, bifoldTheme, type IColorPalette, type ITheme } from '@bifold/core'

import { color, radius, opsecidColors } from './design/tokens'

export { opsecidColors, color, radius }

const ColorPalette: IColorPalette = {
  ...bifoldTheme.ColorPalette,
  brand: {
    ...bifoldTheme.ColorPalette.brand,
    primary: color.signal,
    primaryDisabled: 'rgba(248, 144, 56, 0.35)',
    secondary: opsecidColors.white,
    secondaryDisabled: 'rgba(255, 255, 255, 0.35)',
    tertiary: opsecidColors.white,
    tertiaryDisabled: 'rgba(255, 255, 255, 0.35)',
    primaryLight: color.signalSoft,
    highlight: color.signal,
    primaryBackground: color.ink,
    secondaryBackground: color.slate,
    tertiaryBackground: color.graphite,
    modalPrimary: color.signal,
    modalSecondary: opsecidColors.white,
    modalTertiary: opsecidColors.white,
    modalPrimaryBackground: color.ink,
    modalSecondaryBackground: color.slate,
    modalTertiaryBackground: color.graphite,
    credentialCardPlaceholderBackground: color.graphite,
    link: color.signal,
    credentialLink: color.signal,
    text: color.paper,
    icon: color.paper,
    headerIcon: color.paper,
    headerText: color.paper,
    buttonText: color.ink,
    tabBarInactive: color.fog,
    loadingIcon: color.signal,
  },
  semantic: {
    ...bifoldTheme.ColorPalette.semantic,
    success: color.live,
    error: color.fault,
    focus: color.signal,
  },
  notification: {
    ...bifoldTheme.ColorPalette.notification,
    success: color.slate,
    successBorder: color.live,
    successIcon: color.live,
    successText: color.paper,
    info: color.slate,
    infoBorder: color.signal,
    infoIcon: color.signal,
    infoText: color.paper,
    warn: color.slate,
    warnBorder: color.signal,
    warnIcon: color.signal,
    warnText: color.paper,
    error: color.slate,
    errorBorder: color.fault,
    errorIcon: color.fault,
    errorText: color.paper,
  },
  grayscale: {
    black: opsecidColors.black,
    darkGrey: color.slate,
    mediumGrey: color.fog,
    lightGrey: color.mist,
    veryLightGrey: color.steel,
    white: color.paper,
  },
}

export const opsecidTheme: ITheme = new ThemeBuilder(bifoldTheme)
  .setColorPalette(ColorPalette)
  .withOverrides({
    themeName: 'opsecid-dark',
    borderRadius: radius.control,
  })
  .build()

export const opsecidThemes: ITheme[] = [opsecidTheme]
