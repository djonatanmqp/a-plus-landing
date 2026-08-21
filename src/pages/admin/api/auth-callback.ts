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

      if (isAdminEmail(userEmail)) {
        const token = createAdminToken(userEmail);
        cookies.set(SESSION_COOKIE_NAME, token, {
          path: "/",
          httpOnly: true,
          secure: import.meta.env.PROD,
          sameSite: "lax",
        });
        return redirect("/admin", 303);
      }
    }
  }

  return redirect("/admin?message=Error:+Google+authentication+failed", 303);
}