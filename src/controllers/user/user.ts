/* eslint-disable class-methods-use-this */
import { RequestHandler } from "express";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import { eq } from "drizzle-orm/expressions";
import dbObject from "../../data/db";
import uploadFileToS3 from "../../libs/s3";
import convertToPng from "../../libs/convert_to_png";
import { IFile } from "./types";
import getClientIdFromToken from "../../libs/get_client_id_from_token";

dotenv.config();

// DB
const db = dbObject.Connector;
const { clientSelfiesTable, clientTable } = dbObject.Tables;

class User {
  public uploadSelfie: RequestHandler = async (req, res, next) => {
    // get clientId from headers
    const clientId = getClientIdFromToken(
      req.header("Authorization")?.replace("Bearer ", "")!,
    );

    const selfie = req.file as IFile;
    const { shiftX, shiftY, zoom, width, height } = req.body;

    try {
      let file = selfie.buffer;
      let extName = selfie.originalname.split(".").pop()?.toLowerCase()!;
      // check type of selfie if heic convert to png
      if (selfie.originalname.split(".").pop()?.toLowerCase() === "heic") {
        file = await convertToPng(file);
        extName = "png";
        console.log("file converted to png");
      }

      const newSelfie = {
        selfieId: uuid(),
        selfieUrl: await uploadFileToS3(file, extName),
        shiftX: +shiftX || 0,
        shiftY: +shiftY || 0,
        zoom: +zoom || 0,
        width: +width || 0,
        height: +height || 0,
      };

      // save selfie in DB
      const storedSelfie = await db
        .insert(clientSelfiesTable)
        .values(newSelfie)
        .returning();

      // update user info in db
      await db
        .update(clientTable)
        .set({ selfieId: storedSelfie[0].selfieId })
        .where(eq(clientTable.clientId, clientId));

      const updatedUser = await db
        .select(clientTable)
        .leftJoin(
          clientSelfiesTable,
          eq(clientTable.selfieId, clientSelfiesTable.selfieId),
        );

      // res to user
      return res.status(200).json({
        user: updatedUser[0].pdc_client,
        selfie: updatedUser[0].pdc_selfies,
      });
    } catch (e) {
      next(e);
    }
    return null;
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
