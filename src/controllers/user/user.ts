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

class UserController {
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
      // TODO delete
      console.log("user", JSON.stringify(updatedUser[0].pdc_client));
      console.log("selfie", JSON.stringify(updatedUser[0].pdc_selfies));

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
