import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { headers } from "next/headers";

export async function getServerApolloClient() {
  const requestHeaders = await headers();

  const authHeader = requestHeaders.get("authorization");

  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: process.env.GRAPHQL_URL,
      headers: authHeader
        ? {
            authorization: authHeader,
          }
        : {},
    }),
    cache: new InMemoryCache(),
  });
}