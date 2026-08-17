import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Vibration,
  View,
  useWindowDimensions,
} from 'react-native'
import { OrientationType, useOrientationChange } from 'react-native-orientation-locker'
import { Camera, Code, useCameraDevice, useCameraFormat, useCodeScanner } from 'react-native-vision-camera'

import { color } from '../design/tokens'

type Props = {
  handleCodeScan: (value: string) => Promise<void>
  error?: { data?: string } | null
  enableCameraOnError?: boolean
}

const ScanCamera: React.FC<Props> = ({ handleCodeScan, error, enableCameraOnError }) => {
  const [orientation, setOrientation] = useState(OrientationType.PORTRAIT)
  const [cameraActive, setCameraActive] = useState(true)
  const [invalidQrCodes, setInvalidQrCodes] = useState(new Set<string>())
  const hasFiredRef = useRef(false)
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null)
  const focusOpacity = useRef(new Animated.Value(0)).current
  const focusScale = useRef(new Animated.Value(1)).current
  const device = useCameraDevice('back')
  const screenAspectRatio = useWindowDimensions().scale
  const format = useCameraFormat(device, [
    { fps: 20 },
    { videoAspectRatio: screenAspectRatio },
    { videoResolution: 'max' },
    { photoAspectRatio: screenAspectRatio },
    { photoResolution: 'max' },
  ])
  const camera = useRef<Camera>(null)

  const orientationDegrees: Record<string, string> = {
    [OrientationType.PORTRAIT]: '0deg',
    [OrientationType['LANDSCAPE-LEFT']]: '270deg',
    [OrientationType['PORTRAIT-UPSIDEDOWN']]: '180deg',
    [OrientationType['LANDSCAPE-RIGHT']]: '90deg',
  }

  useOrientationChange((orientationType) => {
    setOrientation(orientationType)
  })

  const onCodeScanned = useCallback(
    (codes: Code[]) => {
      const value = codes[0].value
      if (!value || invalidQrCodes.has(value)) {
        return
      }

      if (error?.data === value) {
        setInvalidQrCodes((prev) => new Set([...prev, value]))
        if (enableCameraOnError) {
          hasFiredRef.current = false
          setCameraActive(true)
        }
        return
      }

      if (hasFiredRef.current || !cameraActive) {
        return
      }

      hasFiredRef.current = true
      Vibration.vibrate()
      handleCodeScan(value)
      setCameraActive(false)
    },
    [invalidQrCodes, error, enableCameraOnError, cameraActive, handleCodeScan]
  )

  const handleFocusTap = (e: GestureResponderEvent): void => {
    if (!device?.supportsFocus) {
      return
    }
    const { locationX: x, locationY: y } = e.nativeEvent
    setFocusPoint({ x, y })
    focusOpacity.setValue(1)
    focusScale.setValue(1.5)
    Animated.parallel([
      Animated.timing(focusOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.spring(focusScale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
    ]).start(() => setFocusPoint(null))
    camera.current?.focus({ x, y })
  }

  useEffect(() => {
    if (error?.data && enableCameraOnError) {
      hasFiredRef.current = false
      setCameraActive(true)
    }
  }, [error, enableCameraOnError])

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned,
  })

  return (
    <View style={[StyleSheet.absoluteFill, { transform: [{ rotate: orientationDegrees[orientation] ?? '0deg' }] }]}>
      {device ? (
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFillObject}
            device={device}
            isActive={cameraActive}
            codeScanner={codeScanner}
            format={format}
          />
          <Pressable accessible={false} style={StyleSheet.absoluteFill} onPressIn={handleFocusTap} />
          <View pointerEvents="none" style={styles.frameWrap}>
            <View style={styles.frame} />
          </View>
          {focusPoint ? (
            <Animated.View
              style={[
                styles.focus,
                {
                  left: focusPoint.x - 40,
                  top: focusPoint.y - 40,
                  opacity: focusOpacity,
                  transform: [{ scale: focusScale }],
                },
              ]}
            />
          ) : null}
        </>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  frameWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 240,
    height: 240,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: color.signal,
  },
  focus: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: color.signal,
    backgroundColor: 'transparent',
  },
})

export default ScanCamera
