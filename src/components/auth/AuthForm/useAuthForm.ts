import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ROUTES } from "@/constants";
import { useAuthUser } from "@/hooks/useAuthUser";
import { register } from "@/lib/api";
import { auth } from "@/lib/firebase";
import { errorMessage } from "@/utils/auth-errors";
import type { Mode } from "./AuthForm.types";

/** Field values, busy/error state and the submit handler of the login and sign-up form. */
export function useAuthForm(mode: Mode) {
  const router = useRouter();
  const user = useAuthUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      // Cosmetic routing only; the rules and the server check the admin claim. The token from a fresh
      // sign-in already carries the claims, so no refresh. AuthForm sends an admin to the dashboard.
      const admin = await user
        .getIdTokenResult()
        .then((t) => t.claims.admin === true)
        .catch(() => false);
      if (!admin) router.push(ROUTES.home);
      setPassword("");
    });
  }

  return {
    user,
    values: { email, password, name, phone },
    setters: { setEmail, setPassword, setName, setPhone },
    error,
    busy,
    handleSubmit,
  };
}
