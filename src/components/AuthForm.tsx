"use client";

import { FirebaseError } from "firebase/app";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { auth } from "@/lib/firebase";

type Mode = "login" | "signup";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  // Older projects and the emulator report these two instead of the one above.
  "auth/wrong-password": "The email or password is wrong.",
  "auth/user-not-found": "The email or password is wrong.",
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/email-already-in-use": "An account with this email already exists. Try logging in.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/network-request-failed": "No connection. Check your internet and try again.",
  "auth/operation-not-allowed": "Email sign-in is not turned on for this site yet.",
  "auth/configuration-not-found": "Email sign-in is not turned on for this site yet.",
};

// An error whose message is already written for the user (it comes from our own server).
class ServerError extends Error {}

function errorMessage(error: unknown) {
  if (error instanceof ServerError) return error.message;
  const code = error instanceof FirebaseError ? error.code : "";
  return ERRORS[code] ?? "Something went wrong. Please try again.";
}

// The server checks the details, creates the account and saves the profile.
async function register(details: { name: string; phone: string; email: string; password: string }) {
  // Without this check a missing setting would send the request to the page's own address.
  if (!API_URL) throw new ServerError("Sign-up is not set up: NEXT_PUBLIC_API_URL is missing.");
  let response: Response;
  try {
    response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
  } catch {
    throw new ServerError("No connection. Check your internet and try again.");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ServerError(body?.error ?? "Something went wrong. Please try again.");
  }
}

// Same pattern as the server, which is the check that counts.
const PHONE_PATTERN = "[+0-9 \\(\\)\\-]{6,20}";

const inputClass =
  "h-11 w-full rounded-full border border-line bg-bg px-4 text-base text-ink placeholder:text-muted";
const labelClass = "flex flex-col gap-1 text-sm font-medium";
const primaryButtonClass =
  "min-h-11 w-full rounded-full bg-brand px-4 font-semibold text-white disabled:opacity-60";

export function AuthForm({ mode }: { mode: Mode }) {
  const copy = COPY[mode];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // undefined = still checking, null = signed out
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  async function run(action: () => Promise<void>) {
    setError("");
    setBusy(true);
    try {
      await action();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    run(async () => {
      if (mode === "signup") {
        await register({ name, phone, email, password });
      }
      await signInWithEmailAndPassword(auth, email, password);
      setPassword("");
    });
  }

  const profileFields = (
    <>
      <label className={labelClass}>
        Name
        <input
          className={inputClass}
          type="text"
          autoComplete="name"
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className={labelClass}>
        Phone (optional)
        <input
          className={inputClass}
          type="tel"
          autoComplete="tel"
          pattern={PHONE_PATTERN}
          title="6 to 20 digits. You can use +, spaces, brackets and dashes."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
    </>
  );

  const errorLine = (
    <p role="alert" className="min-h-5 text-sm text-accent">
      {error}
    </p>
  );

  return (
    <main className="flex min-h-dvh flex-1 items-center justify-center bg-bg px-4 py-10 text-ink">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6">
        <p className="font-serif text-lg font-semibold text-brand">Thambili Bay</p>

        {user && (
          <>
            <h1 className="mt-2 font-serif text-2xl font-semibold">
              Hello{user.displayName ? `, ${user.displayName}` : ""}
            </h1>
            <p className="mt-2 break-words text-muted">{user.email}</p>
            <button type="button" className={`${primaryButtonClass} mt-6`} onClick={() => signOut(auth)}>
              Sign out
            </button>
          </>
        )}

        {!user && (
          <>
            <h1 className="mt-2 font-serif text-2xl font-semibold">{copy.title}</h1>
            <p className="mt-2 text-sm text-muted">
              Demo site: please don&apos;t use a password you use anywhere else.
            </p>

            <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
              {mode === "signup" && profileFields}
              <label className={labelClass}>
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
              <label className={labelClass}>
                Password
                <input
                  className={inputClass}
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  minLength={mode === "signup" ? 8 : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              {errorLine}

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
