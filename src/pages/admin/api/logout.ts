import { SESSION_COOKIE_NAME } from "../../../lib/admin.ts";

export async function POST() {
  return new Response(null, {
    status: 303,
    headers: {
      "set-cookie": `${SESSION_COOKIE_NAME}=deleted; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=0`,
      location: "/admin?message=You+have+been+logged+out.",
    },
  });
}
