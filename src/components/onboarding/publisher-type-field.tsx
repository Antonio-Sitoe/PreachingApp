import { AppIcon } from '@/components/ui/app-icon';
import { IconButton } from '@/components/ui/icon-button';
import { Radio } from '@/components/ui/option-card';
import { Text } from '@/components/ui/text';
import { FieldLabel } from '@/components/ui/text-field';
import { PUBLISHER_TYPE_OPTIONS, type PublisherTypeOption } from '@/lib/setup-profile';
import { LIGHT_THEME_VARS, THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PublisherTypeFieldProps = {
  label: string;
  /** A linha escolhida. Usa `findPublisherTypeOption` para a obter do tipo e da meta. */
  value: PublisherTypeOption;
  onChange: (option: PublisherTypeOption) => void;
  options?: readonly PublisherTypeOption[];
  sheetTitle?: string;
  containerClassName?: string;
};

/**
 * Campo "Como participas no ministério?" (canvas, artboards "Configuração inicial 1 de 2"
 * e "Configuração inicial, tipo de publicador"). Mostra o tipo escolhido e a sua meta;
 * ao tocar abre a lista com todos os tipos. Tocar numa linha escolhe e fecha.
 *
 * @example
 * <PublisherTypeField
 *   label="Como participas no ministério?"
 *   value={findPublisherTypeOption(profile.publisherType, profile.monthlyHourGoal)}
 *   onChange={(option) => update({ publisherType: option.publisherType, monthlyHourGoal: option.monthlyHourGoal })}
 * />
 */
function PublisherTypeField({
  label,
  value,
  onChange,
  options = PUBLISHER_TYPE_OPTIONS,
  sheetTitle = 'Como participas?',
  containerClassName,
}: PublisherTypeFieldProps) {
  const insets = useSafeAreaInsets();
  const sheetRef = React.useRef<React.ComponentRef<typeof BottomSheetModal>>(null);

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
        accessibilityLabel={`${label}: ${value.label}, ${value.goalLabel}`}
        onPress={() => sheetRef.current?.present()}
        className={cn(
          'min-h-[64px] flex-row items-center gap-3 rounded-lg border border-input bg-card px-3 py-2.5 active:bg-secondary',
          Platform.select({
            web: 'outline-none transition-colors focus-visible:border-primary',
          })
        )}>
        <View className="size-11 items-center justify-center rounded-full bg-secondary">
          <AppIcon name={value.icon} size={22} className="text-primary" />
        </View>
        <View className="flex-1">
          <Text variant="titleS" numberOfLines={1}>
            {value.label}
          </Text>
          <Text variant="bodyS" numberOfLines={2} className="text-muted-foreground">
            {value.description}
          </Text>
        </View>
        <AppIcon name="chevron-down" size={20} className="text-subtle" />
      </Pressable>

      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        enablePanDownToClose
        topInset={insets.top + 12}
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
        {/* Com scroll: em ecrãs baixos as dez linhas não cabem todas. */}
        <BottomSheetScrollView
          style={LIGHT_THEME_VARS}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: Math.max(insets.bottom, 24),
            gap: 16,
          }}>
          <View className="flex-row items-center gap-3">
            <Text variant="titleL" className="flex-1">
              {sheetTitle}
            </Text>
            <IconButton
              variant="ghost"
              icon="close"
              accessibilityLabel="Fechar"
              className="-mr-2.5"
              onPress={() => sheetRef.current?.dismiss()}
            />
          </View>
          <View role="radiogroup" aria-label={sheetTitle} className="gap-2">
            {options.map((option) => {
              const isSelected = option.key === value.key;
              return (
                <Pressable
                  key={option.key}
                  role="radio"
                  aria-checked={isSelected}
                  accessibilityLabel={`${option.label}, ${option.goalLabel}`}
                  onPress={() => {
                    onChange(option);
                    sheetRef.current?.dismiss();
                  }}
                  className={cn(
                    'h-[52px] flex-row items-center gap-3 rounded-lg border px-4',
                    isSelected
                      ? 'border-[1.5px] border-primary bg-secondary'
                      : 'border-border active:bg-secondary',
                    Platform.select({ web: 'outline-none' })
                  )}>
                  <Text variant="titleS" numberOfLines={1} className="flex-1">
                    {option.label}
                  </Text>
                  <Text variant="bodyS" className="text-muted-foreground">
                    {option.goalLabel}
                  </Text>
                  <Radio selected={isSelected} />
                </Pressable>
              );
            })}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}

export { PublisherTypeField };
export type { PublisherTypeFieldProps };
