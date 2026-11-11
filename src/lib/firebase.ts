import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";

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

// Browsers may only read and create their own users/{uid} document; see firestore.rules.
export const db = getFirestore(app);
