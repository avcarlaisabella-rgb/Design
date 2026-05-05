import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Lock, Mail, Loader2, Sparkles } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0],
              role: 'client'
            }
          }
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Cadastro realizado! Verifique seu e-mail.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[32px] shadow-sm max-w-md w-full border border-black/5"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#5A5A40] rounded-2xl flex items-center justify-center">
            <Sparkles className="text-white w-8 h-8" />
          </div>
        </div>
        
        <h1 className="text-4xl font-serif text-center mb-2 text-[#1a1a1a]">DesignFlow</h1>
        <p className="text-gray-500 text-center mb-8 font-serif italic text-sm">
          Sua assinatura de design inteligente
        </p>

        {message && (
          <div className={`p-4 rounded-2xl mb-6 text-sm ${
            message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Seu e-mail"
              className="w-full bg-[#fcfcfc] border border-gray-100 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Sua senha"
              className="w-full bg-[#fcfcfc] border border-gray-100 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 focus:border-[#5A5A40] outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5A5A40] text-white p-4 rounded-full font-medium shadow-lg shadow-[#5A5A40]/10 hover:bg-[#4a4a34] transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Criar Conta' : 'Entrar')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          {isSignUp ? 'Já tem uma conta?' : 'Novo por aqui?'} 
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-1 text-[#5A5A40] font-semibold hover:underline"
          >
            {isSignUp ? 'Faça login' : 'Crie sua conta'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
