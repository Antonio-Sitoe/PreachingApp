import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';

import { View } from 'react-native';
import { useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu } from 'lucide-react-native';
import { DrawerActions } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

export function HeaderSecondary() {
  const top = useSafeAreaInsets().top;
  const navigation = useNavigation();
  const { isDark } = useTheme();

  return (
    <View
      className="w-screen"
      style={{
        paddingTop: top,
        elevation: 2,
        backgroundColor: isDark
          ? Colors.dark.darkBgSecundary
          : Colors.light.background,
      }}
    >
      <View className="w-screen px-4 h-14 flex-row items-center justify-between ">
        <TouchableOpacity
          className="py-1"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Menu
            strokeWidth={1.5}
            color={isDark ? Colors.dark.text : Colors.light.tint}
            size={28}
          />
        </TouchableOpacity>
        <View className="flex-row gap-2 items-end" />
      </View>
    </View>
  );
}
