import { lessonEditEffect } from '@/utils/study/lesson-edit';

describe('lessonEditEffect', () => {
  it('não faz nada quando a lição da visita não muda', () => {
    expect(lessonEditEffect(7, 7, 8)).toBe('none');
    expect(lessonEditEffect(null, null, 8)).toBe('none');
    expect(lessonEditEffect(9, 9, 8)).toBe('none');
  });

  it('avança quando a lição sobe acima da actual', () => {
    expect(lessonEditEffect(7, 9, 8)).toBe('advance');
  });

  it('avança quando a lição acrescentada fica acima da actual', () => {
    expect(lessonEditEffect(null, 9, 8)).toBe('advance');
  });

  it('avança quando ainda não há progresso no estudo', () => {
    expect(lessonEditEffect(null, 1, null)).toBe('advance');
  });

  it('não avisa quando a visita fica igual à lição actual', () => {
    expect(lessonEditEffect(7, 8, 8)).toBe('none');
    expect(lessonEditEffect(null, 8, 8)).toBe('none');
  });

  it('avisa quando a lição desce', () => {
    expect(lessonEditEffect(8, 7, 8)).toBe('warn');
  });

  it('avisa quando a lição muda mas fica abaixo da actual', () => {
    expect(lessonEditEffect(3, 5, 8)).toBe('warn');
    expect(lessonEditEffect(null, 5, 8)).toBe('warn');
  });

  it('avisa quando a visita deixa de ter lição', () => {
    expect(lessonEditEffect(8, null, 8)).toBe('warn');
    expect(lessonEditEffect(8, null, null)).toBe('warn');
  });
});
