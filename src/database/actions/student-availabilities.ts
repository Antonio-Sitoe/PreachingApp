import { db } from '../db';
import {
  studentAvailabilities,
  StudentAvailability,
  NewStudentAvailability,
} from '../schemas/student-availabilities';
import { eq } from 'drizzle-orm';

export class StudentAvailabilityActions {
  async create(data: NewStudentAvailability) {
    return db.insert(studentAvailabilities).values(data).returning();
  }

  async getStudentAvailabilities(
    studentId: string
  ): Promise<StudentAvailability[]> {
    return db
      .select()
      .from(studentAvailabilities)
      .where(eq(studentAvailabilities.studentId, studentId));
  }

  async update(id: string, data: Partial<NewStudentAvailability>) {
    return db
      .update(studentAvailabilities)
      .set(data)
      .where(eq(studentAvailabilities.id, id))
      .returning();
  }

  async delete(id: string) {
    return db
      .delete(studentAvailabilities)
      .where(eq(studentAvailabilities.id, id));
  }
}
