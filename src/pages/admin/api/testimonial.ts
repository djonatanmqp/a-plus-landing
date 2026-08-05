// src/pages/admin/api/testimonial.ts
import fs from "fs/promises";
import path from "path";
import { ensureDir, parseCookies, sanitizeSlug, validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";
import { addTestimonialData } from "../../../lib/firebase-admin.ts";

const allowedImageExtensions = [".jpg", ".jpeg"] as const;

function safeImageExtension(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  return allowedImageExtensions.includes(ext as any) ? ext : ".jpg";
}

function isImageSignature(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
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
      headers: { location: "/admin?message=Authentication+required" },
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
      headers: { location: "/admin?message=Fill+in+all+the+testimonial+details" },
    });
  }

  const beforeFile = formData.get("beforeImage") as any;
  const afterFile = formData.get("afterImage") as any;
  if (!beforeFile || !beforeFile.size || !afterFile || !afterFile.size) {
    return new Response(null, {
      status: 303,
      headers: { location: "/admin?message=Upload+both+before+and+after+images" },
    });
  }

  const dateString = `${monthValue}-01`;
  const slug = sanitizeSlug(`${clientName}-${serviceType}-${monthValue}`);

  // Salvamento local do arquivo de imagem nas pastas públicas
  const uploadsDir = path.join(process.cwd(), "public/assets/uploads/testimonials", slug);
  await ensureDir(uploadsDir);

  const beforeExt = safeImageExtension(beforeFile.name);
  const afterExt = safeImageExtension(afterFile.name);
  const beforeName = `before${beforeExt}`;
  const afterName = `after${afterExt}`;

  const beforeBuffer = await validateImageFile(beforeFile);
  const afterBuffer = await validateImageFile(afterFile);
  await fs.writeFile(path.join(uploadsDir, beforeName), beforeBuffer);
  await fs.writeFile(path.join(uploadsDir, afterName), afterBuffer);

  const beforeImagePath = `assets/uploads/testimonials/${slug}/${beforeName}`;
  const afterImagePath = `assets/uploads/testimonials/${slug}/${afterName}`;

  // Grava o depoimento no Firestore em vez de criar um .md
  await addTestimonialData({
    slug,
    clientName,
    serviceType,
    city,
    state,
    beforeImage: beforeImagePath,
    afterImage: afterImagePath,
    date: dateString,
    message,
    createdAt: new Date().toISOString()
  });

  return new Response(null, {
    status: 303,
    headers: { location: "/admin?message=Testimonial+added+successfully!" },
  });
}