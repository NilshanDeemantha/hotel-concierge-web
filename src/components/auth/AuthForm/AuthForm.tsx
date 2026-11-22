"use client";

import Link from "next/link";
import { AuthSidePanel } from "@/components/auth/AuthSidePanel";
import { SignedInCard } from "@/components/auth/SignedInCard";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { PasswordField } from "@/components/ui/PasswordField";
import { TextField } from "@/components/ui/TextField";
import { AUTH_COPY, AUTH_TEXT } from "@/content/auth";
import { authCardClass, primaryButtonClass } from "@/styles/classes";
import type { AuthFormProps } from "./AuthForm.types";
import { ProfileFields } from "./ProfileFields";
import { useAuthForm } from "./useAuthForm";

export function AuthForm({ mode }: AuthFormProps) {
  const copy = AUTH_COPY[mode];
  const { user, values, setters, error, busy, handleSubmit } = useAuthForm(mode);

  return (
    <main className="grid flex-1 px-4 pb-10 @xl:px-8 @4xl:grid-cols-2 @4xl:gap-12 @4xl:px-12">
      <div className="flex items-center justify-center py-8">
        <div className="w-full max-w-[420px]">
          {user && <SignedInCard user={user} />}

          {!user && (
            <>
              <h1 className="font-serif text-[40px] leading-[1.1] font-medium">{copy.title}</h1>
              <p className="mt-2.5 text-muted">{copy.intro}</p>

              <form className={`mt-7 flex flex-col gap-[18px] ${authCardClass}`} onSubmit={handleSubmit}>
                {mode === "signup" && (
                  <ProfileFields
                    name={values.name}
                    phone={values.phone}
                    onNameChange={setters.setName}
                    onPhoneChange={setters.setPhone}
                  />
                )}
                <TextField
                  label={AUTH_TEXT.emailLabel}
                  type="email"
                  autoComplete="email"
                  placeholder={AUTH_TEXT.emailPlaceholder}
                  required
                  value={values.email}
                  onChange={(e) => setters.setEmail(e.target.value)}
                />
                <PasswordField
                  id="auth-password"
                  value={values.password}
                  onChange={setters.setPassword}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  minLength={mode === "signup" ? 8 : undefined}
                  hint={mode === "signup" ? AUTH_TEXT.passwordHint : undefined}
                />

                <ErrorAlert message={error} />

                <button type="submit" className={primaryButtonClass} disabled={busy || user === undefined}>
                  {busy ? copy.busy : copy.submit}
                </button>
                <p className="text-center text-[13px] text-muted">{AUTH_TEXT.demoNote}</p>
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

      <AuthSidePanel />
    </main>
  );
}
