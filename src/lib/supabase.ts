import { createClient } from '@supabase/supabase-js';

// Função para pegar as chaves (env ou localStorage)
const getKeys = () => {
  const envUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';
  
  const localUrl = localStorage.getItem('supabase_url');
  const localKey = localStorage.getItem('supabase_key');

  const url = (localUrl || envUrl || '').trim().replace(/\/$/, "");
  const key = (localKey || envKey || '').trim();

  return { url, key };
};

const { url, key } = getKeys();

const isPlaceholder = (u: string) => {
  return !u || u.includes('seu-id') || u.includes('your-project-id') || u.includes('placeholder') || u.includes('null');
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
