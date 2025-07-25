import { desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { type NewStudent, type Student, students, visits } from '../schemas';

class StudentsActions {
  async create(data: Omit<NewStudent, 'id' | 'createdAt'>) {
    try {
      const newStudent = await db
        .insert(students)
        .values({
          name: data.name,
          age: data.age,
          about: data.about,
          telephone: String(data.telephone),
          email: data.email,
          gender: data.gender,
          address: data.address,
          createdAt: new Date().toISOString(),
        })
        .returning();

      return newStudent[0];
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async deleteWithOwnVisits(studentsId: string) {
    try {
      await db
        .delete(visits)
        .where(eq(visits.studentsId, studentsId))
        .returning();

      const remainingVisits = await db
        .select()
        .from(visits)
        .where(eq(visits.studentsId, studentsId));

      if (remainingVisits.length === 0) {
        const deletedStudent = await db
          .delete(students)
          .where(eq(students.id, studentsId))
          .returning();

        if (deletedStudent.length > 0) {
          return { sucess: true };
        }
      }

      return { sucess: false };
    } catch (error) {
      console.error('Error deleting student and visits:', error);
      throw error;
    }
  }

  async deleteById(id: string) {
    try {
      const deletedStudent = await db
        .delete(students)
        .where(eq(students.id, id))
        .returning();

      return deletedStudent[0];
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  async getAll({ page = 1, pageSize = 10 } = {}) {
    const offset = (page - 1) * pageSize;
    const [{ count }] = await db
      .select({ count: db.$count(students) })
      .from(students);
    const allStudents = await db
      .select()
      .from(students)
      .orderBy(desc(students.createdAt))
      .limit(pageSize)
      .offset(offset);

    return {
      data: allStudents,
      total: Number(count),
      page,
      pageSize,
    };
  }

  async getById(id: string) {
    const student = await db.select().from(students).where(eq(students.id, id));
    return student[0];
  }

  async getWithVisits() {
    const allStudents = await db
      .select()
      .from(students)
      .orderBy(desc(students.createdAt));
    return allStudents;
  }

  async updateById(id: string, data: Omit<Student, 'id' | 'createdAt'>) {
    try {
      const updatedStudent = await db
        .update(students)
        .set({
          name: data.name,
          age: data.age,
          about: data.about,
          telephone: String(data.telephone),
          email: data.email,
          gender: data.gender,
          address: data.address,
        })
        .where(eq(students.id, id))
        .returning();

      return updatedStudent[0];
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }
}

export const studentsAction = new StudentsActions();
