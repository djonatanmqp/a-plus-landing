import type { APIContext } from "astro";
import { parseCookies, validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { saveCompanyData } from "../../../lib/firebase-admin.ts";

export async function POST(context: APIContext) {
  const { request, redirect } = context;
  const cookies = parseCookies(request.headers.get("cookie"));
  const isLoggedIn = validateAdminToken(cookies[SESSION_COOKIE_NAME]);

  if (!isLoggedIn) {
    return redirect("/admin?message=Unauthorized+access.", 303);
  }

  try {
    const formData = await request.formData();

    const name = (formData.get("name") ?? "").toString().trim();
    const serviceArea = (formData.get("serviceArea") ?? "").toString().trim();
    const description = (formData.get("description") ?? "").toString().trim();
    const phone = (formData.get("phone") ?? "").toString().trim();
    const phoneRaw = (formData.get("phoneRaw") ?? "").toString().trim();
    const facetime = (formData.get("facetime") ?? "").toString().trim();
    const email = (formData.get("email") ?? "").toString().trim();
    const fullAddress = (formData.get("fullAddress") ?? "").toString().trim();

    const companyData = {
      name,
      description,
      contact: { phone, phoneRaw, facetime, email },
      address: {
        full: fullAddress,
        serviceArea,
        city: serviceArea.toLowerCase().includes("orlando") ? "Orlando" : ""
      }
    };

    await saveCompanyData(companyData);

    return redirect("/admin?message=Company+settings+updated+successfully!", 303);
  } catch (error) {
    console.error("Failed to update company settings in Firestore:", error);
    return redirect("/admin?message=Error+updating+settings.", 303);
  }
}