import type { LessonProgress } from '@/database/schemas';

export const BOOK_PARTS = [
  { part: 1, from: 1, to: 12 },
  { part: 2, from: 13, to: 33 },
  { part: 3, from: 34, to: 47 },
  { part: 4, from: 48, to: 60 },
] as const;

export type BookPart = (typeof BOOK_PARTS)[number];

export function partOf(lesson: number): BookPart {
  return BOOK_PARTS.find((part) => lesson >= part.from && lesson <= part.to) ?? BOOK_PARTS[0];
}

/** "Parte 2 · lições 13 a 33" */
export function formatPart(part: BookPart): string {
  return `Parte ${part.part} · lições ${part.from} a ${part.to}`;
}

export function partSize(part: BookPart): number {
  return part.to - part.from + 1;
}

/** A lição em curso: a de número mais alto ainda por concluir; senão, a seguinte à última concluída. */
export function currentLesson(rows: readonly LessonProgress[]): number | null {
  if (rows.length === 0) return null;
  const open = rows.filter((row) => !row.completedAt);
  if (open.length > 0) return Math.max(...open.map((row) => row.lessonNumber));
  return Math.min(60, Math.max(...rows.map((row) => row.lessonNumber)) + 1);
}

export type LessonState = 'done' | 'current' | 'todo';

export function lessonState(rows: readonly LessonProgress[], lesson: number): LessonState {
  const row = rows.find((item) => item.lessonNumber === lesson);
  if (row?.completedAt) return 'done';
  if (row) return 'current';
  return currentLesson(rows) === lesson ? 'current' : 'todo';
}
