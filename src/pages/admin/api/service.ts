import fs from "fs/promises";
import path from "path";
import { ensureDir, parseCookies, readServicesConfig, validateAdminToken, writeServicesConfig, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function saveUploadedBlob(file: any, destination: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
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
    const ext = path.extname(heroFile.name) || ".jpg";
    const fileName = `hero${ext}`;
    const destination = path.join(serviceDir, fileName);
    await saveUploadedBlob(heroFile, destination);
    service.heroImage = [`/services/${serviceId}/${fileName}`];
  }

  const coverFile = formData.get("coverImage") as any;
  if (coverFile && coverFile.size) {
    const ext = path.extname(coverFile.name) || ".jpg";
    const fileName = `cover${ext}`;
    const destination = path.join(serviceDir, fileName);
    await saveUploadedBlob(coverFile, destination);
    service.coverImage = [`/services/${serviceId}/${fileName}`];
  }

  const galleryFiles = formData.getAll("galleryImages") as any[];
  if (Array.isArray(galleryFiles)) {
    for (const file of galleryFiles) {
      if (!file || !file.size) continue;

      const ext = path.extname(file.name) || ".jpg";
      // Nome único para evitar conflitos
      const fileName = `gallery-${Date.now()}-${sanitizeFileName(file.name)}`;
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
