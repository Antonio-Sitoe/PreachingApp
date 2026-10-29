import dayjs from 'dayjs';
import { and, asc, desc, eq, inArray, isNull, ne } from 'drizzle-orm';
import { db } from '../db';
import {
  type Appointment,
  type AppointmentTimeOfDay,
  appointments,
  DEFAULT_RHYTHM_DAYS,
  type NewStudent,
  pauses,
  type Student,
  type StudentAvailability,
  stageChanges,
  studentAvailabilities,
  students,
} from '../schemas';
import { usersActions } from './users';

export type StudentInput = Pick<
  NewStudent,
  | 'displayName'
  | 'nameIsProvisional'
  | 'note'
  | 'phone'
  | 'ageRange'
  | 'gender'
  | 'stage'
  | 'status'
  | 'rhythmDays'
  | 'latitude'
  | 'longitude'
  | 'address'
  | 'directions'
  | 'locatedAt'
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
  nameIsProvisional?: boolean;
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

/** Dias da semana em que costuma estar (1 = segunda … 7 = domingo) e a melhor hora, HH:mm. */
export type AvailabilityInput = {
  weekdays: number[];
  time: string | null;
};

export type StudentDetail = {
  student: Student;
  nextVisit: Appointment | null;
  availabilities: StudentAvailability[];
};

const now = () => new Date().toISOString();

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Troca os dias habituais: apaga (logicamente) os que havia e grava os novos. */
function replaceAvailability(
  tx: Transaction,
  studentId: string,
  availability: AvailabilityInput,
  timestamp: string
) {
  tx.update(studentAvailabilities)
    .set({ deletedAt: timestamp, updatedAt: timestamp, syncStatus: 'pending' })
    .where(
      and(eq(studentAvailabilities.studentId, studentId), isNull(studentAvailabilities.deletedAt))
    )
    .run();

  const weekdays = [...new Set(availability.weekdays)].sort((a, b) => a - b);
  if (weekdays.length === 0) return;
  tx.insert(studentAvailabilities)
    .values(
      weekdays.map((weekday) => ({
        studentId,
        weekday,
        time: availability.time,
        createdAt: timestamp,
        updatedAt: timestamp,
        syncStatus: 'pending' as const,
      }))
    )
    .run();
}

async function getById(id: string): Promise<Student | undefined> {
  const rows = await db
    .select()
    .from(students)
    .where(and(eq(students.id, id), isNull(students.deletedAt)));
  return rows[0];
}

/** Tudo o que a ficha mostra: o estudante, a próxima marcação e os dias em que costuma estar. */
async function getDetail(id: string): Promise<StudentDetail | null> {
  const student = await getById(id);
  if (!student) return null;

  const [nextVisits, availabilities] = await Promise.all([
    db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.studentId, id),
          eq(appointments.status, 'pending'),
          isNull(appointments.deletedAt)
        )
      )
      .orderBy(asc(appointments.scheduledAt))
      .limit(1),
    db
      .select()
      .from(studentAvailabilities)
      .where(and(eq(studentAvailabilities.studentId, id), isNull(studentAvailabilities.deletedAt)))
      .orderBy(asc(studentAvailabilities.weekday)),
  ]);

  return { student, nextVisit: nextVisits[0] ?? null, availabilities };
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
          nameIsProvisional: input.nameIsProvisional ?? false,
          note: input.note?.trim() || null,
          stage: 'first_contact',
          status: 'active',
          rhythmDays: input.rhythmDays ?? DEFAULT_RHYTHM_DAYS,
          latitude: input.location?.latitude ?? null,
          longitude: input.location?.longitude ?? null,
          address: input.location?.address ?? null,
          locatedAt: input.location ? timestamp : null,
          createdAt: timestamp,
          updatedAt: timestamp,
          syncStatus: 'pending',
        })
        .returning()
        .get();

      tx.insert(stageChanges)
        .values({
          studentId: student.id,
          fromStage: null,
          toStage: student.stage,
          changedAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
          syncStatus: 'pending',
        })
        .run();

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

