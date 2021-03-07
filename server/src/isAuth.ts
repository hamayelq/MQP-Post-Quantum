import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "./MyContext";

// bearer - token

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"]; // read header

  if (!authorization) {
    throw new Error("not authenticated!");
  }

  try {
    const token = authorization.split(" ")[1]; // bearer, token (so token value)
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!); // verify token is correct
    context.payload = payload as any; // set payload inside context
  } catch (err) {
    console.log(err);
    throw new Error("bad token! not authenticated :^(");
  }

  return next();
};
