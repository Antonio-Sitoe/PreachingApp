import { IconSymbol } from '@/components/ui/IconSymbol';
import { cn } from '@/lib/utils';
import Feather from '@expo/vector-icons/build/Feather';
import { useRouter } from 'expo-router';
import { TouchableOpacity, useColorScheme, View } from 'react-native';

export function EditorHeader() {
  const colorScheme = useColorScheme();
  const { back } = useRouter();

  return (
    <View
      className={`h-[120px] justify-center items-center relative overflow-hidden ${
        colorScheme === 'dark' ? 'bg-[#1D3D47]' : 'bg-[#A1CEDC]'
      }`}
    >
      <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
        <IconSymbol
          size={180}
          color={colorScheme === 'dark' ? '#ffffff' : '#000000'}
          name="chevron.left.forwardslash.chevron.right"
          style={{ position: 'absolute' }}
        />
      </View>
      <View
        className={`absolute top-0 left-0 right-0 bottom-0 ${
          colorScheme === 'dark'
            ? 'bg-[rgba(29,61,71,0.8)]'
            : 'bg-[rgba(161,206,220,0.8)]'
        }`}
      />

      <View className="absolute top-3 left-0 right-0 flex-row justify-between items-start pt-3 px-5">
        <TouchableOpacity
          className={cn(
            `w-11 h-11 rounded-full justify-center items-center shadow-lg ${
              colorScheme === 'dark'
                ? 'bg-[rgba(255,255,255,0.2)]'
                : 'bg-[#252525]'
            }`
          )}
          onPress={() => {
            back();
          }}
        >
          <Feather size={22} color={'#ffffff'} name="chevron-left" />
        </TouchableOpacity>

        <TouchableOpacity
          className={`w-11 h-11 rounded-full justify-center items-center shadow-lg ${
            colorScheme === 'dark' ? 'bg-[rgba(214,24,24,0.2)]' : 'bg-[#252525]'
          }`}
          onPress={() => {}}
        >
          <Feather size={22} color={'#ffffff'} name="more-horizontal" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
