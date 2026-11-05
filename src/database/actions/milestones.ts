import { and, desc, eq, isNull } from 'drizzle-orm';
import { db } from '../db';
import { type Milestone, milestones } from '../schemas';
import type { MilestoneInput } from '../@types';

const now = () => new Date().toISOString();

/** Os marcos do estudante, do mais recente para o mais antigo. */
async function getByStudent(studentId: string): Promise<Milestone[]> {
  return db
    .select()
    .from(milestones)
    .where(and(eq(milestones.studentId, studentId), isNull(milestones.deletedAt)))
    .orderBy(desc(milestones.occurredAt), desc(milestones.createdAt));
}

async function create(input: MilestoneInput): Promise<Milestone> {
  const label = input.label.trim();
  if (!label) throw new Error('Escreve o que aconteceu.');

  try {
    const timestamp = now();
    const rows = await db
      .insert(milestones)
      .values({
        studentId: input.studentId,
        type: input.type ?? 'custom',
        label,
        occurredAt: input.occurredAt,
        createdAt: timestamp,
        updatedAt: timestamp,
        syncStatus: 'pending',
      })
      .returning();
    return rows[0];
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
}

export const milestonesActions = {
  getByStudent,
  create,
};