/** Cria o estudante pelo formulário completo, com a etapa inicial e os dias habituais. */
async function create(
  data: Omit<StudentInput, 'status'>,
  availability?: AvailabilityInput
): Promise<Student> {
  const name = data.displayName.trim();
  if (!name) throw new Error('O nome é obrigatório.');

  const user = await usersActions.getCurrent();
  if (!user) throw new Error('Ainda não há utilizador. Faz a configuração inicial primeiro.');

  try {
    const timestamp = now();
    return db.transaction((tx) => {
      const student = tx
        .insert(students)
        .values({
          ...data,
          userId: user.id,
          displayName: name,
          note: data.note?.trim() || null,
          phone: data.phone?.trim() || null,
          address: data.address?.trim() || null,
          directions: data.directions?.trim() || null,
          status: 'active',
          createdAt: timestamp,
          updatedAt: timestamp,
          syncStatus: 'pending',
        })
        .returning()
        .get();

      tx.insert(stageChanges)
        .values({
          studentId: student.id,
          fromStage: null,
          toStage: student.stage,
          changedAt: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
          syncStatus: 'pending',
        })
        .run();

      if (availability) replaceAvailability(tx, student.id, availability, timestamp);

      return student;
    });
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
}

/**
 * Actualiza o estudante. Uma mudança de etapa grava também uma linha em `stage_changes`;
 * com `availability`, troca os dias habituais.
 */
async function updateById(
  id: string,
  data: Partial<StudentInput>,
  availability?: AvailabilityInput
): Promise<Student | undefined> {
  try {
    const timestamp = now();
    return db.transaction((tx) => {
      const current = tx
        .select({ stage: students.stage })
        .from(students)
        .where(and(eq(students.id, id), isNull(students.deletedAt)))
        .get();
      if (!current) return undefined;

      const updated = tx
        .update(students)
        .set({
          ...(data.displayName !== undefined && { displayName: data.displayName.trim() }),
          ...(data.nameIsProvisional !== undefined && {
            nameIsProvisional: data.nameIsProvisional,
          }),
          ...(data.note !== undefined && { note: data.note?.trim() || null }),
          ...(data.phone !== undefined && { phone: data.phone?.trim() || null }),
          ...(data.ageRange !== undefined && { ageRange: data.ageRange }),
          ...(data.gender !== undefined && { gender: data.gender }),
          ...(data.stage !== undefined && { stage: data.stage }),
          ...(data.status !== undefined && { status: data.status }),
          ...(data.rhythmDays !== undefined && { rhythmDays: data.rhythmDays }),
          ...(data.latitude !== undefined && { latitude: data.latitude }),
          ...(data.longitude !== undefined && { longitude: data.longitude }),
          ...(data.address !== undefined && { address: data.address?.trim() || null }),
          ...(data.directions !== undefined && { directions: data.directions?.trim() || null }),
          ...(data.locatedAt !== undefined && { locatedAt: data.locatedAt }),
          updatedAt: timestamp,
          syncStatus: 'pending',
        })
        .where(eq(students.id, id))
        .returning()
        .get();

      if (data.stage !== undefined && data.stage !== current.stage) {
        tx.insert(stageChanges)
          .values({
            studentId: id,
            fromStage: current.stage,
            toStage: data.stage,
            changedAt: timestamp,
            createdAt: timestamp,
            updatedAt: timestamp,
            syncStatus: 'pending',
          })
          .run();
      }

      if (availability) replaceAvailability(tx, id, availability, timestamp);

      return updated;
    });
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
}

/** Volta a pôr o estudante activo e fecha a pausa em curso. */
async function resume(id: string): Promise<Student | undefined> {
  try {
    const timestamp = now();
    return db.transaction((tx) => {
      tx.update(pauses)
        .set({ resumedAt: timestamp, updatedAt: timestamp, syncStatus: 'pending' })
        .where(and(eq(pauses.studentId, id), isNull(pauses.resumedAt), isNull(pauses.deletedAt)))
        .run();

      return tx
        .update(students)
        .set({ status: 'active', updatedAt: timestamp, syncStatus: 'pending' })
        .where(and(eq(students.id, id), isNull(students.deletedAt)))
        .returning()
        .get();
    });
  } catch (error) {
    console.error('Error resuming student:', error);
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
  getDetail,
  getAll,
  getList,
  quickCreate,
  create,
  updateById,
  resume,
  deleteById,
};
