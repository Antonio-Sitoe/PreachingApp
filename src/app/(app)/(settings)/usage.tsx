import { SettingsSwitch } from '@/components/settings/grouped-list';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { USAGE_NEVER_SENT, USAGE_SENT } from '@/constants/settings';
import { isUsageCountingEnabled, setUsageCountingEnabled } from '@/utils/storage';
import { countEvent } from '@/utils/usage';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function UsageScreen() {
  const queryClient = useQueryClient();
  const [enabled, setEnabled] = React.useState(isUsageCountingEnabled);

  const toggle = (next: boolean) => {
    setEnabled(next);
    setUsageCountingEnabled(next);
    void queryClient.invalidateQueries({ queryKey: ['usage-counting'] });
    if (next) void countEvent('app_open');
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Contagens anónimas" onBack={() => router.back()} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="w-full max-w-[640px] gap-5 self-center px-4 pb-8 pt-5">
        <View className="min-h-[52px] flex-row items-center gap-3 rounded-lg border border-border bg-card px-4 py-2">
          <View className="flex-1 gap-0.5">
            <Text variant="titleS">Enviar contagens de uso</Text>
            <Text variant="bodyS" className="text-muted-foreground">
              {enabled ? 'Ligado. Podes desligar quando quiseres' : 'Desligado até decidires ligar'}
            </Text>
          </View>
          <SettingsSwitch label="Enviar contagens de uso" value={enabled} onValueChange={toggle} />
        </View>

        <ItemList
          title="Se ligares, é enviado isto: só números"
          items={USAGE_SENT}
          icon="check"
          iconClassName="text-success"
        />
        <ItemList
          title="O que nunca sai do telemóvel"
          items={USAGE_NEVER_SENT}
          icon="close"
          iconClassName="text-destructive"
        />

        <Text className="px-1 font-sans text-[13px] leading-[18px] text-muted-foreground">
          Ligar ajuda a perceber se o app está a ser útil. As contagens guardam-se offline e seguem
          quando houver internet.
        </Text>
      </ScrollView>
    </View>
  );
}

function ItemList({
  title,
  items,
  icon,
  iconClassName,
}: {
  title: string;
  items: string[];
  icon: AppIconName;
  iconClassName: string;
}) {
  return (
    <View className="gap-2">
      <Text className="px-1 font-display-semibold text-[13px] leading-4 text-muted-foreground">
        {title}
      </Text>
      <View role="list" className="gap-2.5 rounded-lg border border-border bg-card px-4 py-3.5">
        {items.map((item) => (
          <View key={item} role="listitem" className="flex-row items-center gap-3">
            <AppIcon name={icon} size={18} className={iconClassName} />
            <Text variant="bodyM" className="flex-1">
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
