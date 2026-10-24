import { Logo } from '@/components/brand/logo';
import { APP_ICON_NAMES, AppIcon } from '@/components/ui/app-icon';
import { Avatar } from '@/components/ui/avatar';
import { BottomSheet, BottomSheetPanel, SheetOption } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Fab } from '@/components/ui/fab';
import { IconButton } from '@/components/ui/icon-button';
import { PersonCard } from '@/components/ui/person-card';
import { StageBadge } from '@/components/ui/stage-badge';
import { TabBar, type MainTabKey } from '@/components/ui/tab-bar';
import { Text, type TextVariant } from '@/components/ui/text';
import { showToast, Toast } from '@/components/ui/toast';
import { STAGE_ORDER } from '@/constants/stages';
import { BRAND, THEME, type ThemeColor } from '@/lib/theme';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS: { name: string; token: ThemeColor }[] = [
  { name: 'fundo/app', token: 'background' },
  { name: 'fundo/superfície', token: 'card' },
  { name: 'fundo/suave', token: 'secondary' },
  { name: 'fundo/neutro', token: 'muted' },
  { name: 'marca/primária', token: 'primary' },
  { name: 'marca/forte', token: 'primaryStrong' },
  { name: 'texto/principal', token: 'foreground' },
  { name: 'texto/secundário', token: 'mutedForeground' },
  { name: 'texto/suave', token: 'subtle' },
  { name: 'borda', token: 'border' },
  { name: 'estado/atraso', token: 'warning' },
  { name: 'estado/atraso fundo', token: 'warningSoft' },
  { name: 'estado/sucesso', token: 'success' },
  { name: 'estado/sucesso fundo', token: 'successSoft' },
  { name: 'estado/perigo', token: 'destructive' },
  { name: 'estado/perigo fundo', token: 'destructiveSoft' },
  { name: 'etapa/contacto', token: 'stageContact' },
  { name: 'etapa/revisita', token: 'stageRevisit' },
  { name: 'etapa/estudo iniciado', token: 'stageStarted' },
  { name: 'etapa/estudo regular', token: 'stageRegular' },
  { name: 'etapa/publicador', token: 'stagePublisher' },
  { name: 'etapa/batizado', token: 'stageBaptized' },
  { name: 'etapa/pausa', token: 'stagePaused' },
  { name: 'aviso/fundo', token: 'toast' },
];

const TYPE_SCALE: { label: string; variant: TextVariant; sample: string }[] = [
  { label: 'Destaque · 45/48 Bold', variant: 'display', sample: '7h30' },
  { label: 'Título XL · 25/32 Bold', variant: 'titleXl', sample: 'Hoje' },
  { label: 'Título L · 20/26 Bold', variant: 'titleL', sample: 'Celeste Nhantumbo' },
  { label: 'Título M · 17/22 SemiBold', variant: 'titleM', sample: 'Visitas de hoje' },
  { label: 'Título S · 15/20 Medium', variant: 'titleS', sample: 'Helena Macuácua' },
  {
    label: 'Corpo M · Sen 14/20',
    variant: 'bodyM',
    sample: 'Terminámos a lição 13 e marcámos a próxima visita.',
  },
  { label: 'Corpo S · Sen 12/16', variant: 'bodyS', sample: 'Ficou de ler Salmo 37:29' },
  { label: 'Rótulo M · Sen 13.5/16 SemiBold', variant: 'labelM', sample: 'Pessoas' },
  { label: 'Rótulo S · 12/16 Medium', variant: 'labelS', sample: 'Estudo regular' },
  { label: 'Botão · 16/20 SemiBold', variant: 'button', sample: 'Registar visita' },
];

