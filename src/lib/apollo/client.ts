"use client";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

// Browser Apollo Client. credentials: "include" is required, not optional -
// the frontend (3000) and backend (8090) are different origins, so without
// it the session cookie /auth/firebase sets never gets sent back on
// subsequent requests, and every authenticated query silently comes back
// as if you were logged out.
export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
});
