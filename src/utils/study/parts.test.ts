import type { LessonProgress } from '@/database/schemas';
import {
  BOOK_PARTS,
  currentLesson,
  formatPart,
  lessonState,
  partOf,
  partSize,
} from '@/utils/study/parts';

const row = (lessonNumber: number, completedAt: string | null = null) =>
  ({ lessonNumber, completedAt }) as LessonProgress;

const DONE = '2026-10-01T10:00:00.000Z';

describe('partOf', () => {
  it.each([
    [1, 1],
    [12, 1],
    [13, 2],
    [33, 2],
    [34, 3],
    [47, 3],
    [48, 4],
    [60, 4],
  ])('a lição %i pertence à parte %i', (lesson, part) => {
    expect(partOf(lesson).part).toBe(part);
  });

  it('usa a primeira parte para uma lição fora do livro', () => {
    expect(partOf(61).part).toBe(1);
  });
});

describe('partes do livro', () => {
  it('cobrem as 60 lições', () => {
    expect(BOOK_PARTS.reduce((total, part) => total + partSize(part), 0)).toBe(60);
  });

  it('descreve a parte com o intervalo de lições', () => {
    expect(formatPart(BOOK_PARTS[1])).toBe('Parte 2 · lições 13 a 33');
  });
});

describe('currentLesson', () => {
  it('não tem lição sem progresso', () => {
    expect(currentLesson([])).toBeNull();
  });

  it('escolhe a lição aberta de número mais alto', () => {
    expect(currentLesson([row(3, DONE), row(4), row(7)])).toBe(7);
  });

  it('avança para a seguinte à última concluída', () => {
    expect(currentLesson([row(3, DONE), row(4, DONE)])).toBe(5);
  });

  it('não passa da lição 60', () => {
    expect(currentLesson([row(60, DONE)])).toBe(60);
  });
});

describe('lessonState', () => {
  it('marca como concluída a lição com data de conclusão', () => {
    expect(lessonState([row(1, DONE)], 1)).toBe('done');
  });

  it('marca como actual a lição aberta', () => {
    expect(lessonState([row(1)], 1)).toBe('current');
  });

  it('marca como actual a seguinte à última concluída, mesmo sem registo', () => {
    expect(lessonState([row(1, DONE)], 2)).toBe('current');
  });

  it('deixa por fazer as lições mais à frente', () => {
    expect(lessonState([row(1, DONE)], 3)).toBe('todo');
  });
});
