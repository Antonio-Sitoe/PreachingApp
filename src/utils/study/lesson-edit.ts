export type LessonEditEffect = 'advance' | 'undo' | 'warn' | 'none';
export type UndoBlockReason = 'later-advance' | 'later-visit';

export function lessonEditEffect(
  before: number | null,
  after: number | null,
  current: number | null,
  canUndo = false
): LessonEditEffect {
  if (before === after) return 'none';
  if (canUndo && (after === null || (before !== null && after < before))) return 'undo';
  if (after === null) return 'warn';
  if (after === current) return 'none';
  return current === null || after > current ? 'advance' : 'warn';
}

export function undoBlockReason(
  advance: { lesson: number; createdAt: string },
  activeAdvances: readonly { createdAt: string }[],
  otherVisitLessons: readonly (number | null)[]
): UndoBlockReason | null {
  if (activeAdvances.some((other) => other.createdAt > advance.createdAt)) return 'later-advance';
  const reached = otherVisitLessons.some((lesson) => lesson !== null && lesson >= advance.lesson);
  return reached ? 'later-visit' : null;
}

export function formatUndoBlock(reason: UndoBlockReason): string {
  return reason === 'later-advance'
    ? 'Há um avanço mais recente. Desfaz esse primeiro.'
    : 'Há outra visita nesta lição ou numa mais avançada.';
}
