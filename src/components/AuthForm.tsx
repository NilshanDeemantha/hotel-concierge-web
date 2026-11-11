"use client";

import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore/lite";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { auth, db } from "@/lib/firebase";

type Mode = "login" | "signup";
type Profile = { name: string; phone?: string };

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
  "permission-denied": "We couldn't save your details. Check the name and phone number.",
};

function errorMessage(error: unknown) {
  const code = error instanceof FirebaseError ? error.code : "";
  return ERRORS[code] ?? "Something went wrong. Please try again.";
}

// Same pattern as firestore.rules, so the form and the rules agree.
const PHONE_PATTERN = "[+0-9 \\(\\)\\-]{6,20}";

const inputClass =
  "h-11 w-full rounded-full border border-line bg-bg px-4 text-base text-ink placeholder:text-muted";
const labelClass = "flex flex-col gap-1 text-sm font-medium";
const primaryButtonClass =
  "min-h-11 w-full rounded-full bg-brand px-4 font-semibold text-white disabled:opacity-60";

function saveProfile(uid: string, name: string, phone: string) {
  const profile = {
    name: name.trim(),
    ...(phone.trim() && { phone: phone.trim() }),
    created_at: serverTimestamp(),
  };
  return setDoc(doc(db, "users", uid), profile);
}

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
  // undefined = still loading, null = signed in but no profile saved yet
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);

  // True while sign-up is writing the profile, so the profile lookup below does not race it.
  const creating = useRef(false);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!user) return;
    let current = true;
    getDoc(doc(db, "users", user.uid))
      .then((snap) => current && !creating.current && setProfile(snap.exists() ? (snap.data() as Profile) : null))
      .catch(() => current && !creating.current && setProfile(null));
    return () => {
      current = false;
    };
  }, [user]);

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
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        creating.current = true;
        try {
          const { user: created } = await createUserWithEmailAndPassword(auth, email, password);
          await saveProfile(created.uid, name, phone);
          setProfile({ name: name.trim(), phone: phone.trim() || undefined });
        } catch (e) {
          // The account may exist without a profile; the "Finish your profile" form asks again.
          if (auth.currentUser) setProfile(null);
          throw e;
        } finally {
          creating.current = false;
        }
      }
      setPassword("");
    });
  }

  function handleProfileSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) return;
    run(async () => {
      await saveProfile(user.uid, name, phone);
      setProfile({ name: name.trim(), phone: phone.trim() || undefined });
    });
  }

  function handleSignOut() {
    setProfile(undefined);
    signOut(auth);
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

        {user && profile === undefined && <p className="mt-4 text-muted">Loading…</p>}

        {user && profile === null && (
          <>
            <h1 className="mt-2 font-serif text-2xl font-semibold">Finish your profile</h1>
            <p className="mt-2 break-words text-sm text-muted">Signed in as {user.email}</p>
            <form className="mt-6 flex flex-col gap-4" onSubmit={handleProfileSubmit}>
              {profileFields}
              {errorLine}
              <button type="submit" className={primaryButtonClass} disabled={busy}>
                {busy ? "Saving…" : "Save"}
              </button>
            </form>
            <button type="button" className="mt-4 min-h-11 w-full text-sm text-muted underline" onClick={handleSignOut}>
              Sign out
            </button>
          </>
        )}

        {user && profile && (
          <>
            <h1 className="mt-2 font-serif text-2xl font-semibold">Hello, {profile.name}</h1>
            <p className="mt-2 break-words text-muted">{user.email}</p>
            {profile.phone && <p className="text-muted">{profile.phone}</p>}
            <button type="button" className={`${primaryButtonClass} mt-6`} onClick={handleSignOut}>
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
                  minLength={6}
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
