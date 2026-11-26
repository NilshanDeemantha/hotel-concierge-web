import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { AUTH_EMULATOR_URL, FIRESTORE_EMULATOR_HOST } from "@/config/env";
import { firebaseConfig } from "@/config/firebase";

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

if (AUTH_EMULATOR_URL) connectAuthEmulator(auth, AUTH_EMULATOR_URL);
if (FIRESTORE_EMULATOR_HOST) {
  const [host, port] = FIRESTORE_EMULATOR_HOST.split(":");
  connectFirestoreEmulator(db, host, Number(port));
}
