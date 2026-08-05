// src/pages/admin/api/login.ts
import type { APIContext } from "astro";
import { SESSION_COOKIE_NAME, createAdminToken } from "../../../lib/admin";

export async function POST({ request, cookies, redirect }: APIContext) {
  try {
    const formData = await request.formData();
    const email = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return redirect("/admin?message=E-mail+e+senha+são+obrigatórios", 303);
    }

    // Autentica as credenciais na REST API do Firebase Auth
    const apiKey = import.meta.env.PUBLIC_FIREBASE_API_KEY;
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
      console.error("Erro Firebase Auth:", data);
      return redirect("/admin?message=Credenciais+inválidas", 303);
    }

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

    return redirect("/admin?message=Login+realizado+com+sucesso!", 303);
  } catch (error) {
    console.error("Erro no processamento do login:", error);
    return redirect("/admin?message=Erro+interno+no+servidor", 303);
  }
}