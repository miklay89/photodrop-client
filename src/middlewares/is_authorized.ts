import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserRepository from "../repositories/user";

dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET;

const isAuthorized: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw Boom.unauthorized("Invalid token.");
    }

    let clientId: string;

    jwt.verify(token, tokenSecret, (err, encoded) => {
      if (err) throw Boom.unauthorized("Token expired");
      clientId = (encoded as { clientId: string; iat: number; exp: number })
        .clientId;
    });

    const user = UserRepository.getUserById(clientId!);

    if (!user) throw Boom.unauthorized("Invalid token.");

    next();
  } catch (err) {
    next(err);
  }
};

export default isAuthorized;
