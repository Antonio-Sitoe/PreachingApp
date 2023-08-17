import { View, Text, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { IconIOS } from '@/assets/icons/Icon'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Route, useRouter } from 'expo-router'
import Colors from '@/constants/Colors'
import { Avatar } from '@react-native-material/core'
import { useUser } from '@/contexts/UserContext'
import { defineProfiletext } from '@/utils/helper'

interface AvatarPerfilProps {
  route: Route<string>
  closeDrawer: DrawerContentComponentProps['navigation']['closeDrawer']
  isDarkTheme?: boolean
}

export default function AvatarPerfil({
  closeDrawer,
  route,
  isDarkTheme,
}: AvatarPerfilProps) {
  const router = useRouter()
  const { user } = useUser()
  return (
    <TouchableOpacity className="-mt-1" onPress={() => router.push(route)}>
      <View
        style={{
          backgroundColor: isDarkTheme ? Colors.dark.tint : Colors.light.tint,
        }}
        className="flex p-6 flex-row gap-2 align-top bg-primary justify-between dark:bg-dark-darkPrimary"
      >
        {user.avatar_image ? (
          <Avatar
            color={isDarkTheme ? Colors.dark.tint : Colors.light.tint}
            image={
              <Image
                className="w-14 h-14 rounded"
                source={{
                  uri: user.avatar_image,
                }}
                alt="profile image"
              />
            }
          />
        ) : (
          <Avatar
            label={user.name ? user.name : 'Preaching App'}
            color={isDarkTheme ? Colors.dark.tint : '#4252c5'}
            tintColor="white"
          />
        )}
        <View>
          <Text className="text-base font-bold break-all w-40 text-white">
            {user.name ? user.name : 'Seu nome Aqui 😁'}
          </Text>
          <Text className="font-sm text-gray-50">
            {defineProfiletext(user.profile)}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: isDarkTheme
              ? Colors.dark.darkBgSecundary
              : '#4252c5',
          }}
          className="bg-[#4252c5] rounded  dark:bg-black"
          onPress={closeDrawer}
        >
          <IconIOS name="close-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}
