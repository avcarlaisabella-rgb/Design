import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Database, Key, Save, ExternalLink, Info } from 'lucide-react';

export default function ConfigPortal() {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');

  const handleSave = () => {
    if (!url.startsWith('http')) {
      alert('A URL deve começar com https://');
      return;
    }
    localStorage.setItem('supabase_url', url.trim());
    localStorage.setItem('supabase_key', key.trim());
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[40px] shadow-2xl max-w-lg w-full border border-black/5"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#5A5A40] rounded-2xl flex items-center justify-center">
            <Database className="text-white w-8 h-8" />
          </div>
        </div>

        <h1 className="text-3xl font-serif text-center mb-2">Configuração Supabase</h1>
        <p className="text-gray-500 text-center mb-8 font-serif italic text-sm">
          Insira suas credenciais reais para ativar o sistema.
        </p>

        <div className="bg-blue-50 p-4 rounded-2xl mb-8 flex gap-3 text-sm text-blue-700 leading-relaxed">
          <Info className="w-5 h-5 shrink-0" />
          <p>
            Você encontra esses dados no painel do seu projeto Supabase em: <br />
            <strong>Project Settings → API</strong>
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <ExternalLink className="w-3 h-3" />
              Project URL
            </label>
            <input
              placeholder="https://abc...supabase.co"
              className="w-full bg-[#fcfcfc] border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 outline-none transition-all"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Key className="w-3 h-3" />
              Anon Public Key
            </label>
            <input
              type="password"
              placeholder="eyJhbG..."
              className="w-full bg-[#fcfcfc] border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 outline-none transition-all"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-[#5A5A40] text-white p-5 rounded-full font-medium shadow-lg shadow-[#5A5A40]/10 hover:bg-[#4a4a34] transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Salvar e Ativar Sistema
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('supabase_url');
              localStorage.removeItem('supabase_key');
              window.location.reload();
            }}
            className="w-full bg-red-50 text-red-600 p-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-100 transition-all"
          >
            Limpar e usar chaves dos Secrets
          </button>
        </div>

        <p className="mt-8 text-center text-[10px] text-gray-400 uppercase tracking-widest leading-loose">
          Esses dados serão salvos localmente <br /> apenas para esta sessão de desenvolvimento.
        </p>
      </motion.div>
    </div>
  );
}
