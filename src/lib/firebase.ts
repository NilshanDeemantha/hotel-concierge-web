import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

// Firebase web config is public by design: it only identifies the project.
// Access is controlled by Firebase Auth and server-side checks, not by hiding these values.
const firebaseConfig = {
  apiKey: "AIzaSyAY80Rfqlsr19TLCT1GNV49cYY1ZPkqQww",
  authDomain: "thambili-bay-concierge.firebaseapp.com",
  projectId: "thambili-bay-concierge",
  appId: "1:801312077386:web:53b12a1f8c9995c34898b3",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Local testing only: set this to use the Firebase emulator instead of the live project.
const emulatorUrl = process.env.NEXT_PUBLIC_AUTH_EMULATOR_URL;
if (emulatorUrl) connectAuthEmulator(auth, emulatorUrl);
