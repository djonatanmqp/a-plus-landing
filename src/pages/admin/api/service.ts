import fs from "fs/promises";
import path from "path";
import { ensureDir, parseCookies, readServicesConfig, validateAdminToken, writeServicesConfig, SESSION_COOKIE_NAME } from "../../../lib/admin.ts";

// 🚀 Forçando estritamente o formato JPG/JPEG
const allowedImageExtensions = [".jpg", ".jpeg"] as const;

function safeImageExtension(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  return allowedImageExtensions.includes(ext as any) ? ext : ".jpg";
}

// 🚀 Validação de assinatura por bytes focada apenas em JPEG
function isImageSignature(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return true;
  }
  return false;
}

async function saveUploadedBlob(file: any, destination: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  if (!isImageSignature(buffer.buffer)) {
    throw new Error("Invalid image file. Only JPG/JPEG is allowed.");
  }
  await fs.writeFile(destination, buffer);
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
  const serviceId = (formData.get("serviceId") ?? "").toString();
  if (!serviceId) {
    return new Response(null, {
      status: 303,
      headers: { location: "/admin?message=Select+a+service" },
    });
  }

  const services = await readServicesConfig();
  const service = services.find((item: any) => item.id === serviceId);
  if (!service) {
    return new Response(null, {
      status: 303,
      headers: { location: "/admin?message=Service+not+found" },
    });
  }

  // 🚀 AJUSTE GODADDY: Pasta de uploads mantida na estrutura /public/assets/
  const serviceDir = path.join(process.cwd(), "public/assets/services", serviceId);
  await ensureDir(serviceDir);

  // 1. Processamento da Hero Image
  const heroFile = formData.get("heroImage") as any;
  if (heroFile && heroFile.size) {
    const ext = safeImageExtension(heroFile.name);
    // Padronização: serviceId-hero.jpg
    const fileName = `${serviceId}-hero${ext}`;
    const destination = path.join(serviceDir, fileName);
    await saveUploadedBlob(heroFile, destination);
    // 🚀 AJUSTE GODADDY: O caminho público das imagens no site passa a conter /assets/
    service.heroImage = `/assets/services/${serviceId}/${fileName}`;
  }

  // 2. Processamento da Cover Image
  const coverFile = formData.get("coverImage") as any;
  if (coverFile && coverFile.size) {
    const ext = safeImageExtension(coverFile.name);
    // Padronização: serviceId-cover.jpg
    const fileName = `${serviceId}-cover${ext}`;
    const destination = path.join(serviceDir, fileName);
    await saveUploadedBlob(coverFile, destination);
    // 🚀 AJUSTE GODADDY: O caminho público das imagens no site passa a conter /assets/
    service.coverImage = `/assets/services/${serviceId}/${fileName}`;
  }

  // 3. Processamento das Imagens Adicionais (Galeria)
  const galleryFiles = formData.getAll("galleryImages") as any[];
  if (Array.isArray(galleryFiles)) {
    if (!Array.isArray(service.images)) service.images = [];

    for (const file of galleryFiles) {
      if (!file || !file.size) continue;

      const ext = safeImageExtension(file.name);
      
      // Padronização: serviceId-01.jpg, serviceId-02.jpg...
      const nextIndex = (service.images.length + 1).toString().padStart(2, "0");
      const fileName = `${serviceId}-${nextIndex}${ext}`;
      const destination = path.join(serviceDir, fileName);

      await saveUploadedBlob(file, destination);
      // 🚀 AJUSTE GODADDY: O caminho público das imagens no site passa a conter /assets/
      service.images.push(`/assets/services/${serviceId}/${fileName}`);
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