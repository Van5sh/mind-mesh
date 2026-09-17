import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  type Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp: FirebaseApp =
  getApps()[0] ?? initializeApp(firebaseConfig);

export const firebaseAuth: Auth = getAuth(firebaseApp);

// Both just run the real provider popup and hand back the Firebase ID
// token - they don't talk to the backend themselves. POSTing that token to
// /auth/firebase (which is what actually creates/logs in the user) is the
// caller's job, so this file stays scoped to "talk to Firebase" only.
export async function signInWithGoogle(): Promise<string> {
  const result = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
  return result.user.getIdToken();
}

export async function signInWithGithub(): Promise<string> {
  const result = await signInWithPopup(firebaseAuth, new GithubAuthProvider());
  return result.user.getIdToken();
}