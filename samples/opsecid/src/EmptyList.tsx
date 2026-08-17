import React from 'react'

import { Text, VStack } from './components/ui'

const EmptyList: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <VStack style={{ paddingTop: 48, paddingHorizontal: 24 }}>
      <Text tone="muted" style={{ textAlign: 'center' }}>
        {message ?? 'No credentials yet.'}
      </Text>
    </VStack>
  )
}

export default EmptyList
