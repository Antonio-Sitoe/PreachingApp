import { SettingsSection } from '@/components/settings/grouped-list';
import { MilestoneSheet } from '@/components/students/milestone-sheet';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { STAGES } from '@/constants/stages';
import { milestonesActions, studentsActions } from '@/database/actions';
import { cn } from '@/utils/cn';
import {
  buildStageSteps,
  formatAdvanceLabel,
  formatJourneyTitle,
  formatShortDate,
  getNextStage,
  type StageStep,
} from '@/utils/students/journey';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

export default function StudentStageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [addingMilestone, setAddingMilestone] = React.useState(false);
  const [advancing, setAdvancing] = React.useState(false);

  const journeyQuery = useQuery({
    queryKey: ['students', 'journey', id],
    queryFn: () => studentsActions.getJourney(id),
    enabled: Boolean(id),
  });
  const milestonesQuery = useQuery({
    queryKey: ['milestones', id],
    queryFn: () => milestonesActions.getByStudent(id),
    enabled: Boolean(id),
  });

  const journey = journeyQuery.data;
  const milestones = milestonesQuery.data ?? [];
  const student = journey?.student;
  const nextStage = student ? getNextStage(student.stage) : null;

  async function advance() {
    if (!student || !nextStage || advancing) return;
    setAdvancing(true);
    try {
      const change = await studentsActions.changeStage(student.id, nextStage);
      await queryClient.invalidateQueries({ queryKey: ['students'] });
      if (change) {
        showToast({
          message: `Passou a ${STAGES[nextStage].label.toLocaleLowerCase('pt')}.`,
          action: {
            label: 'Desfazer',
            icon: 'undo',
            onPress: async () => {
              await studentsActions.undoStageChange(change);
              await queryClient.invalidateQueries({ queryKey: ['students'] });
            },
          },
        });
      }
    } catch {
      showToast({ message: 'Não foi possível mudar a etapa. Tenta outra vez.' });
    } finally {
      setAdvancing(false);
    }
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Etapa e marcos" onBack={() => router.back()} />

      {student && journey ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="w-full max-w-[640px] self-center gap-5 px-4 pb-8 pt-5"
          showsVerticalScrollIndicator={false}>
          <SettingsSection title={formatJourneyTitle(student.displayName, student.gender)}>
            <View role="list" aria-label="Etapas do percurso" className="p-4">
              {buildStageSteps(student.stage, journey.stageChanges).map((step, index, steps) => (
                <StageStepRow key={step.stage} step={step} last={index === steps.length - 1} />
              ))}
            </View>
          </SettingsSection>

          {nextStage ? (
            <Button disabled={advancing} onPress={advance}>
              <Text>{formatAdvanceLabel(nextStage)}</Text>
            </Button>
          ) : null}

          <SettingsSection title="Marcos">
            {milestones.length > 0 ? (
              milestones.map((milestone, index) => (
                <View
                  key={milestone.id}
                  className={cn(
                    'min-h-[52px] flex-row items-center gap-3 px-4 py-2',
                    index > 0 && 'border-t border-border'
                  )}>
                  <Text variant="titleS" className="flex-1">
                    {milestone.label}
                  </Text>
                  <Text variant="bodyS" className="text-muted-foreground">
                    {formatShortDate(milestone.occurredAt)}
                  </Text>
                </View>
              ))
            ) : (
              <View className="px-4 py-3.5">
                <Text variant="bodyS" className="text-muted-foreground">
                  Ainda sem marcos. A primeira reunião ou o primeiro comentário ficam bem aqui.
                </Text>
              </View>
            )}
          </SettingsSection>

          <Pressable
            role="button"
            onPress={() => setAddingMilestone(true)}
            className="h-[52px] flex-row items-center justify-center gap-2 rounded-lg border border-dashed border-primary active:bg-secondary">
            <AppIcon name="plus" size={18} className="text-primary" />
            <Text variant="button" className="text-primary">
              Adicionar marco
            </Text>
          </Pressable>
        </ScrollView>
      ) : null}

      {student ? (
        <MilestoneSheet
          open={addingMilestone}
          studentId={student.id}
          onClose={() => setAddingMilestone(false)}
        />
      ) : null}
    </View>
  );
}

function StageStepRow({ step, last }: { step: StageStep; last: boolean }) {
  const reached = step.state !== 'next';
  return (
    <View role="listitem" className="flex-row gap-3">
      <View className="items-center gap-1">
        <View
          className={cn(
            'size-6 items-center justify-center rounded-full',
            step.state === 'done' && 'bg-success',
            step.state === 'current' && 'bg-primary',
            step.state === 'next' && 'border-[1.5px] border-border bg-card'
          )}>
          {step.state === 'done' ? (
            <AppIcon name="check" size={14} strokeWidth={3} className="text-white" />
          ) : null}
        </View>
        {last ? null : (
          <View
            className={cn(
              'min-h-4 w-0.5 flex-1',
              step.state === 'done' ? 'bg-success' : 'bg-border'
            )}
          />
        )}
      </View>
      <View className={cn('flex-1 gap-0.5', !last && 'pb-3.5')}>
        <Text
          className={cn(
            'text-[15px] leading-6',
            step.state === 'current' ? 'font-display-semibold' : 'font-display-medium',
            reached ? 'text-foreground' : 'text-muted-foreground'
          )}>
          {step.label}
        </Text>
        {step.date ? (
          <Text variant="bodyS" className="text-muted-foreground">
            {step.date}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
