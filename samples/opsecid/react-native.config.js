const disabledNative = [
  '@expo/app-integrity',
  '@hyperledger/indy-vdr-react-native',
  'expo-application',
  'expo-crypto',
  'react-native-gifted-chat',
  'react-native-quick-crypto',
  'react-native-screenguard',
  'react-native-tcp-socket',
]

module.exports = {
  assets: ['./assets/fonts'],
  dependencies: Object.fromEntries(
    disabledNative.map((name) => [
      name,
      {
        platforms: {
          android: null,
          ios: null,
        },
      },
    ])
  ),
}
