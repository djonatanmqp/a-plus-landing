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