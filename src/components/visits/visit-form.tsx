import { SetupLayout } from '@/components/onboarding/setup-layout';
import { SettingsRow, SettingsSection, SettingsSwitch } from '@/components/settings/grouped-list';
import { AppIcon } from '@/components/ui/app-icon';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { SelectField } from '@/components/ui/select-field';
import { StageBadge } from '@/components/ui/stage-badge';
import { Text } from '@/components/ui/text';
import { FieldLabel, TextField } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { studentsActions, visitsActions } from '@/database/actions';
import { parseScriptures } from '@/database/actions/visits';
import type { Visit, VisitOutcome } from '@/database/schemas';
import { THEME } from '@/lib/theme';
import { fromTimeString, toTimeString } from '@/utils/students/form';
import { formatPickedDay } from '@/utils/students/journey';
import { countEvent } from '@/utils/usage';
import { formatAppointmentLabel, timeOf, withTime } from '@/utils/visits/format';
import { suggestNextVisit } from '@/utils/visits/next-visit';
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { refreshVisitData } from '@/utils/visits/refresh';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import {
  defaultRemind,
  NextVisitSheet,
  PickerField,
  type NextVisitValue,
  type RemindMinutes,
} from './next-visit-sheet';
import { NotHomeSheet } from './not-home-sheet';
import { ScriptureSheet } from './scripture-sheet';
import { StudentPicker } from './student-picker';

const OUTCOME_OPTIONS: readonly { value: VisitOutcome; label: string }[] = [
  { value: 'met', label: 'Encontrei' },
  { value: 'not_home', label: 'Não estava' },
  { value: 'rescheduled', label: 'Remarcada' },
];

const STUDIED_OPTIONS = [
  { value: 'no', label: 'Não' },
  { value: 'yes', label: 'Sim' },
] as const;

const LESSON_OPTIONS = Array.from({ length: 60 }, (_, index) => ({
  value: String(index + 1),
  label: `Lição ${index + 1}`,
}));

type VisitFormProps = {
  initialStudentId?: string;
  initialStudied?: boolean;
  /** Com `editing`, o formulário edita essa visita em vez de criar uma nova. */
  editing?: Visit;
};

