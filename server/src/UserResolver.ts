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

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hie :D";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    console.log(payload);
    return `your user id is: ${payload!.userId}`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  // this is a bad idea, should do this in a function that can be called...
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);

    return true;
  }

  /* mutations are created to update/create/change in DB */
  @Mutation(() => LoginResponse) // returns LoginResponse
  async login(
    @Arg("email") email: string, // ('') name of graphQL arg, email = variable name, string = type
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

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
    };
  }

  /* mutations are created to update/create/change in DB */
  @Mutation(() => Boolean) // returns boolean, true worked
  async register(
    @Arg("email") email: string, // ('') name of graphQL arg, email = variable name, string = type
    @Arg("password") password: string
  ) {
    const hashedPassword = await hash(password, 12); // technically authentication key, hash again after hashed from client

    const user = await User.findOne({ where: { email } });

    // check if username taken/already exists
    if (user) {
      throw new Error("invalid registration (user already exists!)");
    }

    try {
      await User.insert({
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
