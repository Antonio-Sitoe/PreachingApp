import { defaultRhythmFor, rhythmAfterStageChange } from '@/utils/students/rhythm';

jest.mock('@/utils/storage', () => ({
  getNotificationPreferences: () => ({ rhythm: { revisitDays: 7, studyDays: 14 } }),
}));

describe('defaultRhythmFor', () => {
  it.each(['first_contact', 'return_visit'] as const)('%s usa o ritmo das revisitas', (stage) => {
    expect(defaultRhythmFor(stage)).toBe(7);
  });

  it.each(['study_started', 'regular_study', 'baptized'] as const)(
    '%s usa o ritmo dos estudos',
    (stage) => {
      expect(defaultRhythmFor(stage)).toBe(14);
    }
  );
});

describe('rhythmAfterStageChange', () => {
  it('segue o ritmo por omissão da nova etapa', () => {
    expect(rhythmAfterStageChange(7, 'return_visit', 'study_started')).toBe(14);
    expect(rhythmAfterStageChange(14, 'study_started', 'return_visit')).toBe(7);
  });

  it('mantém o ritmo escolhido pelo utilizador', () => {
    expect(rhythmAfterStageChange(30, 'return_visit', 'study_started')).toBe(30);
  });

  it('não muda dentro do mesmo grupo de etapas', () => {
    expect(rhythmAfterStageChange(7, 'first_contact', 'return_visit')).toBe(7);
  });
});
