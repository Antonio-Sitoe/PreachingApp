import type { PublisherType } from '../schemas';

export type MonthReport = {
  year: number;
  month: number;
  participated: boolean;
  participatedAuto: boolean;
  bibleStudies: number;
  studiesAuto: number;
  studyNames: string[];
  minutes: number;
  sentAt: string | null;
  sentHours: number | null;
};

export type SentReport = {
  publisherType: PublisherType;
  participated: boolean;
  bibleStudies: number;
  hours: number;
};
