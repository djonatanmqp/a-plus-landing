// src/pages/admin/api/company.ts
import type { APIRoute } from "astro";
import fs from "node:fs";
import path from "node:path";
import { parseCookies, validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import company from "../../../data/company.json";

export const POST: APIRoute = async ({ request, redirect }) => {
  // 1. Proteção de Segurança: Verifica se o utilizador está autenticado antes de salvar
  const cookies = parseCookies(request.headers.get("cookie"));
  const isLoggedIn = validateAdminToken(cookies[SESSION_COOKIE_NAME]);

  if (!isLoggedIn) {
    return redirect("/admin?message=Unauthorized+access.");
  }

  try {
    const formData = await request.formData();

    // 2. Captura os valores vindos do formulário
    const name = formData.get("name") as string;
    const serviceArea = formData.get("serviceArea") as string;
    const description = formData.get("description") as string;
    const phone = formData.get("phone") as string;
    const phoneRaw = formData.get("phoneRaw") as string;
    const facetime = formData.get("facetime") as string;
    const email = formData.get("email") as string;
    const fullAddress = formData.get("fullAddress") as string;

    // 3. Modifica a estrutura mantendo as chaves intactas
    company.name = name;
    company.description = description;
    company.contact.phone = phone;
    company.contact.phoneRaw = phoneRaw;
    company.contact.facetime = facetime;
    company.contact.email = email;
    company.address.full = fullAddress;
    company.address.serviceArea = serviceArea;

    // Se preferir mapear dinamicamente uma cidade caso queira manter o fallback do city antigo:
    if (serviceArea.toLowerCase().includes("orlando")) {
      company.address.city = "Orlando";
    }

    // 4. Resolve o caminho absoluto e escreve de forma síncrona com indentação legível (2 espaços)
    const filePath = path.resolve("./src/data/company.json");
    fs.writeFileSync(filePath, JSON.stringify(company, null, 2), "utf-8");

    return redirect("/admin?message=Company+settings+updated+successfully!");
  } catch (error) {
    console.error("Failed to update company settings:", error);
    return redirect("/admin?message=Error+updating+settings.");
  }
};