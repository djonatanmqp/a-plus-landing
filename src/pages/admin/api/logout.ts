import { SESSION_COOKIE_DELETE_FLAGS, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";

export async function POST() {
  return new Response(null, {
    status: 303,
    headers: {
      "set-cookie": `${SESSION_COOKIE_NAME}=deleted; ${SESSION_COOKIE_DELETE_FLAGS}`,
      location: "/admin?message=You+have+been+logged+out.",
    },
  });
}
