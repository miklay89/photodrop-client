import { eq } from "drizzle-orm/expressions";
import Session from "../entities/session";
import dbObject from "../data/db";
import { PDCSession } from "../data/schema";

const db = dbObject.Connector;
const { clientSessionsTable } = dbObject.Tables;

export default class SessionRepository {
  static async saveSession(newSession: Session): Promise<void> {
    await db.insert(clientSessionsTable).values(newSession);
  }

  static async getSessionByRefreshToken(
    refreshToken: string,
  ): Promise<PDCSession[] | null> {
    const session = await db
      .select(clientSessionsTable)
      .where(eq(clientSessionsTable.refreshToken, refreshToken));
    if (!session.length) return null;
    return session;
  }

  static async deleteSessionById(id: string): Promise<void> {
    await db
      .delete(clientSessionsTable)
      .where(eq(clientSessionsTable.sessionId, id));
  }

  static async updateSessionById(
    newSession: PDCSession,
    id: string,
  ): Promise<void> {
    await db
      .update(clientSessionsTable)
      .set(newSession)
      .where(eq(clientSessionsTable.sessionId, id));
  }
}
