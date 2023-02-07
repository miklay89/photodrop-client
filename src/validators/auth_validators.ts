import Joi from "joi";
import Boom from "@hapi/boom";
import { RequestHandler } from "express";

// auth/sing-in/send-otp body validation
export const checkSendOtpBody: RequestHandler = (req, res, next) => {
  const schema = Joi.object({
    phoneNumber: Joi.number().required(),
    countryCode: Joi.number().required(),
  });

  const value = schema.validate(req.body);
  if (value.error?.message) throw Boom.badData(value.error?.message);
  next();
};

// auth/sign-in/verify-otp body validation
export const checkVerifyOtpBody: RequestHandler = (req, res, next) => {
  const schema = Joi.object({
    phoneNumber: Joi.number().required(),
    countryCode: Joi.number().required(),
    otp: Joi.number().required(),
  });

  const value = schema.validate(req.body);
  if (value.error?.message) throw Boom.badData(value.error?.message);
  next();
};

// auth/refresh
export const checkCookies: RequestHandler = (req, res, next) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required(),
  });

  const value = schema.validate(req.cookies);
  if (value.error?.message) throw Boom.badData(value.error?.message);
  next();
};
