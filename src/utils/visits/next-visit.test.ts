import { suggestNextVisit } from '@/utils/visits/next-visit';

const WEDNESDAY = new Date(2026, 9, 7);
const SATURDAY = 6;
const SUNDAY = 7;

const celeste = { displayName: 'Celeste Macuácua', gender: 'female', rhythmDays: 7 } as const;

describe('suggestNextVisit sem dias habituais', () => {
  it('soma o ritmo à data de partida, à meia-noite', () => {
    const { date } = suggestNextVisit(celeste, [], new Date(2026, 9, 7, 18, 30), null);
    expect(date).toEqual(new Date(2026, 9, 14));
  });

  it('usa a hora de recurso', () => {
    expect(suggestNextVisit(celeste, [], WEDNESDAY, '15:00').time).toBe('15:00');
  });

  it.each([
    [{ ...celeste }, 'Sugerida pelo ritmo semanal da Celeste'],
    [
      { ...celeste, displayName: 'Tomás', gender: 'male' as const },
      'Sugerida pelo ritmo semanal do Tomás',
    ],
    [{ ...celeste, displayName: 'Júlia', gender: null }, 'Sugerida pelo ritmo semanal de Júlia'],
    [{ ...celeste, rhythmDays: 14 }, 'Sugerida pelo ritmo quinzenal da Celeste'],
    [{ ...celeste, rhythmDays: 10 }, 'Sugerida pelo ritmo de 10 dias da Celeste'],
  ])('explica a sugestão %#', (student, hint) => {
    expect(suggestNextVisit(student, [], WEDNESDAY, null).hint).toBe(hint);
  });
});

describe('suggestNextVisit com dias habituais', () => {
  it('fica no próprio dia quando o ritmo já cai num dia habitual', () => {
    const { date } = suggestNextVisit(celeste, [{ weekday: 3, time: null }], WEDNESDAY, null);
    expect(date).toEqual(new Date(2026, 9, 14));
  });

  it('avança para o primeiro dia habitual depois do ritmo', () => {
    const availabilities = [
      { weekday: SUNDAY, time: null },
      { weekday: SATURDAY, time: null },
    ];
    const { date } = suggestNextVisit(celeste, availabilities, WEDNESDAY, null);
    expect(date).toEqual(new Date(2026, 9, 17));
  });

  it('reconhece o domingo como dia 7', () => {
    const { date } = suggestNextVisit(celeste, [{ weekday: SUNDAY, time: null }], WEDNESDAY, null);
    expect(date).toEqual(new Date(2026, 9, 18));
  });

  it('prefere a hora do dia habitual à hora de recurso', () => {
    const availabilities = [{ weekday: SATURDAY, time: '16:00' }];
    expect(suggestNextVisit(celeste, availabilities, WEDNESDAY, '09:00').time).toBe('16:00');
  });

  it('usa a hora de recurso quando os dias habituais não têm hora', () => {
    const availabilities = [{ weekday: SATURDAY, time: null }];
    expect(suggestNextVisit(celeste, availabilities, WEDNESDAY, '09:00').time).toBe('09:00');
  });

  it('explica a sugestão', () => {
    const { hint } = suggestNextVisit(celeste, [{ weekday: 3, time: null }], WEDNESDAY, null);
    expect(hint).toBe('Sugerida pelo ritmo semanal e pelos dias em que costuma estar');
  });
});
