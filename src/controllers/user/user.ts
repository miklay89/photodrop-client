import { RequestHandler } from "express";
import { v4 as uuid } from "uuid";
import Boom from "@hapi/boom";
import uploadFileToS3 from "../../libs/s3";
import convertToPng from "../../libs/convert_to_png";
import thumbnail from "../../libs/thumbnails";
import {
  File,
  TypedResponse,
  UpdateUserEmailRequest,
  UpdateUserNameRequest,
  UploadSelfieRequest,
} from "../../types/types";
import getClientIdFromToken from "../../libs/get_client_id_from_token";
import Selfie from "../../entities/selfie";
import SelfieRepository from "../../repositories/selfie";
import UserRepository from "../../repositories/user";
import { PDCClient, PDCSelfie } from "../../data/schema";

export default class UserController {
  static uploadSelfie: RequestHandler = async (
    req: UploadSelfieRequest,
    res: TypedResponse<{ user: PDCClient; selfie: PDCSelfie | null }>,
    next,
  ) => {
    const clientId = getClientIdFromToken(
      req.header("Authorization")?.replace("Bearer ", "")!,
    );

    const selfie = req.file as File;
    const { shiftX, shiftY, zoom, width, height } = req.body;

    try {
      let file = selfie.buffer;
      let extName = selfie.originalname.split(".").pop()?.toLowerCase()!;

      if (selfie.originalname.split(".").pop()?.toLowerCase() === "heic") {
        file = await convertToPng(file);
        extName = "png";
      }

      const selfieThumbnail = await thumbnail(file);

      const newSelfie = new Selfie(
        uuid(),
        await uploadFileToS3(file, extName),
        await uploadFileToS3(selfieThumbnail, "jpeg"),
        shiftX || 0,
        shiftY || 0,
        zoom || 0,
        width || 0,
        height || 0,
      );

      await SelfieRepository.saveSelfie(newSelfie);
      await UserRepository.updateUserSelfie(newSelfie.selfieId, clientId);
      const updatedUser = await UserRepository.getUserById(clientId);

      if (!updatedUser) throw Boom.notFound();

      res.status(200).json({
        user: updatedUser[0].pdc_client,
        selfie: updatedUser[0].pdc_selfies,
      });
    } catch (e) {
      next(e);
    }
  };

  static updateUserName: RequestHandler = async (
    req: UpdateUserNameRequest,
    res: TypedResponse<{ user: PDCClient; selfie: PDCSelfie | null }>,
    next,
  ) => {
    const clientId = getClientIdFromToken(
      req.header("Authorization")?.replace("Bearer ", "")!,
    );
    const { fullName } = req.body;

    try {
      await UserRepository.updateUserName(fullName, clientId);

      const updatedUser = await UserRepository.getUserById(clientId);

      if (!updatedUser) throw Boom.notFound();

      res.status(200).json({
        user: updatedUser[0].pdc_client,
        selfie: updatedUser[0].pdc_selfies,
      });
    } catch (e) {
      next(e);
    }
  };

  static updateUserEmail: RequestHandler = async (
    req: UpdateUserEmailRequest,
    res: TypedResponse<{ user: PDCClient; selfie: PDCSelfie | null }>,
    next,
  ) => {
    const clientId = getClientIdFromToken(
      req.header("Authorization")?.replace("Bearer ", "")!,
    );
    const { email } = req.body;

    try {
      // save user name
      await UserRepository.updateUserEmail(email, clientId);

      const updatedUser = await UserRepository.getUserById(clientId);

      if (!updatedUser) throw Boom.notFound();

      res.status(200).json({
        user: updatedUser[0].pdc_client,
        selfie: updatedUser[0].pdc_selfies,
      });
    } catch (e) {
      next(e);
    }
  };
}