function VisitForm({ initialStudentId, initialStudied, editing }: VisitFormProps) {
  const queryClient = useQueryClient();
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];

  const [studentId, setStudentId] = React.useState(editing?.studentId ?? initialStudentId);
  const [choosingStudent, setChoosingStudent] = React.useState(!editing && !initialStudentId);
  const [visitedAt, setVisitedAt] = React.useState(() =>
    editing ? new Date(editing.visitedAt) : new Date()
  );
  const [picking, setPicking] = React.useState<'date' | 'time' | null>(null);
  const [outcome, setOutcome] = React.useState<VisitOutcome>(editing?.outcome ?? 'met');
  const [notes, setNotes] = React.useState(editing?.notes ?? '');
  const [scriptures, setScriptures] = React.useState<string[]>(() =>
    parseScriptures(editing?.scriptures ?? null)
  );
  const [addingScripture, setAddingScripture] = React.useState(false);
  const [pendingQuestion, setPendingQuestion] = React.useState(editing?.pendingQuestion ?? '');
  const [promisedToBring, setPromisedToBring] = React.useState(editing?.promisedToBring ?? '');
  const [studied, setStudied] = React.useState(
    editing ? Boolean(editing.lessonNumber) : Boolean(initialStudied)
  );
  const [lesson, setLesson] = React.useState<number | undefined>(
    editing?.lessonNumber ?? undefined
  );
  const [stoppedAt, setStoppedAt] = React.useState(editing?.stoppedAtPoint ?? '');
  const [notHomeVisit, setNotHomeVisit] = React.useState<Visit | null>(null);
  const [next, setNext] = React.useState<NextVisitValue | null>(null);
  const [nextEdited, setNextEdited] = React.useState(false);
  const [editingNext, setEditingNext] = React.useState(false);
  const [remind, setRemind] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const detailQuery = useQuery({
    queryKey: ['students', 'detail', studentId],
    queryFn: () => studentsActions.getDetail(studentId as string),
    enabled: Boolean(studentId),
  });
  const lastMetQuery = useQuery({
    queryKey: ['visits', 'last-met', studentId],
    queryFn: () => visitsActions.getLastMet([studentId as string]),
    enabled: Boolean(studentId),
  });

  const detail = detailQuery.data;
  const student = detail?.student;
  const lastLesson = studentId ? lastMetQuery.data?.get(studentId)?.lessonNumber : undefined;
  const suggestion = React.useMemo(
    () =>
      student && detail
        ? suggestNextVisit(student, detail.availabilities, visitedAt, timeOf(visitedAt))
        : null,
    [student, detail, visitedAt]
  );

  React.useEffect(() => {
    if (!suggestion || nextEdited) return;
    setNext((current) => ({
      date: suggestion.date,
      time: suggestion.time,
      remindMinutes: current?.remindMinutes ?? defaultRemind(),
    }));
  }, [suggestion, nextEdited]);

  React.useEffect(() => {
    if (!editing) setLesson(lastLesson ?? undefined);
  }, [lastLesson, editing]);

  function selectStudent(id: string) {
    setStudentId(id);
    setNextEdited(false);
    setChoosingStudent(false);
  }

  function onPicked(_event: DateTimePickerChangeEvent, value: Date) {
    const target = picking;
    setPicking(null);
    if (target === 'date') setVisitedAt((current) => withTime(value, timeOf(current)));
    if (target === 'time') setVisitedAt((current) => withTime(current, toTimeString(value)));
  }

  const refresh = () => refreshVisitData(queryClient);

  async function save() {
    if (!student || saving) return;
    setSaving(true);
    const met = outcome === 'met';
    const fields = {
      visitedAt,
      outcome,
      notes,
      scriptures: met ? scriptures : [],
      pendingQuestion: met ? pendingQuestion : '',
      promisedToBring,
      lessonNumber: met && studied ? (lesson ?? 1) : null,
      stoppedAtPoint: stoppedAt,
    };
    try {
      if (editing) {
        await visitsActions.update(editing.id, fields);
        await refresh();
        showToast({ message: 'Visita actualizada.' });
        router.back();
        return;
      }

      const visit = await visitsActions.create({
        ...fields,
        studentId: student.id,
        next:
          outcome !== 'not_home' && next
            ? {
                date: next.date,
                time: next.time,
                remindMinutesBefore: remind ? next.remindMinutes : null,
              }
            : null,
      });
      void countEvent('visit_logged');
      await refresh();
      if (outcome === 'not_home') {
        setNotHomeVisit(visit);
        return;
      }
      showToast({ message: 'Visita guardada.' });
      router.back();
    } catch {
      setSaving(false);
      showToast({ message: 'Não foi possível guardar a visita. Tenta outra vez.' });
    }
  }

  const met = outcome === 'met';

  return (
    <>
      <SetupLayout
        title={editing ? 'Editar visita' : 'Registar visita'}
        onBack={() => router.back()}
        className="bg-background"
        footer={
          <Button disabled={!student || saving} onPress={save}>
            <Text>{saving ? 'A guardar…' : editing ? 'Guardar alterações' : 'Guardar visita'}</Text>
          </Button>
        }>
        {student ? (
          <View className="flex-row items-center gap-3 rounded-lg border border-border bg-card py-3 pl-4 pr-2">
            <Avatar name={student.displayName} />
            <View className="min-w-0 flex-1 gap-1">
              <Text variant="titleM" numberOfLines={2}>
                {student.displayName}
              </Text>
              <StageBadge stage={student.stage} paused={student.status === 'paused'} />
            </View>
            {editing ? null : (
              <Button variant="ghost" size="sm" onPress={() => setChoosingStudent(true)}>
                <Text>Trocar</Text>
              </Button>
            )}
          </View>
        ) : (
          <Button variant="outline" onPress={() => setChoosingStudent(true)}>
            <Text>Escolher estudante</Text>
          </Button>
        )}

        <View className="flex-row gap-3">
          <PickerField
            label="Dia"
            value={formatPickedDay(visitedAt)}
            icon="calendar"
            onPress={() => setPicking('date')}
          />
          <PickerField
            label="Hora"
            value={timeOf(visitedAt)}
            icon="clock"
            onPress={() => setPicking('time')}
          />
        </View>

        <View className="gap-2">
          <FieldLabel>Resultado</FieldLabel>
          <SegmentedControl
            accessibilityLabel="Resultado"
            options={OUTCOME_OPTIONS}
            value={outcome}
            onChange={setOutcome}
          />
        </View>

        <View className="gap-2">
          <FieldLabel>{met ? 'O que conversaram' : 'Nota (opcional)'}</FieldLabel>
          <TextInput
            accessibilityLabel={met ? 'O que conversaram' : 'Nota'}
            multiline
            textAlignVertical="top"
            placeholderTextColor={theme.subtle}
            value={notes}
            onChangeText={setNotes}
            className="min-h-24 rounded-lg border border-input bg-card px-4 py-3 font-sans text-[14px] text-foreground"
          />
        </View>

        {met ? (
          <>
            <View className="gap-2">
              <FieldLabel>Textos usados</FieldLabel>
              <View className="flex-row flex-wrap gap-2">
                {scriptures.map((text, index) => (
                  <View
                    key={`${text}-${index}`}
                    className="min-h-9 flex-row items-center gap-0.5 rounded-full bg-secondary py-1 pl-3 pr-1">
                    <Text variant="labelS" className="shrink text-[13px] text-primary-strong">
                      {text}
                    </Text>
                    <Pressable
                      role="button"
                      accessibilityLabel={`Remover ${text}`}
                      onPress={() =>
                        setScriptures((current) => current.filter((_, i) => i !== index))
                      }
                      className="size-7 items-center justify-center rounded-full active:opacity-70">
                      <AppIcon name="close" size={14} className="text-primary-strong" />
                    </Pressable>
                  </View>
                ))}
                <Pressable
                  role="button"
                  onPress={() => setAddingScripture(true)}
                  className="min-h-9 flex-row items-center gap-1.5 rounded-full border border-dashed border-primary px-3 py-1 active:bg-secondary">
                  <AppIcon name="plus" size={14} className="text-primary" />
                  <Text variant="labelS" className="text-[13px] text-primary">
                    Adicionar
                  </Text>
                </Pressable>
              </View>
            </View>

            <TextField
              label="Dúvida pendente (opcional)"
              placeholder="O que ficou por responder"
              value={pendingQuestion}
              onChangeText={setPendingQuestion}
            />
          </>
        ) : null}

        <TextField
          label="Prometi levar (opcional)"
          placeholder="Ex.: o convite para a reunião de domingo"
          value={promisedToBring}
          onChangeText={setPromisedToBring}
        />

        {met ? (
          <View className="gap-2">
            <FieldLabel>Estudaram o livro?</FieldLabel>
            <SegmentedControl
              accessibilityLabel="Estudaram o livro?"
              options={STUDIED_OPTIONS}
              value={studied ? 'yes' : 'no'}
              onChange={(value) => setStudied(value === 'yes')}
            />
          </View>
        ) : null}

        {met && studied ? (
          <>
            <SelectField
              label="Em que lição ficaram?"
              value={String(lesson ?? 1)}
              options={LESSON_OPTIONS}
              onChange={(value) => setLesson(Number(value))}
            />
            <TextField
              label="Onde pararam (opcional)"
              placeholder="Ex.: ponto 3"
              value={stoppedAt}
              onChangeText={setStoppedAt}
            />
          </>
        ) : null}

        {student && !editing && outcome !== 'not_home' ? (
          <SettingsSection title="Próxima visita">
            <SettingsRow
              first
              title={next ? formatAppointmentLabel(next.date, next.time) : 'Sem visita marcada'}
              description={nextEdited ? undefined : suggestion?.hint}
              onPress={() => setEditingNext(true)}
            />
            <SettingsRow
              title="Lembrete no telemóvel"
              trailing={
                <SettingsSwitch
                  value={remind}
                  onValueChange={setRemind}
                  label="Lembrete no telemóvel"
                />
              }
            />
          </SettingsSection>
        ) : null}
      </SetupLayout>

      {picking ? (
        <DateTimePicker
          value={picking === 'date' ? visitedAt : fromTimeString(timeOf(visitedAt))}
          mode={picking}
          is24Hour
          maximumDate={picking === 'date' ? new Date() : undefined}
          onValueChange={onPicked}
          onDismiss={() => setPicking(null)}
        />
      ) : null}

      <NotHomeSheet
        visit={notHomeVisit}
        studentName={student?.displayName ?? ''}
        onUndo={() => {
          setNotHomeVisit(null);
          setSaving(false);
        }}
        onDone={() => {
          setNotHomeVisit(null);
          router.back();
        }}
      />
      <StudentPicker
        open={choosingStudent}
        onSelect={selectStudent}
        onClose={() => {
          setChoosingStudent(false);
          if (!studentId) router.back();
        }}
      />
      <ScriptureSheet
        open={addingScripture}
        onAdd={(text) => setScriptures((current) => [...current, text])}
        onClose={() => setAddingScripture(false)}
      />
      {student && next ? (
        <NextVisitSheet
          open={editingNext}
          subtitle={student.displayName}
          rhythmDays={student.rhythmDays}
          value={next}
          onConfirm={(value) => {
            setNext(value);
            setNextEdited(true);
            setEditingNext(false);
          }}
          onClose={() => setEditingNext(false)}
        />
      ) : null}
    </>
  );
}

export { VisitForm };
export type { VisitFormProps };
