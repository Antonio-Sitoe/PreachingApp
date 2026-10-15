import { AppIcon } from '@/components/ui/app-icon';
import { Text } from '@/components/ui/text';
import { PASSWORD_RULE_LABELS, type PasswordRules as Rules } from '@/utils/auth/validation';
import { cn } from '@/utils/cn';
import { View } from 'react-native';

type PasswordRulesProps = {
  rules: Rules;
};

function PasswordRules({ rules }: PasswordRulesProps) {
  return (
    <View role="list" aria-label="Regras da senha" className="gap-2.5">
      {PASSWORD_RULE_LABELS.map(({ key, label }) => {
        const met = rules[key];
        return (
          <View
            key={key}
            role="listitem"
            accessible
            accessibilityLabel={`${label}: ${met ? 'cumprida' : 'por cumprir'}`}
            className="flex-row items-center gap-3">
            <View className="size-4 items-center justify-center">
              {met ? (
                <AppIcon name="check" size={16} strokeWidth={3} className="text-success" />
              ) : (
                <View className="size-1.5 rounded-full bg-subtle" />
              )}
            </View>
            <Text
              className={cn(
                'flex-1 font-display-medium text-[13.5px] leading-[18px]',
                !met && 'text-muted-foreground'
              )}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export { PasswordRules };
export type { PasswordRulesProps };
