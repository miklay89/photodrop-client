import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { eq } from "drizzle-orm/expressions";
import dbObject from "../data/db";

dotenv.config();

const db = dbObject.Connector;
const { clientTable } = dbObject.Tables;

const tokenSecret = process.env.TOKEN_SECRET as string;

const isAuthorized: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw Boom.unauthorized("Invalid token.");
    }

    let decode;

    jwt.verify(token, tokenSecret, (err, encoded) => {
      if (err) throw Boom.unauthorized("Token expired");
      decode = encoded;
    });

    const user = await db
      .select(clientTable)
      .where(eq(clientTable.clientId, (decode as any).clientId));

    if (!user.length) throw Boom.unauthorized("Invalid token.");

    next();
  } catch (err) {
    next(err);
  }
};

export default isAuthorized;
