import { Field, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { Message } from "./Message";
import { User } from "./User";

@ObjectType()
@Entity("chats")
export class Chat extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Field(() => String)
  @Column({ nullable: true })
  name: string;

  @Field(() => Message)
  @OneToMany(() => Message, (messages) => messages.chat, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinTable()
  messages: Message[];

  @Field(() => [User])
  @JoinTable()
  @ManyToMany(() => User, (member) => member.chats, { onDelete: "CASCADE" })
  members: User[];

  @Field(() => String)
  @Column({ nullable: true })
  lastMessage: string;

  // pending field, boolean, for friend 'request'
  @Field(() => Boolean)
  @Column({ default: true })
  pendingRequest: boolean;

  // sentByUuid,
  @Field(() => String)
  @Column()
  sentByUuid: string;

  //sentBySymKey
  @Field(() => String)
  @Column({ default: "" })
  sentBySymKey: string;

  //acceptedBySymkey
  @Field(() => String)
  @Column({ default: "" })
  acceptedBySymKey: string;

  @Field(() => Date)
  @CreateDateColumn({ name: "createdAt" })
  "createdAt": Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updatedAt" })
  "updatedAt": Date;
}
