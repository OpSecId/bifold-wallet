import React, { useEffect, useState } from 'react'
import { StatusBar, View } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import Toast from 'react-native-toast-message'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { useNavigationContainerRef } from '@react-navigation/native'
import { isTablet } from 'react-native-device-info'
import Orientation from 'react-native-orientation-locker'
import {
  AnimatedComponentsProvider,
  AuthProvider,
  ContainerProvider,
  ErrorBoundaryWrapper,
  ErrorModal,
  NavContainer,
  NetworkProvider,
  StoreProvider,
  ThemeProvider,
  TourProvider,
  animatedComponents,
  bifoldLoggerInstance,
  initStoredLanguage,
  toastConfig,
  tours,
  type Container,
} from '@bifold/core'

import RootStack from './navigators/RootStack'
import { loadRidgeFonts } from './design/fonts'
import { color } from './design/tokens'
import { opsecidTheme, opsecidThemes } from './theme'

const createOpsecidApp = (container: Container): React.FC => {
  const AppComponent: React.FC = () => {
    const navigationRef = useNavigationContainerRef()
    const [fontsReady, setFontsReady] = useState(false)

    useEffect(() => {
      initStoredLanguage().then()
    }, [])

    useEffect(() => {
      loadRidgeFonts()
        .catch(() => undefined)
        .finally(() => setFontsReady(true))
    }, [])

    useEffect(() => {
      SplashScreen.hide()
    }, [])

    if (!isTablet()) {
      Orientation.lockToPortrait()
    }

    if (!fontsReady) {
      return <View style={{ flex: 1, backgroundColor: color.ink }} />
    }

    return (
      <ErrorBoundaryWrapper logger={bifoldLoggerInstance}>
        <ContainerProvider value={container}>
          <StoreProvider>
            <ThemeProvider themes={opsecidThemes} defaultThemeName={opsecidTheme.themeName}>
              <NavContainer navigationRef={navigationRef}>
                <AnimatedComponentsProvider value={animatedComponents}>
                  <AuthProvider>
                    <NetworkProvider>
                      <StatusBar
                        hidden={false}
                        barStyle="light-content"
                        backgroundColor={opsecidTheme.ColorPalette.brand.primaryBackground}
                        translucent={false}
                      />
                      <ErrorModal />
                      <TourProvider tours={tours} overlayColor={'gray'} overlayOpacity={0.7}>
                        <KeyboardProvider statusBarTranslucent={true} navigationBarTranslucent={true}>
                          <RootStack />
                        </KeyboardProvider>
                      </TourProvider>
                      <Toast topOffset={15} config={toastConfig} />
                    </NetworkProvider>
                  </AuthProvider>
                </AnimatedComponentsProvider>
              </NavContainer>
            </ThemeProvider>
          </StoreProvider>
        </ContainerProvider>
      </ErrorBoundaryWrapper>
    )
  }

  return AppComponent
}

export default createOpsecidApp
