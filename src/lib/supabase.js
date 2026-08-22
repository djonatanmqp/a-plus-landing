import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: 'pkce', // <--- Força o fluxo de authorization code seguro (evita access_token na URL)
    // Força o uso do sessionStorage da aba em vez do localStorage permanente
    storage: typeof window !== 'undefined' ? window.sessionStorage : null,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Limpa os dados da sessão ao fechar a aba ou o navegador
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => {
    const keysToRemove = [];
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      if (key && key.includes('supabase.auth.token')) {
        keysToRemove.push(key);
      }
    }
    // Correção: usando .forEach() corretamente
    keysToRemove.forEach(k => window.sessionStorage.removeItem(k));
  });
}