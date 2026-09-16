// Firebase client SDK setup only - not wired into auth-context.tsx yet.
// lib/auth-context.tsx still simulates sign-in with local state, per this
// project's frontend-only constraints; this file exists so that swap is a
// small, contained change later, not a bigger one that starts from zero.
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Next.js can re-evaluate this module on hot reload - guard against
// re-initializing an already-initialized app, which firebase/app throws on.
export const firebaseApp: FirebaseApp =
  getApps()[0] ?? initializeApp(firebaseConfig);

export const firebaseAuth: Auth = getAuth(firebaseApp);
