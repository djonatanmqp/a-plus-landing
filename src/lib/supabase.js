import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
// Dá prioridade para a chave secreta no servidor, se existir; caso contrário, usa a pública
const supabaseKey = import.meta.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);