import Selfie from "../entities/selfie";
import dbObject from "../data/db";

const db = dbObject.Connector;
const { clientSelfiesTable } = dbObject.Tables;

export default class SelfieRepository {
  static async saveSelfie(newSelfie: Selfie): Promise<void> {
    await db.insert(clientSelfiesTable).values(newSelfie);
  }
}
