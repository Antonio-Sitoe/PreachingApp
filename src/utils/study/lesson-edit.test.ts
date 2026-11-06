import { lessonEditEffect, undoBlockReason } from '@/utils/study/lesson-edit';

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

describe('lessonEditEffect com avanço por desfazer', () => {
  it('desfaz quando a lição desce', () => {
    expect(lessonEditEffect(8, 7, 8, true)).toBe('undo');
  });

  it('desfaz quando a visita deixa de ter lição', () => {
    expect(lessonEditEffect(8, null, 8, true)).toBe('undo');
  });

  it('continua a avançar quando a lição sobe', () => {
    expect(lessonEditEffect(8, 9, 8, true)).toBe('advance');
  });

  it('não faz nada quando a lição não muda', () => {
    expect(lessonEditEffect(8, 8, 8, true)).toBe('none');
  });
});

describe('undoBlockReason', () => {
  const advance = { lesson: 8, createdAt: '2026-11-05T10:00:00.000Z' };

  it('deixa desfazer o último avanço sem outras visitas na lição', () => {
    expect(undoBlockReason(advance, [advance], [7, null])).toBeNull();
  });

  it('bloqueia quando há um avanço mais recente', () => {
    const later = { createdAt: '2026-11-06T10:00:00.000Z' };
    expect(undoBlockReason(advance, [advance, later], [])).toBe('later-advance');
  });

  it('bloqueia quando outra visita está nesta lição ou mais à frente', () => {
    expect(undoBlockReason(advance, [advance], [8])).toBe('later-visit');
    expect(undoBlockReason(advance, [advance], [9])).toBe('later-visit');
  });
});
