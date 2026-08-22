// src/pages/admin/api/auth-google.ts
import type { APIContext } from "astro";
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export async function GET({ request, redirect }: APIContext) {
  const url = new URL(request.url);
  // Redireciona de volta para /admin — o Supabase adicionará o access_token no hash
  // O cliente no /admin captura o token e chama /admin/api/set-session para gravar o cookie do painel
  const redirectTo = `${url.origin}/admin`;

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