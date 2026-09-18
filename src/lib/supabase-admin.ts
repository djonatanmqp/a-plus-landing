// src/lib/supabase-admin.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// 1. Configuração e validação do cliente com a chave de serviço (service_role)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Configuração ausente: PUBLIC_SUPABASE_URL e uma chave server-side do Supabase não definidos.");
}

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// 2. Funções de busca de dados tipadas (substitutas do antigo Firebase Admin)

export async function getCompanyData() {
  const { data, error } = await supabaseAdmin
    .from("settings")
    .select("*")
    .single();
  
  if (error) {
    console.error("Erro ao buscar company data:", error.message);
    return null;
  }
  return data;
}

export async function getServicesData() {
  const { data, error } = await supabaseAdmin
    .from('services')
    .select('*')
    .order('display_order', { ascending: true }); // Ordena pelo campo de ordem

  if (error) {
    console.error('Error fetching services:', error.message);
    return [];
  }
  return data;
}

export async function getFaqData() {
  const { data, error } = await supabaseAdmin
    .from("faqs")
    .select("*");
  
  if (error) {
    console.error("Erro ao buscar FAQs:", error.message);
    return [];
  }
  return data || [];
}

export async function getTestimonialsData() {
  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .select("*");
  
  if (error) {
    console.error("Erro ao buscar Testimonials:", error.message);
    return [];
  }
  return data || [];
}