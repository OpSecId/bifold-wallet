import React from 'react'

import { Text, VStack } from './components/ui'

const HomeFooter: React.FC = () => {
  return (
    <VStack px={24} py={32}>
      <Text tone="muted" style={{ textAlign: 'center' }}>
        Scan a QR code to add a credential or respond to a request.
      </Text>
    </VStack>
  )
}

export default HomeFooter
