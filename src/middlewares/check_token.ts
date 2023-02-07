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

const checkTokens: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw Boom.unauthorized("Invalid token.");
    }

    const decode = jwt.verify(token, tokenSecret);

    if (typeof decode === "string") throw Boom.unauthorized("Invalid token.");

    const { clientId } = decode;

    const user = await db
      .select(clientTable)
      .where(eq(clientTable.clientId, clientId));

    if (!user.length) throw Boom.unauthorized("Invalid token");

    req.body.decode = decode;
    next();
  } catch (err) {
    next(err);
  }
};

export default checkTokens;
