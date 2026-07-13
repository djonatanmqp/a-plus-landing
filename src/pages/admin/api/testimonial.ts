import fs from "fs/promises";
import path from "path";
import { ensureDir, parseCookies, sanitizeSlug, validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";

// 🚀 Restrito unicamente para JPG / JPEG
const allowedImageExtensions = [".jpg", ".jpeg"] as const;

function safeImageExtension(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  return allowedImageExtensions.includes(ext as any) ? ext : ".jpg";
}

// 🚀 Assinatura binária restrita apenas ao formato JPEG/JPG
function isImageSignature(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return true;
  }
  return false;
}

async function validateImageFile(file: any) {
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!isImageSignature(buffer.buffer)) {
    throw new Error("Invalid image file. Only JPG/JPEG is allowed.");
  }
  return buffer;
}

export async function POST({ request }: { request: Request }) {
  const cookies = parseCookies(request.headers.get("cookie"));
  if (!validateAdminToken(cookies[SESSION_COOKIE_NAME])) {
    return new Response(null, {
      status: 303,
      headers: {
        location: "/admin?message=Authentication+required",
      },
    });
  }

  const formData = await request.formData();
  const clientName = (formData.get("clientName") ?? "").toString().trim();
  const serviceType = (formData.get("serviceType") ?? "").toString().trim();
  const city = (formData.get("city") ?? "").toString().trim();
  const state = (formData.get("state") ?? "").toString().trim();
  const message = (formData.get("message") ?? "").toString().trim();
  const monthValue = (formData.get("date") ?? "").toString().trim();

  if (!clientName || !serviceType || !city || !state || !message || !monthValue) {
    return new Response(null, {
      status: 303,
      headers: {
        location: "/admin?message=Fill+in+all+the+testimonial+details",
      },
    });
  }

  const beforeFile = formData.get("beforeImage") as any;
  const afterFile = formData.get("afterImage") as any;
  if (!beforeFile || !beforeFile.size || !afterFile || !afterFile.size) {
    return new Response(null, {
      status: 303,
      headers: {
        location: "/admin?message=Upload+both+before+and+after+images",
      },
    });
  }

  if (!/^[0-9]{4}-[0-9]{2}$/.test(monthValue)) {
    return new Response(null, {
      status: 303,
      headers: {
        location: "/admin?message=Invalid+date+format",
      },
    });
  }

  const dateString = `${monthValue}-01`;
  const slug = sanitizeSlug(`${clientName}-${serviceType}-${monthValue}`);
  
  // 🚀 AJUSTE GODADDY: Pasta de uploads redirecionada para a pasta persistente /public/assets/
  const uploadsDir = path.join(process.cwd(), "public/assets/uploads/testimonials", slug);
  await ensureDir(uploadsDir);

  // 🚀 Força o uso estrito das extensões validadas como JPG
  const beforeExt = safeImageExtension(beforeFile.name);
  const afterExt = safeImageExtension(afterFile.name);
  const beforeName = `before${beforeExt}`;
  const afterName = `after${afterExt}`;

  const beforeDestination = path.join(uploadsDir, beforeName);
  const afterDestination = path.join(uploadsDir, afterName);

  // Validação dos blocos binários (Garante segurança contra falsificações de extensão)
  const beforeBuffer = await validateImageFile(beforeFile);
  const afterBuffer = await validateImageFile(afterFile);
  await fs.writeFile(beforeDestination, beforeBuffer);
  await fs.writeFile(afterDestination, afterBuffer);

  // 🚀 AJUSTE GODADDY: O caminho público das imagens no site passa a conter /assets/
  const beforeImagePath = `assets/uploads/testimonials/${slug}/${beforeName}`;
  const afterImagePath = `assets/uploads/testimonials/${slug}/${afterName}`;

  const safeClientName = clientName.replace(/"/g, '\\"').replace(/\r?\n/g, " ");
  const safeServiceType = serviceType.replace(/"/g, '\\"').replace(/\r?\n/g, " ");
  const safeCity = city.replace(/"/g, '\\"').replace(/\r?\n/g, " ");
  const safeState = state.replace(/"/g, '\\"').replace(/\r?\n/g, " ");
  const safeMessage = message.replace(/\r\n?/g, "\n").trim();

  const markdown = `---\nclientName: "${safeClientName}"\nserviceType: "${safeServiceType}"\ncity: "${safeCity}"\nstate: "${safeState}"\nbeforeImage: "${beforeImagePath}"\nafterImage: "${afterImagePath}"\ndate: ${dateString}\n---\n${safeMessage}\n`;
  
  // 🚀 AJUSTE GODADDY: Salvando o arquivo .md na pasta persistente para evitar perda no deploy do GitHub
  const contentDir = path.join(process.cwd(), "public/assets/content/testimonials");
  await ensureDir(contentDir);
  
  const testimonialFile = path.join(contentDir, `${slug}.md`);
  await fs.writeFile(testimonialFile, markdown, "utf8");

  return new Response(null, {
    status: 303,
    headers: {
      location: "/admin?message=Testimonial+added+successfully!",
    },
  });
}