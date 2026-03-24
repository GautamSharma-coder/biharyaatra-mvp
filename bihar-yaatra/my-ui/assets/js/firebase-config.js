import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier, updateProfile } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// 1. Initialize Firebase
// In the preview environment, we use the provided global variables if available.
// Fallback to a placeholder if running locally outside the preview.
const firebaseConfig = {
  apiKey: "AIzaSyAO1bKiSsTHCsGlgFXm_-D2gbFBqXdWQuE",
  authDomain: "biharyaatra-t.firebaseapp.com",
  projectId: "biharyaatra-t",
  storageBucket: "biharyaatra-t.firebasestorage.app",
  messagingSenderId: "101220485604",
  appId: "1:101220485604:web:e96c3230ee36de85ba1ff1",
  measurementId: "G-B83LETRN9L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 2. App ID & Path Helper
// 'default-app-id' is the actual Firestore path root where all project data lives.
// This was confirmed from the Firebase Console — all collections are stored at:
//   artifacts/default-app-id/users, artifacts/default-app-id/public/data/...
// Do NOT change this to firebaseConfig.appId — that path is empty.
const appId = 'default-app-id';

// 3. Auth — no auto-init needed.
// Public pages read Firestore without auth (open rules on public/ path).
// Partner/admin pages call onAuthStateChanged themselves.

// Export services and helpers
export {
  app,
  auth,
  db,
  appId,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInWithPhoneNumber,
  RecaptchaVerifier
};
