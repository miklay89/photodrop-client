/* eslint-disable class-methods-use-this */
import { RequestHandler } from "express";
// import Boom from "@hapi/boom";
// import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
// import { eq } from "drizzle-orm/expressions";
// import dbObject from "../../data/db";

dotenv.config();

// DB
// const db = dbObject.Connector;
// const { clientTable, clientSessionsTable, clientSelfiesTable } =
//   dbObject.Tables;

class PayController {
  public payForAlbum: RequestHandler = async (req, res, next) => {
    try {
      // TODO
      // use sprite
      res.status(200).json({ message: "pay for album" });
    } catch (e) {
      next(e);
    }
  };
}

export default new PayController();
