import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { AUTH_EMULATOR_URL } from "@/config/env";
import { firebaseConfig } from "@/config/firebase";

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

if (AUTH_EMULATOR_URL) connectAuthEmulator(auth, AUTH_EMULATOR_URL);
