"use client";

import { FirebaseError } from "firebase/app";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { auth } from "@/lib/firebase";

type Mode = "login" | "signup";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const COPY = {
  login: {
    title: "Welcome back",
    intro: "Log in to your Thambili Bay account.",
    submit: "Log in",
    busy: "Logging in…",
    switchText: "New here?",
    switchLink: "Create an account",
    switchHref: "/signup",
  },
  signup: {
    title: "Create your account",
    intro: "It takes a minute. Only your name, email and a password are needed.",
    submit: "Create account",
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
  "h-12 w-full rounded-xl border border-line bg-bg px-3.5 text-base font-normal text-ink placeholder:text-muted";
const labelClass = "flex flex-col gap-1.5 text-sm font-semibold";
const primaryButtonClass =
  "min-h-13 w-full rounded-full bg-brand px-4 font-semibold text-white disabled:opacity-60";

export function AuthForm({ mode }: { mode: Mode }) {
  const copy = COPY[mode];
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      router.push("/");
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
          placeholder="Your full name"
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className={labelClass}>
        <span>
          Phone <span className="font-normal text-muted">(optional)</span>
        </span>
        <input
          className={inputClass}
          type="tel"
          autoComplete="tel"
          placeholder="+94 77 123 4567"
          pattern={PHONE_PATTERN}
          title="6 to 20 digits. You can use +, spaces, brackets and dashes."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
    </>
  );

  return (
    <main className="grid flex-1 px-4 pb-10 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-12">
      <div className="flex items-center justify-center py-8">
        <div className="w-full max-w-[420px]">
          {user && (
            <div className="rounded-[20px] border border-line bg-surface p-7 shadow-[0_10px_30px_rgba(30,42,40,0.06)]">
              <h1 className="font-serif text-3xl font-medium">
                Hello{user.displayName ? `, ${user.displayName}` : ""}
              </h1>
              <p className="mt-2 break-words text-muted">{user.email}</p>
              <button type="button" className={`${primaryButtonClass} mt-6`} onClick={() => signOut(auth)}>
                Sign out
              </button>
            </div>
          )}

          {!user && (
            <>
              <h1 className="font-serif text-[40px] leading-[1.1] font-medium">{copy.title}</h1>
              <p className="mt-2.5 text-muted">{copy.intro}</p>

              <form
                className="mt-7 flex flex-col gap-[18px] rounded-[20px] border border-line bg-surface p-7 shadow-[0_10px_30px_rgba(30,42,40,0.06)]"
                onSubmit={handleSubmit}
              >
                {mode === "signup" && profileFields}
                <label className={labelClass}>
                  Email
                  <input
                    className={inputClass}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="auth-password" className="text-sm font-semibold">
                    Password
                  </label>
                  <div className="flex h-12 items-center gap-1 rounded-xl border border-line bg-bg pr-0.5 pl-3.5 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-accent">
                    <input
                      id="auth-password"
                      className="h-11 min-w-0 flex-1 bg-transparent text-base text-ink outline-none"
                      type={showPassword ? "text" : "password"}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      required
                      minLength={mode === "signup" ? 8 : undefined}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      className="flex size-11 flex-none items-center justify-center rounded-[10px] text-muted"
                      onClick={() => setShowPassword((shown) => !shown)}
                    >
                      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                        {showPassword && <path d="M4 4l16 16" />}
                      </svg>
                    </button>
                  </div>
                  {mode === "signup" && <p className="text-[13px] font-normal text-muted">At least 8 characters.</p>}
                </div>

                <div role="alert">
                  {error && (
                    <p className="flex items-start gap-2 rounded-xl bg-[#FBEDE8] px-3 py-2.5 text-sm text-[#9A3A1B]">
                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-px flex-none">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v5M12 16.2v.3" />
                      </svg>
                      <span>{error}</span>
                    </p>
                  )}
                </div>

                <button type="submit" className={primaryButtonClass} disabled={busy || user === undefined}>
                  {busy ? copy.busy : copy.submit}
                </button>
                <p className="text-center text-[13px] text-muted">
                  Demo site: please don&apos;t use a password you use anywhere else.
                </p>
              </form>

              <p className="mt-6 text-center text-[15px] text-muted">
                {copy.switchText}{" "}
                <Link className="font-semibold text-brand underline" href={copy.switchHref}>
                  {copy.switchLink}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      <div className="relative hidden min-h-[640px] overflow-hidden rounded-[28px] lg:block">
        <Image
          src="/images/hero-beach.jpg"
          alt="Palm trees on a red-earth headland above a turquoise sea"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute bottom-6 left-6 max-w-[380px] rounded-[20px] bg-bg p-7">
          <p className="text-[13px] font-bold tracking-widest text-brand uppercase">Galle coast, Sri Lanka</p>
          <p className="mt-2.5 font-serif text-[32px] leading-[1.1] font-medium">
            Slow days between the palms and the sea
          </p>
        </div>
      </div>
    </main>
  );
}
