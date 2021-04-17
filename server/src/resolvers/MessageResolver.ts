import { Mutation, Query, Resolver } from "type-graphql";
import { PubSub, withFilter } from "apollo-server-express";
import { getRepository } from "typeorm";
import { Chat } from "../entity/Chat";
import { Message } from "../entity/Message";
import { User } from "../entity/User";

export type contextType = {
  user: User;
};

@Resolver()
export class MessageResolver {
  @Mutation(() => Boolean)
  async createMessage(_: any, { chatId, content }: any, { user }: contextType) {
    if (!user) {
      throw new Error("createNessage: user unauthorized");
    }

    const chat: Chat | undefined = await Chat.findOne({ uuid: chatId });
    if (!chat) {
      throw new Error("createMessage: can't find chat");
    }
    chat.lastMessage = content;

    const newMessage = await this.createNewMessage(content, user, chat);
    await chat.save();

    return this.triggerSubscription(chatId, newMessage);
  }

  @Mutation(() => Message)
  async createNewMessage(content: string, user: User, chat: Chat) {
    const message = await Message.create({ content, sender: user, chat });
    await message.save();
    return message;
  }

  @Mutation(() => Boolean)
  async triggerSubscription(chatId: string, message: Message) {
    pubSub.publish(GET_CHAT_SUB, { getNewMessages: message, chatId });
    return true;
  }

  @Query(() => Chat)
  async getMessages(_: any, { chatId }: any, { user }: contextType) {
    if (!user) {
      throw new Error("getMessage: user unauthorized");
    }

    let chats: Chat[] = await this.getChatRepo(chatId);

    if (!chats[0].members.some(({ uuid }) => uuid === user.uuid)) {
      throw new Error("getMessage: user unauthorized");
    }

    let messages = chats[0].messages.map((message) => {
      if (message.sender.uuid === user.uuid) return { ...message, me: true };
      return { ...message, me: false };
    });

    messages.sort((a, b) => +new Date(b.date) - +new Date(a.date));

    return { chat: { ...chats[0], messages } };
  }

  @Query(() => Chat)
  async getChatRepo(chatId: string) {
    const chatRepo = getRepository(Chat);
    return await chatRepo.find({
      relations: ["members", "messages", "messages.sender"],
      where: { uuid: chatId },
    });
  }

  // @Query(() => [Message])
  getNewMessages = () => {
    return withFilter(
      () => pubSub.asyncIterator(GET_CHAT_SUB),
      (payload, variable) => payload.chatId === variable.chatId
    );
  };
}

export const GET_CHAT_SUB = "GET_CHAT_SUB";
export const pubSub = new PubSub();
