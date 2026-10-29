import { SettingsRow, SettingsSection } from '@/components/settings/grouped-list';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { timeEntriesActions } from '@/database/actions';
import type { TimeEntry } from '@/database/schemas';
import { formatDuration, formatEntryDay, formatTimeOfDay } from '@/utils/hours/format';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import * as React from 'react';
import { View } from 'react-native';

function entryDetail(entry: TimeEntry) {
  if (entry.source === 'manual') return 'Entrada manual';
  const end = dayjs(entry.startedAt).add(entry.minutes, 'minute');
  return `Cronómetro · ${formatTimeOfDay(entry.startedAt)} às ${formatTimeOfDay(end.toDate())}`;
}

type EntryListProps = {
  entries: TimeEntry[];
};

function EntryList({ entries }: EntryListProps) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = React.useState<TimeEntry | null>(null);

  if (entries.length === 0) return null;

  const remove = async (entry: TimeEntry) => {
    setSelected(null);
    try {
      await timeEntriesActions.remove(entry.id);
      await queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      showToast({
        message: 'Entrada apagada',
        action: {
          label: 'Desfazer',
          icon: 'undo',
          onPress: async () => {
            await timeEntriesActions.create({
              startedAt: entry.startedAt,
              minutes: entry.minutes,
              source: entry.source,
            });
            await queryClient.invalidateQueries({ queryKey: ['time-entries'] });
          },
        },
      });
    } catch {
      showToast({ message: 'Não foi possível apagar. Tenta de novo.' });
    }
  };

  return (
    <>
      <SettingsSection title="Esta semana">
        {entries.map((entry, index) => (
          <SettingsRow
            key={entry.id}
            first={index === 0}
            title={formatEntryDay(entry.startedAt)}
            description={entryDetail(entry)}
            value={formatDuration(entry.minutes)}
            onPress={() => setSelected(entry)}
          />
        ))}
      </SettingsSection>

      <BottomSheet
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? `${formatEntryDay(selected.startedAt)} · ${formatDuration(selected.minutes)}` : undefined}>
        <Text variant="bodyS" className="text-muted-foreground">
          {selected ? entryDetail(selected) : ''}
        </Text>
        <View className="gap-1">
          <Button variant="destructive" onPress={() => selected && void remove(selected)}>
            <Text>Apagar entrada</Text>
          </Button>
          <Button variant="ghost" className="min-h-12" onPress={() => setSelected(null)}>
            <Text>Cancelar</Text>
          </Button>
        </View>
      </BottomSheet>
    </>
  );
}

export { EntryList };
