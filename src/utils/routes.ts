import {
  BadgeDollarSign,
  BookOpenCheck,
  type LucideIcon,
} from 'lucide-react-native';

import { IconIOS } from '@/assets/icons/Icon';
import type { Href } from 'expo-router';
import type { IconIOSPropName } from '@/assets/icons/Icon';
interface IroutesProps {
  label: string;
  icon: {
    IconRoute: LucideIcon | typeof IconIOS;
    name: IconIOSPropName | string;
  };
  route: Href;
}

type ROUTE_TYPE = IroutesProps[];

export const DRAWER_ROUTES: ROUTE_TYPE = [
  {
    label: 'Home',
    icon: {
      IconRoute: IconIOS,
      name: 'home-outline',
    },
    route: '/(tabs)/',
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
    label: 'Configurações',
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
];
