/* eslint-disable class-methods-use-this */
import { RequestHandler } from "express";
// import Boom from "@hapi/boom";
// import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import { and, eq, like } from "drizzle-orm/expressions";
import getClientIdFromToken from "../../libs/get_client_id_from_token";
import dbObject from "../../data/db";

dotenv.config();

// DB
const db = dbObject.Connector;
const { clientTable, photosTable, albumsTable, clientAlbumsTable } =
  dbObject.Tables;

class DashboardController {
  public getAllAlbums: RequestHandler = async (req, res, next) => {
    // TODO user_id + phone
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
      const data = await db
        .select(photosTable)
        .innerJoin(albumsTable, eq(photosTable.albumId, albumsTable.albumId))
        .where(like(photosTable.clients, phone));

      const insertData: Array<{ albumId: string; clientId: string }> = [];
      // creating albums data for client users and store to DB
      [...new Set(data.map((d) => d.pd_albums.albumId))].forEach((e) => {
        insertData.push({ albumId: e, clientId });
      });
      // save albums data in db
      await db
        .insert(clientAlbumsTable)
        .values(...insertData)
        .onConflictDoNothing();

      // get data for response
      // const resArr: any[] = [];
      const albumsAndPhotos = await db
        .select(clientAlbumsTable)
        .innerJoin(
          photosTable,
          eq(photosTable.albumId, clientAlbumsTable.albumId),
        )
        .where(
          and(
            eq(clientAlbumsTable.clientId, clientId),
            like(photosTable.clients, phone),
          ),
        );

      console.log(albumsAndPhotos);

      res.status(200).json("ok");
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

export default new DashboardController();
