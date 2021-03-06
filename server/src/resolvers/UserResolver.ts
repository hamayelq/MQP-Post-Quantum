import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entity/User";
import { hash, compare } from "bcryptjs";
import { MyContext } from "../MyContext";
import { createAccessToken, createRefreshToken } from "../auth/auth";
import { isAuth } from "../auth/isAuth";
import { sendRefreshToken } from "../auth/sendRefreshToken";
import { getConnection } from "typeorm";
import { verify } from "jsonwebtoken";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field()
  encryptedPrivateKey: string;
  @Field()
  publicKey: string;
  @Field(() => User)
  user: User;
}

export type contextType = {
  user: User;
};

@Resolver()
export class UserResolver {
  // bye!
  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return `Your user id is: ${payload!.uuid}`;
  }

  // find users in db
  @Query(() => [User])
  async getUsers(@Arg("uuid") uuid: string) {
    const user = await User.findOne({ where: { uuid: uuid } });

    if (!user) {
      return [];
    }

    console.log(
      `getUsers request made by user with uuid ${uuid ? uuid : "NULL"}`
    );

    const users = await User.find();
    const filteredUsers: User[] = users.filter((user) => user.uuid !== uuid);
    return filteredUsers;
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
  async revokeRefreshTokensForUser(
    @Arg("userId", () => String) userId: string
  ) {
    await getConnection()
      .getRepository(User)
      .increment({ uuid: userId }, "tokenVersion", 1);

    return true;
  }

  // login a user
  @Mutation(() => LoginResponse) // returns LoginResponse
  async login(
    @Arg("username") username: string,
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
      console.log("Invalid login attempt: ", username, password);
      throw new Error("invalid login (incorrect password)");
    }

    if (valid) {
      console.log("Valid login attempt");
    }

    // login success
    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      encryptedPrivateKey: user.encryptedPrivateKey,
      publicKey: user.publicKey,
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    try {
      sendRefreshToken(res, "");
      // or
      // res.clearCookie
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // register a user
  @Mutation(() => Boolean) // returns boolean, true worked
  async register(
    @Arg("email") email: string,
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Arg("publicKey") publicKey: string,
    @Arg("encryptedPrivateKey") encryptedPrivateKey: string
  ) {
    const hashedPassword = await hash(password, 12);

    const userByName = await User.findOne({ where: { username } });
    const userByEmail = await User.findOne({ where: { email } });

    // check if username/email taken/already exists
    if (userByName || userByEmail) {
      throw new Error("exists");
    }

    try {
      await User.insert({
        username,
        email,
        password: hashedPassword,
        publicKey,
        encryptedPrivateKey,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}
