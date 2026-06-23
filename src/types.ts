export type Route =
  | '/'
  | '/tarefas'
  | '/tarefas/nova'
  | '/tarefas/nova-erro'
  | '/tarefas/sucesso'
  | '/agenda'
  | '/agenda/criar-plano'
  | '/agenda/disponibilidade'
  | '/agenda/revisao'
  | '/agenda/sugestao'
  | '/agenda/sucesso'
  | '/disciplinas'
  | '/configuracoes';

export type Priority = 'Alta' | 'Média' | 'Baixa';
export type TaskStatus = 'Pendente' | 'Atrasada' | 'Concluída';
export type TaskType = 'Prova' | 'Trabalho' | 'Leitura' | 'Exercício' | 'Revisão';

export interface TaskDraft {
  title: string;
  subject: string;
  type: TaskType;
  dueDate: string;
  dueTime: string;
  priority: Priority;
  reminder: string;
}

export interface Task {
  id: number;
  title: string;
  subject: string;
  type: TaskType;
  due: string;
  dueDate: string;
  dueTime: string;
  priority: Priority;
  status: TaskStatus;
  reminder: string;
  completedAt?: string;
}

export interface StudyBlock {
  id: number;
  day: string;
  time: string;
  subject: string;
  reason: string;
  taskId?: number;
}

export interface Subject {
  id: number;
  name: string;
  professor: string;
  color: string;
  pending: number;
  progress: number;
}

export interface AvailabilitySlot {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
}

export interface StudyPreferences {
  availability: AvailabilitySlot[];
  durationMinutes: number;
}

export interface AppSettings {
  showTextLabels: boolean;
  confirmations: boolean;
  reminders: boolean;
}
