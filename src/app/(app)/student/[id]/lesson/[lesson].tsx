import { SettingsRow, SettingsSection, SettingsSwitch } from '@/components/settings/grouped-list';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { FieldLabel } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { lessonsActions, studentsActions } from '@/database/actions';
import { THEME } from '@/lib/theme';
import { cn } from '@/utils/cn';
import { formatDayMonth } from '@/utils/students/pause';
import { currentLesson, lessonState, partOf } from '@/utils/study/parts';
import { refreshVisitData } from '@/utils/visits/refresh';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView, TextInput, View } from 'react-native';

const STATE_STYLES = {
  done: { label: 'Concluída', bg: 'bg-success-soft', text: 'text-success' },
  current: { label: 'Em curso', bg: 'bg-secondary', text: 'text-primary-strong' },
  todo: { label: 'Por começar', bg: 'bg-muted', text: 'text-muted-foreground' },
} as const;

export default function LessonScreen() {
  const { id, lesson: lessonParam } = useLocalSearchParams<{ id: string; lesson: string }>();
  const lesson = Number(lessonParam);
  const queryClient = useQueryClient();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];

  const studentQuery = useQuery({
    queryKey: ['students', 'detail', id],
    queryFn: () => studentsActions.getDetail(id),
    enabled: Boolean(id),
  });
  const lessonsQuery = useQuery({
    queryKey: ['lessons', id],
    queryFn: () => lessonsActions.getByStudent(id),
    enabled: Boolean(id),
  });
  const detailQuery = useQuery({
    queryKey: ['lessons', id, 'detail', lesson],
    queryFn: () => lessonsActions.getDetail(id, lesson),
    enabled: Boolean(id) && Number.isInteger(lesson),
  });

  const student = studentQuery.data?.student;
  const rows = lessonsQuery.data ?? [];
  const detail = detailQuery.data;
  const row = detail?.row ?? null;
  const state = lessonState(rows, lesson);
  const style = STATE_STYLES[state];
  const isLatest = row !== null && currentLesson(rows) === lesson;

  const [notes, setNotes] = React.useState('');
  const savedNotes = React.useRef('');
  React.useEffect(() => {
    setNotes(row?.notes ?? '');
    savedNotes.current = row?.notes ?? '';
  }, [row?.id, row?.notes]);

  const refresh = () => refreshVisitData(queryClient);

  async function saveNotes() {
    if (!row || notes.trim() === savedNotes.current.trim()) return;
    try {
      await lessonsActions.update(row.id, { notes: notes.trim() || null });
      savedNotes.current = notes;
      await refresh();
    } catch {
      showToast({ message: 'Não foi possível guardar a nota. Tenta outra vez.' });
    }
  }

  async function setGoal(goalDone: boolean) {
    if (!row) return;
    await lessonsActions.update(row.id, { goalDone });
    await refresh();
  }

  async function toggleCompleted() {
    if (!row) return;
    await lessonsActions.update(row.id, {
      completedAt: row.completedAt ? null : new Date().toISOString(),
    });
    await refresh();
    showToast({
      message: row.completedAt
        ? `Lição ${lesson} voltou a estar em curso.`
        : `Lição ${lesson} concluída.`,
    });
  }

  async function resolve(visitId: string) {
    await lessonsActions.resolveQuestion(visitId);
    await refresh();
    showToast({ message: 'Dúvida marcada como respondida.' });
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Lição"
        onBack={async () => {
          await saveNotes();
          router.back();
        }}
      />
      {student && detail ? (
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="w-full max-w-[640px] self-center gap-5 px-4 pb-8 pt-5"
          showsVerticalScrollIndicator={false}>
          <View className="gap-1.5">
            <Text variant="bodyS" className="text-muted-foreground">
              {student.displayName} · parte {partOf(lesson).part}
            </Text>
            <Text variant="titleXl">Lição {lesson}</Text>
            <View className={cn('self-start rounded-full px-2 py-[3px]', style.bg)}>
              <Text variant="labelS" className={style.text}>
                {style.label}
              </Text>
            </View>
          </View>

          {row ? (
            <>
              <SettingsSection title="Datas">
                <DetailRow first label="Começou" value={formatDayMonth(row.startedAt)} />
                <DetailRow
                  label="Terminou"
                  value={row.completedAt ? formatDayMonth(row.completedAt) : 'Ainda em curso'}
                />
                <DetailRow label="Visitas nesta lição" value={String(detail.visitCount)} />
              </SettingsSection>

              <SettingsSection>
                <SettingsRow
                  first
                  title='Cumpriu o "Tente o seguinte"'
                  trailing={
                    <SettingsSwitch
                      value={row.goalDone}
                      onValueChange={setGoal}
                      label='Cumpriu o "Tente o seguinte"'
                    />
                  }
                />
              </SettingsSection>

              <View className="gap-2">
                <FieldLabel>Nota da lição</FieldLabel>
                <TextInput
                  accessibilityLabel="Nota da lição"
                  multiline
                  textAlignVertical="top"
                  placeholderTextColor={theme.subtle}
                  placeholder="O que ficou desta lição"
                  value={notes}
                  onChangeText={setNotes}
                  onEndEditing={saveNotes}
                  className="min-h-[84px] rounded-lg border border-input bg-card px-4 py-3 font-sans text-[14px] text-foreground"
                />
              </View>

              {detail.questions.length > 0 ? (
                <SettingsSection title="Dúvidas pendentes">
                  {detail.questions.map((item, index) => (
                    <View
                      key={item.visitId}
                      className={cn(
                        'min-h-[52px] flex-row items-center gap-3 py-2 pl-4 pr-3',
                        index > 0 && 'border-t border-border'
                      )}>
                      <View className="min-w-0 flex-1 gap-0.5">
                        <Text variant="titleS">{item.question}</Text>
                        <Text variant="bodyS" className="text-muted-foreground">
                          Ficou por responder a {formatDayMonth(item.askedAt)}
                        </Text>
                      </View>
                      <Button variant="outline" size="sm" onPress={() => resolve(item.visitId)}>
                        <Text>Respondida</Text>
                      </Button>
                    </View>
                  ))}
                </SettingsSection>
              ) : null}

              {isLatest ? (
                <Button variant="outline" onPress={toggleCompleted}>
                  <Text>{row.completedAt ? 'Voltar a pôr em curso' : 'Marcar como concluída'}</Text>
                </Button>
              ) : null}
            </>
          ) : (
            <Text className="text-muted-foreground">
              Esta lição ainda não começou. Fica registada quando uma visita a marcar como a lição
              onde ficaram.
            </Text>
          )}
        </ScrollView>
      ) : null}
    </View>
  );
}

function DetailRow({ label, value, first }: { label: string; value: string; first?: boolean }) {
  return (
    <View
      className={cn(
        'min-h-12 flex-row items-center gap-3 px-4 py-2',
        !first && 'border-t border-border'
      )}>
      <Text className="flex-1 text-muted-foreground">{label}</Text>
      <Text variant="titleS" className="text-right">
        {value}
      </Text>
    </View>
  );
}
