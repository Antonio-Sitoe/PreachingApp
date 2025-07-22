import { db } from '@/database/db';
import { eq } from 'drizzle-orm';
import { type NewUser, users } from '../schemas';

class UsersActions {
  async getUserById(id: string) {
    const user = await db.select().from(users).where(eq(users.id, id));
    return user[0];
  }

  async findFirstUser() {
    const user = await db.select().from(users).limit(1);
    return user[0];
  }

  async getAllUsers() {
    const allUsers = await db.select().from(users);
    return allUsers;
  }

  async upsert(data: NewUser) {
    try {
      const hasUser = await this.getAllUsers();
      if (hasUser.length === 0) {
        const user = await db.insert(users).values(data).returning();
        return user[0];
      } else {
        const user = await db
          .update(users)
          .set(data)
          .where(eq(users.id, data.id!))
          .returning();
        return user[0];
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
}

export const usersActions = new UsersActions();
