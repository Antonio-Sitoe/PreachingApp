import { REVISIT_STAGES } from '@/constants/students';
import type { StudentStage } from '@/database/schemas';
import { getNotificationPreferences } from '@/utils/storage';

export function defaultRhythmFor(stage: StudentStage): number {
  const { rhythm } = getNotificationPreferences();
  return REVISIT_STAGES.includes(stage) ? rhythm.revisitDays : rhythm.studyDays;
}

/**
 * O ritmo depois de mudar de etapa: segue o ritmo por omissão da nova etapa,
 * excepto quando o utilizador já tinha escolhido outro.
 */
export function rhythmAfterStageChange(
  rhythmDays: number,
  from: StudentStage,
  to: StudentStage
): number {
  return rhythmDays === defaultRhythmFor(from) ? defaultRhythmFor(to) : rhythmDays;
}
