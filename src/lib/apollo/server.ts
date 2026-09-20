import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { headers } from "next/headers";

export async function getServerApolloClient() {
  const requestHeaders = await headers();

  const cookie = requestHeaders.get("cookie");

  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
      headers: cookie
        ? {
            cookie,
          }
        : {},
    }),
    cache: new InMemoryCache(),
  });
}