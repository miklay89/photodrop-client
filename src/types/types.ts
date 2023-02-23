import { Request, Response } from "express";
// eslint-disable-next-line import/no-unresolved
import { Send } from "express-serve-static-core";
import { PDCSelfie, PDCClient } from "../data/schema";

export interface SendOtpRequest extends Request {
  body: {
    countryCode: string;
    phoneNumber: string;
  };
}

export interface VerifyOtpRequest extends Request {
  body: {
    countryCode: string;
    phoneNumber: string;
    otp: string;
  };
}

export interface UserWithSelfie {
  pdc_client: PDCClient;
  pdc_selfies: PDCSelfie | null;
}

export interface RefreshTokensRequest extends Request {
  cookies: {
    refreshToken: string;
  };
}

export interface UploadSelfieRequest extends Request {
  body: {
    shiftX: number;
    shiftY: number;
    zoom: number;
    width: number;
    height: number;
  };
}

export interface UpdateUserNameRequest extends Request {
  body: {
    fullName: string;
  };
}

export interface UpdateUserEmailRequest extends Request {
  body: {
    email: string;
  };
}

export interface AlbumsIds {
  albumId: string;
}

export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface TypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}
