import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import getClientIdFromToken from "../../libs/get_client_id_from_token";
import UserRepository from "../../repositories/user";
import AlbumRepository from "../../repositories/album";
import { TypedResponse } from "../../types/types";
import Album from "../../entities/album";

export default class DashboardController {
  static getAllAlbums: RequestHandler = async (
    req,
    res: TypedResponse<Album[]>,
    next,
  ) => {
    const clientId = getClientIdFromToken(
      req.header("Authorization")?.replace("Bearer ", "")!,
    );

    try {
      const user = await UserRepository.getUserById(clientId);
      if (!user) throw Boom.notFound();
      let { phone } = user[0].pdc_client;
      if (phone[0] === "+") phone = phone.slice(1);

      const albumsIds = await AlbumRepository.getAlbumsByPhone(phone);

      if (albumsIds) {
        const uniqAlbumsIds = [...new Set(albumsIds.map((a) => a.albumId))];
        uniqAlbumsIds.map((albumId) =>
          AlbumRepository.getUserAlbumByUserIdAndAlbumId(
            clientId,
            albumId,
          ).then(async (query) => {
            if (!query) {
              await AlbumRepository.createRecordUserAlbum(clientId, albumId);
            }
          }),
        );
      }

      const albumsWithPhotos =
        await AlbumRepository.getAllAlbumsWithPhotosByUserIdAndPhone(
          clientId,
          phone,
        );

      if (!albumsWithPhotos) throw Boom.notFound();

      res.status(200).json(albumsWithPhotos);
    } catch (e) {
      next(e);
    }
  };

  static getAlbumById: RequestHandler = async (
    req,
    res: TypedResponse<Album>,
    next,
  ) => {
    const clientId = getClientIdFromToken(
      req.header("Authorization")?.replace("Bearer ", "")!,
    );
    const { albumId } = req.params;

    try {
      const user = await UserRepository.getUserById(clientId);
      if (!user) throw Boom.notFound();
      let { phone } = user[0].pdc_client;
      if (phone[0] === "+") phone = phone.slice(1);

      const albumWithPhotos =
        await AlbumRepository.getAllAlbumWithPhotosByUserIdAndPhoneAndAlbumId(
          clientId,
          phone,
          albumId,
        );

      if (!albumWithPhotos) throw Boom.notFound();

      res.status(200).json(albumWithPhotos);
    } catch (e) {
      next(e);
    }
  };
}
