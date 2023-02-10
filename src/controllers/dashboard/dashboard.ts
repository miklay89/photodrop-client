/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { RequestHandler } from "express";
// import Boom from "@hapi/boom";
// import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import { and, eq, like } from "drizzle-orm/expressions";
import getClientIdFromToken from "../../libs/get_client_id_from_token";
import dbObject from "../../data/db";
import { IAlbum } from "./types";

dotenv.config();

// DB
const db = dbObject.Connector;
const { clientTable, photosTable, albumsTable, clientAlbumsTable } =
  dbObject.Tables;

class DashboardController {
  public getAllAlbums: RequestHandler = async (req, res, next) => {
    // user_id + phone
    const clientId = getClientIdFromToken(
      req.header("Authorization")?.replace("Bearer ", "")!,
    );

    try {
      // get user info + phone
      const user = await db
        .select(clientTable)
        .where(eq(clientTable.clientId, clientId));
      const { phone } = user[0];
      // get all users photo + albums
      const allPhotosAndAlbumsByPhone = await db
        .select(photosTable)
        .innerJoin(albumsTable, eq(photosTable.albumId, albumsTable.albumId))
        .where(like(photosTable.clients, phone));

      const insertData: Array<{ albumId: string; clientId: string }> = [];
      // creating albums data for client users and store to DB
      [
        ...new Set(allPhotosAndAlbumsByPhone.map((d) => d.pd_albums.albumId)),
      ].forEach((e) => {
        insertData.push({ albumId: e, clientId });
      });
      // save albums data in db
      await db
        .insert(clientAlbumsTable)
        .values(...insertData)
        .onConflictDoNothing();

      // get data for response
      const mapped = new Map();
      await db
        .select(clientAlbumsTable)
        .fields({
          albumId: clientAlbumsTable.albumId,
          name: albumsTable.name,
          location: albumsTable.location,
          createdAt: albumsTable.createdAt,
          isUnlocked: clientAlbumsTable.isUnlocked,
          photos: photosTable,
        })
        .innerJoin(
          photosTable,
          eq(photosTable.albumId, clientAlbumsTable.albumId),
        )
        .innerJoin(
          albumsTable,
          eq(albumsTable.albumId, clientAlbumsTable.albumId),
        )
        .where(
          and(
            eq(clientAlbumsTable.clientId, clientId),
            like(photosTable.clients, phone),
          ),
        )
        .then((query) => {
          const uniqAlbumsIds = [...new Set(query.map((q) => q.albumId))];
          const photos = query.map((q) => q.photos);
          // eslint-disable-next-line array-callback-return
          uniqAlbumsIds.map((uaid) => {
            const album = query.find((q) => q.albumId === uaid);
            const reAlb = {
              albumId: album?.albumId,
              name: album?.name,
              location: album?.location,
              createdAt: album?.createdAt,
              isUnlocked: album?.isUnlocked,
              cover: photos.find((p) => p.albumId === uaid)
                ?.unlockedThumbnailUrl,
              photos: photos.filter((p) => p.albumId === uaid),
            };
            mapped.set(uaid, reAlb);
          });
        });
      const verifiedResponse: any[] = [];
      const arrFromMap = Array.from(mapped.values());
      arrFromMap.forEach((a: IAlbum) => {
        if (a.isUnlocked) {
          a.photos.forEach((p) => {
            p.url = p.unlockedPhotoUrl;
            p.thumbnail = p.unlockedThumbnailUrl;
            delete p.lockedPhotoUrl;
            delete p.lockedThumbnailUrl;
            delete p.unlockedPhotoUrl;
            delete p.unlockedThumbnailUrl;
          });
        } else {
          a.photos.forEach((p) => {
            p.url = p.lockedPhotoUrl;
            p.thumbnail = p.lockedThumbnailUrl;
            delete p.lockedPhotoUrl;
            delete p.lockedThumbnailUrl;
            delete p.unlockedPhotoUrl;
            delete p.unlockedThumbnailUrl;
          });
        }
        verifiedResponse.push(a);
      });

      res.status(200).json(verifiedResponse);
    } catch (e) {
      next(e);
    }
  };

  public getAlbumById: RequestHandler = async (req, res, next) => {
    const clientId = getClientIdFromToken(
      req.header("Authorization")?.replace("Bearer ", "")!,
    );
    const { albumId } = req.params;
    console.log(clientId);
    console.log(albumId);
    try {
      // get user info + phone
      const user = await db
        .select(clientTable)
        .where(eq(clientTable.clientId, clientId));
      const { phone } = user[0];

      // get data for response
      const mapped = new Map();
      await db
        .select(clientAlbumsTable)
        .fields({
          albumId: clientAlbumsTable.albumId,
          name: albumsTable.name,
          location: albumsTable.location,
          createdAt: albumsTable.createdAt,
          isUnlocked: clientAlbumsTable.isUnlocked,
          photos: photosTable,
        })
        .innerJoin(
          photosTable,
          eq(photosTable.albumId, clientAlbumsTable.albumId),
        )
        .innerJoin(
          albumsTable,
          eq(albumsTable.albumId, clientAlbumsTable.albumId),
        )
        .where(
          and(
            eq(clientAlbumsTable.clientId, clientId),
            like(photosTable.clients, phone),
            eq(albumsTable.albumId, albumId),
          ),
        )
        .then((query) => {
          const uniqAlbumsIds = [...new Set(query.map((q) => q.albumId))];
          const photos = query.map((q) => q.photos);
          // eslint-disable-next-line array-callback-return
          uniqAlbumsIds.map((uaid) => {
            const album = query.find((q) => q.albumId === uaid);
            const reAlb = {
              albumId: album?.albumId,
              name: album?.name,
              location: album?.location,
              createdAt: album?.createdAt,
              isUnlocked: album?.isUnlocked,
              cover: photos.find((p) => p.albumId === uaid)
                ?.unlockedThumbnailUrl,
              photos: photos.filter((p) => p.albumId === uaid),
            };
            mapped.set(uaid, reAlb);
          });
        });
      const verifiedResponse: any[] = [];
      const arrFromMap = Array.from(mapped.values());
      arrFromMap.forEach((a: IAlbum) => {
        if (a.isUnlocked) {
          a.photos.forEach((p) => {
            p.url = p.unlockedPhotoUrl;
            p.thumbnail = p.unlockedThumbnailUrl;
            delete p.lockedPhotoUrl;
            delete p.lockedThumbnailUrl;
            delete p.unlockedPhotoUrl;
            delete p.unlockedThumbnailUrl;
          });
        } else {
          a.photos.forEach((p) => {
            p.url = p.lockedPhotoUrl;
            p.thumbnail = p.lockedThumbnailUrl;
            delete p.lockedPhotoUrl;
            delete p.lockedThumbnailUrl;
            delete p.unlockedPhotoUrl;
            delete p.unlockedThumbnailUrl;
          });
        }
        verifiedResponse.push(a);
      });

      res.status(200).json(verifiedResponse);
    } catch (e) {
      next(e);
    }
  };
}

export default new DashboardController();
