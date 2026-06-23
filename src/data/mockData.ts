import type { StudyBlock, Subject, Task } from '../types';

export const tasks: Task[] = [
  {
    id: 1,
    title: 'Trabalho de Psicologia',
    subject: 'Psicologia',
    type: 'Trabalho',
    due: 'Amanhã, 23:59',
    dueDate: '2026-06-23',
    dueTime: '23:59',
    priority: 'Alta',
    status: 'Pendente',
    reminder: '1 dia antes',
  },
  {
    id: 2,
    title: 'Prova de Estatística',
    subject: 'Estatística',
    type: 'Prova',
    due: 'Em 3 dias',
    dueDate: '2026-06-25',
    dueTime: '08:00',
    priority: 'Alta',
    status: 'Pendente',
    reminder: '3 dias antes',
  },
  {
    id: 3,
    title: 'Lista de Cálculo',
    subject: 'Cálculo',
    type: 'Exercício',
    due: 'Ontem, 18:00',
    dueDate: '2026-06-21',
    dueTime: '18:00',
    priority: 'Média',
    status: 'Atrasada',
    reminder: 'No dia',
  },
  {
    id: 4,
    title: 'Leitura de Metodologia',
    subject: 'Metodologia Científica',
    type: 'Leitura',
    due: 'Concluída ontem',
    dueDate: '2026-06-21',
    dueTime: '20:00',
    priority: 'Baixa',
    status: 'Concluída',
    reminder: 'Sem lembrete',
  },
];

export const subjects: Subject[] = [
  { id: 1, name: 'Psicologia', professor: 'Profª Helena', color: '#7c3aed', pending: 2, progress: 64 },
  { id: 2, name: 'Estatística', professor: 'Prof. Bruno', color: '#2563eb', pending: 1, progress: 48 },
  { id: 3, name: 'Cálculo', professor: 'Prof. André', color: '#b45309', pending: 3, progress: 35 },
  { id: 4, name: 'Metodologia Científica', professor: 'Profª Camila', color: '#15803d', pending: 0, progress: 92 },
];

export const suggestedBlocks: StudyBlock[] = [
  {
    id: 1,
    day: 'Segunda-feira',
    time: '19:00 - 20:30',
    subject: 'Psicologia',
    reason: 'Trabalho vence amanhã',
  },
  {
    id: 2,
    day: 'Quarta-feira',
    time: '20:00 - 21:30',
    subject: 'Estatística',
    reason: 'Prova em 3 dias',
  },
  {
    id: 3,
    day: 'Sábado',
    time: '09:00 - 10:30',
    subject: 'Cálculo',
    reason: 'Lista atrasada',
  },
];

export const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
