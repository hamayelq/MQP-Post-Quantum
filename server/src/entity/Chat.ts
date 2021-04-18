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
  @Column()
  name: string;

  @Field(() => Message)
  @OneToMany(() => Message, (messages) => messages.chat)
  @JoinTable()
  messages: Message[];

  @Field(() => User)
  @ManyToMany(() => User, (member) => member.chats)
  @JoinTable()
  members: User[];

  @Field(() => String)
  @Column({ nullable: true })
  lastMessage: string;

  @Field(() => Date)
  @CreateDateColumn({ name: "createdAt" })
  "createdAt": Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: "updatedAt" })
  "updatedAt": Date;
}
