import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabBarItem<Key extends string = string> = {
  key: Key;
  label: string;
  icon: AppIconName;
};

const MAIN_TABS = [
  { key: 'today', label: 'Hoje', icon: 'today' },
  { key: 'people', label: 'Pessoas', icon: 'people' },
  { key: 'notes', label: 'Notas', icon: 'notes' },
  { key: 'more', label: 'Mais', icon: 'more' },
] as const satisfies readonly TabBarItem[];

type MainTabKey = (typeof MAIN_TABS)[number]['key'];

type TabBarProps<Key extends string> = {
  items?: readonly TabBarItem<Key>[];
  activeKey: Key;
  onChange: (key: Key) => void;

  bottomInset?: number;
  className?: string;
};

function TabBar<Key extends string = MainTabKey>({
  items = MAIN_TABS as unknown as readonly TabBarItem<Key>[],
  activeKey,
  onChange,
  bottomInset,
  className,
}: TabBarProps<Key>) {
  const insets = useSafeAreaInsets();
  const paddingBottom = bottomInset ?? Math.max(insets.bottom, 12);

  return (
    <View
      role="tablist"
      className={cn('flex-row gap-2 border-t border-border bg-card px-4 pt-3', className)}
      style={{ paddingBottom }}>
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <Pressable
            key={item.key}
            role="tab"
            aria-selected={active}
            accessibilityLabel={item.label}
            onPress={() => onChange(item.key)}
            className={'min-h-11 flex-1 items-center gap-2 active:opacity-70'}>
            <AppIcon
              name={item.icon}
              strokeWidth={item.icon === 'more' ? 2.5 : 2}
              className={active ? 'text-primary' : 'text-muted-foreground'}
            />
            <Text
              variant="labelM"
              numberOfLines={1}
              className={active ? 'text-primary' : 'font-sans text-muted-foreground'}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export { MAIN_TABS, TabBar };
export type { MainTabKey, TabBarItem, TabBarProps };
