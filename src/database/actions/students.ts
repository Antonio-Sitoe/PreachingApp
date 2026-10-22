import dayjs from 'dayjs';
import { and, asc, desc, eq, inArray, isNull, ne } from 'drizzle-orm';
import { db } from '../db';
import {
  type Appointment,
  type AppointmentTimeOfDay,
  appointments,
  DEFAULT_RHYTHM_DAYS,
  type NewStudent,
  type Student,
  students,
} from '../schemas';
import { usersActions } from './users';

export type StudentInput = Pick<
  NewStudent,
  | 'displayName'
  | 'note'
  | 'phone'
  | 'stage'
  | 'status'
  | 'rhythmDays'
  | 'latitude'
  | 'longitude'
  | 'address'
>;

export type StudentLocation = {
  latitude: number;
  longitude: number;
  address?: string | null;
};

export type ReturnOn = {
  date: Date;
  timeOfDay?: AppointmentTimeOfDay;
};

export type QuickStudentInput = {
  name: string;
  note?: string;
  location?: StudentLocation | null;
  returnOn?: ReturnOn | null;
  rhythmDays?: number;
};

export type QuickStudentResult = {
  student: Student;
  appointment: Appointment | null;
};

export type StudentNextVisit = {
  scheduledAt: string;
  timeOfDay: AppointmentTimeOfDay;
};

export type StudentListItem = Student & {
  nextVisit: StudentNextVisit | null;
  lastVisitAt: string | null;
};

const now = () => new Date().toISOString();

async function getById(id: string): Promise<Student | undefined> {
  const rows = await db
    .select()
    .from(students)
    .where(and(eq(students.id, id), isNull(students.deletedAt)));
  return rows[0];
}

async function getAll(): Promise<Student[]> {
  const user = await usersActions.getCurrent();
  if (!user) return [];
  return db
    .select()
    .from(students)
    .where(and(eq(students.userId, user.id), isNull(students.deletedAt)))
    .orderBy(desc(students.updatedAt));
}

/** Os estudantes por encerrar, com a próxima marcação e a última visita feita. */
async function getList(): Promise<StudentListItem[]> {
  const user = await usersActions.getCurrent();
  if (!user) return [];

  const [rows, visits] = await Promise.all([
    db
      .select()
      .from(students)
      .where(
        and(eq(students.userId, user.id), isNull(students.deletedAt), ne(students.status, 'closed'))
      ),
    db
      .select({
        studentId: appointments.studentId,
        scheduledAt: appointments.scheduledAt,
        timeOfDay: appointments.timeOfDay,
        status: appointments.status,
      })
      .from(appointments)
      .innerJoin(students, eq(appointments.studentId, students.id))
      .where(
        and(
          eq(students.userId, user.id),
          isNull(appointments.deletedAt),
          inArray(appointments.status, ['pending', 'done'])
        )
      )
      .orderBy(asc(appointments.scheduledAt)),
  ]);

  const nextVisits = new Map<string, StudentNextVisit>();
  const lastVisits = new Map<string, string>();
  for (const visit of visits) {
    if (visit.status === 'pending') {
      if (!nextVisits.has(visit.studentId)) {
        nextVisits.set(visit.studentId, {
          scheduledAt: visit.scheduledAt,
          timeOfDay: visit.timeOfDay,
        });
      }
    } else {
      // Ordenadas por data: a última escrita é a mais recente.
      lastVisits.set(visit.studentId, visit.scheduledAt);
    }
  }

  return rows.map((student) => ({
    ...student,
    nextVisit: nextVisits.get(student.id) ?? null,
    lastVisitAt: lastVisits.get(student.id) ?? null,
  }));
}

async function quickCreate(input: QuickStudentInput): Promise<QuickStudentResult> {
  const name = input.name.trim();
  if (!name) throw new Error('O nome é obrigatório.');

  const user = await usersActions.getCurrent();
  if (!user) throw new Error('Ainda não há utilizador. Faz a configuração inicial primeiro.');

  try {
    const timestamp = now();
    // O driver do expo-sqlite é síncrono: sem await dentro da transacção,
    // para os dois inserts correrem antes do COMMIT.
    return db.transaction((tx) => {
      const student = tx
        .insert(students)
        .values({
          userId: user.id,
          displayName: name,
          note: input.note?.trim() || null,
          stage: 'first_contact',
          status: 'active',
          rhythmDays: input.rhythmDays ?? DEFAULT_RHYTHM_DAYS,
          latitude: input.location?.latitude ?? null,
          longitude: input.location?.longitude ?? null,
          address: input.location?.address ?? null,
          createdAt: timestamp,
          updatedAt: timestamp,
          syncStatus: 'pending',
        })
        .returning()
        .get();

      const appointment = input.returnOn
        ? tx
            .insert(appointments)
            .values({
              studentId: student.id,
              scheduledAt: dayjs(input.returnOn.date).startOf('day').toISOString(),
              timeOfDay: input.returnOn.timeOfDay ?? 'any',
              status: 'pending',
              createdAt: timestamp,
              updatedAt: timestamp,
              syncStatus: 'pending',
            })
            .returning()
            .get()
        : null;

      return { student, appointment };
    });
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
}

async function updateById(id: string, data: Partial<StudentInput>): Promise<Student | undefined> {
  try {
    const rows = await db
      .update(students)
      .set({
        ...(data.displayName !== undefined && { displayName: data.displayName.trim() }),
        ...(data.note !== undefined && { note: data.note?.trim() || null }),
        ...(data.phone !== undefined && { phone: data.phone?.trim() || null }),
        ...(data.stage !== undefined && { stage: data.stage }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.rhythmDays !== undefined && { rhythmDays: data.rhythmDays }),
        ...(data.latitude !== undefined && { latitude: data.latitude }),
        ...(data.longitude !== undefined && { longitude: data.longitude }),
        ...(data.address !== undefined && { address: data.address }),
        updatedAt: now(),
        syncStatus: 'pending',
      })
      .where(and(eq(students.id, id), isNull(students.deletedAt)))
      .returning();
    return rows[0];
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
}

async function deleteById(id: string): Promise<Student | undefined> {
  try {
    const timestamp = now();
    const rows = await db
      .update(students)
      .set({ deletedAt: timestamp, updatedAt: timestamp, syncStatus: 'pending' })
      .where(and(eq(students.id, id), isNull(students.deletedAt)))
      .returning();
    return rows[0];
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
}

export const studentsActions = {
  getById,
  getAll,
  getList,
  quickCreate,
  updateById,
  deleteById,
};
