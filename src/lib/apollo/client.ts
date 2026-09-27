"use client";

import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
} from "@apollo/client";

import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";

// Terminating link: a drop-in replacement for HttpLink that also knows how
// to send a GraphQL multipart request (the spec CreateFile's `file: Upload!`
// variable requires) - it sends a normal JSON POST when an operation has no
// File/Blob in its variables, and only switches to multipart when one is
// present.
const httpLink = new UploadHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  credentials: "include",
});


const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL!,
        }),
      )
    : null;

const splitLink = wsLink
  ? ApolloLink.split(
      ({ query }) => {
        const definition = getMainDefinition(query);

        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink,
    )
  : httpLink;

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});