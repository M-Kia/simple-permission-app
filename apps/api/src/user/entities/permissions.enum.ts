import { registerEnumType } from "@nestjs/graphql";

export enum Permissions {
  CREATE_USER = 'CREATE_USER',
  READ_USER = 'READ_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
}

registerEnumType(Permissions, {
  name: 'Permissions',
})