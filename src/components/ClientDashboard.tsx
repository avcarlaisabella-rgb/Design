import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profile, DesignRequest, Plan } from '../types';
import { PLANS, STATUS_COLORS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  LogOut, 
  Layout, 
  Clock, 
  CheckCircle2, 
  Settings, 
  Download,
  AlertCircle,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import PlanSelector from './PlanSelector';
import RequestModal from './RequestModal';

interface Props {
  profile: Profile;
}

export default function ClientDashboard({ profile: initialProfile }: Props) {
  const [profile, setProfile] = useState(initialProfile);
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'plan'>('requests');

  const currentPlan = PLANS.find(p => p.id === profile.plan_id);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('client_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  }

  const activeRequestsCount = requests.filter(r => r.status !== 'finalizado').length;
  const canRequest = currentPlan && 
                    profile.arts_used < currentPlan.arts_limit && 
                    activeRequestsCount < currentPlan.active_requests_limit;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-serif text-[#1a1a1a]">Olá, {profile.full_name}</h1>
          <p className="text-gray-500 font-serif italic">Bem-vindo ao seu estúdio criativo.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => supabase.auth.signOut()}
            className="p-3 bg-white text-gray-400 hover:text-red-500 rounded-2xl shadow-sm transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard 
          icon={<Layout className="w-5 h-5" />}
          label="Plano" 
          value={currentPlan?.name || 'Sem plano'} 
          color="bg-[#5A5A40]"
        />
        <StatCard 
          icon={<Sparkles className="w-5 h-5" />}
          label="Artes Disponíveis" 
          value={currentPlan ? `${profile.arts_used}/${currentPlan.arts_limit}` : '0/0'} 
          color="bg-purple-600"
        />
        <StatCard 
          icon={<Clock className="w-5 h-5" />}
          label="Pedidos Ativos" 
          value={currentPlan ? `${activeRequestsCount}/${currentPlan.active_requests_limit}` : '0/0'} 
          color="bg-blue-600"
        />
        <StatCard 
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Revisões Utilizadas" 
          value={currentPlan ? `${profile.revisions_used}/${currentPlan.revisions_limit}` : '0/0'} 
          color="bg-emerald-600"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('requests')}
          className={cn(
            "pb-4 px-6 text-sm font-medium transition-all whitespace-nowrap",
            activeTab === 'requests' ? "border-b-2 border-[#5A5A40] text-[#5A5A40]" : "text-gray-400"
          )}
        >
          Meus Pedidos
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={cn(
            "pb-4 px-6 text-sm font-medium transition-all whitespace-nowrap",
            activeTab === 'plan' ? "border-b-2 border-[#5A5A40] text-[#5A5A40]" : "text-gray-400"
          )}
        >
          Minha Assinatura
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'requests' ? (
          <motion.div
            key="requests"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif">Fluxo de Design</h2>
              <button
                disabled={!canRequest}
                onClick={() => setIsModalOpen(true)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-full text-white shadow-lg transition-all",
                  canRequest ? "bg-[#5A5A40] hover:bg-[#4a4a34] shadow-[#5A5A40]/10" : "bg-gray-300 cursor-not-allowed shadow-none"
                )}
              >
                <Plus className="w-4 h-4" />
                Novo Pedido
              </button>
            </div>

            {!canRequest && currentPlan && (
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-3 mb-8 text-orange-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                Limite de pedidos ativos ou artes mensais atingido. Aguarde a finalização ou o reset do ciclo.
              </div>
            )}

            <div className="grid gap-6">
              {loading ? (
                <div className="text-center py-20 text-gray-400">Carregando pedidos...</div>
              ) : requests.length === 0 ? (
                <div className="bg-white p-20 rounded-3xl text-center border-2 border-dashed border-gray-200">
                  <Sparkles className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-xl font-serif text-gray-500">Nenhum pedido encontrado.</h3>
                  <p className="text-gray-400">Que tal começar sua primeira criação hoje?</p>
                </div>
              ) : (
                requests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="plan"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <PlanSelector currentPlanId={profile.plan_id} onSelect={() => {}} />
          </motion.div>
        )}
      </AnimatePresence>

      <RequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchRequests}
        clientId={profile.id}
      />
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 hover:border-[#5A5A40]/20 transition-all group">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 transition-transform group-hover:scale-110", color)}>
        {icon}
      </div>
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-medium">{label}</p>
      <p className="text-2xl font-serif text-[#1a1a1a]">{value}</p>
    </div>
  );
}

interface RequestCardProps {
  request: DesignRequest;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 hover:shadow-md transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-serif text-[#1a1a1a]">{request.title}</h3>
            <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", STATUS_COLORS[request.status])}>
              {request.status}
            </span>
          </div>
          <p className="text-gray-500 text-sm line-clamp-1 mb-4">{request.description}</p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Solicitado em: {formatDate(request.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              {request.revised_count} revisões
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          {request.final_url && (
            <a 
              href={request.final_url} 
              target="_blank" 
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Baixar Entrega
            </a>
          )}
          <button className="p-2 bg-gray-50 text-gray-400 hover:text-[#5A5A40] rounded-xl transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
