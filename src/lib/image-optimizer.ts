import sharp from "sharp";

/**
 * Redimensiona e converte um Buffer de imagem para Base64 WebP otimizado.
 */
export async function bufferToWebpBase64(buffer: Buffer): Promise<string> {
  const optimizedBuffer = await sharp(buffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  return `data:image/webp;base64,${optimizedBuffer.toString("base64")}`;
}

export function validateImage(file: File): boolean {
  const validMimes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB
  return validMimes.includes(file.type) && file.size <= maxSize;
}