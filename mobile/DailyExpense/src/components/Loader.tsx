import { View, Text, ActivityIndicatorProps, ActivityIndicator } from 'react-native'
import React from 'react'
import { useTheme } from '../theme/ThemeProvider'

const AppActivityLoader = (props: ActivityIndicatorProps) => {
  const { theme } = useTheme();
  return (
    <ActivityIndicator
        color={props.color ?? theme.colors.primary}
        size={props.size ?? 'large'}
    />
  )
}

export default AppActivityLoader