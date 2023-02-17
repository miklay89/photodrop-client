/* eslint-disable class-methods-use-this */
import { RequestHandler } from "express";
import Stripe from "stripe";
import Boom from "@hapi/boom";
import { eq, and, like } from "drizzle-orm/expressions";
import dotenv from "dotenv";
import getClientIdFromToken from "../../libs/get_client_id_from_token";
import { IPaymentObject } from "./types";
import dbObject from "../../data/db";

dotenv.config();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;
const REDIRECT_URL = process.env.REDIRECT_URL as string;
const REDIRECT_FE_URL = process.env.REDIRECT_FE_URL as string;

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });

// DB
const db = dbObject.Connector;
const { clientTable, clientAlbumsTable, albumsTable, photosTable } =
  dbObject.Tables;

class PayController {
  public createPaymentForAlbum: RequestHandler = async (req, res, next) => {
    // user id from header
    const clientId = getClientIdFromToken(
      req.header("Authorization")?.replace("Bearer ", "")!,
    );
    const { albumId } = req.params;

    // get album data and price
    // create payment link
    try {
      // get user from db
      const user = await db
        .select(clientTable)
        .where(eq(clientTable.clientId, clientId));

      let { phone } = user[0];
      if (phone[0] === "+") phone = phone.slice(1);

      const paymentObject: IPaymentObject[] = [];

      // get data for creating price
      await db
        .select(clientAlbumsTable)
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
            like(photosTable.clients, `%${phone}%`),
            eq(albumsTable.albumId, albumId),
          ),
        )
        .then((query) => {
          if (!query.length) throw Boom.notFound();
          const sorted = {
            albumInfo: query[0].pd_albums,
            count: query.map((q) => q.pd_photos).length,
          };
          paymentObject.push(sorted);
        });

      const product = await stripe.products.create({
        name: paymentObject[0].albumInfo.name!,
      });

      const price = await stripe.prices.create({
        currency: "usd",
        unit_amount: 500,
        product: product.id,
      });

      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
        after_completion: {
          type: "redirect",
          redirect: {
            url: `${REDIRECT_URL}/pay/album/confirm-payment/${albumId}/${clientId}`,
          },
        },
      });

      res.status(200).json(paymentLink.url);
    } catch (e) {
      next(e);
    }
  };

  public confirmPaymentForAlbum: RequestHandler = async (req, res, next) => {
    const { albumId, clientId } = req.params;
    try {
      // update album state
      await db
        .update(clientAlbumsTable)
        .set({ isUnlocked: true })
        .where(
          and(
            eq(clientAlbumsTable.clientId, clientId),
            eq(clientAlbumsTable.albumId, albumId),
          ),
        );
      res.status(303).redirect(`${REDIRECT_FE_URL}${albumId}`);
    } catch (e) {
      next(e);
    }
  };
}

export default new PayController();
