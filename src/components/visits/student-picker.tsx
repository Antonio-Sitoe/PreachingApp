import { ScreenHeader } from '@/components/ui/screen-header';
import { SettingsSection } from '@/components/settings/grouped-list';
import { AppIcon } from '@/components/ui/app-icon';
import { Avatar } from '@/components/ui/avatar';
import { StageBadge } from '@/components/ui/stage-badge';
import { Text } from '@/components/ui/text';
import { type StudentListItem, studentsActions } from '@/database/actions';
import { THEME } from '@/lib/theme';
import { cn } from '@/utils/cn';
import { normalize } from '@/utils/students/list';
import { formatSinceLastVisit } from '@/utils/visits/format';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Modal, Pressable, ScrollView, TextInput, View } from 'react-native';

type StudentPickerProps = {
  open: boolean;
  onSelect: (studentId: string) => void;
  onClose: () => void;
};

function StudentPicker({ open, onSelect, onClose }: StudentPickerProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const [search, setSearch] = React.useState('');
  const { data = [] } = useQuery({
    queryKey: ['students', 'list'],
    queryFn: studentsActions.getList,
    enabled: open,
  });

  const query = normalize(search);
  const active = data.filter(
    (item) => item.status === 'active' && (!query || normalize(item.displayName).includes(query))
  );
  const today = active
    .filter((item) => item.nextVisit && dayjs(item.nextVisit.scheduledAt).isSame(dayjs(), 'day'))
    .sort((a, b) => (a.nextVisit?.time ?? '').localeCompare(b.nextVisit?.time ?? ''));
  const others = active
    .filter((item) => !today.includes(item))
    .sort((a, b) => a.displayName.localeCompare(b.displayName, 'pt', { sensitivity: 'base' }));

  return (
    <Modal visible={open} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View className="flex-1 bg-background">
        <ScreenHeader title="Escolher estudante" onBack={onClose} />
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="w-full max-w-[640px] self-center gap-5 px-4 pb-8 pt-5">
          <View className="relative justify-center">
            <View className="absolute left-4 z-10" pointerEvents="none">
              <AppIcon name="search" size={20} className="text-subtle" />
            </View>
            <TextInput
              accessibilityLabel="Procurar estudante"
              className="min-h-[52px] rounded-lg border border-border bg-card pl-[46px] pr-4 font-sans text-[14px] text-foreground"
              placeholder="Procurar pelo nome"
              placeholderTextColor={theme.subtle}
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
            />
          </View>

          {today.length > 0 ? (
            <SettingsSection title="Para hoje">
              {today.map((item, index) => (
                <PickerRow
                  key={item.id}
                  student={item}
                  detail={item.nextVisit?.time ?? 'Hoje'}
                  first={index === 0}
                  onPress={() => onSelect(item.id)}
                />
              ))}
            </SettingsSection>
          ) : null}

          {others.length > 0 ? (
            <SettingsSection title="Todos os estudantes">
              {others.map((item, index) => (
                <PickerRow
                  key={item.id}
                  student={item}
                  detail={formatSinceLastVisit(item.lastVisitAt)}
                  first={index === 0}
                  onPress={() => onSelect(item.id)}
                />
              ))}
            </SettingsSection>
          ) : null}

          {today.length === 0 && others.length === 0 ? (
            <Text className="px-1 text-center text-muted-foreground">
              {search ? `Ninguém com o nome "${search}".` : 'Ainda não há estudantes activos.'}
            </Text>
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
}

type PickerRowProps = {
  student: StudentListItem;
  detail: string;
  first: boolean;
  onPress: () => void;
};

function PickerRow({ student, detail, first, onPress }: PickerRowProps) {
  return (
    <Pressable
      role="button"
      onPress={onPress}
      className={cn(
        'flex-row items-center gap-3 py-3 pl-4 pr-3 active:bg-secondary',
        !first && 'border-t border-border'
      )}>
      <Avatar name={student.displayName} />
      <View className="min-w-0 flex-1 gap-1">
        <Text variant="titleS" numberOfLines={1}>
          {student.displayName}
        </Text>
        <View className="flex-row flex-wrap items-center gap-2">
          <StageBadge stage={student.stage} />
          <Text variant="bodyS" className="text-muted-foreground">
            {detail}
          </Text>
        </View>
      </View>
      <AppIcon name="chevron-right" size={18} className="text-subtle" />
    </Pressable>
  );
}

export { StudentPicker };
export type { StudentPickerProps };
