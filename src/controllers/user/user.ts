/* eslint-disable class-methods-use-this */
import { RequestHandler } from "express";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import { eq } from "drizzle-orm/expressions";
import dbObject from "../../data/db";
import uploadFileToS3 from "../../libs/s3";
import convertToPng from "../../libs/convert_to_png";
import thumbnail from "../../libs/thumbnails";
import { IFile } from "./types";
import getClientIdFromToken from "../../libs/get_client_id_from_token";

dotenv.config();

// DB
const db = dbObject.Connector;
const { clientSelfiesTable, clientTable } = dbObject.Tables;

class UserController {
  public uploadSelfie: RequestHandler = async (req, res, next) => {
    // get clientId from headers
    const clientId = getClientIdFromToken(
      req.header("Authorization")?.replace("Bearer ", "")!,
    );

    console.log("selfie", req.body);

    const selfie = req.file as IFile;
    const { shiftX, shiftY, zoom, width, height } = req.body;

    try {
      let file = selfie.buffer;
      let extName = selfie.originalname.split(".").pop()?.toLowerCase()!;
      // check type of selfie if heic convert to png
      if (selfie.originalname.split(".").pop()?.toLowerCase() === "heic") {
        file = await convertToPng(file);
        extName = "png";
      }
      const selfieThumbnail = await thumbnail(file);

      const newSelfie = {
        selfieId: uuid(),
        selfieUrl: await uploadFileToS3(file, extName),
        selfieThumbnail: await uploadFileToS3(selfieThumbnail, "jpeg"),
        shiftX: parseFloat(shiftX) || 0,
        shiftY: parseFloat(shiftY) || 0,
        zoom: parseFloat(zoom) || 0,
        width: parseFloat(width) || 0,
        height: parseFloat(height) || 0,
      };

      // save selfie in DB
      await db.insert(clientSelfiesTable).values(newSelfie);

      // update user info in db
      await db
        .update(clientTable)
        .set({ selfieId: newSelfie.selfieId })
        .where(eq(clientTable.clientId, clientId));

      const updatedUser = await db
        .select(clientTable)
        .leftJoin(
          clientSelfiesTable,
          eq(clientTable.selfieId, clientSelfiesTable.selfieId),
        )
        .where(eq(clientTable.clientId, clientId));

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
    // get clientId from headers
    const clientId = getClientIdFromToken(
      req.header("Authorization")?.replace("Bearer ", "")!,
    );
    const { fullName } = req.body;

    try {
      // save user name
      await db
        .update(clientTable)
        // eslint-disable-next-line object-shorthand
        .set({ fullName: fullName as string })
        .where(eq(clientTable.clientId, clientId));

      const updatedUser = await db
        .select(clientTable)
        .leftJoin(
          clientSelfiesTable,
          eq(clientTable.selfieId, clientSelfiesTable.selfieId),
        )
        .where(eq(clientTable.clientId, clientId));

      res.status(200).json({
        user: updatedUser[0].pdc_client,
        selfie: updatedUser[0].pdc_selfies,
      });
    } catch (e) {
      next(e);
    }
    return null;
  };

  public updateUserEmail: RequestHandler = async (req, res, next) => {
    // get clientId from headers
    const clientId = getClientIdFromToken(
      req.header("Authorization")?.replace("Bearer ", "")!,
    );
    const { email } = req.body;

    try {
      // save user name
      await db
        .update(clientTable)
        // eslint-disable-next-line object-shorthand
        .set({ email: email as string })
        .where(eq(clientTable.clientId, clientId));

      const updatedUser = await db
        .select(clientTable)
        .leftJoin(
          clientSelfiesTable,
          eq(clientTable.selfieId, clientSelfiesTable.selfieId),
        )
        .where(eq(clientTable.clientId, clientId));

      res.status(200).json({
        user: updatedUser[0].pdc_client,
        selfie: updatedUser[0].pdc_selfies,
      });
    } catch (e) {
      next(e);
    }
    return null;
  };
}

export default new UserController();
