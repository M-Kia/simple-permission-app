import { GraphQLClient } from "graphql-request";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

const endpoint = process.env.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

// Client-side GraphQL client
export const graphqlClient = new GraphQLClient(endpoint, {
  credentials: 'include',
});

// Server-side GraphQL client (for SSR)
export async function getServerGraphqlClient(cookies: ReadonlyRequestCookies) {
  const sessionId = cookies.get('sessionId')?.value;
  
  return new GraphQLClient(endpoint, {
    headers: sessionId ? { Cookie: `sessionId=${sessionId}` } : {},
  });
}