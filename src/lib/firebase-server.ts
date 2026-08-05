import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Trata as quebras de linha da chave privada armazenada no .env
const rawKey = import.meta.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY;
const privateKey = rawKey ? rawKey.replace(/\\n/g, "\n") : undefined;

const projectId = import.meta.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
const clientEmail = import.meta.env.FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;

// Validação simples para emitir um alerta claro se alguma chave estiver faltando
if (!privateKey || !clientEmail || !projectId) {
  console.error("⚠️ ERRO DE CONFIGURAÇÃO DO FIREBASE ADMIN: Variáveis de ambiente faltando no .env!");
}

// Inicialização segura do Firebase Admin
const app = getApps().length === 0 
  ? initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    }) 
  : getApp();

export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);