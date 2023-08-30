import React from 'react'
import useTheme from '@/hooks/useTheme'
import Colors from '@/constants/Colors'
import Logo from '@/assets/images/illo.svg'
import LogoDark from '@/assets/images/darkill.svg'
import { Text, View } from './Themed'

interface NoContentProps {
  text: string
}

export default function NoContent({ text }: NoContentProps) {
  const { isDark } = useTheme()
  return (
    <View
      style={{
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
      }}
      className="flex-1 items-center justify-center"
    >
      {isDark ? <LogoDark /> : <Logo />}
      <Text className="mt-2 font-textIBM" lightColor={Colors.light.tint}>
        {text}
      </Text>
    </View>
  )
}
