import { desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { type INewVisit, type IVisit, visits } from '../schemas';
import { students } from '../schemas';

class VisitsActions {
  async create(data: Omit<INewVisit, 'id'>) {
    try {
      const newVisit = await db
        .insert(visits)
        .values({
          studentsId: data.studentsId,
          notes: data.notes,
          publications: data.publications,
          biblicalTexts: data.biblicalTexts,
          videos: data.videos,
          result: data.result,
          dateAndHours: String(data.dateAndHours),
          createdAt: new Date().toISOString(),
        })
        .returning();

      return newVisit[0];
    } catch (error) {
      console.error('Error creating visit:', error);
      throw error;
    }
  }

  async updateById(id: string, data: Omit<IVisit, 'id'>) {
    try {
      const updatedVisit = await db
        .update(visits)
        .set({
          studentsId: data.studentsId,
          notes: data.notes,
          publications: data.publications,
          biblicalTexts: data.biblicalTexts,
          videos: data.videos,
          result: data.result,
          dateAndHours: data.dateAndHours,
        })
        .where(eq(visits.id, id))
        .returning();

      return updatedVisit[0];
    } catch (error) {
      console.error('Error updating visit:', error);
      throw error;
    }
  }

  async deleteVisitById(id: string) {
    try {
      const deletedVisit = await db
        .delete(visits)
        .where(eq(visits.id, id))
        .returning();

      return deletedVisit[0];
    } catch (error) {
      console.error('Error deleting visit:', error);
      throw error;
    }
  }
  async resetAllVisits() {
    await db.delete(visits);
  }

  async getAll() {
    const allVisits = await db
      .select()
      .from(visits)
      .orderBy(desc(visits.createdAt));
    return allVisits;
  }

  async getById(id: string) {
    const visit = await db.select().from(visits).where(eq(visits.id, id));
    return visit[0];
  }

  async getByStudentId(studentId: string) {
    const studentVisits = await db
      .select()
      .from(visits)
      .where(eq(visits.studentsId, studentId))
      .orderBy(desc(visits.createdAt));
    return studentVisits;
  }

  async getWithStudentInfo() {
    const visitsWithStudents = await db
      .select({
        visit: visits,
        student: students,
      })
      .from(visits)
      .leftJoin(students, eq(visits.studentsId, students.id))
      .orderBy(desc(visits.createdAt));

    return visitsWithStudents;
  }
}

export const visitsAction = new VisitsActions();
