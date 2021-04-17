import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Chat } from "./Chat";
import { User } from "./User";

@ObjectType()
@Entity("messages")
export class Message extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @Field(() => Chat)
  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @Field()
  @Column("text")
  fromName: string;

  @Field()
  @Column("text")
  toName: string;

  @Field()
  @Column("text")
  content: string;

  @Field()
  @CreateDateColumn()
  date: string;
}
