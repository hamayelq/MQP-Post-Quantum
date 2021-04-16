import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from "typeorm";

@ObjectType()
@Entity("messages")
export class User extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @CreateDateColumn({ name: "createdAt" })
  "createdAt": Date;

  @Field()
  @Column("text")
  fromName: string;

  /* not used for login process, should be used for password
     recovery in future */
  @Field()
  @Column("text")
  toName: string;

  // no @Field() here as to not expose password
  @Field()
  @Column("text")
  content: string;
}
