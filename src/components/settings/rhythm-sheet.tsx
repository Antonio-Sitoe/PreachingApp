import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import {
  RHYTHM_MAX_DAYS,
  RHYTHM_MIN_DAYS,
  RHYTHM_SHORTCUTS,
} from '@/utils/notifications/preferences';
import { Minus, Plus } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Pressable, View } from 'react-native';

const SHORTCUT_OPTIONS = RHYTHM_SHORTCUTS.map(({ days, label }) => ({ value: days, label }));

type RhythmSheetProps = {
  open: boolean;
  title: string;
  days: number;
  hint?: string;
  onSave: (days: number) => void;
  onClose: () => void;
};

function RhythmSheet({ open, title, days, hint, onSave, onClose }: RhythmSheetProps) {
  const [draft, setDraft] = React.useState(days);

  React.useEffect(() => {
    if (open) setDraft(days);
  }, [open, days]);

  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <View className="gap-2">
        <Text className="px-1 font-display-semibold text-[13px] leading-4 text-muted-foreground">
          Atalhos
        </Text>
        <SegmentedControl
          accessibilityLabel="Atalhos"
          options={SHORTCUT_OPTIONS}
          value={draft}
          onChange={setDraft}
        />
      </View>

      <View className="flex-row items-center gap-3 rounded-lg border border-border bg-card py-2.5 pl-4 pr-3">
        <View className="flex-1 gap-0.5">
          <Text variant="titleS">Ou a cada</Text>
          <Text variant="bodyS" className="text-muted-foreground">
            dias entre visitas
          </Text>
        </View>
        <DaysStepper value={draft} onChange={setDraft} />
      </View>

      {hint ? (
        <Text variant="bodyS" className="px-1 text-muted-foreground">
          {hint}
        </Text>
      ) : null}

      <View className="gap-1">
        <Button onPress={() => onSave(draft)}>
          <Text>Guardar</Text>
        </Button>
        <Button variant="ghost" className="min-h-12" onPress={onClose}>
          <Text>Cancelar</Text>
        </Button>
      </View>
    </BottomSheet>
  );
}

function DaysStepper({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const { colorScheme } = useColorScheme();
  const color = THEME[colorScheme ?? 'light'].foreground;
  const atMin = value <= RHYTHM_MIN_DAYS;
  const atMax = value >= RHYTHM_MAX_DAYS;
  const buttonClassName =
    'size-11 items-center justify-center rounded-lg border border-border bg-card active:bg-secondary disabled:opacity-30';

  return (
    <View role="group" aria-label="Ou a cada" className="flex-row items-center gap-1">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Menos um"
        disabled={atMin}
        onPress={() => onChange(Math.max(RHYTHM_MIN_DAYS, value - 1))}
        className={buttonClassName}>
        <Minus size={18} color={color} />
      </Pressable>
      <Text variant="titleL" className="w-9 text-center">
        {value}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Mais um"
        disabled={atMax}
        onPress={() => onChange(Math.min(RHYTHM_MAX_DAYS, value + 1))}
        className={buttonClassName}>
        <Plus size={18} color={color} />
      </Pressable>
    </View>
  );
}

export { DaysStepper, RhythmSheet };
export type { RhythmSheetProps };
