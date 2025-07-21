import { db } from '@/database/db';
import { eq } from 'drizzle-orm';
import { type NewUser, users } from '../schemas';

class UsersActions {
  async getUserById(id: string) {
    const user = await db.select().from(users).where(eq(users.id, id));
    return user[0];
  }

  async getUserByEmail(email: string) {
    const user = await db.select().from(users).where(eq(users.email, email));
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

  async create(data: Omit<NewUser, 'id'>) {
    try {
      const upsertedUser = await db
        .insert(users)
        .values({
          username: data.username,
          email: data.email,
          avatarImage: data.avatarImage,
          profile: data.profile,
          createdAt: new Date().toISOString(),
        })
        .onConflictDoUpdate({
          target: users.email,
          set: {
            username: data.username,
            avatarImage: data.avatarImage,
            profile: data.profile,
          },
        })
        .returning();

      return upsertedUser[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
}

export const usersActions = new UsersActions();
