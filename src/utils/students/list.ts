import { capitalize } from '@/components/reports/format';
import {
  REVISIT_STAGES,
  STUDENT_SORTS,
  TIME_OF_DAY_SUFFIX,
  type StudentFilter,
  type StudentSort,
} from '@/constants/students';
import type { StudentListItem } from '@/database/actions';
import dayjs, { type Dayjs } from 'dayjs';
import '@/lib/dayjs';
import { weekdayName } from './return-date';

/** Minúsculas e sem acentos: "Macuácua" → "macuacua". */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function matchesFilter(item: StudentListItem, filter: StudentFilter): boolean {
  if (filter === 'paused') return item.status === 'paused';
  if (item.status !== 'active') return false;
  if (filter === 'revisits') return REVISIT_STAGES.includes(item.stage);
  if (filter === 'studying') return !REVISIT_STAGES.includes(item.stage);
  return true;
}

export function filterStudents(
  items: readonly StudentListItem[],
  filter: StudentFilter,
  search: string
): StudentListItem[] {
  const query = normalize(search);
  return items.filter(
    (item) => matchesFilter(item, filter) && (!query || normalize(item.displayName).includes(query))
  );
}

const byName = (a: StudentListItem, b: StudentListItem) =>
  a.displayName.localeCompare(b.displayName, 'pt', { sensitivity: 'base' });

/** Compara datas ISO; quem não tem data vai para o fim, por nome. */
function byDate(
  pick: (item: StudentListItem) => string | null | undefined,
  direction: 1 | -1
): (a: StudentListItem, b: StudentListItem) => number {
  return (a, b) => {
    const left = pick(a);
    const right = pick(b);
    if (!left && !right) return byName(a, b);
    if (!left) return 1;
    if (!right) return -1;
    return left === right ? byName(a, b) : left < right ? -direction : direction;
  };
}

const SORTERS: Record<StudentSort, (a: StudentListItem, b: StudentListItem) => number> = {
  'next-visit': byDate((item) => item.nextVisit?.scheduledAt, 1),
  name: byName,
  'last-visit-desc': byDate((item) => item.lastVisitAt, -1),
  'last-visit-asc': byDate((item) => item.lastVisitAt, 1),
  created: byDate((item) => item.createdAt, -1),
};

export function sortStudents(items: StudentListItem[], sort: StudentSort): StudentListItem[] {
  return [...items].sort(SORTERS[sort]);
}

export function getSortSummary(sort: StudentSort): string {
  return STUDENT_SORTS.find((option) => option.id === sort)?.summary ?? '';
}

/** "6 estudantes", "1 estudante em pausa" */
export function formatStudentCount(count: number, filter: StudentFilter): string {
  const noun = count === 1 ? 'estudante' : 'estudantes';
  return filter === 'paused' ? `${count} ${noun} em pausa` : `${count} ${noun}`;
}

/** "Hoje", "Amanhã", "Quarta, 7 Out" */
function formatVisitDay(day: Dayjs, today: Dayjs): string {
  if (day.isSame(today, 'day')) return 'Hoje';
  if (day.isSame(today.add(1, 'day'), 'day')) return 'Amanhã';
  const month = capitalize(day.format('MMMM').slice(0, 3));
  return `${capitalize(weekdayName(day))}, ${day.date()} ${month}`;
}

export type StudentDetail = {
  text: string;
  tone: 'default' | 'warning';
};

export function getStudentDetail(item: StudentListItem): StudentDetail {
  const today = dayjs().startOf('day');

  if (item.nextVisit) {
    const day = dayjs(item.nextVisit.scheduledAt).startOf('day');
    if (day.isBefore(today)) return overdue(today.diff(day, 'day'));
    return {
      text: `${formatVisitDay(day, today)}${TIME_OF_DAY_SUFFIX[item.nextVisit.timeOfDay]}`,
      tone: 'default',
    };
  }

  const due = dayjs(item.lastVisitAt ?? item.createdAt)
    .startOf('day')
    .add(item.rhythmDays, 'day');
  if (due.isBefore(today)) return overdue(today.diff(due, 'day'));
  return { text: 'Sem visita marcada', tone: 'default' };
}

function overdue(days: number): StudentDetail {
  return {
    text: days === 1 ? 'Fora do ritmo há 1 dia' : `Fora do ritmo há ${days} dias`,
    tone: 'warning',
  };
}
