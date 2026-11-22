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
      await signInWithEmailAndPassword(auth, email, password);
      router.push(ROUTES.home);
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
