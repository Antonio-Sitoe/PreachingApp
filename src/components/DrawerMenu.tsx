import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer'
import { Route, useRouter } from 'expo-router'
import { View } from 'react-native'
import { IconIOS } from '@/assets/icons/Icon'
import {
  BadgeDollarSign,
  BookOpenCheck,
  LucidePresentation,
  MessageSquarePlus,
} from 'lucide-react-native'
import AvatarPerfil from './AvatarPerfil'

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter()

  function handleGotoRoute(route: Route<string>) {
    router.push(route)
    props.navigation.closeDrawer()
  }
  return (
    <DrawerContentScrollView {...props}>
      <AvatarPerfil
        closeDrawer={props.navigation.closeDrawer}
        route="/profile/"
      />
      <View className="w-full h-full pt-6 pb-6 pr-6 pl-2">
        <DrawerItem
          label="Home"
          activeBackgroundColor="blue"
          labelStyle={{
            fontSize: 16,
            paddingVertical: 5,
          }}
          style={{ width: '100%' }}
          icon={() => (
            <IconIOS name="ios-home-outline" size={28} color={'#535763'} />
          )}
          onPress={() => handleGotoRoute('/(tabs)/')}
        />
        <DrawerItem
          label="Conversas sobre a Biblia"
          activeBackgroundColor="blue"
          labelStyle={{
            fontSize: 16,
            paddingVertical: 5,
          }}
          style={{ width: '100%' }}
          icon={() => (
            <LucidePresentation strokeWidth={1.5} size={28} color="#535763" />
          )}
          onPress={() => handleGotoRoute('/presentation')}
        />
        <DrawerItem
          label="Guia de Usuario"
          activeBackgroundColor="blue"
          labelStyle={{
            fontSize: 16,
            paddingVertical: 5,
          }}
          style={{ width: '100%' }}
          icon={() => (
            <BookOpenCheck strokeWidth={1.5} size={28} color="#535763" />
          )}
          onPress={() => handleGotoRoute('/userGuide/')}
        />
        <DrawerItem
          label="Ajuda e feedback"
          activeBackgroundColor="blue"
          labelStyle={{
            fontSize: 16,
            paddingVertical: 5,
          }}
          style={{ width: '100%' }}
          icon={() => (
            <MessageSquarePlus strokeWidth={1.5} size={28} color="#535763" />
          )}
          onPress={() => handleGotoRoute('/feedback')}
        />
        <DrawerItem
          label="Definicoes"
          activeBackgroundColor="blue"
          labelStyle={{
            fontSize: 16,
            paddingVertical: 5,
          }}
          style={{ width: '100%' }}
          icon={() => (
            <IconIOS name="settings-outline" size={28} color="#535763" />
          )}
          onPress={() => handleGotoRoute('/settings/')}
        />
        <DrawerItem
          label="Apoiar"
          activeBackgroundColor="blue"
          labelStyle={{
            fontSize: 16,
            paddingVertical: 5,
          }}
          style={{ width: '100%' }}
          icon={() => (
            <BadgeDollarSign size={28} strokeWidth={1.5} color="#535763" />
          )}
          onPress={() => handleGotoRoute('/helpUs')}
        />
      </View>
    </DrawerContentScrollView>
  )
}
