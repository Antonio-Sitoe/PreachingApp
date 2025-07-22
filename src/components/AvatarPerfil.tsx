import { View, Text, Image, TouchableOpacity } from 'react-native';
import { IconIOS } from '@/assets/icons/Icon';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { type Href, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';
import { defineProfiletext } from '@/utils/helper';

interface AvatarPerfilProps {
  route: Href;
  closeDrawer: DrawerContentComponentProps['navigation']['closeDrawer'];
  isDarkTheme?: boolean;
}

export default function AvatarPerfil({
  closeDrawer,
  route,
  isDarkTheme,
}: AvatarPerfilProps) {
  const router = useRouter();
  const { user } = useUser();
  return (
    <TouchableOpacity className="-mt-1" onPress={() => router.push(route)}>
      <View
        style={{
          backgroundColor: isDarkTheme ? Colors.dark.tint : Colors.light.tint,
        }}
        className="flex rounded-lg p-6 flex-row gap-2 align-top bg-primary justify-between dark:bg-dark-darkPrimary"
      >
        {user?.avatarImage && (
          <Image
            className="w-14 h-14 rounded"
            source={{
              uri: user?.avatarImage,
            }}
            alt="profile image"
          />
        )}

        <View>
          <Text className="text-base font-bold break-all w-40 text-white">
            {user?.username ? user?.username : 'Seu nome Aqui 😁'}
          </Text>
          <Text className="font-sm text-gray-50">
            {defineProfiletext(user?.profile || '')}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: isDarkTheme
              ? Colors.dark.darkBgSecundary
              : '#4252c5',
          }}
          className="bg-[#4252c5] rounded w-10 h-10  dark:bg-black items-center justify-center"
          onPress={closeDrawer}
        >
          <IconIOS name="close-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
