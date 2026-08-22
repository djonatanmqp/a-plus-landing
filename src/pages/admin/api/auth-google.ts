// src/pages/admin/api/auth-google.ts
import type { APIContext } from "astro";
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export async function GET({ request, redirect }: APIContext) {
  const url = new URL(request.url);
  const redirectTo = `${url.origin}/admin/api/auth-callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });

  if (error || !data.url) {
    return redirect("/admin?message=" + encodeURIComponent("Error: Could not initialize Google login"), 303);
  }

  return redirect(data.url, 303);
}