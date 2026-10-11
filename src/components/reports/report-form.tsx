import { AlertDialog } from '@/components/ui/alert-dialog';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { reportDateLabel, shiftDate } from '@/components/reports/format';
import { Stepper } from '@/components/reports/stepper';
import { useReportForm } from '@/components/reports/store';
import { reportsActions } from '@/database/actions';
import { THEME } from '@/lib/theme';
import { useQueryClient } from '@tanstack/react-query';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { TextInput, View, ScrollView, useWindowDimensions } from 'react-native';

function ReportForm() {
  const queryClient = useQueryClient();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const open = useReportForm((state) => state.open);
  const draft = useReportForm((state) => state.draft);
  const close = useReportForm((state) => state.close);
  const setDraft = useReportForm((state) => state.setDraft);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const { height } = useWindowDimensions();
  const empty =
    draft.hours === 0 && draft.minutes === 0 && draft.students === 0 && draft.comments.trim().length === 0;

  async function refresh() {
    await queryClient.invalidateQueries({ queryKey: ['reports'] });
  }

  async function save() {
    if (empty) {
      showToast({ message: 'Indica as horas, os minutos, os estudos ou um comentário.' });
      return;
    }

    setSaving(true);
    try {
      const input = {
        date: draft.date,
        hours: draft.hours,
        minutes: draft.minutes,
        students: draft.students,
        comments: draft.comments,
      };
      if (draft.id) await reportsActions.update(draft.id, input);
      else await reportsActions.create(input);
      await refresh();
      close();
      showToast({ message: draft.id ? 'Relatório actualizado.' : 'Relatório guardado.' });
    } catch {
      showToast({ message: 'Não foi possível guardar o relatório.' });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!pendingDeleteId) return;
    setConfirmDelete(false);
    try {
      await reportsActions.remove(pendingDeleteId);
      await refresh();
      setPendingDeleteId(null);
      showToast({ message: 'Relatório apagado.' });
    } catch {
      showToast({ message: 'Não foi possível apagar o relatório.' });
    }
  }

  return (
    <>
      <BottomSheet
        open={open}
        onClose={close}
        title={draft.id ? 'Editar relatório' : 'Novo relatório'}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ maxHeight: height * 0.7 }}
          contentContainerClassName="gap-4">
        <View className="flex-row items-center justify-between">
          <IconButton
            variant="ghost"
            icon="chevron-left"
            accessibilityLabel="Dia anterior"
            onPress={() => setDraft({ date: shiftDate(draft.date, -1) })}
          />
          <Text variant="titleS" className="flex-1 text-center">
            {reportDateLabel(draft.date)}
          </Text>
          <IconButton
            variant="ghost"
            icon="chevron-right"
            accessibilityLabel="Dia seguinte"
            onPress={() => setDraft({ date: shiftDate(draft.date, 1) })}
          />
        </View>

        <View className="flex-row gap-3">
          <Stepper label="Horas" value={draft.hours} onChange={(hours) => setDraft({ hours })} />
          <Stepper
            label="Minutos"
            value={draft.minutes}
            max={59}
            onChange={(minutes) => setDraft({ minutes })}
          />
        </View>
        <Stepper label="Estudos" value={draft.students} onChange={(students) => setDraft({ students })} />

        <View className="gap-2">
          <Text variant="labelM">Comentário</Text>
          <TextInput
            accessibilityLabel="Comentário"
            value={draft.comments}
            onChangeText={(comments) => setDraft({ comments })}
            placeholder="Escreve aqui"
            placeholderTextColor={theme.subtle}
            multiline
            maxLength={140}
            textAlignVertical="top"
            className="h-24 rounded-lg border border-input bg-card px-3 py-3 font-sans text-[14px] text-foreground"
          />
        </View>

        <View className="flex-row gap-2">
          {draft.id ? (
            <Button
              variant="destructive"
              className="flex-1"
              onPress={() => {
                if (!draft.id) return;
                setPendingDeleteId(draft.id);
                close();
                setConfirmDelete(true);
              }}>
              <Text>Apagar</Text>
            </Button>
          ) : null}
          <Button variant="neutral" className="flex-1" onPress={close}>
            <Text>Cancelar</Text>
          </Button>
          <Button className="flex-1" disabled={saving} onPress={save}>
            <Text>{saving ? 'A guardar…' : 'Guardar'}</Text>
          </Button>
        </View>
        </ScrollView>
      </BottomSheet>

      <AlertDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        icon="alert"
        tone="destructive"
        title="Apagar relatório"
        description="Este dia deixa de aparecer na lista.">
        <Button variant="destructive" onPress={remove}>
          <Text>Apagar</Text>
        </Button>
        <Button variant="neutral" onPress={() => setConfirmDelete(false)}>
          <Text>Cancelar</Text>
        </Button>
      </AlertDialog>
    </>
  );
}

export { ReportForm };
