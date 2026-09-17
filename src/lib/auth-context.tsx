"use client";

/**
 * Real session state: Firebase handles the Google/GitHub sign-in itself
 * (src/lib/firebase.ts), the resulting ID token is POSTed to the backend's
 * POST /auth/firebase, which verifies it and sets a session cookie - from
 * then on, `me` is the source of truth for who's logged in. signOut()
 * clears local state immediately (instant UI feedback) and separately
 * fires POST /auth/logout in the background to actually invalidate the
 * session server-side.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { gql, type TypedDocumentNode } from "@apollo/client";
import { apolloClient } from "./apollo/client";
import { signInWithGoogle, signInWithGithub } from "./firebase";
import type { User } from "./types";

export type AuthProvider = "google" | "github";

interface AuthState {
  status: "loading" | "authenticated" | "unauthenticated";
  user: User | null;
}

interface AuthValue extends AuthState {
  signIn: (provider: AuthProvider) => Promise<void>;
  signOut: () => void;
  signingIn: AuthProvider | null;
}

const AuthContext = createContext<AuthValue | null>(null);

interface MeQueryResult {
  me: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    profile: {
      firstName: string | null;
      lastName: string | null;
      bio: string | null;
      avatarUrl: string | null;
    } | null;
  } | null;
}

// No variables, so the second type param is `Record<string, never>` rather
// than `void`/omitted - keeps `client.query<>` generic inference happy
// without needing to specify the generic manually at the call site.
const ME_QUERY: TypedDocumentNode<MeQueryResult, Record<string, never>> = gql`
  query Me {
    me {
      id
      username
      email
      createdAt
      profile {
        firstName
        lastName
        bio
        avatarUrl
      }
    }
  }
`;

function toUser(me: NonNullable<MeQueryResult["me"]>): User {
  return {
    id: me.id,
    username: me.username,
    email: me.email,
    createdAt: me.createdAt,
    firstName: me.profile?.firstName ?? undefined,
    lastName: me.profile?.lastName ?? undefined,
    bio: me.profile?.bio ?? null,
    avatarUrl: me.profile?.avatarUrl ?? null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading", user: null });
  const [signingIn, setSigningIn] = useState<AuthProvider | null>(null);

  const refetchMe = useCallback(async () => {
    try {
      const { data } = await apolloClient.query({
        query: ME_QUERY,
        fetchPolicy: "network-only",
      });
      setState(
        data?.me
          ? { status: "authenticated", user: toUser(data.me) }
          : { status: "unauthenticated", user: null },
      );
    } catch {
      // Network/GraphQL error on the identity check - treat as logged out
      // rather than leaving the app stuck on a loading spinner.
      setState({ status: "unauthenticated", user: null });
    }
  }, []);

  useEffect(() => {
    refetchMe();
  }, [refetchMe]);

  const signIn = useCallback(
    async (provider: AuthProvider) => {
      setSigningIn(provider);
      try {
        const idToken =
          provider === "google" ? await signInWithGoogle() : await signInWithGithub();

        const res = await fetch(process.env.NEXT_PUBLIC_AUTH_URL!, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        if (!res.ok) {
          throw new Error(`backend rejected the login (${res.status})`);
        }

        await refetchMe();
      } finally {
        setSigningIn(null);
      }
    },
    [refetchMe],
  );

  const signOut = useCallback(() => {
    // Clear local state/cache immediately - the UI should reflect "logged
    // out" right away regardless of how long the network call below takes.
    apolloClient.clearStore();
    setState({ status: "unauthenticated", user: null });

    // Best-effort: invalidates the session server-side too (deletes the
    // row, so the cookie can't be replayed even if it were captured).
    // Not awaited by callers and failures aren't surfaced - from the
    // user's point of view they're already logged out either way.
    fetch(process.env.NEXT_PUBLIC_LOGOUT_URL!, {
      method: "POST",
      credentials: "include",
    }).catch(() => {
      // Nothing meaningful to do client-side if this fails.
    });
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ ...state, signIn, signOut, signingIn }),
    [state, signIn, signOut, signingIn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
