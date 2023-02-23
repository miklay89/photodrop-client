import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET as string;

const getClientIdFromToken = (token: string): string => {
  const decode = jwt.verify(token, tokenSecret);
  return (decode as { clientId: string; iat: number; exp: number }).clientId;
};

export default getClientIdFromToken;
