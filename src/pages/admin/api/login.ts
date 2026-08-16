// src/pages/admin/api/login.ts
import type { APIContext } from "astro";
import {
  SESSION_COOKIE_NAME,
  createAdminToken,
  isAdminEmail,
  isLoginAllowed,
  recordLoginAttempt,
  getLoginAttemptInfo,
} from "../../../lib/admin";

export async function POST({ request, cookies, redirect }: APIContext) {
  try {
    const formData = await request.formData();
    const email = formData.get("username")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      // A1 — mensagens de erro sempre prefixadas com "Error:"
      return redirect(
        `/admin?message=${encodeURIComponent("Error: Email and password are required")}`,
        303
      );
    }

    // C2 — Rate limiting por IP + e-mail para bloquear ataques de força bruta
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rateLimitKey = `${clientIp}:${email.toLowerCase()}`;

    if (!isLoginAllowed(rateLimitKey)) {
      const { remainingSeconds } = getLoginAttemptInfo(rateLimitKey);
      return redirect(
        `/admin?message=${encodeURIComponent(
          `Error: Too many login attempts. Try again in ${remainingSeconds}s.`
        )}`,
        303
      );
    }

    // Autentica as credenciais na REST API do Firebase Auth
    const apiKey = import.meta.env.PUBLIC_FIREBASE_API_KEY;

    if (!apiKey) {
      return redirect(
        `/admin?message=${encodeURIComponent("Error: Firebase is not configured on the server.")}`,
        303
      );
    }

    const firebaseUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    const response = await fetch(firebaseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Firebase Auth error:", data);
      recordLoginAttempt(rateLimitKey, false);
      return redirect(
        `/admin?message=${encodeURIComponent("Error: Invalid email or password.")}`,
        303
      );
    }

    // C1 — Allowlist: somente e-mails autorizados recebem cookie de sessão
    if (!isAdminEmail(data.email)) {
      console.error("Unauthorized admin login attempt:", data.email);
      recordLoginAttempt(rateLimitKey, false);
      return redirect(
        `/admin?message=${encodeURIComponent(
          "Error: This account is not authorized to access the admin panel."
        )}`,
        303
      );
    }

    recordLoginAttempt(rateLimitKey, true);

    // Gera o token/sessão do admin
    const token = createAdminToken(data.email);

    // Grava o cookie HTTP de sessão no Astro
    cookies.set(SESSION_COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return redirect("/admin?message=Login+successful", 303);
  } catch (error) {
    console.error("Login processing error:", error);
    return redirect(
      `/admin?message=${encodeURIComponent("Error: Internal server error.")}`,
      303
    );
  }
}