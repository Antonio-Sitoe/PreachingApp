import type { Stage } from '@/constants/stages';
import type { NewNote, Note } from '../schemas';

export type NoteInput = Pick<
  NewNote,
  'title' | 'body' | 'tagId' | 'color' | 'studentId' | 'remoteId'
>;

export type NoteListItem = Note & { tagName: string | null };

export type NotePage = {
  data: NoteListItem[];
  totalPage: number;
};

export type LinkableStudent = {
  id: string;
  name: string;
  stage: Stage;
};
