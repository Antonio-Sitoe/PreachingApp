import { View, Text, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { IconIOS } from '@/assets/icons/Icon'
import { DrawerContentComponentProps } from '@react-navigation/drawer'

interface AvatarPerfilProps {
  closeDrawer: DrawerContentComponentProps['navigation']['closeDrawer']
}

export default function AvatarPerfil({ closeDrawer }: AvatarPerfilProps) {
  return (
    <TouchableOpacity>
      <View className="flex p-6  flex-row gap-2 align-top bg-blue-700 justify-between">
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
        <TouchableOpacity className="bg-blue-600 rounded" onPress={closeDrawer}>
          <IconIOS name="close-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}