const BRAND_PALETTE = [
  { name: 'Roxo escuro', hex: BRAND.purpleDark },
  { name: 'Roxo', hex: BRAND.purple },
  { name: 'Terracota', hex: BRAND.terracotta },
  { name: 'Areia', hex: BRAND.sand },
  { name: 'Branco', hex: BRAND.white },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-4">
      <Text variant="titleL">{title}</Text>
      {children}
    </View>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="bodyS" className="text-muted-foreground">
      {children}
    </Text>
  );
}

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <Button variant="ghost" size="sm" onPress={toggleColorScheme}>
      <Text>{colorScheme === 'dark' ? 'Tema claro' : 'Tema escuro'}</Text>
    </Button>
  );
}

export default function DesignSystemScreen() {
  const { colorScheme } = useColorScheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const compact = width < 400;
  const [tab, setTab] = React.useState<MainTabKey>('today');
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const undoToast = () =>
    showToast({
      message: 'Visita marcada como feita',
      action: { label: 'Desfazer', icon: 'undo', onPress: () => {} },
    });

  return (
    <>
      <Stack.Screen options={{ title: 'Componentes', headerRight: () => <ThemeToggle /> }} />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="mx-auto w-full max-w-[560px] gap-10 pb-16 pt-6"
        contentContainerStyle={{
          paddingLeft: Math.max(16, insets.left),
          paddingRight: Math.max(16, insets.right),
        }}>
        <Section title="Marca e logótipo">
          <View className="flex-row gap-3">
            <View className="h-[150px] min-w-0 flex-1 items-center justify-center rounded-lg border border-border bg-white">
              <Logo variant="color" width={72} />
            </View>
            <View
              className="h-[150px] flex-1 items-center justify-center rounded-lg"
              style={{ backgroundColor: BRAND.splash }}>
              <Logo variant="white" width={72} />
            </View>
            <View className="h-[150px] flex-1 items-center justify-center rounded-lg bg-[#10121C]">
              <Logo variant="white" width={72} />
            </View>
          </View>
          <View className="flex-row flex-wrap gap-3">
            {BRAND_PALETTE.map((color) => (
              <View key={color.name} className="min-w-[88px] flex-1 gap-1.5">
                <View
                  className="h-14 rounded-lg border border-border"
                  style={{ backgroundColor: color.hex }}
                />
                <Text variant="labelS" numberOfLines={1}>
                  {color.name}
                </Text>
                <Caption>{color.hex}</Caption>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Cores">
          <View className="flex-row flex-wrap gap-y-4">
            {COLORS.map((color) => (
              <View
                key={color.name}
                className={compact ? 'w-1/2 gap-1.5 pr-3' : 'w-1/3 gap-1.5 pr-3'}>
                <View className="h-14 flex-row overflow-hidden rounded-lg border border-border">
                  <View className="flex-1" style={{ backgroundColor: THEME.light[color.token] }} />
                  <View className="flex-1" style={{ backgroundColor: THEME.dark[color.token] }} />
                </View>
                <Text variant="labelS" numberOfLines={1}>
                  {color.name}
                </Text>
                <Caption>
                  {THEME.light[color.token]} · {THEME.dark[color.token]}
                </Caption>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Tipografia">
          <View className="gap-4">
            {TYPE_SCALE.map((item) => (
              <View key={item.variant} className="gap-1">
                <Caption>{item.label}</Caption>
                <Text variant={item.variant}>{item.sample}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Ícones">
          <View className="flex-row flex-wrap gap-y-5">
            {APP_ICON_NAMES.map((name) => (
              <View
                key={name}
                className={compact ? 'w-1/3 items-center gap-1.5' : 'w-1/4 items-center gap-1.5'}>
                <AppIcon name={name} strokeWidth={name === 'more' ? 2.5 : 2} />
                <Caption>{name}</Caption>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Etiqueta de etapa">
          <View className="flex-row flex-wrap gap-3">
            {STAGE_ORDER.map((stage) => (
              <StageBadge key={stage} stage={stage} />
            ))}
            <StageBadge stage="return_visit" paused />
          </View>
        </Section>

        <Section title="Botões e avatar">
          <View className="gap-3">
            <Button>
              <Text>Registar visita</Text>
            </Button>
            <Button variant="outline">
              <Text>Direcções</Text>
            </Button>
            <Button variant="ghost">
              <Text>Cancelar</Text>
            </Button>
            <Button variant="destructive">
              <Text>Remover pessoa</Text>
            </Button>
            <Button disabled>
              <Text>Desactivado</Text>
            </Button>
          </View>
          <View className="flex-row flex-wrap items-center gap-4">
            <Fab accessibilityLabel="Novo contacto" />
            <IconButton icon="check" accessibilityLabel="Marcar como feita" />
            <IconButton icon="chevron-left" variant="ghost" accessibilityLabel="Voltar" />
            <Avatar name="Ana Macamo" />
            <Avatar name="Ana Macamo" size="lg" />
            <Avatar name="Daniel" tone="brand" />
          </View>
        </Section>

        <Section title="Cartão de pessoa">
          <View className="gap-2">
            <Caption>Visita de hoje</Caption>
            <PersonCard
              name="Celeste Nhantumbo"
              stage="regular_study"
              meta="10:00"
              detail="Lição 14 · levar a brochura"
              onPress={() => {}}
              onActionPress={undoToast}
            />
          </View>
          <View className="gap-2">
            <Caption>Em atraso</Caption>
            <PersonCard
              name="Helena Macuácua"
              stage="return_visit"
              meta="há 2 dias"
              metaTone="warning"
              detail="Ficou de ler Salmo 37:29"
              onPress={() => {}}
              onActionPress={undoToast}
            />
          </View>
          <View className="gap-2">
            <Caption>Na lista de pessoas</Caption>
            <PersonCard
              name="Ernesto Sitoe"
              stage="return_visit"
              detail="Última visita há 16 dias"
              onPress={() => {}}
            />
          </View>
        </Section>

        <Section title="Barra de navegação">
          <View className="overflow-hidden rounded-lg border border-border">
            <TabBar activeKey={tab} onChange={setTab} bottomInset={32} />
          </View>
        </Section>

        <Section title="Aviso">
          <Toast
            message="Visita marcada como feita"
            action={{ label: 'Desfazer', icon: 'undo', onPress: () => {} }}
          />
          <Button variant="outline" onPress={undoToast}>
            <Text>Mostrar o aviso no ecrã</Text>
          </Button>
        </Section>

        <Section title="Folha inferior">
          <View className="overflow-hidden rounded-t-sheet border border-border">
            <BottomSheetPanel title="Título da folha" bottomInset={24}>
              <SheetOption
                icon="check"
                tone="success"
                title="Opção"
                description="Uma linha que explica o que acontece"
              />
              <Button variant="ghost">
                <Text>Cancelar</Text>
              </Button>
            </BottomSheetPanel>
          </View>
          <Button variant="outline" onPress={() => setSheetOpen(true)}>
            <Text>Abrir a folha</Text>
          </Button>
        </Section>

        <Section title="Estado vazio">
          <EmptyState
            icon="people"
            title="Ainda não há pessoas"
            description="Regista a primeira pessoa que estás a acompanhar."
            actionLabel="Novo contacto"
            onActionPress={() => {}}
          />
        </Section>

        <Caption>Tema actual: {colorScheme === 'dark' ? 'escuro' : 'claro'}</Caption>
      </ScrollView>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="O que aconteceu?">
        <SheetOption
          icon="check"
          tone="success"
          title="Visita feita"
          description="Regista o que conversaram"
          onPress={() => setSheetOpen(false)}
        />
        <SheetOption
          icon="not-home"
          tone="warning"
          title="Não estava em casa"
          description="Conta como tentativa e sugere nova data"
          onPress={() => setSheetOpen(false)}
        />
        <Button variant="ghost" onPress={() => setSheetOpen(false)}>
          <Text>Cancelar</Text>
        </Button>
      </BottomSheet>
    </>
  );
}
