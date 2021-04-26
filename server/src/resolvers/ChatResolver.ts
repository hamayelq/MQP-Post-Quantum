import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Chat } from "../entity/Chat";

export type contextType = {
  user: User;
};

@Resolver()
export class ChatResolver {
  @Mutation(() => Boolean)
  async createChat(
    @Arg("memberIds", () => [String]) memberIds: string[],
    @Arg("userId") userId: string
  ) {
    try {
      const user = await User.findOne({ where: { uuid: userId } });

      if (!user) throw new Error("getChats: user not authorized");

      if (memberIds.length == 1) {
        const userRepo = await this.getUserRepo(userId);

        for (let chat of userRepo.chats) {
          if (chat.members.length == 2) {
            const chatExist = chat.members.filter(
              (member) => member.uuid == memberIds[0]
            );
            if (chatExist.length >= 1) return true;
          }
        }
      }

      const members = await this.getUserObject(memberIds);

      return await this.createNewChat([...members, user]);
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async createNewChat(members: User[]) {
    try {
      // const chats: Chat[] = getRepository(Chat);

      const chat = Chat.create({ members: [...members], lastMessage: "" });
      await chat.save();
      return true;
    } catch (err) {
      console.log("Save Chat FAILED\n");
      console.log(err);
      return false;
    }
  }

  @Query(() => [Chat])
  async getChats(@Arg("userId") userId: string) {
    console.log(
      `getChats request made by user with uuid ${userId ? userId : "NULL"}`
    );

    try {
      const user = await User.findOne({ where: { uuid: userId } });

      if (!user) throw new Error("getChats: user not authorized");

      const userRepo = await this.getUserRepo(userId);

      const chats = [];
      for (let chat of userRepo.chats) {
        if (chat.members.length == 1) {
          await chat.remove();
        } else if (!chat.name) {
          const member = chat.members.filter(
            (member) => member.uuid !== user.uuid
          )[0];
          chats.push({ ...chat, name: member.username });
        } else {
          chats.push(chat);
        }
      }

      console.log("getChats request succesful");
      return chats;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  @Query(() => [User])
  async getUserObject(memberIds: string[]) {
    const members = await Promise.all(
      memberIds.map(async (memberId) => {
        const user = await User.findOne({ uuid: memberId });
        return user;
      })
    );
    return members as User[]; // casting to User[] to get rid of annoying User[] | undefined error
  }

  @Query(() => User)
  async getUserRepo(userId: string) {
    const userRepo = getRepository(User);

    const user = await userRepo.find({
      relations: ["chats", "chats.members"],
      where: { uuid: userId },
    });

    return user[0];
  }
}
