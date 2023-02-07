import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const tokenSecret = process.env.TOKEN_SECRET as string;

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
