import { loadAsync } from 'expo-font'

export const ridgeFontMap = {
  'Outfit-Regular': require('../../assets/fonts/Outfit-Regular.ttf'),
  'Outfit-SemiBold': require('../../assets/fonts/Outfit-SemiBold.ttf'),
  'IBMPlexMono-Medium': require('../../assets/fonts/IBMPlexMono-Medium.ttf'),
}

export const loadRidgeFonts = () => loadAsync(ridgeFontMap)
