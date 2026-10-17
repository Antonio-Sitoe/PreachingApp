import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SettingsRow, SettingsSection } from '@/components/settings/grouped-list';
import { Text } from '@/components/ui/text';
import { usersActions } from '@/database/actions';
import { PUBLISHER_TYPE_INFO } from '@/utils/profile/setup';
import { isUsageCountingEnabled } from '@/utils/storage';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

export default function MoreScreen() {
  const { data: user } = useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => usersActions.getCurrent(),
  });
  const { data: usageCounting } = useQuery({
    queryKey: ['usage-counting'],
    queryFn: () => isUsageCountingEnabled(),
  });

  const name = user?.name.trim() || 'Sem nome';
  const initial = name.charAt(0).toUpperCase();
  const publisher = PUBLISHER_TYPE_INFO[user?.publisherType ?? 'publisher'].label;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Mais" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="w-full max-w-[640px] gap-5 self-center px-4 pb-8 pt-5">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${name}, ${publisher}, ver perfil`}
          onPress={() => router.push('/profile')}
          className="flex-row items-center gap-3.5 rounded-lg border border-border bg-card py-3 pl-4 pr-3 active:bg-secondary">
          <View className="size-12 items-center justify-center rounded-full bg-primary">
            <Text className="font-display text-[20px] leading-none text-primary-foreground">
              {initial}
            </Text>
          </View>
          <View className="flex-1 gap-0.5">
            <Text variant="titleM">{name}</Text>
            <Text className="font-sans text-[13px] leading-[18px] text-muted-foreground">
              {publisher} · ver perfil
            </Text>
          </View>
          <AppIcon name="chevron-right" size={18} className="text-subtle" />
        </Pressable>

        <View className="flex-row gap-2">
          <MenuTile icon="notes" label="Relatórios" onPress={() => router.push('/report')} />
          <MenuTile icon="clock" label="Horas" />
          <MenuTile icon="heart" label="Apoiar" onPress={() => router.push('/support')} />
        </View>

        <SettingsSection title="Definições">
          <SettingsRow first title="Gerais" onPress={() => router.push('/general')} />
          <SettingsRow title="Notificações" onPress={() => router.push('/notifications')} />
          <SettingsRow title="Backup e restauro" onPress={() => router.push('/backup')} />
          <SettingsRow
            title="Contagens anónimas"
            value={usageCounting ? 'Ligadas' : 'Desligadas'}
            onPress={() => router.push('/usage')}
          />
        </SettingsSection>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/auth/sign-in')}
          className="flex-row items-center gap-3 rounded-lg bg-secondary py-3 pl-4 pr-3 active:opacity-80">
          <View className="flex-1 gap-0.5">
            <Text className="font-display-semibold text-[14px] leading-[19px] text-primary-strong">
              Estás a usar sem conta
            </Text>
            <Text variant="bodyS" className="text-muted-foreground">
              Entra para teres cópia na nuvem e sincronização.
            </Text>
          </View>
          <AppIcon name="chevron-right" size={18} className="text-primary-strong" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

function MenuTile({
  icon,
  label,
  onPress,
}: {
  icon: AppIconName;
  label: string;
  onPress?: () => void;
}) {
  const className = 'flex-1 gap-2.5 rounded-lg border border-border bg-card px-3 py-3.5';
  const content = (
    <>
      <AppIcon name={icon} size={22} className="text-primary" />
      <Text variant="titleS">{label}</Text>
    </>
  );

  if (!onPress) return <View className={className}>{content}</View>;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`${className} active:bg-secondary`}>
      {content}
    </Pressable>
  );
}
