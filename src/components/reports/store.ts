import type { Report } from '@/database/schemas';
import dayjs from 'dayjs';
import { create } from 'zustand';

export type ReportDraft = {
  id: string | null;
  date: string;
  hours: number;
  minutes: number;
  students: number;
  comments: string;
};

function emptyDraft(): ReportDraft {
  return {
    id: null,
    date: dayjs().format('YYYY-MM-DD'),
    hours: 0,
    minutes: 0,
    students: 0,
    comments: '',
  };
}

type ReportFormState = {
  open: boolean;
  draft: ReportDraft;
  openCreate: () => void;
  openEdit: (report: Report) => void;
  close: () => void;
  setDraft: (values: Partial<ReportDraft>) => void;
};

export const useReportForm = create<ReportFormState>((set) => ({
  open: false,
  draft: emptyDraft(),
  openCreate: () => set({ open: true, draft: emptyDraft() }),
  openEdit: (report) =>
    set({
      open: true,
      draft: {
        id: report.id,
        date: report.date,
        hours: report.hours,
        minutes: report.minutes,
        students: report.students,
        comments: report.comments ?? '',
      },
    }),
  close: () => set({ open: false, draft: emptyDraft() }),
  setDraft: (values) => set((state) => ({ draft: { ...state.draft, ...values } })),
}));
