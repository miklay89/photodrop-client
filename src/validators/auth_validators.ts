/* eslint-disable class-methods-use-this */
import Joi from "joi";
import Boom from "@hapi/boom";
import { RequestHandler } from "express";

class AuthValidator {
  // auth/sing-in/send-otp body validation
  public checkSendOtpBody: RequestHandler = (req, res, next) => {
    try {
      const schema = Joi.object({
        phoneNumber: Joi.number().required(),
        countryCode: Joi.number().required(),
      });

      const value = schema.validate(req.body);
      if (value.error?.message) throw Boom.badData(value.error?.message);
      next();
    } catch (err) {
      next(err);
    }
  };

  // auth/sign-in/verify-otp body validation
  public checkVerifyOtpBody: RequestHandler = (req, res, next) => {
    try {
      const schema = Joi.object({
        phoneNumber: Joi.number().required(),
        countryCode: Joi.number().required(),
        otp: Joi.number().required(),
      });

      const value = schema.validate(req.body);
      if (value.error?.message) throw Boom.badData(value.error?.message);
      next();
    } catch (err) {
      next(err);
    }
  };

  // auth/refresh
  public checkCookies: RequestHandler = (req, res, next) => {
    try {
      const schema = Joi.object({
        refreshToken: Joi.string().required(),
      });

      const value = schema.validate(req.cookies);
      if (value.error?.message) throw Boom.badData(value.error?.message);
      next();
    } catch (err) {
      next(err);
    }
  };
}

export default new AuthValidator();
