// src/lib/services.ts
import type { Database } from '../types/supabase';

// Extrai o tipo Service diretamente do schema do Supabase
type Service = Database['public']['Tables']['services']['Row'];

export type ServiceImageType = "hero" | "cover" | "gallery";

/**
 * Função utilitária para fallback ou compatibilidade de caminhos de imagem.
 * Com o Supabase Storage, as imagens já salvam a URL pública completa, 
 * mas esta função pode ser usada caso precise de uma estrutura padrão.
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

  const formattedIndex = String(index ?? 1).padStart(2, "0");
  return `${basePath}/${serviceId}-${formattedIndex}.webp`;
}