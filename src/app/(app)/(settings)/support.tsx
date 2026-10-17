import { Button } from '@/components/ui/button';
import { AppIcon } from '@/components/ui/app-icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { EMOLA_NUMBER } from '@/constants/settings';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function SupportScreen() {
  const copy = async () => {
    try {
      await Clipboard.setStringAsync(EMOLA_NUMBER.replace(/\s/g, ''));
      showToast({ message: 'Número copiado.' });
    } catch {
      showToast({ message: 'Não foi possível copiar o número.' });
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Apoiar" onBack={() => router.back()} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="w-full max-w-[640px] gap-5 self-center px-4 pb-8 pt-5">
        <View className="items-center gap-3 px-2 pt-2">
          <View className="size-[72px] items-center justify-center rounded-full bg-destructive-soft">
            <AppIcon name="heart" size={32} className="text-destructive" />
          </View>
          <Text role="heading" className="text-center font-display text-[25px] leading-8">
            A tua ajuda importa
          </Text>
          <Text variant="bodyM" className="text-center text-muted-foreground">
            O app é gratuito e feito nas horas livres. Cada contribuição, por pequena que seja,
            ajuda a mantê-lo activo e a melhorá-lo.
          </Text>
        </View>

        <View className="flex-row items-center gap-3 rounded-lg border border-border bg-card p-4">
          <View className="flex-1 gap-0.5">
            <Text variant="bodyS" className="text-muted-foreground">
              Número e-Mola
            </Text>
            <Text selectable className="font-display text-[25px] leading-8 text-primary-strong">
              {EMOLA_NUMBER}
            </Text>
          </View>
          <Button
            variant="ghost"
            size="sm"
            className="border border-border"
            accessibilityLabel="Copiar o número e-Mola"
            onPress={copy}>
            <AppIcon name="copy" size={18} className="text-primary" />
            <Text>Copiar</Text>
          </Button>
        </View>

        <Text className="px-1 font-sans text-[13px] leading-[18px] text-muted-foreground">
          Envia o valor que quiseres por e-Mola para este número. O app não processa pagamentos nem
          guarda nada sobre a doação.
        </Text>
      </ScrollView>
    </View>
  );
}
