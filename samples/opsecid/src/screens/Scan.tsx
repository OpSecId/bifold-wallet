import { useAgent } from '@bifold/react-hooks'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Platform, Pressable } from 'react-native'
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions'
import {
  BifoldError,
  QrCodeScanError,
  TOKENS,
  connectFromScanOrDeepLink,
  isOpenIdCredentialOffer,
  isOpenIdPresentationRequest,
  useServices,
} from '@bifold/core'

import ScanCamera from '../components/ScanCamera'
import { Heading, Screen, Text, VStack } from '../components/ui'
import { color } from '../design/tokens'

const Scan: React.FC = () => {
  const { agent } = useAgent()
  const navigation = useNavigation()
  const [{ enableImplicitInvitations, enableReuseConnections }, logger] = useServices([
    TOKENS.CONFIG,
    TOKENS.UTIL_LOGGER,
  ])
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<QrCodeScanError | null>(null)

  const ensurePermission = useCallback(async () => {
    const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
    const existing = await check(permission)
    if (existing === RESULTS.GRANTED) {
      return true
    }
    const next = await request(permission)
    return next === RESULTS.GRANTED
  }, [])

  useEffect(() => {
    ensurePermission().then(setReady).catch(() => setReady(false))
  }, [ensurePermission])

  const handleCodeScan = useCallback(
    async (value: string) => {
      setError(null)
      try {
        if (isOpenIdCredentialOffer(value) || isOpenIdPresentationRequest(value)) {
          throw new Error('This wallet does not support OpenID4VC credential offers or presentations.')
        }
        await connectFromScanOrDeepLink(
          value,
          agent,
          logger,
          navigation.getParent() ?? navigation,
          false,
          enableImplicitInvitations,
          enableReuseConnections
        )
      } catch (err: unknown) {
        const wrapped = new BifoldError('Scan failed', 'Could not use this QR code', (err as Error)?.message ?? '', 1031)
        setError(new QrCodeScanError('Invalid QR code', value, wrapped.message))
      }
    },
    [agent, enableImplicitInvitations, enableReuseConnections, logger, navigation]
  )

  return (
    <Screen style={{ backgroundColor: color.ink }}>
      <VStack style={{ flex: 1 }}>
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 20 }}>
          <Text tone="accent">Close</Text>
        </Pressable>
        <VStack gap={8} style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <Heading>Scan</Heading>
          <Text tone="muted">Point the camera at a credential or proof QR code.</Text>
        </VStack>
        {ready ? (
          <ScanCamera handleCodeScan={handleCodeScan} error={error} enableCameraOnError />
        ) : (
          <VStack style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
            <Text>Camera permission is required to scan.</Text>
          </VStack>
        )}
      </VStack>
    </Screen>
  )
}

export default Scan
