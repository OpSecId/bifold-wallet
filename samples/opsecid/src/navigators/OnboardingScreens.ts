import React from 'react'
import { ParamListBase, RouteConfig, StackNavigationState } from '@react-navigation/native'
import { StackNavigationOptions, TransitionPresets } from '@react-navigation/stack'
import type { StackNavigationEventMap } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { Screens } from '@bifold/core'
import type { ScreenOptionsType } from '../../../../packages/core/src/types/navigators'

type ScreenOptions = RouteConfig<
  ParamListBase,
  Screens,
  StackNavigationState<ParamListBase>,
  StackNavigationOptions,
  StackNavigationEventMap
>

interface ScreenComponents {
  SplashScreen: React.FC
  Preface: React.FC
  UpdateAvailableScreen: React.FC
  Terms: React.FC
  NameWallet: React.FC
  Biometry: React.FC
  PushNotifications: React.FC
  AttemptLockout: React.FC
  OnboardingScreen: React.FC
  CreatePINScreen: React.FC
  EnterPINScreen: React.FC
}

export const getOnboardingScreens = (
  t: TFunction,
  ScreenOptionsDictionary: ScreenOptionsType,
  components: ScreenComponents
): ScreenOptions[] => [
  {
    name: Screens.Splash,
    component: components.SplashScreen,
    options: {
      ...TransitionPresets.ModalFadeTransition,
      title: t('Screens.Splash'),
      headerShown: false,
      ...ScreenOptionsDictionary[Screens.Splash],
    },
  },
  {
    name: Screens.Preface,
    component: components.Preface,
    options: { headerShown: false, ...ScreenOptionsDictionary[Screens.Preface] },
  },
  {
    name: Screens.UpdateAvailable,
    component: components.UpdateAvailableScreen,
    options: { headerShown: false, ...ScreenOptionsDictionary[Screens.UpdateAvailable] },
  },
  {
    name: Screens.Onboarding,
    component: components.OnboardingScreen,
    options: () => ({
      headerShown: false,
      headerLeft: () => false,
      ...ScreenOptionsDictionary[Screens.Onboarding],
    }),
  },
  {
    name: Screens.Terms,
    component: components.Terms,
    options: () => ({ headerShown: false, ...ScreenOptionsDictionary[Screens.Terms] }),
  },
  {
    name: Screens.CreatePIN,
    component: components.CreatePINScreen,
    initialParams: {},
    options: () => ({
      headerShown: false,
      headerLeft: () => false,
      ...ScreenOptionsDictionary[Screens.CreatePIN],
    }),
  },
  {
    name: Screens.NameWallet,
    component: components.NameWallet,
    options: () => ({ headerShown: false, ...ScreenOptionsDictionary[Screens.NameWallet] }),
  },
  {
    name: Screens.Biometry,
    component: components.Biometry,
    options: () => ({
      headerShown: false,
      ...TransitionPresets.SlideFromRightIOS,
      title: t('Screens.Biometry'),
      ...ScreenOptionsDictionary[Screens.Biometry],
    }),
  },
  {
    name: Screens.PushNotifications,
    component: components.PushNotifications,
    options: () => ({ headerShown: false, ...ScreenOptionsDictionary[Screens.PushNotifications] }),
  },
  {
    name: Screens.EnterPIN,
    component: components.EnterPINScreen,
    options: () => ({
      headerShown: false,
      headerLeft: () => false,
      ...ScreenOptionsDictionary[Screens.EnterPIN],
    }),
  },
  {
    name: Screens.AttemptLockout,
    component: components.AttemptLockout,
    options: () => ({
      headerShown: false,
      headerLeft: () => null,
      ...ScreenOptionsDictionary[Screens.AttemptLockout],
    }),
  },
]
