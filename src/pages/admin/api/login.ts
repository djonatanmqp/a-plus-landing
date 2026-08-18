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
import { supabase } from "../../../lib/supabase.js";

export async function POST({ request, cookies, redirect }: APIContext) {
  try {
    const formData = await request.formData();
    const email = formData.get("username")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return redirect(
        `/admin?message=${encodeURIComponent("Error: Email and password are required")}`,
        303
      );
    }

    // Rate limiting por IP + e-mail para bloquear ataques de força bruta
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

    // Autentica as credenciais via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user || !data.user.email) {
      console.error("Supabase Auth error:", error);
      recordLoginAttempt(rateLimitKey, false);
      return redirect(
        `/admin?message=${encodeURIComponent("Error: Invalid email or password.")}`,
        303
      );
    }

    const userEmail = data.user.email.toLowerCase();

    // Allowlist: somente e-mails autorizados recebem cookie de sessão
    if (!isAdminEmail(userEmail)) {
      console.error("Unauthorized admin login attempt:", userEmail);
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
    const token = createAdminToken(userEmail);

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