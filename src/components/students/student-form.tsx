import { TagChip } from '@/components/notes/list';
import { SetupLayout } from '@/components/onboarding/setup-layout';
import { DaysStepper } from '@/components/settings/rhythm-sheet';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { SelectField } from '@/components/ui/select-field';
import { Text } from '@/components/ui/text';
import { FieldLabel, TextField } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { STAGE_ORDER, STAGES } from '@/constants/stages';
import { AGE_RANGE_OPTIONS, GENDER_OPTIONS, WEEKDAY_OPTIONS } from '@/constants/students';
import { type StudentDetail, studentsActions } from '@/database/actions';
import type { StudentAgeRange, StudentGender, StudentStage } from '@/database/schemas';
import { readLocation } from '@/hooks/use-current-location';
import { cn } from '@/utils/cn';
import { RHYTHM_SHORTCUTS } from '@/utils/notifications/preferences';
import { getNotificationPreferences } from '@/utils/storage';
import { fromTimeString, toTimeString, validatePhone } from '@/utils/students/form';
import DateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

const STAGE_OPTIONS = STAGE_ORDER.map((stage) => ({ value: stage, label: STAGES[stage].label }));

const RHYTHM_OPTIONS = RHYTHM_SHORTCUTS.map(({ days, label }) => ({ value: days, label }));

type Location = {
  latitude: number;
  longitude: number;
  locatedAt: string;
};

type FormState = {
  name: string;
  phone: string;
  stage: StudentStage;
  rhythmDays: number;
  weekdays: number[];
  time: string | null;
  address: string;
  location: Location | null;
  ageRange: StudentAgeRange | null;
  gender: StudentGender | null;
};

type FormErrors = {
  name?: string;
  phone?: string;
};

function initialState(detail?: StudentDetail, initialName = ''): FormState {
  if (!detail) {
    return {
      name: initialName,
      phone: '',
      stage: 'first_contact',
      rhythmDays: getNotificationPreferences().rhythm.revisitDays,
      weekdays: [],
      time: null,
      address: '',
      location: null,
      ageRange: null,
      gender: null,
    };
  }

  const { student, availabilities } = detail;
  return {
    name: student.displayName,
    phone: student.phone ?? '',
    stage: student.stage,
    rhythmDays: student.rhythmDays,
    weekdays: availabilities.map((row) => row.weekday),
    time: availabilities.find((row) => row.time)?.time ?? null,
    address: student.address ?? '',
    location:
      student.latitude != null && student.longitude != null
        ? {
            latitude: student.latitude,
            longitude: student.longitude,
            locatedAt: student.locatedAt ?? student.createdAt,
          }
        : null,
    ageRange: student.ageRange,
    gender: student.gender,
  };
}

type StudentFormProps = {
  /** Sem `detail`, o formulário cria um estudante novo. */
  detail?: StudentDetail;
  /** Nome já escrito na captura no terreno, para não o escrever outra vez. */
  initialName?: string;
};

