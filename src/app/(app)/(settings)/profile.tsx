import { PublisherTypeField } from '@/components/onboarding/publisher-type-field';
import { SetupLayout } from '@/components/onboarding/setup-layout';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { FieldLabel, TextField } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { defaultMonthlyHourGoal, MONTHLY_HOUR_GOALS, usersActions } from '@/database/actions';
import {
  DEFAULT_SETUP_PROFILE,
  findProfileTypeOption,
  PROFILE_TYPE_OPTIONS,
  toSetupProfile,
  type SetupProfile,
} from '@/utils/profile/setup';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const [profile, setProfile] = React.useState<SetupProfile>(DEFAULT_SETUP_PROFILE);
  const [saving, setSaving] = React.useState(false);
  const touched = React.useRef(false);

  React.useEffect(() => {
    let cancelled = false;
    usersActions
      .getCurrent()
      .then((user) => {
        if (user && !cancelled && !touched.current) setProfile(toSetupProfile(user));
      })
      .catch((error) => console.error('Error loading user:', error));
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (changes: Partial<SetupProfile>) => {
    touched.current = true;
    setProfile((current) => ({ ...current, ...changes }));
  };

  const goals = [...MONTHLY_HOUR_GOALS[profile.publisherType]].sort((a, b) => b - a);

  const save = async () => {
    setSaving(true);
    try {
      await usersActions.saveProfile(profile);
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      router.back();
    } catch {
      showToast({ message: 'Não foi possível guardar. Tenta de novo.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SetupLayout
      title="Perfil"
      onBack={() => router.back()}
      className="bg-background"
      footer={
        <Button disabled={saving} onPress={save}>
          <Text>Guardar</Text>
        </Button>
      }>
      <View className="flex-row items-center gap-4">
        <Avatar
          name={profile.name}
          initials={profile.name.trim().charAt(0).toUpperCase()}
          size="xl"
          tone="brand"
        />
        <TextField
          label="Como preferes ser chamado?"
          containerClassName="flex-1"
          value={profile.name}
          onChangeText={(name) => update({ name })}
          placeholder="O teu nome"
          autoComplete="given-name"
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={40}
          returnKeyType="done"
        />
      </View>

      <PublisherTypeField
        label="Como participas no ministério?"
        options={PROFILE_TYPE_OPTIONS}
        value={findProfileTypeOption(profile.publisherType)}
        onChange={(option) =>
          update({
            publisherType: option.publisherType,
            monthlyHourGoal: defaultMonthlyHourGoal(option.publisherType),
          })
        }
      />

      {goals.length > 1 ? (
        <View className="gap-2">
          <FieldLabel>Meta deste mês</FieldLabel>
          <SegmentedControl
            accessibilityLabel="Meta deste mês"
            options={goals.map((goal) => ({ value: goal, label: `${goal} horas` }))}
            value={profile.monthlyHourGoal ?? goals[0]}
            onChange={(monthlyHourGoal) => update({ monthlyHourGoal })}
          />
        </View>
      ) : null}

      <Text variant="bodyS" className="text-muted-foreground">
        Podes mudar o tipo e a meta em qualquer mês. O relatório e o cronómetro ajustam-se sozinhos.
      </Text>
    </SetupLayout>
  );
}
