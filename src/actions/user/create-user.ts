"use server";

import { getServerApolloClient } from "@/lib/apollo/server";
import {
  CreateUserDocument,
  type CreateUserInput,
  type CreateUserMutation,
} from "@/graphql/generated/graphql";

export async function createUserAction(
  input: CreateUserInput
) {
  const client = await getServerApolloClient();

  const { data } = await client.mutate({
    mutation: CreateUserDocument,
    variables: {
      input,
    },
  });

  return data?.createUser;
}