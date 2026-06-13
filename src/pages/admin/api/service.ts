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
  // Verifica se inicia com a assinatura padrão do JPEG (FF D8 FF)
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

  // 1. Processamento da Hero Image
  const heroFile = formData.get("heroImage") as any;
  if (heroFile && heroFile.size) {
    const ext = safeImageExtension(heroFile.name);
    const fileName = `hero${ext}`;
    const destination = path.join(serviceDir, fileName);
    await saveUploadedBlob(heroFile, destination);
    // 🚀 Ajustado: Salva como string direta e não como array
    service.heroImage = `/services/${serviceId}/${fileName}`;
  }

  // 2. Processamento da Cover Image
  const coverFile = formData.get("coverImage") as any;
  if (coverFile && coverFile.size) {
    const ext = safeImageExtension(coverFile.name);
    const fileName = `cover${ext}`;
    const destination = path.join(serviceDir, fileName);
    await saveUploadedBlob(coverFile, destination);
    // 🚀 Ajustado: Salva como string direta e não como array
    service.coverImage = `/services/${serviceId}/${fileName}`;
  }

  // 3. Processamento das Imagens Adicionais (Galeria com Append Incremental)
  const galleryFiles = formData.getAll("galleryImages") as any[];
  if (Array.isArray(galleryFiles)) {
    // Garante que a propriedade images existe e é uma estrutura limpa
    if (!Array.isArray(service.images)) {
      service.images = [];
    }

    for (const file of galleryFiles) {
      if (!file || !file.size) continue;

      const ext = safeImageExtension(file.name);
      
      // 🚀 Ajustado: Nome baseado no total de fotos salvas + 1 para realizar o incremento gradual
      const nextIndex = service.images.length + 1;
      const fileName = `projeto${nextIndex}${ext}`;
      const destination = path.join(serviceDir, fileName);

      await saveUploadedBlob(file, destination);

      // Injeta o novo link na coleção mantendo o histórico anterior
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