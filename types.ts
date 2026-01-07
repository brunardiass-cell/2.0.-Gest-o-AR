
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
  collaborators: string[]; // Pode conter nomes fora da lista fixa
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

export type TeamMember = 'Graziella' | 'Bruna' | 'Ester' | 'Marjorie' | 'Ana Luiza' | 'Ana Terzian';

export interface DashboardStats {
  totalLastMonth: number;
  completed: number;
  inProgress: number;
  blocked: number;
  avgProgress: number;
}

export interface AppConfig {
  notificationEmail: string;
  projects: string[];
  memberProjects: Record<TeamMember, string[]>;
}

export type ViewMode = 'selection' | 'dashboard' | 'tasks' | 'projects';
