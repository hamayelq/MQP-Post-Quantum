import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Chat } from "../entity/Chat";

export type contextType = {
  user: User;
};

@ObjectType()
class GetChatSymKeyResponse {
  @Field(() => String)
  encryptedSymKey: string;
}

@Resolver()
export class ChatResolver {
  @Mutation(() => Boolean)
  async createChat(
    @Arg("memberIds", () => [String]) memberIds: string[],
    @Arg("userId") userId: string,
    @Arg("sentBySymKey") sentBySymKey: string,
    @Arg("acceptedBySymKey") acceptedBySymKey: string
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

      return await this.createNewChat(
        [...members, user],
        userId,
        sentBySymKey,
        acceptedBySymKey
      );
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async createNewChat(
    members: User[],
    userId: string,
    sentBySymKey: string,
    acceptedBySymKey: string
  ) {
    try {
      const chat = Chat.create({
        members: [...members],
        lastMessage: "",
        sentByUuid: userId,
        sentBySymKey,
        acceptedBySymKey,
      });
      await chat.save();
      return true;
    } catch (err) {
      console.log("Save Chat FAILED\n");
      console.log(err);
      return false;
    }
  }

  @Mutation(() => Boolean)
  async acceptRequest(
    @Arg("chatId") chatId: string,
    @Arg("encryptedSymKey") encryptedSymKey: string
  ) {
    try {
      const chatRepo = getRepository(Chat);
      const chatToUpdate: Chat | undefined = await chatRepo.findOne({
        where: { uuid: chatId },
      });

      if (!chatToUpdate) throw new Error("Could not find chat to update");

      chatToUpdate.pendingRequest = false;
      chatToUpdate.acceptedBySymKey = encryptedSymKey;

      await chatRepo.save(chatToUpdate);

      return true;
    } catch (err) {
      console.log(err);
      throw new Error("Error accepting request");
    }
  }

  @Mutation(() => Boolean)
  async denyRequest(@Arg("chatId") chatId: string) {
    try {
      const chatRepo = getRepository(Chat);
      const chatToUpdate: Chat | undefined = await chatRepo.findOne({
        where: { uuid: chatId },
      });
      if (!chatToUpdate) throw new Error("Could not find chat to update");

      await chatRepo.remove(chatToUpdate);
      return true;
    } catch (err) {
      console.log(err);
      throw new Error("Error deleting request");
    }
  }

  @Query(() => GetChatSymKeyResponse)
  async getChatSymKey(
    @Arg("chatId") chatId: string,
    @Arg("userId") userId: string
  ) {
    try {
      const chat = await Chat.findOne({ where: { uuid: chatId } });

      const symKey =
        chat?.sentByUuid === userId
          ? chat.sentBySymKey
          : chat?.acceptedBySymKey;

      return { encryptedSymKey: symKey };
    } catch (err) {
      console.log(err);
      throw new Error("Error getting chat symkey");
    }
  }

  @Query(() => [Chat])
  async getChats(@Arg("userId") userId: string) {
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

      // console.log("getChats request succesful");
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
