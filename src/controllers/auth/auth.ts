/* eslint-disable class-methods-use-this */
import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import { Twilio } from "twilio";
import { eq } from "drizzle-orm/expressions";
import dbObject from "../../data/db";
import createTokens from "../../libs/jwt_generator";
import getClientIdFromToken from "../../libs/get_client_id_from_token";

dotenv.config();
// TWILIO
const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const serviceSid = process.env.TWILIO_SERVICE_SID as string;
const client = new Twilio(accountSid, authToken);

// DB
const db = dbObject.Connector;
const { clientTable, clientSessionsTable, clientSelfiesTable } =
  dbObject.Tables;

class AuthController {
  public sendOtp: RequestHandler = async (req, res, next) => {
    const countryCode = req.body.countryCode as string;
    const phoneNumber = req.body.phoneNumber as string;

    try {
      const otpRes = await client.verify
        .services(serviceSid)
        .verifications.create({
          to: `+${countryCode}${phoneNumber}`,
          channel: "sms",
        });

      res.status(200).json({ message: otpRes });
    } catch (e) {
      next(e);
    }
  };

  // if ok need to return user + selfie
  public verifyOtp: RequestHandler = async (req, res, next) => {
    const { countryCode, phoneNumber, otp } = req.body;

    try {
      // verify otp code
      await client.verify
        .services(serviceSid)
        .verificationChecks.create({
          to: `+${countryCode}${phoneNumber}`,
          code: otp,
        })
        .then((r) => {
          if (!r.valid) throw Boom.badRequest("Invalid otp code.");
        })
        .catch(() => {
          throw Boom.badRequest("Invalid otp code.");
        });

      // checking user in DB
      const user = await db
        .select(clientTable)
        .leftJoin(
          clientSelfiesTable,
          eq(clientTable.selfieId, clientSelfiesTable.selfieId),
        )
        .where(eq(clientTable.phone, `${countryCode}${phoneNumber}`));

      // user exist - creating tokens, session, return user + selfie
      if (user.length) {
        const tokens = createTokens(user[0].pdc_client.clientId);
        const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
        const sessionExpireTimestamp = new Date(refreshTokenExpTime).toJSON();
        const newSession = {
          sessionId: uuid(),
          clientId: user[0].pdc_client.clientId,
          refreshToken: tokens.refreshToken,
          expiresIn: sessionExpireTimestamp as unknown as Date,
        };

        // saving session in DB
        await db.insert(clientSessionsTable).values(newSession);
        // res to user
        return res
          .cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
          })
          .json({
            accessToken: tokens.accessToken,
            user: user[0].pdc_client,
            selfie: user[0].pdc_selfies,
          });
      }

      // user isn't exist - creating user, tokens and session
      const newUser = {
        clientId: uuid(),
        phone: `${countryCode}${phoneNumber}`,
      };

      // saving user in DB
      const savedUser = await db
        .insert(clientTable)
        .values(newUser)
        .returning();
      // creating tokens
      const tokens = createTokens(savedUser[0].clientId);
      const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
      const sessionExpireTimestamp = new Date(refreshTokenExpTime).toJSON();
      // creating session
      const newSession = {
        sessionId: uuid(),
        clientId: savedUser[0].clientId,
        refreshToken: tokens.refreshToken,
        expiresIn: sessionExpireTimestamp as unknown as Date,
      };
      // saving session in DB
      await db.insert(clientSessionsTable).values(newSession);
      // res to user
      return res
        .cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .json({
          accessToken: tokens.accessToken,
          user: savedUser[0],
        });
    } catch (e) {
      next(e);
    }
    return null;
  };

  public refresh: RequestHandler = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken as string;
    const timeStamp = new Date(Date.now()).toJSON();

    try {
      // check existing session in DB
      const sessionIsExist = await db
        .select(clientSessionsTable)
        .where(eq(clientSessionsTable.refreshToken, refreshToken));

      // session isn't exist
      if (!sessionIsExist.length)
        throw Boom.badRequest("Invalid refresh token.");

      // check session expiration
      if (
        Date.parse(timeStamp) >=
        Date.parse(sessionIsExist[0].expiresIn as unknown as string)
      ) {
        // delete old session
        await db
          .delete(clientSessionsTable)
          .where(
            eq(clientSessionsTable.sessionId, sessionIsExist[0].sessionId),
          );

        return res
          .status(401)
          .json(Boom.badRequest("Session is expired, please log-in."));
      }

      // creating new tokens - access and refresh
      const newTokens = createTokens(sessionIsExist[0].clientId);

      // creating new session
      // session expire in - 5 days
      const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
      const sessionExpireTimestamp = new Date(refreshTokenExpTime).toJSON();

      // update session in DB
      const newSession = {
        sessionId: sessionIsExist[0].sessionId,
        clientId: sessionIsExist[0].clientId,
        refreshToken: newTokens.refreshToken,
        expiresIn: sessionExpireTimestamp as unknown as Date,
      };

      // update session in DB
      await db
        .update(clientSessionsTable)
        .set(newSession)
        .where(eq(clientSessionsTable.sessionId, newSession.sessionId));
      // res to user
      return res
        .cookie("refreshToken", newTokens.refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .json({ accessToken: newTokens.accessToken });
    } catch (e) {
      next(e);
    }
    return null;
  };

  public me: RequestHandler = async (req, res, next) => {
    const clientId = getClientIdFromToken(
      req.header("Authorization")?.replace("Bearer ", "")!,
    );
    try {
      const user = await db
        .select(clientTable)
        .leftJoin(
          clientSelfiesTable,
          eq(clientTable.selfieId, clientSelfiesTable.selfieId),
        )
        .where(eq(clientTable.clientId, clientId));

      return res.json({
        user: user[0].pdc_client,
        selfie: user[0].pdc_selfies,
      });
    } catch (e) {
      next(e);
    }
    return null;
  };
}

export default new AuthController();
