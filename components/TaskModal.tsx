
import React, { useState, useEffect } from 'react';
import { Task, TeamMember, Priority, Status, TaskUpdate } from '../types';
import { TEAM_MEMBERS, PRIORITIES, STATUSES } from '../constants';
import { X, Plus, Mail, MessageSquare, Bell, ClipboardList, Check, Trash2, CalendarDays, UserPlus } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialData?: Task;
  availableProjects: string[];
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialData, availableProjects = [] }) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    requestDate: new Date().toISOString().split('T')[0],
    project: availableProjects[0] || '',
    activity: '',
    description: '',
    projectLead: 'Graziella',
    collaborators: [],
    priority: 'Média',
    status: 'Não Iniciada',
    plannedStartDate: new Date().toISOString().split('T')[0],
    realStartDate: '',
    completionDate: '',
    progress: 0,
    nextStep: '',
    updates: [],
    emailOnJoin: true,
    emailOnDeadline: true
  });

  const [newUpdateNote, setNewUpdateNote] = useState('');
  const [customCollaborator, setCustomCollaborator] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        updates: initialData.updates || []
      });
    }
  }, [initialData]);

  const addCustomCollaborator = () => {
    if (!customCollaborator.trim()) return;
    const updated = [...(formData.collaborators || [])];
    if (!updated.includes(customCollaborator.trim())) {
      updated.push(customCollaborator.trim());
      setFormData(prev => ({ ...prev, collaborators: updated }));
    }
    setCustomCollaborator('');
  };

  const toggleCollaborator = (member: string) => {
    const current = formData.collaborators || [];
    const updated = current.includes(member) 
      ? current.filter(m => m !== member)
      : [...current, member];
    setFormData(prev => ({ ...prev, collaborators: updated }));
  };

  const handleAddUpdate = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!newUpdateNote.trim()) return;

    const newUpdate: TaskUpdate = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().split('T')[0],
      note: newUpdateNote.trim()
    };

    setFormData(prev => ({
      ...prev,
      updates: [newUpdate, ...(prev.updates || [])]
    }));
    setNewUpdateNote('');
  };

  const handleRemoveUpdate = (id: string) => {
    setFormData(prev => ({
      ...prev,
      updates: (prev.updates || []).filter(u => u.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || Math.random().toString(36).substring(2, 9),
    } as Task);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <header className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
              <ClipboardList size={28} className="text-indigo-500" /> {initialData ? 'Editar Registro' : 'Novo Registro'}
            </h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Formulário de Controle Regulatório</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition"><X size={24} /></button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Informações Primárias</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Projeto Mestre</label>
                  <select 
                    name="project" value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                  >
                    <option value="">Selecione um projeto...</option>
                    {availableProjects.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Título da Atividade</label>
                  <input 
                    type="text" required value={formData.activity} onChange={(e) => setFormData({...formData, activity: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                    placeholder="Ex: Envio de Dossiê X"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Descrição Completa</label>
                  <textarea 
                    rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                    placeholder="Detalhes técnicos da atividade..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-indigo-600 mb-1 uppercase tracking-widest">Próximas Atividades / Próximo Passo</label>
                  <input 
                    type="text" value={formData.nextStep} onChange={(e) => setFormData({...formData, nextStep: e.target.value})}
                    className="w-full px-4 py-3 bg-indigo-50/30 border border-indigo-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-black"
                    placeholder="Qual a próxima ação estratégica?"
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Cronograma</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Solicitação</label>
                    <input type="date" value={formData.requestDate} onChange={e => setFormData({...formData, requestDate: e.target.value})} className="w-full p-2 bg-slate-50 border rounded-lg text-xs font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Prazo Alvo</label>
                    <input type="date" value={formData.completionDate} onChange={e => setFormData({...formData, completionDate: e.target.value})} className="w-full p-2 bg-slate-50 border rounded-lg text-xs font-bold" />
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Responsabilidade</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">Líder da Atividade</label>
                  <select 
                    value={formData.projectLead} onChange={e => setFormData({...formData, projectLead: e.target.value as any})}
                    className="w-full p-3 bg-slate-50 border rounded-xl text-sm font-bold"
                  >
                    {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2 uppercase">Colaboradores</label>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {TEAM_MEMBERS.map(m => (
                      <button 
                        key={m} type="button" onClick={() => toggleCollaborator(m)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border transition ${formData.collaborators?.includes(m) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-200'}`}
                      >
                        {m}
                      </button>
                    ))}
                    {(formData.collaborators || []).filter(c => !TEAM_MEMBERS.includes(c as any)).map(c => (
                       <button 
                        key={c} type="button" onClick={() => toggleCollaborator(c)}
                        className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border bg-slate-100 text-indigo-600 border-indigo-200 flex items-center gap-1"
                      >
                        {c} <X size={10} />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="Outro colaborador..." value={customCollaborator} onChange={e => setCustomCollaborator(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomCollaborator())}
                      className="flex-1 p-2 bg-slate-50 border rounded-lg text-xs"
                    />
                    <button type="button" onClick={addCustomCollaborator} className="p-2 bg-indigo-600 text-white rounded-lg"><UserPlus size={16}/></button>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Histórico de Atualizações</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Adicionar nota de atualização..." 
                    value={newUpdateNote} 
                    onChange={e => setNewUpdateNote(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddUpdate())}
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button type="button" onClick={handleAddUpdate} className="p-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition">
                    <Plus size={20}/>
                  </button>
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {formData.updates && formData.updates.length > 0 ? formData.updates.map(up => (
                    <div key={up.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs relative group">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-400">{new Date(up.date).toLocaleDateString('pt-BR')}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveUpdate(up.id)}
                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12}/>
                        </button>
                      </div>
                      <p className="text-slate-700 leading-snug">{up.note}</p>
                    </div>
                  )) : (
                    <p className="text-center text-slate-400 text-xs py-4 italic">Nenhuma nota registrada.</p>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Status e Progresso</h3>
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}
                    className="p-3 bg-slate-50 border rounded-xl text-sm font-bold"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select 
                    value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as any})}
                    className="p-3 bg-slate-50 border rounded-xl text-sm font-bold"
                  >
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">% de Avanço Real</span>
                    <span className="text-sm font-black text-indigo-600">{formData.progress}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={formData.progress} onChange={e => setFormData({...formData, progress: parseInt(e.target.value)})}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </section>
            </div>
          </div>
        </form>

        <footer className="px-10 py-6 bg-slate-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-8 py-3 text-slate-400 font-black uppercase text-[10px] tracking-widest">Descartar</button>
          <button 
            onClick={handleSubmit}
            className="px-12 py-3 bg-slate-900 text-white rounded-xl shadow-xl hover:bg-slate-800 transition font-black uppercase text-[10px] tracking-[0.2em]"
          >
            Confirmar Registro
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TaskModal;
