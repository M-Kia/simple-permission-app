import { getServerGraphqlClient, graphqlClient } from "../graphql-client";
import { LOGIN_MUTATION, LOGOUT_MUTATION } from "../graphql/mutations";
import { PERMISSIONS_QUERY, WHO_AM_I_QUERY } from "../graphql/queries";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export enum Permissions {
  READ_USER = 'READ_USER',
  CREATE_USER = 'CREATE_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
}

export interface User {
  id: string
  userName: string;
  permissions: Permissions[]
  createdAt: Date
  updatedAt: Date
}

// Client-side API (for mutations and client components)
export const authApi = {
  login: async (userName: string, password: string): Promise<User> => {
    const data = await graphqlClient.request<{login: User}>(LOGIN_MUTATION, {
      userName, password
    })
    return data.login
  },
  logout: async (): Promise<boolean> => {
    const data = await graphqlClient.request<{logout: boolean}>(LOGOUT_MUTATION)
    return data.logout
  },
  whoAmI: async (): Promise<User> => {
    const data = await graphqlClient.request<{whoAmI: User}>(WHO_AM_I_QUERY);
    return data.whoAmI
  },
  getAllPermissions: async (): Promise<string[]> => {
    const data = await graphqlClient.request<{permissions: string[]}>(PERMISSIONS_QUERY);
    return data.permissions
  }
}

// Server-side API (for SSR)
export const serverAuthApi = {
  whoAmI: async (cookieStore: ReadonlyRequestCookies): Promise<User | null> => {
    try {
      const client = await getServerGraphqlClient(cookieStore);
      const data = await client.request<{whoAmI: User}>(WHO_AM_I_QUERY);
      return data.whoAmI;
    } catch {
      return null;
    }
  },
  getAllPermissions: async (cookieStore: ReadonlyRequestCookies): Promise<string[]> => {
    try {
      const client = await getServerGraphqlClient(cookieStore);
      const data = await client.request<{permissions: string[]}>(PERMISSIONS_QUERY);
      return data.permissions;
    } catch {
      return Object.values(Permissions);
    }
  }
}