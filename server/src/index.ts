import "reflect-metadata";
// import {createConnection} from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./UserResolver";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";

/* lambda function, logic to start server */
(async () => {
  const app = express();
  app.use(cookieParser());
  app.get("/", (_req, res) => res.send("Hello\n")); // checking if express is working as expected

  /* cookie only works on this route, for security 
     purposes, sent only if refreshing */
  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.tokenid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    /* check if token is valid/not expired */
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      // if error, return ok false :)
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }

    /* if here, we know token is valid and we can return
     access token */

    const user = await User.findOne({ id: payload.userId });

    /* just in case user isn't found */
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    /* if token version does not match payload token version
       token is invalid. kind of like stack canaries? */
    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    /* creates a new refresh token, might want to remove this
       actually. want to make chat app as secure as possible.
       perhaps we want to force the user to sign in again every
       few minutes */
    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  await createConnection(); // getting entitites and connection info (from ormconfig.json)

  /* defining GraphQL specifics */
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }), // global context
  });

  /* applying GraphQL to express server */
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("express server started\n");
  });
})();
