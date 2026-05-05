import { PLANS } from '../constants';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface Props {
  currentPlanId: string | null;
  onSelect: (planId: string) => void;
}

export default function PlanSelector({ currentPlanId, onSelect }: Props) {
  return (
    <div className="py-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-serif mb-4">Escolha seu fluxo de design</h2>
        <p className="text-gray-500 font-serif italic max-w-2xl mx-auto">
          Nossos planos são desenhados para escalar conforme seu negócio cresce. 
          Sem contratos complexos, apenas design de alta qualidade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {PLANS.map((plan, idx) => {
          const isSelected = currentPlanId === plan.id;
          const isElite = plan.id === 'elite';

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "relative bg-white p-8 rounded-[40px] shadow-sm border-2 transition-all flex flex-col",
                isSelected ? "border-[#5A5A40]" : "border-transparent hover:border-gray-200",
                isElite && "bg-gradient-to-br from-white to-[#F5F5F0]"
              )}
            >
              {isElite && (
                <div className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest text-[#5A5A40] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-serif mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-serif font-bold">R$ {plan.price}</span>
                  <span className="text-gray-400 text-sm font-serif">/mês</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <FeatureItem label={`${plan.arts_limit} artes mensais`} />
                <FeatureItem label={`${plan.revisions_limit} revisões`} />
                <FeatureItem label={`${plan.active_requests_limit} pedido simultâneo`} />
                {plan.priority && <FeatureItem label="Prioridade Extra" highlight />}
                <FeatureItem label="Download em alta resolução" />
              </ul>

              <button
                onClick={() => onSelect(plan.id)}
                className={cn(
                  "w-full py-4 rounded-3xl font-medium transition-all text-sm uppercase tracking-widest",
                  isSelected 
                    ? "bg-gray-100 text-gray-500 cursor-default" 
                    : "bg-[#5A5A40] text-white hover:bg-[#4a4a34] shadow-lg shadow-[#5A5A40]/20"
                )}
              >
                {isSelected ? 'Plano Atual' : 'Selecionar'}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function FeatureItem({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <div className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
        highlight ? "bg-green-100 text-green-600" : "bg-gray-50 text-gray-400"
      )}>
        <Check className="w-3 h-3" />
      </div>
      <span className={cn(highlight ? "text-green-700 font-semibold" : "text-gray-600")}>
        {label}
      </span>
    </li>
  );
}
