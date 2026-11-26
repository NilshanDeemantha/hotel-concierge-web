import { useEffect, useState } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";

/** Whether the signed-in user has the admin claim: undefined while checking, false when signed out. */
export function useIsAdmin() {
  const user = useAuthUser();
  const [result, setResult] = useState<{ uid: string; admin: boolean }>();
  useEffect(() => {
    if (!user) return;
    let active = true;
    // Forced refresh so a freshly granted claim shows up.
    user
      .getIdTokenResult(true)
      .then((t) => t.claims.admin === true)
      .catch(() => false)
      .then((admin) => active && setResult({ uid: user.uid, admin }));
    return () => {
      active = false;
    };
  }, [user]);
  if (user === undefined) return undefined;
  if (user === null) return false;
  return result?.uid === user.uid ? result.admin : undefined;
}
