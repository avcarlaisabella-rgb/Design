import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profile, DesignRequest, RequestStatus } from '../types';
import { STATUS_COLORS } from '../constants';
import { motion } from 'motion/react';
import { 
  Users, 
  Layers, 
  TrendingUp, 
  Search,
  ExternalLink,
  ChevronRight,
  LogOut,
  RefreshCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import React from 'react';

interface Props {
  profile: Profile;
}

export default function AdminDashboard({ profile }: Props) {
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [clients, setClients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<RequestStatus | 'todas'>('todas');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [reqRes, clientRes] = await Promise.all([
        supabase.from('requests').select('*, client:profiles(*)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').eq('role', 'client')
      ]);

      if (reqRes.error) throw reqRes.error;
      if (clientRes.error) throw clientRes.error;

      setRequests(reqRes.data || []);
      setClients(clientRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (requestId: string, newStatus: RequestStatus) => {
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredRequests = filter === 'todas' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const totalRevenue = clients.reduce((acc, c) => acc + (c.plan_id ? 500 : 0), 0); // Mock financial

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-serif text-[#1a1a1a]">Admin Panel</h1>
          <p className="text-gray-500 font-serif italic text-sm">Gerencie o estúdio e seus talentos.</p>
        </div>
        <button 
          onClick={() => supabase.auth.signOut()}
          className="p-3 bg-white text-gray-400 hover:text-red-500 rounded-2xl shadow-sm transition-all"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Total de Clientes</p>
          <p className="text-3xl font-serif">{clients.length}</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Layers className="w-6 h-6" />
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Pedidos Pendentes</p>
          <p className="text-3xl font-serif">{requests.filter(r => r.status !== 'finalizado').length}</p>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Faturamento Estimado</p>
          <p className="text-3xl font-serif text-emerald-600">R$ {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Requests List */}
        <div className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-serif">Gerenciar Pedidos</h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {['todas', 'solicitado', 'em produção', 'revisão', 'finalizado'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s as any)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
                    filter === s 
                      ? "bg-[#5A5A40] text-white border-[#5A5A40]" 
                      : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <motion.div 
                layout
                key={request.id} 
                className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Cliente: {request.client?.full_name || 'Desconhecido'}
                    </p>
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", STATUS_COLORS[request.status])}>
                      {request.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif mb-1">{request.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-1 italic">{request.description}</p>
                  
                  <div className="flex items-center gap-4">
                    <select
                      value={request.status}
                      onChange={(e) => updateStatus(request.id, e.target.value as RequestStatus)}
                      className="bg-gray-50 border border-gray-100 text-xs p-2 rounded-lg outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    >
                      <option value="solicitado">Solicitado</option>
                      <option value="em produção">Em Produção</option>
                      <option value="revisão">Revisão</option>
                      <option value="finalizado">Finalizado</option>
                    </select>
                    <span className="text-[10px] text-gray-300">{formatDate(request.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-[#5A5A40] transition-all">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Rail: Client List */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-black/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif">Clientes</h3>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                <RefreshCcw className="w-3 h-3" />
                Auto-Update
              </div>
            </div>
            
            <div className="space-y-6">
              {clients.map(client => (
                <div key={client.id} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 bg-[#F5F5F0] rounded-xl flex items-center justify-center font-serif text-[#5A5A40]">
                    {client.full_name?.[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1a1a1a] line-clamp-1">{client.full_name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                      Plan: {client.plan_id || 'Free'} • {client.arts_used} artes
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#5A5A40] transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#151619] text-white p-8 rounded-[32px] shadow-xl relative overflow-hidden">
            <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
            <h3 className="text-lg font-serif mb-4 relative z-10">Suporte Premium</h3>
            <div className="space-y-4 relative z-10">
              <SupportItem icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />} label="Sistemas OK" />
              <SupportItem icon={<Clock className="w-4 h-4 text-blue-400" />} label="Média Entrega: 24h" />
              <SupportItem icon={<AlertCircle className="w-4 h-4 text-yellow-400" />} label="2 Demandas Urgentes" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SupportItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-3 text-xs text-white/60">
      {icon}
      <span>{label}</span>
    </div>
  );
}
