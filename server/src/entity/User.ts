import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToMany,
  //   ManyToOne,
} from "typeorm";
import { Chat } from "./Chat";
import { Message } from "./Message";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Field()
  @Column("text", { nullable: true }) // remove nullable in production
  publicKey: string; // plaintext public key

  @Field()
  @Column("text", { nullable: true }) // remove nullable in production
  encryptedPrivateKey: string; // encrypted private key

  @Field()
  @Column("text", { unique: true })
  username: string;

  /* not used for login process, should be used for password
     recovery in future */
  @Field()
  @Column("text")
  email: string;

  // no @Field() here as to not expose password
  @Column("text")
  password: string;

  /* used to check if version matches saved version in user
     upon token refresh */
  @Column("int", { default: 0 })
  tokenVersion: number;

  @Field(() => [Message])
  @OneToMany(() => Message, (messages) => messages.fromName, {
    nullable: true,
    onDelete: "CASCADE",
  })
  messages: Message[];

  @Field(() => [Chat])
  @ManyToMany(() => Chat, (chat) => chat.members, {
    nullable: true,
    onDelete: "CASCADE",
  })
  chats: Chat[];
}
