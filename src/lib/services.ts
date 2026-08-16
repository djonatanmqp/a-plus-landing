// src/utils/services.ts
import { type Service } from '../types/firebase';

export type ServiceImageType = "hero" | "cover" | "gallery";

/**
 * Gera o caminho padrão para as imagens dos serviços.
 *
 * Nomenclatura:
 * - hero: /assets/services/{serviceId}/{serviceId}-hero.webp
 * - cover: /assets/services/{serviceId}/{serviceId}-cover.webp
 * - gallery: /assets/services/{serviceId}/{serviceId}-01.webp
 */
export function getServiceImagePath(
  serviceId: Service['id'],
  type: ServiceImageType,
  index?: number
): string {
  const basePath = `/assets/services/${serviceId}`;

  if (type === "hero") {
    return `${basePath}/${serviceId}-hero.webp`;
  }

  if (type === "cover") {
    return `${basePath}/${serviceId}-cover.webp`;
  }

  // Galeria: formata index com 2 dígitos (01, 02, 03...)
  const formattedIndex = String(index ?? 1).padStart(2, "0");
  return `${basePath}/${serviceId}-${formattedIndex}.webp`;
}