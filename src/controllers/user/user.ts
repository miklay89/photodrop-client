// TODO
// /upload selfie + shift x, shift y, zoom, width, height fields in selfie table

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

class User {
  public uploadSelfie: RequestHandler = async (req, res, next) => {
    // TODO use s3
    try {
      res.status(200).json({ message: "upload selfie" });
    } catch (e) {
      next(e);
    }
  };

  public updateUserName: RequestHandler = async (req, res, next) => {
    // TODO
    try {
      res.status(200).json({ message: "update user name" });
    } catch (e) {
      next(e);
    }
  };

  public updateUserEmail: RequestHandler = async (req, res, next) => {
    // TODO
    try {
      res.status(200).json({ message: "update user email" });
    } catch (e) {
      next(e);
    }
  };
}

export default new User();
