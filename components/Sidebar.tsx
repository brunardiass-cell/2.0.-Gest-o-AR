
import React from 'react';
import { TEAM_MEMBERS } from '../constants';
import { TeamMember, ViewMode } from '../types';
import { LayoutDashboard, ListTodo, Users, User, FolderKanban, LogOut, Home } from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  selectedMember: TeamMember | 'Todos';
  onMemberChange: (member: TeamMember | 'Todos') => void;
  onGoHome: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  selectedMember, 
  onMemberChange,
  onGoHome
}) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-400 fixed h-full flex flex-col shadow-2xl z-50 border-r border-slate-800">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10 cursor-pointer group" onClick={onGoHome}>
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg transition-transform group-hover:scale-105">
            G
          </div>
          <div>
            <h2 className="text-white font-black text-lg leading-tight uppercase tracking-tighter">Graziella</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Liderança</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          <button 
            onClick={() => onViewChange('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-bold text-xs uppercase tracking-widest ${currentView === 'dashboard' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'hover:bg-white/5'}`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button 
            onClick={() => onViewChange('tasks')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-bold text-xs uppercase tracking-widest ${currentView === 'tasks' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'hover:bg-white/5'}`}
          >
            <ListTodo size={18} />
            Atividades
          </button>
          <button 
            onClick={() => onViewChange('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-bold text-xs uppercase tracking-widest ${currentView === 'projects' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'hover:bg-white/5'}`}
          >
            <FolderKanban size={18} />
            Projetos
          </button>
        </nav>
      </div>

      <div className="px-6 py-4 flex-1 overflow-y-auto custom-scrollbar">
        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-4">
          Membros do Setor
        </h3>
        <div className="space-y-1">
          <button 
            onClick={() => onMemberChange('Todos')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-xs font-bold uppercase tracking-wider ${selectedMember === 'Todos' ? 'text-indigo-400' : 'hover:text-white'}`}
          >
            <Users size={16} className={selectedMember === 'Todos' ? 'text-indigo-400' : 'text-slate-700'} />
            Todas Equipes
          </button>
          {TEAM_MEMBERS.map(member => (
            <button 
              key={member}
              onClick={() => onMemberChange(member)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-xs font-bold uppercase tracking-wider ${selectedMember === member ? 'text-indigo-400' : 'hover:text-white'}`}
            >
              <User size={16} className={selectedMember === member ? 'text-indigo-400' : 'text-slate-700'} />
              {member}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-slate-800">
        <button 
          onClick={onGoHome}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition text-xs font-bold uppercase tracking-widest text-slate-400"
        >
          <Home size={18} />
          Início
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition text-xs font-bold uppercase tracking-widest text-red-500 mt-1">
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
