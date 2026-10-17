import { ChoiceRow } from '@/components/settings/choice-row';
import { SettingsRow, SettingsSection, SettingsSwitch } from '@/components/settings/grouped-list';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import {
  LANGUAGE_LABELS,
  LIST_VIEW_OPTIONS,
  LOCK_HINT,
  LOCK_NOT_AVAILABLE,
  THEME_OPTIONS,
} from '@/constants/settings';
import { usersActions } from '@/database/actions';
import { LANGUAGES, type Language } from '@/database/schemas';
import {
  getListView,
  getThemePreference,
  setListView,
  setThemePreference,
  type ListView,
  type ThemePreference,
} from '@/utils/storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { colorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export default function GeneralScreen() {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => usersActions.getCurrent(),
  });
  const [theme, setTheme] = React.useState<ThemePreference>(getThemePreference);
  const [listView, setListViewState] = React.useState<ListView>(getListView);
  const [languageOpen, setLanguageOpen] = React.useState(false);

  const language = user?.language ?? 'pt';

  const changeTheme = (next: ThemePreference) => {
    setTheme(next);
    setThemePreference(next);
    colorScheme.set(next);
  };

  const changeListView = (next: ListView) => {
    setListViewState(next);
    setListView(next);
  };

  const changeLanguage = async (next: Language) => {
    setLanguageOpen(false);
    if (!user || next === user.language) return;
    try {
      await usersActions.updateById(user.id, { language: next });
      await queryClient.invalidateQueries({ queryKey: ['user'] });
    } catch {
      showToast({ message: 'Não foi possível mudar a língua. Tenta de novo.' });
    }
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Gerais" onBack={() => router.back()} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="w-full max-w-[640px] gap-5 self-center px-4 pb-8 pt-5">
        <View className="overflow-hidden rounded-lg border border-border bg-card">
          <SettingsRow
            first
            title="Língua"
            value={LANGUAGE_LABELS[language]}
            onPress={() => setLanguageOpen(true)}
          />
        </View>

        <SegmentedSection title="Tema">
          <SegmentedControl
            accessibilityLabel="Tema"
            options={THEME_OPTIONS}
            value={theme}
            onChange={changeTheme}
          />
        </SegmentedSection>

        <SettingsSection title="Bloqueio do app" hint={LOCK_HINT}>
          <SettingsRow
            first
            title="Pedir PIN ao abrir"
            trailing={
              <SettingsSwitch
                label="Pedir PIN ao abrir"
                value={false}
                onValueChange={() => showToast({ message: LOCK_NOT_AVAILABLE })}
              />
            }
          />
          <SettingsRow
            title="Usar impressão digital ou rosto"
            trailing={
              <SettingsSwitch
                label="Usar impressão digital ou rosto"
                value={false}
                onValueChange={() => showToast({ message: LOCK_NOT_AVAILABLE })}
              />
            }
          />
        </SettingsSection>

        <SegmentedSection title="Vista das listas">
          <SegmentedControl
            accessibilityLabel="Vista das listas"
            options={LIST_VIEW_OPTIONS}
            value={listView}
            onChange={changeListView}
          />
        </SegmentedSection>
      </ScrollView>

      <BottomSheet open={languageOpen} onClose={() => setLanguageOpen(false)} title="Língua">
        <View role="radiogroup" aria-label="Língua">
          {LANGUAGES.map((option) => (
            <ChoiceRow
              key={option}
              label={LANGUAGE_LABELS[option]}
              selected={option === language}
              onPress={() => {
                void changeLanguage(option);
              }}
            />
          ))}
        </View>
        <Button variant="ghost" className="min-h-12" onPress={() => setLanguageOpen(false)}>
          <Text>Fechar</Text>
        </Button>
      </BottomSheet>
    </View>
  );
}

function SegmentedSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="px-1 font-display-semibold text-[13px] leading-4 text-muted-foreground">
        {title}
      </Text>
      {children}
    </View>
  );
}
