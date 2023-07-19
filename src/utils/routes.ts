import {
  BadgeDollarSign,
  BookOpenCheck,
  LucidePresentation,
  MessageSquarePlus,
} from 'lucide-react-native'

import { IconIOS } from '@/assets/icons/Icon'
import { Route } from 'expo-router'
interface IroutesProps {
  label: string
  icon: {
    IconRoute: any
    name: string
  }
  route: Route<string>
}

type ROUTE_TYPE = IroutesProps[]

export const DRAWER_ROUTES: ROUTE_TYPE = [
  {
    label: 'Home',
    icon: {
      IconRoute: IconIOS,
      name: 'ios-home-outline',
    },
    route: '/(tabs)/',
  },
  {
    label: 'Conversas sobre a Biblia',
    icon: {
      IconRoute: LucidePresentation,
      name: '',
    },

    route: '/presentation',
  },
  {
    label: 'Guia de Usuario',

    icon: {
      IconRoute: BookOpenCheck,
      name: '',
    },
    route: '/userGuide/',
  },
  {
    label: 'Ajuda e feedback',

    icon: {
      IconRoute: MessageSquarePlus,
      name: '',
    },
    route: '/feedback',
  },
  {
    label: 'configurações',
    icon: {
      IconRoute: IconIOS,
      name: 'settings-outline',
    },

    route: '/settings/',
  },
  {
    label: 'Apoiar',
    icon: {
      IconRoute: BadgeDollarSign,
      name: 'settings-outline',
    },
    route: '/helpUs',
  },
]
