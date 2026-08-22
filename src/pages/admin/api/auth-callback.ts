// src/pages/admin/api/auth-callback.ts
import type { APIContext } from "astro";
import { SESSION_COOKIE_NAME, createAdminToken, isAdminEmail } from "../../../lib/admin";
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export async function GET({ request, cookies, redirect }: APIContext) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user?.email) {
      const userEmail = data.user.email.toLowerCase();

      // Valida se o e-mail está na allowlist de administradores
      if (isAdminEmail(userEmail)) {
        const token = createAdminToken(userEmail);
        
        // Grava o cookie de sessão do painel admin
        cookies.set(SESSION_COOKIE_NAME, token, {
          path: "/",
          httpOnly: true,
          secure: import.meta.env.PROD,
          sameSite: "lax",
        });

        // Redireciona com sucesso para o painel protegido
        return redirect("/admin", 303);
      } else {
        return redirect("/admin?message=" + encodeURIComponent("Error: Email not authorized"), 303);
      }
    }
  }

  return redirect("/admin?message=" + encodeURIComponent("Error: Google authentication failed"), 303);
}