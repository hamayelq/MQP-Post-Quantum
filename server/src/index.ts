import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";
import cors from "cors";
import { MessageResolver } from "./resolvers/MessageResolver";

/* lambda function, logic to start server */
(async () => {
  const app = express();

  /* fixing cors shenanigans */
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(cookieParser());

  app.get("/", (_req, res) => res.send("Hello\n")); // checking if express is working as expected

  /* cookie only works on this route, for security 
     purposes, sent only if refreshing */
  app.post("/refresh_token", async (req, res) => {
    console.log("refresh", req.cookies);
    const token = req.cookies.jid;

    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (e) {
      console.log(e);
      return res.send({ ok: false, accessToken: "" });
    }

    const user = await User.findOne({ id: payload.userId });

    console.log("payload:", payload);
    console.log("USER:", user);
    if (!user) {
      console.log("NO USER!");
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      console.log("TOKEN VERSION NOT MATCH!");
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  await createConnection(); // getting entitites and connection info (from ormconfig.json)

  /* defining GraphQL specifics */
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, MessageResolver],
    }),
    context: ({ req, res }) => ({ req, res }), // global context
  });

  /* applying GraphQL to express server */
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("express server started\n");
  });
})();
