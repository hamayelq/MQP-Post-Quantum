import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "./entity/User";
import { hash, compare } from "bcryptjs";
import { MyContext } from "./MyContext";
import { createAccessToken, createRefreshToken } from "./auth";
import { isAuth } from "./isAuth";
import { sendRefreshToken } from "./sendRefreshToken";
import { getConnection } from "typeorm";
import { verify } from "jsonwebtoken";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hie :D";
  }

  // bye!
  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return `Your user id is: ${payload!.userId}`;
  }

  // find users in db
  @Query(() => [User])
  users() {
    return User.find();
  }

  // return currently logged in user
  @Query(() => User, { nullable: true })
  me(@Ctx() context: MyContext) {
    // console.log(context.req.headers.authorization);
    const authorization = context.req.headers.authorization; // read header

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1]; // bearer, token (so token value)
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!); // verify token is correct
      context.payload = payload as any; // set payload inside context
      return User.findOne(payload.userId);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  // this is a bad idea, should do this in a function that can be called...
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }

  // login a user
  @Mutation(() => LoginResponse) // returns LoginResponse
  async login(
    @Arg("username") username: string, // ('') name of graphQL arg, username = variable name, string = type
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { username } });

    // login error
    // username incorrect/does not exist
    if (!user) {
      throw new Error("invalid login (user does not exist)");
    }

    const valid = await compare(password, user.password);

    //password invalid
    if (!valid) {
      throw new Error("invalid login (incorrect password)");
    }

    // login success
    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, "");
    // or
    // res.clearCookie
    return true;
  }

  // register a user
  @Mutation(() => Boolean) // returns boolean, true worked
  async register(
    @Arg("email") email: string,
    @Arg("username") username: string, // ('') name of graphQL arg, username = variable name, string = type
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password, 12); // technically authentication key, hash again after hashed from client

    const user = await User.findOne({ where: { username } });

    // check if username taken/already exists
    if (user) {
      throw new Error("invalid registration (user already exists!)");
    }

    try {
      await User.insert({
        username,
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}
