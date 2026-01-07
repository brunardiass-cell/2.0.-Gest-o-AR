
import React from 'react';
import { TEAM_MEMBERS } from '../constants';
import { TeamMember } from '../types';
import { Users, User, ArrowRight, ShieldCheck } from 'lucide-react';

interface SelectionViewProps {
  onSelect: (member: TeamMember | 'Todos') => void;
}

const SelectionView: React.FC<SelectionViewProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900">
      <div className="max-w-5xl w-full text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-black uppercase tracking-widest mb-8">
          <ShieldCheck size={16} />
          Assuntos Regulatórios CTVacinas
        </div>
        <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
          Olá, <span className="text-indigo-500">Graziella</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
          Escolha uma área de atuação para iniciar a gestão do setor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        {/* All Teams Card */}
        <button
          onClick={() => onSelect('Todos')}
          className="group relative bg-indigo-600 p-8 rounded-3xl shadow-2xl shadow-indigo-900/50 hover:shadow-indigo-500/30 transition-all hover:-translate-y-2 flex flex-col items-start text-left overflow-hidden border border-indigo-400/20"
        >
          <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:scale-110 transition-transform">
            <Users size={120} />
          </div>
          <div className="bg-white/10 p-4 rounded-2xl text-white mb-8 border border-white/20">
            <Users size={32} />
          </div>
          <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Visão Geral</h3>
          <p className="text-indigo-100/70 mb-8 max-w-[200px] text-sm font-medium">Monitoramento consolidado de todas as equipes do setor.</p>
          <div className="mt-auto flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest">
            Acessar Painel <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Team Members Grid */}
        {TEAM_MEMBERS.map((member) => (
          <button
            key={member}
            onClick={() => onSelect(member)}
            className="group bg-slate-800/50 p-8 rounded-3xl shadow-sm border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800 transition-all hover:-translate-y-1 flex flex-col items-start text-left"
          >
            <div className={`p-4 rounded-2xl mb-8 ${member === 'Graziella' ? 'bg-indigo-600/10 text-indigo-500 border border-indigo-500/20' : 'bg-slate-700/50 text-slate-500 border border-slate-700'}`}>
              <User size={32} />
            </div>
            <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">
              {member} {member === 'Graziella' && <span className="text-[10px] font-bold text-indigo-500 ml-2 border border-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-widest">Líder</span>}
            </h3>
            <p className="text-slate-500 text-sm mb-8 font-medium italic">Atividades e progresso individual.</p>
            <div className="mt-auto flex items-center gap-2 text-indigo-500 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Ver Atividades <ArrowRight size={18} />
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-20 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4">
        <span>Gestão de Projetos</span>
        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></span>
        <span>Relatórios Gemini</span>
      </div>
    </div>
  );
};

export default SelectionView;
