// src/pages/admin/api/set-session.ts
import type { APIContext } from "astro";
import { SESSION_COOKIE_NAME, createAdminToken, isAdminEmail } from "../../../lib/admin";
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export async function POST({ request, cookies }: APIContext) {
  try {
    const { accessToken } = await request.json();
    if (!accessToken) return new Response("Token required", { status: 400 });

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.email || !isAdminEmail(user.email.toLowerCase())) {
      return new Response("Unauthorized", { status: 403 });
    }

    const token = createAdminToken(user.email.toLowerCase());
    cookies.set(SESSION_COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response("Internal Error", { status: 500 });
  }
}