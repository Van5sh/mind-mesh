"use client";

/**
 * Mock, client-only "session" state. There is no auth provider integration
 * and no real OAuth flow here — this only simulates the *UI* of being
 * signed in (loading state -> "session" persisted to localStorage) so the
 * rest of the app can gate routes and show the current user. The real
 * backend is OAuth-only (Google/GitHub) per BACKEND_HANDOFF.md; this mock
 * mirrors that by only ever offering those two providers.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { mockUsers, CURRENT_USER_ID } from "./mock-data";
import type { User } from "./types";

const STORAGE_KEY = "meshmind.mock-session";
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading", user: null });
  const [signingIn, setSigningIn] = useState<AuthProvider | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "1") {
        const user = mockUsers.find((u) => u.id === CURRENT_USER_ID) ?? mockUsers[0];
        setState({ status: "authenticated", user });
      } else {
        setState({ status: "unauthenticated", user: null });
      }
    } catch {
      setState({ status: "unauthenticated", user: null });
    }
  }, []);

  const signIn = useCallback(async (provider: AuthProvider) => {
    setSigningIn(provider);
    // Simulated OAuth redirect/callback round trip — no network call, no
    // provider integration. Purely a frontend loading-state simulation.
    await new Promise((resolve) => setTimeout(resolve, 1100));
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore (private browsing, etc.)
    }
    const user = mockUsers.find((u) => u.id === CURRENT_USER_ID) ?? mockUsers[0];
    setState({ status: "authenticated", user });
    setSigningIn(null);
  }, []);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState({ status: "unauthenticated", user: null });
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
