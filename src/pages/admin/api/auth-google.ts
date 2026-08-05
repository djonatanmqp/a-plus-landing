import type { APIContext } from "astro";
import { createAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { adminAuth } from "../../../lib/firebase-server";

export async function POST({ request, cookies }: APIContext) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return new Response(JSON.stringify({ error: "Token ausente" }), { status: 400 });
    }

    // Verifica a autenticidade do token do Google via Firebase Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email?.toLowerCase();

    const allowedEmails = [
      "djonatanmqp@gmail.com",
      "detlev@apluspaversgrass.com"
    ];

    if (!email || !allowedEmails.includes(email)) {
      return new Response(JSON.stringify({ error: "E-mail não autorizado" }), { status: 403 });
    }

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
    console.error("Erro na rota auth-google:", error);
    return new Response(JSON.stringify({ error: "Erro interno no servidor" }), { status: 500 });
  }
}