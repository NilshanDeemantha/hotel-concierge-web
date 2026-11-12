import type { Metadata } from "next";
import { AUTH_COPY } from "@/content/auth";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: AUTH_COPY.login.pageTitle };

export default function Page() {
  return <AuthForm mode="login" />;
}
