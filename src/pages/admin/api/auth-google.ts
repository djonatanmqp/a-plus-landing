// src/pages/admin/api/auth-google.ts
import type { APIContext } from "astro";
import { createAdminToken, SESSION_COOKIE_NAME, isAdminEmail } from "../../../lib/admin.ts";
import { supabase } from "../../../lib/supabase.ts"; // ou o caminho correto do seu cliente supabase

// Armazenamento em memória para rate limiting (por IP)
const googleLoginAttempts = new Map<string, { count: number; firstAttempt: number }>();

export async function POST({ request, cookies }: APIContext) {
  try {
    const body = await request.json().catch(() => ({}));
    const { accessToken } = body; // ou idToken dependendo de como você envia do front-end

    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Error: Missing token" }), { status: 400 });
    }

    // 1. Rate limiting baseado no IP do cliente
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const key = `google-login:${ip}`;
    
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutos
    const maxAttempts = 5;

    let attempt = googleLoginAttempts.get(key) || { count: 0, firstAttempt: now };
    const elapsed = now - attempt.firstAttempt;

    if (elapsed > windowMs) {
      attempt = { count: 0, firstAttempt: now };
    }

    if (attempt.count >= maxAttempts) {
      return new Response(
        JSON.stringify({ error: 'Too many login attempts. Please try again later.' }), 
        { status: 429 }
      );
    }

    attempt.count += 1;
    googleLoginAttempts.set(key, attempt);

    // 2. Valida o token e recupera o usuário via Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user || !user.email) {
      return new Response(JSON.stringify({ error: "Error: Invalid token or user not found" }), { status: 400 });
    }

    const email = user.email.toLowerCase();

    // 3. Validação contra a allowlist centralizada em lib/admin.ts
    if (!isAdminEmail(email)) {
      return new Response(JSON.stringify({ error: "Error: Email not authorized" }), { status: 403 });
    }

    // Sucesso no login: reseta as tentativas para este IP
    googleLoginAttempts.delete(key);

    const token = createAdminToken(email);

    cookies.set(SESSION_COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Google auth route error:", error);
    return new Response(JSON.stringify({ error: "Error: Internal server error" }), { status: 500 });
  }
}