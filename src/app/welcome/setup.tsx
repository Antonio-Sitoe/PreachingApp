import { PublisherTypeField } from '@/components/onboarding/publisher-type-field';
import { SetupLayout } from '@/components/onboarding/setup-layout';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { TextField } from '@/components/ui/text-field';
import { showToast } from '@/components/ui/toast';
import { usersActions } from '@/database/actions';
import {
  DEFAULT_SETUP_PROFILE,
  findPublisherTypeOption,
  toSetupProfile,
  type SetupProfile,
} from '@/lib/setup-profile';
import { router } from 'expo-router';
import * as React from 'react';

export default function SetupScreen() {
  const [profile, setProfile] = React.useState<SetupProfile>(DEFAULT_SETUP_PROFILE);
  const [saving, setSaving] = React.useState(false);
  // Fica verdadeiro quando a pessoa mexe no formulário, para a leitura da base
  // de dados não passar por cima do que ela já escreveu.
  const touched = React.useRef(false);

  // Se a pessoa voltar atrás do passo 2, encontra o que já tinha escolhido.
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

  const next = async () => {
    setSaving(true);
    try {
      await usersActions.saveProfile(profile);
      router.push('/welcome/permissions');
    } catch {
      showToast({ message: 'Não foi possível guardar. Tenta de novo.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SetupLayout
      title="Configuração"
      step={1}
      footer={
        <Button disabled={saving} onPress={next}>
          <Text>Seguinte</Text>
        </Button>
      }>
      <Text variant="titleXl">Vamos preparar o app para ti</Text>

      <TextField
        label="Como preferes ser chamado?"
        value={profile.name}
        onChangeText={(name) => update({ name })}
        placeholder="O teu nome"
        autoComplete="given-name"
        autoCapitalize="words"
        autoCorrect={false}
        maxLength={40}
        returnKeyType="done"
      />

      <PublisherTypeField
        label="Como participas no ministério?"
        value={findPublisherTypeOption(profile.publisherType, profile.monthlyHourGoal)}
        onChange={(option) =>
          update({
            publisherType: option.publisherType,
            monthlyHourGoal: option.monthlyHourGoal,
          })
        }
      />

      <Text variant="bodyS" className="text-muted-foreground">
        Podes mudar isto em qualquer mês, no teu perfil.
      </Text>
    </SetupLayout>
  );
}
