import { Field, Int, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

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
