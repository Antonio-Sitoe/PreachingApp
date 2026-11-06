export type LessonEditEffect = 'advance' | 'warn' | 'none';

export function lessonEditEffect(
  before: number | null,
  after: number | null,
  current: number | null
): LessonEditEffect {
  if (before === after) return 'none';
  if (after === null) return 'warn';
  if (after === current) return 'none';
  return current === null || after > current ? 'advance' : 'warn';
}
