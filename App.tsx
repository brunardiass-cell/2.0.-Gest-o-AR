
import React, { useState, useMemo } from 'react';
import { Task, TeamMember, DashboardStats, ViewMode, AppConfig } from './types';
import { INITIAL_TASKS, TEAM_MEMBERS } from './constants';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import TaskBoard from './components/TaskBoard';
import TaskModal from './components/TaskModal';
import TaskDetailsModal from './components/TaskDetailsModal';
import ReportView from './components/ReportView';
import SelectionView from './components/SelectionView';
import ProjectsManager from './components/ProjectsManager';
import { Plus, FileText, Search, X, ShieldCheck, ArrowRight, Bell } from 'lucide-react';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [viewMode, setViewMode] = useState<ViewMode>('selection');
  const [selectedMember, setSelectedMember] = useState<TeamMember | 'Todos'>('Todos');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [viewingTask, setViewingTask] = useState<Task | undefined>(undefined);
  const [isReportOpen, setIsReportOpen] = useState(false);
  
  const [config, setConfig] = useState<AppConfig>({
    notificationEmail: 'graziella.lider@empresa.com',
    projects: ['Registro de Vacinas', 'Estudos de Estabilidade', 'Dossiê Técnico', 'Ensaios Clínicos'],
    memberProjects: {
      'Graziella': [], 'Bruna': [], 'Ester': [], 'Marjorie': [], 'Ana Luiza': [], 'Ana Terzian': []
    }
  });

  const memberTasks = useMemo(() => {
    if (selectedMember === 'Todos') return tasks;
    return tasks.filter(t => 
      t.projectLead === selectedMember || t.collaborators.includes(selectedMember)
    );
  }, [tasks, selectedMember]);

  const filteredTasks = useMemo(() => {
    return memberTasks.filter(t => {
      const matchesSearch = 
        t.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'Todos' || t.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [memberTasks, searchTerm, statusFilter]);

  const nextPendingTask = useMemo(() => {
    return [...memberTasks]
      .filter(t => t.status !== 'Concluída' && t.nextStep)
      .sort((a, b) => new Date(a.completionDate).getTime() - new Date(b.completionDate).getTime())[0];
  }, [memberTasks]);

  const stats: DashboardStats = useMemo(() => {
    const total = memberTasks.length;
    const completed = memberTasks.filter(t => t.status === 'Concluída').length;
    const inProgress = memberTasks.filter(t => t.status === 'Em Andamento').length;
    const blocked = memberTasks.filter(t => t.status === 'Bloqueada').length;
    const avgProgress = total > 0 
      ? Math.round(memberTasks.reduce((acc, curr) => acc + curr.progress, 0) / total) 
      : 0;
    return { totalLastMonth: total, completed, inProgress, blocked, avgProgress };
  }, [memberTasks]);

  const handleSaveTask = (newTask: Task) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? newTask : t));
    } else {
      setTasks(prev => [newTask, ...prev]);
    }
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('Todos');
  };

  if (viewMode === 'selection') {
    return <SelectionView onSelect={(m) => { setSelectedMember(m); setViewMode('dashboard'); }} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentView={viewMode} 
        onViewChange={setViewMode} 
        selectedMember={selectedMember} 
        onMemberChange={setSelectedMember}
        onGoHome={() => setViewMode('selection')}
      />

      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <header className="bg-slate-900 text-white p-6 shadow-md flex justify-between items-center sticky top-0 z-40 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase">Assuntos Regulatórios CTVacinas</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Gestão de Projetos e Atividades</p>
            </div>
          </div>
          
          <div className="flex gap-3">
             <button 
              onClick={() => setIsReportOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition text-xs font-black uppercase tracking-widest"
            >
              <FileText size={16} />
              Relatório IA
            </button>
            <button 
              onClick={() => { setEditingTask(undefined); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition shadow-lg font-black uppercase text-xs tracking-widest"
            >
              <Plus size={18} />
              Nova Tarefa
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6 flex-1">
          {/* Notification: Next Important Action */}
          {nextPendingTask && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between animate-in slide-in-from-top-2 duration-500 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-600 p-2 rounded-xl text-white">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Próxima Ação Prioritária</p>
                  <p className="text-sm font-bold text-slate-900">
                    {nextPendingTask.project}: <span className="text-slate-600 font-medium">{nextPendingTask.nextStep}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setViewingTask(nextPendingTask)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition text-xs font-black uppercase tracking-widest shadow-sm"
              >
                Ver Atividade
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 items-end justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex-1 space-y-1 w-full">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Buscar em Atividades</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Título, projeto ou palavra-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
                />
              </div>
            </div>

            <div className="w-full md:w-48 space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Todos">Todos Status</option>
                <option value="Não Iniciada">Não Iniciada</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Bloqueada">Bloqueada</option>
                <option value="Concluída">Concluída</option>
              </select>
            </div>

            <button 
              onClick={clearFilters}
              className="px-4 py-2.5 text-slate-500 hover:text-indigo-600 font-bold text-xs uppercase flex items-center gap-2 transition"
            >
              <X size={16} /> Limpar Filtros
            </button>
          </div>

          {viewMode === 'dashboard' && <DashboardOverview stats={stats} tasks={filteredTasks} />}
          {viewMode === 'tasks' && (
            <TaskBoard 
              tasks={filteredTasks} 
              onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
              onDelete={(id) => setTasks(prev => prev.filter(t => t.id !== id))}
              onViewDetails={setViewingTask}
            />
          )}
          {viewMode === 'projects' && (
             <ProjectsManager 
              config={config} 
              onSave={(newConfig) => setConfig(newConfig)} 
            />
          )}
        </div>
      </main>

      {isModalOpen && (
        <TaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveTask} 
          initialData={editingTask}
          availableProjects={config.projects}
        />
      )}

      {viewingTask && (
        <TaskDetailsModal task={viewingTask} onClose={() => setViewingTask(undefined)} />
      )}

      {isReportOpen && (
        <ReportView 
          isOpen={isReportOpen} 
          onClose={() => setIsReportOpen(false)} 
          tasks={filteredTasks}
          userName={selectedMember}
        />
      )}
    </div>
  );
};

export default App;
