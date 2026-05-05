import { createClient } from '@supabase/supabase-js';

// Função para pegar as chaves (env ou localStorage)
const getKeys = () => {
  // Tentamos ler de várias fontes possíveis para garantir compatibilidade
  const envUrl = process.env.VITE_SUPABASE_URL || (import.meta as any).env.VITE_SUPABASE_URL || '';
  const envKey = process.env.VITE_SUPABASE_ANON_KEY || (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';
  
  const localUrl = localStorage.getItem('supabase_url');
  const localKey = localStorage.getItem('supabase_key');

  const url = (localUrl || envUrl || '').trim().replace(/\/$/, "");
  const key = (localKey || envKey || '').trim();

  return { url, key };
};

const { url, key } = getKeys();

const isPlaceholder = (u: string) => {
  const val = u.toLowerCase();
  return !u || 
         val.includes('seu-id') || 
         val.includes('your-project-id') || 
         val.includes('placeholder') || 
         val.includes('null') ||
         !val.startsWith('http');
};

// Exportamos uma função para verificar se as chaves são válidas
export const isConfigured = () => {
  const { url } = getKeys();
  return !isPlaceholder(url);
};

// Instância inicial
export const supabase = createClient(
  isPlaceholder(url) ? 'https://placeholder-project.supabase.co' : url,
  key || 'placeholder-key'
);
