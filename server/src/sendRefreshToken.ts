import { Response } from "express";

/* When access token expires, create new access token */
export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("tokenid", token, {
    httpOnly: true,
  });
};
