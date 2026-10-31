/** "uma lição a cada 2 visitas, em média"; sem lições concluídas, `null`. */
export function formatLessonPace(studyVisits: number, completedLessons: number): string | null {
  if (completedLessons === 0 || studyVisits === 0) return null;
  const pace = Math.round(studyVisits / completedLessons);
  if (pace <= 1) return 'uma lição por visita, em média';
  return `uma lição a cada ${pace} visitas, em média`;
}

/** "lição 3", "lições 1 e 2", "lições 1 a 4" */
export function formatLessons(lessons: number[]): string {
  const first = lessons[0];
  const last = lessons[lessons.length - 1];
  if (first === last) return `lição ${first}`;
  return `lições ${first} ${last - first === 1 ? 'e' : 'a'} ${last}`;
}
