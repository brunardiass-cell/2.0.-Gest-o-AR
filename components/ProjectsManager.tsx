
import React, { useState } from 'react';
import { ProjectData, ChecklistItem, Task } from '../types';
import { Plus, Trash2, FolderKanban, CheckCircle2, Circle, ClipboardList, ShieldCheck, ListTodo, ChevronRight } from 'lucide-react';

interface ProjectsManagerProps {
  projects: ProjectData[];
  tasks: Task[];
  onUpdate: (projects: ProjectData[]) => void;
}

const ProjectsManager: React.FC<ProjectsManagerProps> = ({ projects, tasks, onUpdate }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [checklistType, setChecklistType] = useState<'tracking' | 'regulatory'>('tracking');

  const activeProject = projects.find(p => p.id === selectedProjectId);

  const addProject = () => {
    if (!newProjectName.trim()) return;
    const newProj: ProjectData = {
      id: Math.random().toString(36).substring(2, 9),
      name: newProjectName.trim(),
      trackingChecklist: [],
      regulatoryChecklist: []
    };
    onUpdate([...projects, newProj]);
    setNewProjectName('');
    setSelectedProjectId(newProj.id);
  };

  const removeProject = (id: string) => {
    if (confirm('Excluir este projeto e todos os seus checklists?')) {
      const remaining = projects.filter(p => p.id !== id);
      onUpdate(remaining);
      setSelectedProjectId(remaining[0]?.id || null);
    }
  };

  const addItemToChecklist = () => {
    if (!newItemText.trim() || !selectedProjectId) return;
    const newItem: ChecklistItem = {
      id: Math.random().toString(36).substring(2, 9),
      text: newItemText.trim(),
      completed: false
    };

    onUpdate(projects.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          [checklistType === 'tracking' ? 'trackingChecklist' : 'regulatoryChecklist']: [
            ...p[checklistType === 'tracking' ? 'trackingChecklist' : 'regulatoryChecklist'],
            newItem
          ]
        };
      }
      return p;
    }));
    setNewItemText('');
  };

  const toggleItem = (itemId: string, type: 'tracking' | 'regulatory') => {
    onUpdate(projects.map(p => {
      if (p.id === selectedProjectId) {
        const listKey = type === 'tracking' ? 'trackingChecklist' : 'regulatoryChecklist';
        return {
          ...p,
          [listKey]: p[listKey].map(item => item.id === itemId ? { ...item, completed: !item.completed } : item)
        };
      }
      return p;
    }));
  };

  const removeItem = (itemId: string, type: 'tracking' | 'regulatory') => {
    onUpdate(projects.map(p => {
      if (p.id === selectedProjectId) {
        const listKey = type === 'tracking' ? 'trackingChecklist' : 'regulatoryChecklist';
        return {
          ...p,
          [listKey]: p[listKey].filter(item => item.id !== itemId)
        };
      }
      return p;
    }));
  };

  const projectTasks = tasks.filter(t => t.project === activeProject?.name);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
      {/* Sidebar de Projetos */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Novo Projeto</h3>
          <div className="flex gap-2">
            <input 
              type="text" placeholder="Nome do projeto..." value={newProjectName} onChange={e => setNewProjectName(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
            />
            <button onClick={addProject} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition shadow-lg"><Plus size={20}/></button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-900 text-white"><h3 className="text-[10px] font-black uppercase tracking-widest">Lista de Projetos Ativos</h3></div>
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto custom-scrollbar">
            {projects.map(p => (
              <button 
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`w-full text-left p-4 transition-all flex items-center justify-between group ${selectedProjectId === p.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
              >
                <div className="flex items-center gap-3">
                  <FolderKanban size={18} className={selectedProjectId === p.id ? 'text-indigo-600' : 'text-slate-400'} />
                  <span className={`text-sm font-black uppercase tracking-tight ${selectedProjectId === p.id ? 'text-indigo-900' : 'text-slate-600'}`}>{p.name}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeProject(p.id); }} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"><Trash2 size={16}/></button>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detalhes do Projeto Selecionado */}
      <div className="lg:col-span-8 space-y-6">
        {activeProject ? (
          <>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Painel de Acompanhamento</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{activeProject.name}</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Checklist de Acompanhamento */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ClipboardList size={16} className="text-indigo-500"/> Progresso do Projeto
                  </h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="Adicionar marco..." value={checklistType === 'tracking' ? newItemText : ''} 
                      onChange={e => { setChecklistType('tracking'); setNewItemText(e.target.value); }}
                      onKeyDown={e => e.key === 'Enter' && addItemToChecklist()}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                    <button onClick={() => { setChecklistType('tracking'); addItemToChecklist(); }} className="p-2 bg-slate-900 text-white rounded-xl"><Plus size={16}/></button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {activeProject.trackingChecklist.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group border border-slate-100">
                        <button onClick={() => toggleItem(item.id, 'tracking')} className="flex items-center gap-3 text-left">
                          {item.completed ? <CheckCircle2 className="text-emerald-500" size={18}/> : <Circle className="text-slate-300" size={18}/>}
                          <span className={`text-xs font-bold uppercase tracking-tight ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.text}</span>
                        </button>
                        <button onClick={() => removeItem(item.id, 'tracking')} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500"><Trash2 size={14}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checklist Regulatório */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-500"/> Documentação Regulatória
                  </h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="Adicionar documento..." value={checklistType === 'regulatory' ? newItemText : ''} 
                      onChange={e => { setChecklistType('regulatory'); setNewItemText(e.target.value); }}
                      onKeyDown={e => e.key === 'Enter' && addItemToChecklist()}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                    <button onClick={() => { setChecklistType('regulatory'); addItemToChecklist(); }} className="p-2 bg-slate-900 text-white rounded-xl"><Plus size={16}/></button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {activeProject.regulatoryChecklist.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group border border-slate-100">
                        <button onClick={() => toggleItem(item.id, 'regulatory')} className="flex items-center gap-3 text-left">
                          {item.completed ? <CheckCircle2 className="text-emerald-500" size={18}/> : <Circle className="text-slate-300" size={18}/>}
                          <span className={`text-xs font-bold uppercase tracking-tight ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.text}</span>
                        </button>
                        <button onClick={() => removeItem(item.id, 'regulatory')} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500"><Trash2 size={14}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Listagem de Próximas Tarefas do Projeto */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                <ListTodo size={16} className="text-indigo-500"/> Próximas Atividades Deste Projeto
              </h3>
              <div className="space-y-3">
                {projectTasks.length > 0 ? projectTasks.filter(t => t.status !== 'Concluída').map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-100 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 text-[10px] font-black text-indigo-600">
                        {t.projectLead.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{t.activity}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.projectLead} • Prazo: {new Date(t.completionDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden md:block text-right mr-4">
                         <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Próximo Passo</p>
                         <p className="text-xs font-bold text-slate-600">{t.nextStep}</p>
                      </div>
                      <ChevronRight size={20} className="text-slate-300" />
                    </div>
                  </div>
                )) : (
                  <p className="text-center py-8 text-slate-400 text-sm font-medium italic italic">Nenhuma atividade pendente para este projeto.</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-20 text-center">
            <FolderKanban size={48} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Selecione ou crie um projeto para gerenciar seus checklists</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsManager;
