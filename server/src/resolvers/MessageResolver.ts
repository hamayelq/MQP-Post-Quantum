import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { PubSub, withFilter } from "apollo-server-express";
import { getRepository } from "typeorm";
import { Chat } from "../entity/Chat";
import { Message } from "../entity/Message";
import { User } from "../entity/User";

export type contextType = {
  user: User;
};

@ObjectType()
class GetMessageResponse {
  @Field(() => String)
  uuid: string;
  @Field(() => String)
  lastMessage: string;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
  @Field(() => [User])
  members: User[];
  @Field(() => [Message])
  messages: Message[];
}

@Resolver()
export class MessageResolver {
  @Mutation(() => Boolean)
  async createMessage(
    @Arg("chatId") chatId: string,
    @Arg("content") content: string,
    @Arg("userId") userId: string
  ) {
    const user = await User.findOne({ where: { uuid: userId } });

    if (!user) {
      throw new Error("createMessage: user unauthorized");
    }

    const chat: Chat | undefined = await Chat.findOne({ uuid: chatId });
    if (!chat) {
      throw new Error("createMessage: can't find chat");
    }
    chat.lastMessage = content;

    const newMessage = await this.createNewMessage(content, user, chat);

    try {
      await chat.save();
    } catch (err) {
      console.log(err);
    }

    return this.triggerSubscription(chatId, newMessage);
  }

  @Mutation(() => Message)
  async createNewMessage(content: string, user: User, chat: Chat) {
    const message = Message.create({
      content,
      sender: user,
      fromName: user.username,
      chat,
    });
    try {
      await message.save();
    } catch (err) {
      console.log(err);
    }
    return message;
  }

  @Mutation(() => Boolean)
  async triggerSubscription(chatId: string, message: Message) {
    try {
      pubSub.publish(GET_CHAT_SUB, { getNewMessages: message, chatId });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Query(() => GetMessageResponse)
  async getMessages(
    @Arg("chatId") chatId: string,
    @Arg("userId") userId: string
  ) {
    const user = await User.findOne({ where: { uuid: userId } });

    if (!user) {
      throw new Error("getMessage: user unauthorized");
    }

    let chats: Chat[] = await this.getChatRepo(chatId);

    if (!chats[0].members.some(({ uuid }) => uuid === userId)) {
      throw new Error("getMessage: user unauthorized");
    }

    let messages: any = [];

    try {
      messages = chats[0].messages.map((message) => {
        if (message.sender.uuid === user.uuid) return { ...message, me: true };
        return { ...message, me: false };
      });

      messages.sort((a: any, b: any) => +new Date(b.date) - +new Date(a.date));
    } catch (err) {
      console.log(err);
    }

    return { ...chats[0], messages };
  }

  @Query(() => Chat)
  async getChatRepo(chatId: string) {
    const chatRepo = getRepository(Chat);
    return await chatRepo.find({
      relations: ["members", "messages", "messages.sender"],
      where: { uuid: chatId },
    });
  }

  getNewMessages = () => {
    return withFilter(
      () => pubSub.asyncIterator(GET_CHAT_SUB),
      (payload, variable) => payload.chatId === variable.chatId
    );
  };
}

export const GET_CHAT_SUB = "GET_CHAT_SUB";
export const pubSub = new PubSub();
