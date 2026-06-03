import { createAdminToken, ADMIN_PASSWORD, ADMIN_USER, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "../../../lib/admin.ts";

export async function POST({ request }: { request: Request }) {
  const formData = await request.formData();
  const username = (formData.get("username") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString();

  if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    return new Response(null, {
      status: 303,
      headers: {
        location: "/admin?message=Credenciais+inv%C3%A1lidas",
      },
    });
  }

  const token = createAdminToken(username);
  return new Response(null, {
    status: 303,
    headers: {
      "set-cookie": `${SESSION_COOKIE_NAME}=${token}; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`,
      location: "/admin?message=Login+realizado+com+sucesso",
    },
  });
}
