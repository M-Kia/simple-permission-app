import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Permissions } from "./permissions.enum";

@ObjectType()
@Entity('user')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({unique: true})
  userName: string;

  @Column()
  password: string;

  @Field(() => [Permissions])
  @Column({type: "enum",
    enum: Permissions,
    array: true,
    default: [Permissions.READ_USER]
  })
  permissions: Permissions[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}