
export type Priority = 'Baixa' | 'Média' | 'Alta' | 'Urgente';
export type Status = 'Não Iniciada' | 'Em Andamento' | 'Bloqueada' | 'Concluída';

export interface TaskUpdate {
  id: string;
  date: string;
  note: string;
}

export interface Task {
  id: string;
  requestDate: string;
  project: string; 
  activity: string;
  description: string;
  projectLead: string;
  collaborators: string[];
  priority: Priority;
  status: Status;
  plannedStartDate: string;
  realStartDate?: string;
  completionDate: string;
  progress: number;
  nextStep: string;
  updates: TaskUpdate[];
  emailOnJoin: boolean;
  emailOnDeadline: boolean;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  notificationsEnabled: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ProjectData {
  id: string;
  name: string;
  trackingChecklist: ChecklistItem[];
  regulatoryChecklist: ChecklistItem[];
}

export interface DashboardStats {
  totalLastMonth: number;
  completed: number;
  inProgress: number;
  blocked: number;
  avgProgress: number;
}

export interface AppConfig {
  notificationEmail: string;
  people: Person[];
  projectsData: ProjectData[];
  projects: string[];
}

export type ViewMode = 'selection' | 'dashboard' | 'tasks' | 'projects' | 'people';
