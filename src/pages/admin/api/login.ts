import { createAdminToken, ADMIN_PASSWORD, ADMIN_USER, SESSION_COOKIE_FLAGS, SESSION_COOKIE_NAME, recordLoginAttempt, isLoginAllowed } from "../../../lib/admin.ts";

export async function POST({ request }: { request: Request }) {
  const formData = await request.formData();
  const username = (formData.get("username") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  const rateKey = `${username}:${ip}`;

  if (!isLoginAllowed(rateKey)) {
    return new Response(null, {
      status: 429,
      headers: {
        location: "/admin?message=Too+many+login+attempts.+Try+again+later",
      },
    });
  }

  const success = username === ADMIN_USER && password === ADMIN_PASSWORD;
  recordLoginAttempt(rateKey, success);

  if (!success) {
    return new Response(null, {
      status: 303,
      headers: {
        location: "/admin?message=Invalid+credentials",
      },
    });
  }

  const token = createAdminToken(username);
  return new Response(null, {
    status: 303,
    headers: {
      "set-cookie": `${SESSION_COOKIE_NAME}=${token}; ${SESSION_COOKIE_FLAGS}`,
      location: "/admin?message=Login+successful!",
    },
  });
}
