import fs from "fs/promises";
import path from "path";
import { ensureDir, parseCookies, readServicesConfig, validateAdminToken, writeServicesConfig, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";

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

async function saveUploadedBlob(file: any, destination: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!isImageSignature(buffer.buffer)) {
    throw new Error("Invalid image file");
  }
  await fs.writeFile(destination, buffer);
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
  const serviceId = (formData.get("serviceId") ?? "").toString();
  if (!serviceId) {
    return new Response(null, {
      status: 303,
      headers: {
        location: "/admin?message=Select+a+service",
      },
    });
  }

  const services = await readServicesConfig();
  const service = services.find((item: any) => item.id === serviceId);
  if (!service) {
    return new Response(null, {
      status: 303,
      headers: {
        location: "/admin?message=Service+not+found",
      },
    });
  }

  const serviceDir = path.join(process.cwd(), "public/services", serviceId);
  await ensureDir(serviceDir);

  const heroFile = formData.get("heroImage") as any;
  if (heroFile && heroFile.size) {
    const ext = safeImageExtension(heroFile.name);
    const fileName = `hero${ext}`;
    const destination = path.join(serviceDir, fileName);
    await saveUploadedBlob(heroFile, destination);
    service.heroImage = [`/services/${serviceId}/${fileName}`];
  }

  const coverFile = formData.get("coverImage") as any;
  if (coverFile && coverFile.size) {
    const ext = safeImageExtension(coverFile.name);
    const fileName = `cover${ext}`;
    const destination = path.join(serviceDir, fileName);
    await saveUploadedBlob(coverFile, destination);
    service.coverImage = [`/services/${serviceId}/${fileName}`];
  }

  const galleryFiles = formData.getAll("galleryImages") as any[];
  if (Array.isArray(galleryFiles)) {
    for (const file of galleryFiles) {
      if (!file || !file.size) continue;

      const ext = safeImageExtension(file.name);
      // Nome único para evitar conflitos
      const fileName = `gallery-${Date.now()}-${sanitizeFileName(file.name)}${ext}`;
      const destination = path.join(serviceDir, fileName);

      await saveUploadedBlob(file, destination);

      // Ajuste: Garante que service.images seja um array de strings (plano)
      if (!Array.isArray(service.images)) {
        service.images = [];
      }

      // Push da string diretamente, não de um array
      service.images.push(`/services/${serviceId}/${fileName}`);
    }
  }

  await writeServicesConfig(services);

  return new Response(null, {
    status: 303,
    headers: {
      location: "/admin?message=Service+updated+successfully.",
    },
  });
}