function StudentForm({ detail, initialName }: StudentFormProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = React.useState<FormState>(() => initialState(detail, initialName));
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [pickingTime, setPickingTime] = React.useState(false);
  const [locating, setLocating] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const savingLock = React.useRef(false);

  const update = (changes: Partial<FormState>) =>
    setForm((current) => ({ ...current, ...changes }));

  function toggleWeekday(weekday: number) {
    update({
      weekdays: form.weekdays.includes(weekday)
        ? form.weekdays.filter((day) => day !== weekday)
        : [...form.weekdays, weekday],
    });
  }

  function onTimeChange(_event: DateTimePickerChangeEvent, date: Date) {
    setPickingTime(false);
    update({ time: toTimeString(date) });
  }

  async function locate() {
    if (locating) return;
    setLocating(true);
    try {
      const result = await readLocation();
      if (!result) {
        showToast({ message: 'Sem acesso à localização. Podes escrever a morada.' });
        return;
      }
      update({
        location: {
          latitude: result.latitude,
          longitude: result.longitude,
          locatedAt: new Date().toISOString(),
        },
        ...(!form.address.trim() && result.address ? { address: result.address } : {}),
      });
      showToast({ message: 'Localização guardada.' });
    } catch {
      showToast({ message: 'Não foi possível ler a localização. Tenta outra vez.' });
    } finally {
      setLocating(false);
    }
  }

  async function save() {
    const nextErrors: FormErrors = {
      name: form.name.trim() ? undefined : 'Escreve um nome para guardar. Pode ser provisório.',
      phone: validatePhone(form.phone),
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone) return;
    if (savingLock.current) return;
    savingLock.current = true;
    setSaving(true);

    const data = {
      displayName: form.name,
      // Quem preenche a ficha completa confirma o nome.
      nameIsProvisional: false,
      phone: form.phone,
      stage: form.stage,
      rhythmDays: form.rhythmDays,
      address: form.address,
      latitude: form.location?.latitude ?? null,
      longitude: form.location?.longitude ?? null,
      locatedAt: form.location?.locatedAt ?? null,
      ageRange: form.ageRange,
      gender: form.gender,
    };
    const availability = {
      weekdays: form.weekdays,
      time: form.weekdays.length > 0 ? form.time : null,
    };

    try {
      if (detail) {
        await studentsActions.updateById(detail.student.id, data, availability);
        await queryClient.invalidateQueries({ queryKey: ['students'] });
        showToast({ message: 'Alterações guardadas.' });
        router.back();
      } else {
        const student = await studentsActions.create(data, availability);
        await queryClient.invalidateQueries({ queryKey: ['students'] });
        showToast({ message: `${student.displayName} guardado.` });
        router.replace(`/student/${student.id}`);
      }
    } catch {
      savingLock.current = false;
      setSaving(false);
      showToast({ message: 'Não foi possível guardar. Tenta outra vez.' });
    }
  }

  return (
    <SetupLayout
      title={detail ? 'Editar estudante' : 'Novo estudante'}
      onBack={() => router.back()}
      footer={
        <Button disabled={saving} onPress={save}>
          <Text>{saving ? 'A guardar…' : 'Guardar'}</Text>
        </Button>
      }>
      <TextField
        label="Nome"
        placeholder="Pode ser provisório"
        value={form.name}
        onChangeText={(name) => {
          update({ name });
          if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
        }}
        error={errors.name}
        autoCapitalize="words"
        returnKeyType="next"
      />

      <TextField
        label="Telefone (opcional)"
        value={form.phone}
        onChangeText={(phone) => {
          update({ phone });
          if (errors.phone) setErrors((current) => ({ ...current, phone: undefined }));
        }}
        error={errors.phone}
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        autoComplete="tel"
      />

      <SelectField
        label="Etapa"
        value={form.stage}
        options={STAGE_OPTIONS}
        onChange={(stage) => update({ stage })}
      />

      <View className="gap-2">
        <FieldLabel>Ritmo das visitas</FieldLabel>
        <SegmentedControl
          accessibilityLabel="Ritmo das visitas"
          options={RHYTHM_OPTIONS}
          value={form.rhythmDays}
          onChange={(rhythmDays) => update({ rhythmDays })}
        />
        <View className="flex-row items-center gap-3 rounded-lg border border-border bg-card py-2.5 pl-4 pr-3">
          <View className="flex-1 gap-0.5">
            <Text variant="titleS">Ou a cada</Text>
            <Text variant="bodyS" className="text-muted-foreground">
              dias entre visitas
            </Text>
          </View>
          <DaysStepper value={form.rhythmDays} onChange={(rhythmDays) => update({ rhythmDays })} />
        </View>
      </View>

      <ChipGroup label="Dias em que costuma estar (opcional)">
        {WEEKDAY_OPTIONS.map((option) => (
          <TagChip
            key={option.value}
            label={option.label}
            active={form.weekdays.includes(option.value)}
            onPress={() => toggleWeekday(option.value)}
          />
        ))}
      </ChipGroup>

      {form.weekdays.length > 0 ? (
        <View className="gap-2">
          <FieldLabel>Melhor hora</FieldLabel>
          <Pressable
            role="button"
            accessibilityLabel={`Melhor hora: ${form.time ?? 'por escolher'}`}
            onPress={() => setPickingTime(true)}
            className="h-[52px] flex-row items-center gap-2.5 rounded-lg border border-input bg-card px-4 active:bg-secondary">
            <Text
              className={cn('flex-1 text-[14px]', !form.time && 'text-muted-foreground')}
              numberOfLines={1}>
              {form.time ?? 'Escolher a hora'}
            </Text>
            <AppIcon name="clock" size={18} className="text-subtle" />
          </Pressable>
        </View>
      ) : null}

      <View className="gap-2">
        <View className="flex-row items-end gap-2">
          <TextField
            label="Morada (opcional)"
            value={form.address}
            onChangeText={(address) => update({ address })}
            containerClassName="flex-1"
          />
          <Pressable
            role="button"
            accessibilityLabel="Guardar a localização de onde estou agora"
            disabled={locating}
            onPress={locate}
            className="size-[52px] items-center justify-center rounded-lg bg-primary active:opacity-80">
            {locating ? (
              <ActivityIndicator color="white" />
            ) : (
              <AppIcon name="map-pin" size={22} className="text-primary-foreground" />
            )}
          </Pressable>
        </View>
        {form.location ? (
          <View className="flex-row items-center gap-2">
            <AppIcon name="map-pin" size={16} className="text-success" />
            <Text variant="bodyS" className="flex-1 text-muted-foreground">
              Ponto guardado no mapa.
            </Text>
          </View>
        ) : null}
      </View>

      <ChipGroup label="Faixa etária (opcional)">
        {AGE_RANGE_OPTIONS.map((option) => (
          <TagChip
            key={option.value}
            label={option.label}
            active={form.ageRange === option.value}
            onPress={() =>
              update({ ageRange: form.ageRange === option.value ? null : option.value })
            }
          />
        ))}
      </ChipGroup>

      <ChipGroup label="Género (opcional)">
        {GENDER_OPTIONS.map((option) => (
          <TagChip
            key={option.value}
            label={option.label}
            active={form.gender === option.value}
            onPress={() => update({ gender: form.gender === option.value ? null : option.value })}
          />
        ))}
      </ChipGroup>

      {pickingTime ? (
        <DateTimePicker
          value={fromTimeString(form.time)}
          mode="time"
          is24Hour
          display="default"
          onValueChange={onTimeChange}
          onDismiss={() => setPickingTime(false)}
        />
      ) : null}
    </SetupLayout>
  );
}

function ChipGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <FieldLabel>{label}</FieldLabel>
      <View role="group" aria-label={label} className="flex-row flex-wrap gap-2">
        {children}
      </View>
    </View>
  );
}

export { StudentForm };
export type { StudentFormProps };
