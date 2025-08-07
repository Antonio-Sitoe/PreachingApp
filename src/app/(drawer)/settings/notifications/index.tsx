import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';

export default function NotificationsRoot() {
  const { isDark } = useTheme();
  const router = useRouter();

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: isDark
          ? Colors.dark.darkBgSecundary
          : Colors.light.background,
      }}
    >
      <SafeAreaView className="flex-1 px-4 mt-4">
        <View className="flex-row items-center  mb-6">
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center mr-4"
            onPress={() => router.back()}
          >
            <ChevronLeft
              size={24}
              color={isDark ? Colors.dark.tint : Colors.light.tint}
            />
          </TouchableOpacity>
          <Text
            className="text-2xl font-bold"
            lightColor="black"
            darkColor="white"
          >
            Outras Notificações
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}></ScrollView>
      </SafeAreaView>
    </View>
  );
}
