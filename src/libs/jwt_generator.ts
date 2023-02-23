import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET;

export default function createTokens(clientId: string) {
  const accessToken = jwt.sign(
    {
      clientId,
    },
    tokenSecret,
    {
      expiresIn: "24h",
    },
  );
  const refreshToken = uuidv4();
  const tokens = {
    accessToken,
    refreshToken,
  };
  return tokens;
}
