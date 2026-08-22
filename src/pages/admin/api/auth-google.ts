// src/pages/admin/api/auth-google.ts
import type { APIContext } from "astro";
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export async function GET({ request, redirect }: APIContext) {
  const url = new URL(request.url);
  // Garante explicitamente a rota exata de callback que processará o código
  const redirectTo = `${url.origin}/admin/api/auth-callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });

  if (error || !data.url) {
    console.error("Google OAuth generation error:", error);
    return redirect("/admin?message=" + encodeURIComponent("Error: Could not initialize Google login"), 303);
  }

  // Redireciona o navegador diretamente para a URL oficial de autenticação do Google gerada pelo Supabase
  return redirect(data.url, 303);
}