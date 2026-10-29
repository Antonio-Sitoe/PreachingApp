import { AppIcon } from '@/components/ui/app-icon';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { type ReturnOn, studentsActions } from '@/database/actions';
import { useCurrentLocation } from '@/hooks/use-current-location';
import { showToast } from '@/hooks/use-toast';
import { cn } from '@/utils/cn';
import { getNotificationPreferences } from '@/utils/storage';
import { daysAhead, formatReturnSummary, formatShortDay } from '@/utils/students/return-date';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { ReturnDateSheet } from './return-date-sheet';

type ReturnChoice = 'tomorrow' | 'rhythm' | 'custom';

type QuickStudentSheetProps = {
  open: boolean;
  initialName?: string;
  onClose: () => void;
};

function QuickStudentSheet({ open, initialName, onClose }: QuickStudentSheetProps) {
  const queryClient = useQueryClient();
  const rhythmDays = getNotificationPreferences().rhythm.revisitDays;
  const { location } = useCurrentLocation(open);

  const [name, setName] = React.useState('');
  const [note, setNote] = React.useState('');
  const [nameError, setNameError] = React.useState<string>();
  const [choice, setChoice] = React.useState<ReturnChoice>('rhythm');
  const [returnOn, setReturnOn] = React.useState<ReturnOn>({ date: daysAhead(rhythmDays) });
  const [pickingDate, setPickingDate] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const savingLock = React.useRef(false);
  const wasOpen = React.useRef(false);

  React.useEffect(() => {
    if (!open) {
      wasOpen.current = false;
      return;
    }
    if (wasOpen.current) return;
    wasOpen.current = true;
    savingLock.current = false;
    setSaving(false);
    setName(initialName ?? '');
    setNote('');
    setNameError(undefined);
    setChoice('rhythm');
    setReturnOn({ date: daysAhead(rhythmDays) });
    setPickingDate(false);
  }, [open, initialName, rhythmDays]);

  function choose(next: Exclude<ReturnChoice, 'custom'>) {
    setChoice(next);
    setReturnOn({ date: daysAhead(next === 'tomorrow' ? 1 : rhythmDays) });
  }

  function confirmDate(value: ReturnOn) {
    setChoice('custom');
    setReturnOn(value);
    setPickingDate(false);
  }

  async function save() {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Escreve o nome ou uma descrição.');
      return;
    }
    if (savingLock.current) return;
    savingLock.current = true;
    setSaving(true);
    try {
      await studentsActions.quickCreate({
        name: trimmed,
        // Captura no terreno: o nome fica por confirmar até se editar a ficha.
        nameIsProvisional: true,
        note,
        location,
        returnOn,
        rhythmDays,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['students'] }),
        queryClient.invalidateQueries({ queryKey: ['appointments'] }),
      ]);
      showToast({ message: `${trimmed} guardado.` });
      onClose();
    } catch {
      savingLock.current = false;
      setSaving(false);
      showToast({ message: 'Não foi possível guardar. Tenta outra vez.' });
    }
  }

  const displayName = name.trim();

  function openFullForm() {
    onClose();
    router.push({ pathname: '/student/new', params: displayName ? { name: displayName } : {} });
  }

  return (
    <>
      <BottomSheet open={open && !pickingDate} onClose={onClose}>
        <Text variant="titleL" className="text-center">
          Novo contacto
        </Text>

        <TextField
          label="Nome"
          value={name}
          onChangeText={(value) => {
            setName(value);
            if (nameError) setNameError(undefined);
          }}
          error={nameError}
          autoCapitalize="words"
          returnKeyType="next"
        />
        <TextField
          label="Uma linha para te lembrares (opcional)"
          value={note}
          onChangeText={setNote}
        />

        {location?.address ? (
          <View className="flex-row items-center gap-2">
            <AppIcon name="map-pin" size={18} className="text-success" />
            <Text variant="bodyS" className="flex-1 text-muted-foreground">
              Localização guardada: {location.address}
            </Text>
          </View>
        ) : null}

        <View className="gap-2">
          <Text variant="titleS">Quando voltas?</Text>
          <View role="radiogroup" aria-label="Quando voltas?" className="flex-row gap-2">
            <ReturnOption
              label="Amanhã"
              selected={choice === 'tomorrow'}
              onPress={() => choose('tomorrow')}
            />
            <ReturnOption
              label={`Em ${rhythmDays} dias`}
              selected={choice === 'rhythm'}
              onPress={() => choose('rhythm')}
            />
            <ReturnOption
              label={choice === 'custom' ? formatShortDay(returnOn.date) : 'Escolher'}
              icon={choice === 'custom' ? 'calendar' : undefined}
              selected={choice === 'custom'}
              onPress={() => setPickingDate(true)}
            />
          </View>
          <View className="flex-row gap-2">
            <AppIcon name="calendar" size={18} className="mt-0.5 text-primary" />
            <Text variant="bodyS" className="flex-1 text-muted-foreground">
              {formatReturnSummary(returnOn.date, returnOn.timeOfDay)}.{' '}
              {displayName ? `${displayName} aparece` : 'Aparece'} no teu{' '}
              <Text variant="bodyS" className="font-sans-semibold text-foreground">
                Hoje
              </Text>{' '}
              nesse dia.
            </Text>
          </View>
        </View>

        <View className="gap-1">
          <Button disabled={saving} onPress={save}>
            <Text>{saving ? 'A guardar…' : 'Guardar'}</Text>
          </Button>
          <Button variant="ghost" className="min-h-12" disabled={saving} onPress={openFullForm}>
            <Text>Preencher a ficha completa</Text>
          </Button>
          <Button variant="ghost" className="min-h-12" disabled={saving} onPress={onClose}>
            <Text>Cancelar</Text>
          </Button>
        </View>
      </BottomSheet>

      <ReturnDateSheet
        open={open && pickingDate}
        name={name}
        address={location?.address}
        value={returnOn}
        onConfirm={confirmDate}
        onClose={() => setPickingDate(false)}
      />
    </>
  );
}

type ReturnOptionProps = {
  label: string;
  selected: boolean;
  icon?: 'calendar';
  onPress: () => void;
};

function ReturnOption({ label, selected, icon, onPress }: ReturnOptionProps) {
  return (
    <Pressable
      role="radio"
      aria-checked={selected}
      onPress={onPress}
      className={cn(
        'h-12 flex-1 flex-row items-center justify-center gap-2 rounded-lg border',
        selected ? 'border-primary bg-secondary' : 'border-border bg-card active:bg-secondary'
      )}>
      {icon ? <AppIcon name={icon} size={18} className="text-primary" /> : null}
      <Text
        numberOfLines={1}
        className={cn(
          'font-display-medium text-[15px] leading-5',
          selected ? 'text-primary-strong' : 'text-foreground'
        )}>
        {label}
      </Text>
    </Pressable>
  );
}

export { QuickStudentSheet };
export type { QuickStudentSheetProps };
