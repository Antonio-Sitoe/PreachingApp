type MaybeId = string | null | undefined;

export const queryKeys = {
  appointments: {
    all: ['appointments'] as const,
    today: (day: string) => ['appointments', 'today', day] as const,
    scheduledDays: (month: string) => ['appointments', 'scheduled-days', month] as const,
  },
  lessons: {
    all: ['lessons'] as const,
    byStudent: (studentId: MaybeId) => ['lessons', studentId] as const,
    detail: (studentId: string, lesson: number) =>
      ['lessons', studentId, 'detail', lesson] as const,
  },
  milestones: {
    all: ['milestones'] as const,
    byStudent: (studentId: string) => ['milestones', studentId] as const,
    reviews: (studentId: string) => ['milestones', studentId, 'reviews'] as const,
  },
  monthPlans: {
    all: ['month-plans'] as const,
    month: (year: number, month: number) => ['month-plans', year, month] as const,
  },
  monthlyReports: {
    all: ['monthly-reports'] as const,
    history: ['monthly-reports', 'history'] as const,
    month: (year: number, month: number) => ['monthly-reports', year, month] as const,
  },
  notes: {
    all: ['notes'] as const,
    linkableStudents: ['notes', 'linkable-students'] as const,
    list: (tagId?: string, search?: string) =>
      ['notes', tagId ?? 'all', search ?? ''] as const,
  },
  students: {
    all: ['students'] as const,
    list: ['students', 'list'] as const,
    detail: (id: MaybeId) => ['students', 'detail', id] as const,
    journey: (id: string) => ['students', 'journey', id] as const,
  },
  tags: {
    all: ['tags'] as const,
  },
  timeEntries: {
    all: ['time-entries'] as const,
    month: (year: number, month: number) => ['time-entries', 'month', year, month] as const,
    week: (day: string) => ['time-entries', 'week', day] as const,
    serviceYear: (startYear: number) => ['time-entries', 'service-year', startYear] as const,
  },
  usage: {
    counting: ['usage-counting'] as const,
  },
  user: {
    all: ['user'] as const,
    current: ['user', 'current'] as const,
  },
  visits: {
    all: ['visits'] as const,
    detail: (id: string) => ['visits', 'detail', id] as const,
    byStudent: (studentId: string) => ['visits', 'student', studentId] as const,
  },
};
