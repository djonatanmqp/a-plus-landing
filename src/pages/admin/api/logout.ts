import type { APIContext } from "astro";
import { SESSION_COOKIE_NAME } from "../../../lib/admin.ts";

export async function POST({ cookies, redirect }: APIContext) {
  // 1. Remove o cookie de sessão do servidor
  cookies.delete(SESSION_COOKIE_NAME, {
    path: "/",
  });

  // 2. Redireciona para a tela de login
  return redirect("/admin?message=Logged+out+successfully", 303);
}

// Suporte caso a chamada seja feita por GET (ex: link direto)
export async function GET({ cookies, redirect }: APIContext) {
  cookies.delete(SESSION_COOKIE_NAME, {
    path: "/",
  });
  return redirect("/admin?message=Logged+out+successfully", 303);
}