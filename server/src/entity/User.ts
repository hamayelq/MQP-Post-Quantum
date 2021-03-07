import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

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
}
