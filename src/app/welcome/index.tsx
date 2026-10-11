import { Logo } from '@/components/brand/logo';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { vars } from 'nativewind';
import { Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const LIGHT = vars({
  '--primary': '93 108 178',
  '--primary-foreground': '255 255 255',
  '--foreground': '30 30 30',
  '--muted-foreground': '72 76 82',
});

const WASH = `linear-gradient(180deg, rgba(93, 108, 178, 0.18) 0%, rgba(93, 108, 178, 0.03) 75%, ${THEME.light.background} 100%)`;

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-background"
      style={[
        LIGHT,
        {
          backgroundColor: THEME.light.background,
          experimental_backgroundImage: WASH,
          ...(Platform.OS === 'web' ? { backgroundImage: WASH } : null),
        },
      ]}>
      <StatusBar style="dark" />
      <View
        className="flex-1 justify-between px-4"
        style={{ paddingTop: insets.top + 16, paddingBottom: Math.max(insets.bottom, 32) }}>
        <View className="flex-1 items-center justify-center gap-8 px-2">
          <Logo variant="color" width={170} />
          <Text className="text-center font-sans text-[18px] leading-5 text-muted-foreground">
            Acompanha o progresso do seu estudante desde o primeiro contacto ao batismo.
          </Text>
        </View>

        <View className="gap-3">
          <Button className="w-full" onPress={() => router.push('/welcome/setup')}>
            <Text>Começar</Text>
          </Button>
          <Pressable
            accessibilityRole="button"
            className="h-[52px] items-center hidden justify-center rounded-lg active:opacity-80"
            style={{ backgroundColor: 'rgba(217, 217, 217, 0.3)' }}
            onPress={() => router.push('/auth/sign-in')}>
            <Text className="font-display-medium text-button text-foreground">Já tenho conta</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            className="h-11 items-center hidden justify-center active:opacity-80"
            onPress={() => router.push('/welcome/restore')}>
            <Text variant="titleS" className="font-display-semibold text-primary">
              Tenho uma cópia de segurança
            </Text>
          </Pressable>
          <Text variant="bodyS" className="text-center text-muted-foreground" />
        </View>
      </View>
    </View>
  );
}
