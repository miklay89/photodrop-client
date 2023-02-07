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

class Dashboard {
  public getAllAlbums: RequestHandler = async (req, res, next) => {
    // TODO user_id + phone
    try {
      res.status(200).json({ message: "get all user albums" });
    } catch (e) {
      next(e);
    }
  };

  public getAlbumById: RequestHandler = async (req, res, next) => {
    // TODO user_id + phone
    try {
      res.status(200).json({ message: "get albums by album id" });
    } catch (e) {
      next(e);
    }
  };
}

export default new Dashboard();
