import fs from "fs/promises";
import path from "path";
import { ensureDir, parseCookies, sanitizeSlug, validateAdminToken, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";

const allowedImageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"] as const;

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function safeImageExtension(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  return allowedImageExtensions.includes(ext as any) ? ext : ".jpg";
}

function isImageSignature(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  )
    return true;
  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38 &&
    (bytes[4] === 0x37 || bytes[4] === 0x39) &&
    bytes[5] === 0x61
  )
    return true;
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
    return true;
  return false;
}

async function validateImageFile(file: any) {
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!isImageSignature(buffer.buffer)) {
    throw new Error("Invalid image file");
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
  const uploadsDir = path.join(process.cwd(), "public/uploads/testimonials", slug);
  await ensureDir(uploadsDir);

  const beforeExt = safeImageExtension(beforeFile.name);
  const afterExt = safeImageExtension(afterFile.name);
  const beforeName = `before${beforeExt}`;
  const afterName = `after${afterExt}`;

  const beforeDestination = path.join(uploadsDir, beforeName);
  const afterDestination = path.join(uploadsDir, afterName);

  const beforeBuffer = await validateImageFile(beforeFile);
  const afterBuffer = await validateImageFile(afterFile);
  await fs.writeFile(beforeDestination, beforeBuffer);
  await fs.writeFile(afterDestination, afterBuffer);

  const beforeImagePath = `testimonials/${slug}/${beforeName}`;
  const afterImagePath = `testimonials/${slug}/${afterName}`;

  const safeClientName = clientName.replace(/"/g, '\\"').replace(/\r?\n/g, " ");
  const safeServiceType = serviceType.replace(/"/g, '\\"').replace(/\r?\n/g, " ");
  const safeCity = city.replace(/"/g, '\\"').replace(/\r?\n/g, " ");
  const safeState = state.replace(/"/g, '\\"').replace(/\r?\n/g, " ");
  const safeMessage = message.replace(/\r\n?/g, "\n").trim();

  const markdown = `---\nclientName: "${safeClientName}"\nserviceType: "${safeServiceType}"\ncity: "${safeCity}"\nstate: "${safeState}"\nbeforeImage: "${beforeImagePath}"\nafterImage: "${afterImagePath}"\ndate: ${dateString}\n---\n${safeMessage}\n`;
  const testimonialFile = path.join(process.cwd(), "src/content/testimonials", `${slug}.md`);
  await fs.writeFile(testimonialFile, markdown, "utf8");

  return new Response(null, {
    status: 303,
    headers: {
      location: "/admin?message=Testimonial+added+successfully!",
    },
  });
}
