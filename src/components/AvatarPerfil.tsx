import { View, Text, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { IconIOS } from '@/assets/icons/Icon'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { Route, useRouter } from 'expo-router'
import Colors from '@/constants/Colors'

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
  return (
    <TouchableOpacity className="-mt-1" onPress={() => router.push(route)}>
      <View className="flex p-6 flex-row gap-2 align-top bg-primary justify-between">
        <Image
          className="w-14 h-14 rounded"
          source={{
            uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
          }}
          alt="profile image"
        />
        <View>
          <Text className="text-base font-bold break-all w-40 text-white">
            Antonio Manuel Sitoe
          </Text>
          <Text className="font-sm text-gray-50">Publicador</Text>
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
