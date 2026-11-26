import { onSnapshot, type FirestoreError, type Query, type QuerySnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { ADMIN_TEXT } from "@/content/admin";

const loadError = (e: FirestoreError) =>
  e.code === "permission-denied" ? ADMIN_TEXT.permissionDenied : ADMIN_TEXT.loadFailed;

/**
 * Live results of the query `makeQuery(key)`, subscribed only while mounted and `key` is not null.
 * A new key or a retry drops the old listener, and results of an earlier key are never returned.
 * `makeQuery` and `toData` must be stable (module-level), or the listener restarts on every render.
 */
export function useLiveQuery<T>(
  key: string | null,
  makeQuery: (key: string) => Query,
  toData: (snapshot: QuerySnapshot) => T,
) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; attempt: number; data?: T; error?: string }>();

  useEffect(() => {
    if (key === null) return;
    return onSnapshot(
      makeQuery(key),
      (snapshot) => setResult({ key, attempt, data: toData(snapshot) }),
      (e) => setResult({ key, attempt, error: loadError(e) }),
    );
  }, [key, attempt, makeQuery, toData]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  const current = key !== null && result?.key === key && result.attempt === attempt ? result : undefined;
  return { data: current?.data, error: current?.error ?? "", loading: key !== null && !current, retry };
}
