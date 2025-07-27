import { db } from '../db';
import { studentAvailabilities } from '../schemas/student-availabilities';
import type {
  StudentAvailability,
  NewStudentAvailability,
} from '../schemas/student-availabilities';
import { eq } from 'drizzle-orm';

class StudentAvailabilityActions {
  async create(data: NewStudentAvailability) {
    return await db
      .insert(studentAvailabilities)
      .values({
        id: data.id,
        weekday: data.weekday,
        studentId: data.studentId,
        hour: data.hour,
        minute: data.minute,
        title: data.title,
        body: data.body,
        isActive: data.isActive,
      })
      .returning();
  }

  async getAll(): Promise<StudentAvailability[]> {
    return db.select().from(studentAvailabilities);
  }

  async getByStudentId(studentId: string): Promise<StudentAvailability[]> {
    try {
      return db
        .select()
        .from(studentAvailabilities)
        .where(eq(studentAvailabilities.studentId, studentId));
    } catch (error) {
      console.error('Error fetching student availabilities:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<NewStudentAvailability>) {
    return db
      .update(studentAvailabilities)
      .set({
        ...data,
      })
      .where(eq(studentAvailabilities.id, id))
      .returning();
  }

  async delete(id: string) {
    return await db
      .delete(studentAvailabilities)
      .where(eq(studentAvailabilities.id, id))
      .returning();
  }

  async deleteAllForStudent(studentId: string) {
    return db
      .delete(studentAvailabilities)
      .where(eq(studentAvailabilities.studentId, studentId));
  }

  async clear() {
    return db.delete(studentAvailabilities);
  }
}

export const availabilitiesAction = new StudentAvailabilityActions();
