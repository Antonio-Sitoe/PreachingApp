import { AppIcon } from '@/components/ui/app-icon';
import { Radio } from '@/components/ui/option-card';
import { FieldLabel } from '@/components/ui/text-field';
import { Text } from '@/components/ui/text';
import { LIGHT_THEME_VARS, THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SelectOption<Value extends string> = {
  value: Value;
  label: string;
};

type SelectFieldProps<Value extends string> = {
  label: string;
  value: Value;
  options: readonly SelectOption<Value>[];
  onChange: (value: Value) => void;
  /** Título da folha com as opções. Por omissão, o rótulo do campo. */
  sheetTitle?: string;
  containerClassName?: string;
};

/**
 * Campo de escolha (canvas, artboard "Configuração inicial 1 de 2": "Língua").
 * Parece um campo de texto com uma seta; ao tocar abre o bottom sheet com as opções.
 *
 * @example
 * <SelectField label="Língua" value={lingua} options={LANGUAGE_OPTIONS} onChange={setLingua} />
 */
function SelectField<Value extends string>({
  label,
  value,
  options,
  onChange,
  sheetTitle,
  containerClassName,
}: SelectFieldProps<Value>) {
  const insets = useSafeAreaInsets();
  const sheetRef = React.useRef<React.ComponentRef<typeof BottomSheetModal>>(null);
  const selected = options.find((option) => option.value === value);
  const title = sheetTitle ?? label;

  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />
    ),
    []
  );

  return (
    <View className={cn('gap-2', containerClassName)}>
      <FieldLabel>{label}</FieldLabel>
      <Pressable
        role="button"
        accessibilityLabel={`${label}: ${selected?.label ?? ''}`}
        onPress={() => sheetRef.current?.present()}
        className={cn(
          'h-[52px] flex-row items-center gap-3 rounded-lg border border-input bg-card pl-4 pr-3 active:bg-secondary',
          Platform.select({
            web: 'outline-none transition-colors focus-visible:border-primary',
          })
        )}>
        <Text variant="titleS" numberOfLines={1} className="flex-1">
          {selected?.label ?? ''}
        </Text>
        <AppIcon name="chevron-down" size={20} className="text-subtle" />
      </Pressable>

      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: THEME.light.card,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        handleIndicatorStyle={{
          backgroundColor: THEME.light.border,
          width: 36,
          height: 4,
        }}>
        <BottomSheetView
          style={[
            LIGHT_THEME_VARS,
            { paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 24), gap: 16 },
          ]}>
          <Text variant="titleL">{title}</Text>
          <View role="radiogroup" className="gap-2.5">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  role="radio"
                  aria-checked={isSelected}
                  onPress={() => {
                    onChange(option.value);
                    sheetRef.current?.dismiss();
                  }}
                  className={cn(
                    'h-[52px] flex-row items-center gap-3 rounded-lg border px-4',
                    isSelected
                      ? 'border-[1.5px] border-primary bg-secondary'
                      : 'border-border active:bg-secondary',
                    Platform.select({ web: 'outline-none' })
                  )}>
                  <Text variant="titleS" className="flex-1">
                    {option.label}
                  </Text>
                  <Radio selected={isSelected} />
                </Pressable>
              );
            })}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

export { SelectField };
export type { SelectFieldProps, SelectOption };
