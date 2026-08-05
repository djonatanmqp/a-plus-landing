// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Suporte para import.meta.env (Astro) e process.env (Node.js / tsx)
const getEnv = (key) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env) {
    // Mapeia PUBLIC_FIREBASE_ para process.env
    return process.env[key] || process.env[key.replace('PUBLIC_', '')];
  }
  return '';
};

const firebaseConfig = {
  apiKey: getEnv("PUBLIC_FIREBASE_API_KEY"),
  authDomain: getEnv("PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("PUBLIC_FIREBASE_APP_ID")
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);