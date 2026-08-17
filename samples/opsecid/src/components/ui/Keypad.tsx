import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { color, radius, type as typeTokens } from '../../design/tokens'

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', '⌫'],
]

type Props = {
  onDigit: (digit: string) => void
  onBackspace: () => void
}

const Keypad: React.FC<Props> = ({ onDigit, onBackspace }) => {
  return (
    <View style={styles.grid}>
      {KEYS.map((row) => (
        <View key={row.join('-')} style={styles.row}>
          {row.map((key) => {
            if (!key) {
              return <View key="spacer" style={styles.key} />
            }
            const isBack = key === '⌫'
            return (
              <Pressable
                key={key}
                accessibilityRole="button"
                accessibilityLabel={isBack ? 'Delete' : key}
                onPress={() => (isBack ? onBackspace() : onDigit(key))}
                style={({ pressed }) => [styles.key, pressed && styles.pressed]}
              >
                <Text style={styles.label}>{key}</Text>
              </Pressable>
            )
          })}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  key: {
    width: '30%',
    aspectRatio: 1.85,
    borderRadius: radius.control,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.steel,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    color: color.paper,
    fontFamily: typeTokens.title.fontFamily,
    fontSize: 20,
    fontWeight: '500',
  },
})

export default Keypad
