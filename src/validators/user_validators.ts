import Joi from "joi";
import Boom from "@hapi/boom";
import { RequestHandler } from "express";

// user/update-name body validation
export const checkUpdateNameBody: RequestHandler = (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    const value = schema.validate(req.body);
    if (value.error?.message) throw Boom.badData(value.error?.message);
    next();
  } catch (err) {
    next(err);
  }
};

// user/update-email body validation
export const checkUpdateEmailBody: RequestHandler = (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().required(),
    });

    const value = schema.validate(req.body);
    if (value.error?.message) throw Boom.badData(value.error?.message);
    next();
  } catch (err) {
    next(err);
  }
};

// user/upload-selfie body validation
export const checkUploadSelfieBody: RequestHandler = (req, res, next) => {
  try {
    const bodySchema = Joi.object({
      shiftX: Joi.number().required(),
      shiftY: Joi.number().required(),
      zoom: Joi.number().required(),
      width: Joi.number().required(),
      height: Joi.number().required(),
    });

    const fileSchema = Joi.object().required().label("files");

    const valueBody = bodySchema.validate(req.body);
    if (valueBody.error?.message) throw Boom.badData(valueBody.error?.message);

    const valueFile = fileSchema.validate(req.file);
    if (valueFile.error?.message) throw Boom.badData(valueFile.error?.message);

    next();
  } catch (err) {
    next(err);
  }
};
