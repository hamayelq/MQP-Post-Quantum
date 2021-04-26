import { sign } from "jsonwebtoken";
import { User } from "../entity/User";
import "dotenv/config";

export const createAccessToken = (user: User) => {
  /* sign takes parameters to be stored in JWT, and a secret
     which is a random string - generate this randomly rather
     than hardcoded (currently) */
  return sign(
    { userId: user.uuid },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" } // expires in 15 minutes (should be short, refresh later)
  );
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.uuid, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!, // needs to be different secret
    { expiresIn: "7d" } // for cookie, keep signed in for 7d
  );
};
