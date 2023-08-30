import * as React from 'react'
import {
  DialogProps,
  ThemeProviderProps,
  DialogActionsProps,
} from '@react-native-material/core'

declare module '@react-native-material/core' {
  export interface DialogActionsProps {
    children: React.ReactNode
    className?: string
  }
}

declare module '@react-native-material/core' {
  export interface DialogProps {
    children: React.ReactNode
    visible: boolean
    onDismiss: () => void
  }
}

declare module '@react-native-material/core' {
  export interface ThemeProviderProps {
    children: React.ReactNode
  }
}
