import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text } from 'react-native'

import { testIdWithKey } from '../../utils/testable'
import { useThemeContext } from '../../utils/themeContext'
import InfoTextBox from '../texts/InfoTextBox'

const NoNewUpdates: React.FC = () => {
  const { t } = useTranslation()
  const { HomeTheme } = useThemeContext()
  const styles = StyleSheet.create({
    text: {
      ...HomeTheme.noNewUpdatesText
    },
  })
  return (
    <InfoTextBox>
      <Text style={[styles.text]} testID={testIdWithKey('NoNewUpdates')}>
        {t('Home.NoNewUpdates')}
      </Text>
    </InfoTextBox>
  )
}

export default NoNewUpdates
