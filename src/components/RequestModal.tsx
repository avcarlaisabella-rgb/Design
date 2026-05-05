import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Loader2, Link as LinkIcon, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  clientId: string;
}

export default function RequestModal({ isOpen, onClose, onSuccess, clientId }: Props) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('requests')
        .insert({
          client_id: clientId,
          title,
          description,
          status: 'solicitado'
        });

      if (insertError) throw insertError;
      
      onSuccess();
      onClose();
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-[#F5F5F0]/30">
              <div>
                <h2 className="text-2xl font-serif text-[#1a1a1a]">Novo Pedido</h2>
                <p className="text-gray-500 text-sm font-serif italic">Explique sua visão para o designer.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm leading-relaxed">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  Título do Projeto
                </label>
                <input
                  required
                  placeholder="Ex: Logo para nova marca de café"
                  className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 outline-none transition-all"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" />
                  Descrição e Referências
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Descreva detalhes como cores, estilo, formato e links de referência..."
                  className="w-full bg-gray-50/50 border border-gray-100 p-4 rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 outline-none transition-all resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-500 rounded-full font-medium hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] px-6 py-4 bg-[#5A5A40] text-white rounded-full font-medium shadow-lg shadow-[#5A5A40]/20 hover:bg-[#4a4a34] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Pedido'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
