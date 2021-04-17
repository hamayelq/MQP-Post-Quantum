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
import { PubSub, withFilter } from "apollo-server-express";
import { getRepository } from "typeorm";
import { Chat } from "../entity/Chat";
import { Message } from "../entity/Message";

@Resolver()
export class MessageResolver {
  @Mutation(() => Boolean)
  async triggerSubscription(senderId, chatId: String, message: String) {
    pubSub.publish(GET_CHAT_SUB, { getNewMessages: message, chatId });
    return true;
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
