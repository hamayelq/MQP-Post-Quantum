import { Field, Int, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Field()
  @Column("text")
  username: string;

  /* not used for login process, should be used for password
     recovery in future */
  @Field()
  @Column("text")
  email: string;

  // no @Field() here as to not expose password
  @Field()
  @Column("text")
  password: string;

  /* used to check if version matches saved version in user
     upon token refresh */
  @Column("int", { default: 0 })
  tokenVersion: number;
}