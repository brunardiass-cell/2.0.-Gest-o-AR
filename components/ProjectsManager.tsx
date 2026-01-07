
import React, { useState } from 'react';
import { AppConfig } from '../types';
import { Plus, Trash2, Edit3, FolderKanban, Check, X } from 'lucide-react';

interface ProjectsManagerProps {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
}

const ProjectsManager: React.FC<ProjectsManagerProps> = ({ config, onSave }) => {
  const [newProject, setNewProject] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const addProject = () => {
    if (!newProject.trim()) return;
    if (config.projects.includes(newProject.trim())) {
      alert('Projeto já existe');
      return;
    }
    onSave({ ...config, projects: [...config.projects, newProject.trim()] });
    setNewProject('');
  };

  const removeProject = (name: string) => {
    if (confirm(`Excluir o projeto "${name}"?`)) {
      onSave({ ...config, projects: config.projects.filter(p => p !== name) });
    }
  };

  const startEdit = (index: number, val: string) => {
    setEditingIndex(index);
    setEditingValue(val);
  };

  const saveEdit = () => {
    if (!editingValue.trim()) return;
    const updated = [...config.projects];
    updated[editingIndex!] = editingValue.trim();
    onSave({ ...config, projects: updated });
    setEditingIndex(null);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 bg-slate-900 text-white border-b border-slate-800">
          <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
            <FolderKanban size={28} className="text-indigo-500" /> Gerenciar Projetos
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Lista mestre de categorias do setor</p>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Nome do novo projeto..."
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
            />
            <button 
              onClick={addProject}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-900/20 flex items-center gap-2"
            >
              <Plus size={18} /> Adicionar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.projects.map((proj, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-indigo-500/30 transition">
                {editingIndex === idx ? (
                  <div className="flex-1 flex gap-2">
                    <input 
                      autoFocus
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="flex-1 px-2 py-1 border border-indigo-300 rounded outline-none text-sm"
                    />
                    <button onClick={saveEdit} className="p-1 text-emerald-600"><Check size={18}/></button>
                    <button onClick={() => setEditingIndex(null)} className="p-1 text-red-500"><X size={18}/></button>
                  </div>
                ) : (
                  <>
                    <span className="font-bold text-slate-700">{proj}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(idx, proj)} className="p-2 text-slate-400 hover:text-indigo-600"><Edit3 size={16}/></button>
                      <button onClick={() => removeProject(proj)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsManager;
