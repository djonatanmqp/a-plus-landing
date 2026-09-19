// src/lib/services.ts
import { supabase } from "./supabase.js";
import type { Database } from '../types/supabase';

export type Service = Database['public']['Tables']['services']['Row'];

/**
 * Retorna a URL pública da imagem do Supabase Storage ou um placeholder se não houver.
 */
export function getServiceImageUrl(service: Service, type: 'hero' | 'cover' | 'gallery' | string = 'hero', index: number = 0): string {
  let imagePath = '';

  if (type === 'hero' || type === 'cover') imagePath = service.main_image || service.hero_image || service.cover_image || '';
  else if (type === 'gallery') {
    const gallery = service.images || [];
    imagePath = gallery[index] || '';
  }

  if (imagePath) {
    if (imagePath.startsWith('http')) return imagePath;
    const { data } = supabase.storage.from('services').getPublicUrl(imagePath);
    if (data?.publicUrl) return data.publicUrl;
  }
  
  const label = encodeURIComponent(`${service.title || 'Service'} (${type})`);
  return `https://placehold.co/1200x600/0b3c5d/ffffff?text=${label}`;
}

export async function getServicesData(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Erro ao buscar serviços do Supabase:", error.message);
    return [];
  }

  return data || [];
}

export async function getServiceById(id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Erro ao buscar o serviço ${id}:`, error.message);
    return null;
  }

  return data;
}