import { Fab } from '@/components/ui/fab';
import { ReportForm } from '@/components/reports/report-form';
import { ReportMonth, ReportYear } from '@/components/reports/report-period';
import { ReportsList } from '@/components/reports/reports-list';
import { useReportForm } from '@/hooks/use-report-form';
import { Text } from '@/components/ui/text';
import { CONTENT_MAX_WIDTH } from '@/components/ui/screen';
import { cn } from '@/utils/cn';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = [
  { key: 'list', label: 'Relatórios' },
  { key: 'month', label: 'Mês' },
  { key: 'year', label: 'Ano' },
] as const;

type ReportTab = (typeof TABS)[number]['key'];

export default function ReportScreen() {
  const [tab, setTab] = useState<ReportTab>('month');
  const openCreate = useReportForm((state) => state.openCreate);

  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }} className="bg-background">
      <View className="w-full flex-1 self-center" style={{ maxWidth: CONTENT_MAX_WIDTH }}>
        <View className="mx-4 mb-3 mt-3 flex-row rounded-lg bg-muted p-1">
          {TABS.map((item) => {
            const active = tab === item.key;
            return (
              <Pressable
                key={item.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                onPress={() => setTab(item.key)}
                className={cn('h-9 flex-1 items-center justify-center rounded-md', active && 'bg-card')}>
                <Text variant="labelS" className={active ? 'text-primary' : 'text-muted-foreground'}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {tab === 'list' ? <ReportsList /> : null}
        {tab === 'month' ? <ReportMonth /> : null}
        {tab === 'year' ? <ReportYear /> : null}
      </View>

      <View pointerEvents="box-none" style={StyleSheet.absoluteFill} className="items-center">
        <View pointerEvents="box-none" className="w-full max-w-[640px] flex-1">
          <Fab floating accessibilityLabel="Novo relatório" onPress={openCreate} />
        </View>
      </View>
      <ReportForm />
    </SafeAreaView>
  );
}
