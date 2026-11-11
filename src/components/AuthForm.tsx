"use client";

import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { auth } from "@/lib/firebase";

type Mode = "login" | "signup";

const COPY = {
  login: {
    title: "Welcome back",
    submit: "Log in",
    busy: "Logging in…",
    switchText: "New here?",
    switchLink: "Create an account",
    switchHref: "/signup",
  },
  signup: {
    title: "Create your account",
    submit: "Sign up",
    busy: "Creating account…",
    switchText: "Already have an account?",
    switchLink: "Log in",
    switchHref: "/login",
  },
} as const;

const ERRORS: Record<string, string> = {
  "auth/invalid-credential": "The email or password is wrong.",
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/email-already-in-use": "An account with this email already exists. Try logging in.",
  "auth/weak-password": "Use a password with at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/network-request-failed": "No connection. Check your internet and try again.",
  "auth/operation-not-allowed": "Email sign-in is not turned on for this site yet.",
  "auth/configuration-not-found": "Email sign-in is not turned on for this site yet.",
};

function errorMessage(error: unknown) {
  const code = error instanceof FirebaseError ? error.code : "";
  return ERRORS[code] ?? "Something went wrong. Please try again.";
}

const inputClass =
  "h-11 w-full rounded-full border border-line bg-bg px-4 text-base text-ink placeholder:text-muted";
const primaryButtonClass =
  "min-h-11 w-full rounded-full bg-brand px-4 font-semibold text-white disabled:opacity-60";

export function AuthForm({ mode }: { mode: Mode }) {
  const copy = COPY[mode];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // undefined = still checking, null = signed out
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setPassword("");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-dvh flex-1 items-center justify-center bg-bg px-4 py-10 text-ink">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6">
        <p className="font-serif text-lg font-semibold text-brand">Thambili Bay</p>

        {user ? (
          <>
            <h1 className="mt-2 font-serif text-2xl font-semibold">You are signed in</h1>
            <p className="mt-2 break-words text-muted">{user.email}</p>
            <button
              type="button"
              className={`${primaryButtonClass} mt-6`}
              onClick={() => signOut(auth)}
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <h1 className="mt-2 font-serif text-2xl font-semibold">{copy.title}</h1>
            <p className="mt-2 text-sm text-muted">
              Demo site: please don&apos;t use a password you use anywhere else.
            </p>

            <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Email
                <input
                  className={inputClass}
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Password
                <input
                  className={inputClass}
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <p role="alert" className="min-h-5 text-sm text-accent">
                {error}
              </p>

              <button
                type="submit"
                className={primaryButtonClass}
                disabled={busy || user === undefined}
              >
                {busy ? copy.busy : copy.submit}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              {copy.switchText}{" "}
              <Link className="font-semibold text-brand underline" href={copy.switchHref}>
                {copy.switchLink}
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
