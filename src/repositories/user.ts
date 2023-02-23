import { eq } from "drizzle-orm/expressions";
import dbObject from "../data/db";
import User from "../entities/user";
import { UserWithSelfie } from "../types/types";

const db = dbObject.Connector;
const { clientTable, clientSelfiesTable } = dbObject.Tables;

export default class UserRepository {
  static async getUserByPhone(phone: string): Promise<UserWithSelfie[] | null> {
    const user = await db
      .select(clientTable)
      .leftJoin(
        clientSelfiesTable,
        eq(clientTable.selfieId, clientSelfiesTable.selfieId),
      )
      .where(eq(clientTable.phone, phone));
    if (!user.length) return null;
    return user;
  }

  static async saveUser(newUser: User): Promise<void> {
    await db.insert(clientTable).values(newUser);
  }

  static async getUserById(id: string): Promise<UserWithSelfie[] | null> {
    const user = await db
      .select(clientTable)
      .leftJoin(
        clientSelfiesTable,
        eq(clientTable.selfieId, clientSelfiesTable.selfieId),
      )
      .where(eq(clientTable.clientId, id));
    if (!user.length) return null;
    return user;
  }

  static async updateUserSelfie(
    selfieId: string,
    userId: string,
  ): Promise<void> {
    await db
      .update(clientTable)
      // eslint-disable-next-line object-shorthand
      .set({ selfieId: selfieId })
      .where(eq(clientTable.clientId, userId));
  }

  static async updateUserName(name: string, userId: string): Promise<void> {
    await db
      .update(clientTable)
      .set({ fullName: name })
      .where(eq(clientTable.clientId, userId));
  }

  static async updateUserEmail(email: string, userId: string): Promise<void> {
    await db
      .update(clientTable)
      // eslint-disable-next-line object-shorthand
      .set({ email: email })
      .where(eq(clientTable.clientId, userId));
  }
}
