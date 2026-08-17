import { Agent } from '@credo-ts/core'
import { StackActions, useNavigation, useNavigationState } from '@react-navigation/native'
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DeviceEventEmitter } from 'react-native'
import {
  DispatchAction,
  EventTypes,
  TOKENS,
  useServices,
  useStore,
  type OnboardingStackParams,
  type State,
  type WalletSecret,
} from '@bifold/core'
import { useOnboardingState } from '../../../../packages/core/src/hooks/useOnboardingState'

import { getOnboardingScreens } from './OnboardingScreens'
import AttemptLockout from '../screens/AttemptLockout'
import Biometry from '../screens/Biometry'
import PINCreate from '../screens/PINCreate'
import PINEnter from '../screens/PINEnter'
import Splash from '../screens/Splash'
import Terms from '../screens/Terms'
import Welcome from '../screens/Welcome'

export type OnboardingStackProps = {
  initializeAgent: (walletSecret: WalletSecret) => Promise<void>
  agent: Agent | null
}

const Empty: React.FC = () => null

const OnboardingStack: React.FC<OnboardingStackProps> = ({ initializeAgent, agent }) => {
  const [store, dispatch] = useStore<State>()
  const { t } = useTranslation()
  const Stack = createStackNavigator()
  const [config, { version: termsVersion }, ScreenOptionsDictionary, generateOnboardingWorkflowSteps] = useServices([
    TOKENS.CONFIG,
    TOKENS.SCREEN_TERMS,
    TOKENS.OBJECT_SCREEN_CONFIG,
    TOKENS.ONBOARDING,
  ])
  const navigation = useNavigation<StackNavigationProp<OnboardingStackParams>>()
  const currentRoute = useNavigationState((state) => state?.routes[state?.index])
  const { onboardingState, activeScreen } = useOnboardingState(
    store,
    config,
    Number(termsVersion),
    agent,
    generateOnboardingWorkflowSteps
  )

  const onAuthenticated = useCallback(
    (status: boolean): void => {
      if (!status) {
        return
      }
      dispatch({
        type: DispatchAction.DID_AUTHENTICATE,
      })
    },
    [dispatch]
  )

  const SplashScreen = useCallback(() => {
    return <Splash initializeAgent={initializeAgent} />
  }, [initializeAgent])

  const CreatePINScreen = useCallback(
    (props: object) => {
      return <PINCreate setAuthenticated={onAuthenticated} {...props} />
    },
    [onAuthenticated]
  )

  const EnterPINScreen = useCallback(
    (props: object) => {
      return <PINEnter setAuthenticated={onAuthenticated} {...props} />
    },
    [onAuthenticated]
  )

  useEffect(() => {
    if (activeScreen && activeScreen === currentRoute?.name) {
      return
    }
    if (activeScreen) {
      navigation.dispatch(StackActions.replace(activeScreen))
      return
    }
    DeviceEventEmitter.emit(EventTypes.DID_COMPLETE_ONBOARDING)
  }, [activeScreen, currentRoute, onboardingState, navigation])

  const screens = useMemo(
    () =>
      getOnboardingScreens(t, ScreenOptionsDictionary, {
        SplashScreen,
        Preface: Empty,
        UpdateAvailableScreen: Empty,
        Terms,
        NameWallet: Empty,
        Biometry,
        PushNotifications: Empty,
        AttemptLockout,
        OnboardingScreen: Welcome,
        CreatePINScreen,
        EnterPINScreen,
      }),
    [SplashScreen, CreatePINScreen, EnterPINScreen, t, ScreenOptionsDictionary]
  )

  return (
    <Stack.Navigator initialRouteName={activeScreen} screenOptions={{ headerShown: false }}>
      {screens.map((item) => {
        return <Stack.Screen key={item.name} {...item} />
      })}
    </Stack.Navigator>
  )
}

export default OnboardingStack
