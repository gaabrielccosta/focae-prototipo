import type { Subject, Task, TaskDraft, TaskStatus } from '../types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const priorityRank: Record<Task['priority'], number> = {
  Alta: 0,
  Média: 1,
  Baixa: 2,
};

const statusRank: Record<TaskStatus, number> = {
  Atrasada: 0,
  Pendente: 1,
  Concluída: 2,
};

export function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysUntil(dateKey: string, referenceDate = new Date()) {
  return Math.round((parseDateKey(dateKey).getTime() - startOfDay(referenceDate).getTime()) / MS_PER_DAY);
}

export function formatDueLabel(dateKey: string, referenceDate = new Date()) {
  const diff = daysUntil(dateKey, referenceDate);

  if (diff === -1) return 'Ontem';
  if (diff < -1) return `${Math.abs(diff)} dias atrás`;
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Amanhã';
  if (diff <= 7) return `Em ${diff} dias`;

  return new Intl.DateTimeFormat('pt-BR').format(parseDateKey(dateKey));
}

export function getInitialTaskStatus(dueDate: string, referenceDate = new Date()): TaskStatus {
  return daysUntil(dueDate, referenceDate) < 0 ? 'Atrasada' : 'Pendente';
}

export function getTaskDisplayStatus(task: Task, referenceDate = new Date()): TaskStatus {
  if (task.status === 'Concluída') return 'Concluída';
  return getInitialTaskStatus(task.dueDate, referenceDate);
}

export function getTaskDueText(task: Task, referenceDate = new Date()) {
  if (task.status === 'Concluída') return task.due;
  return formatDueLabel(task.dueDate, referenceDate);
}

export function formatTaskDueDateTime(task: Pick<Task, 'dueDate' | 'dueTime'>) {
  const dueDate = parseDateKey(task.dueDate);
  const day = String(dueDate.getDate()).padStart(2, '0');
  const month = String(dueDate.getMonth() + 1).padStart(2, '0');
  const year = dueDate.getFullYear();

  return `${day}/${month}/${year} ${task.dueTime}`;
}

export function createTaskFromDraft(id: number, draft: TaskDraft, referenceDate = new Date()): Task {
  return {
    id,
    ...draft,
    due: formatDueLabel(draft.dueDate, referenceDate),
    status: getInitialTaskStatus(draft.dueDate, referenceDate),
  };
}

export function sortTasksByUrgency(tasks: Task[], referenceDate = new Date()) {
  return [...tasks].sort((firstTask, secondTask) => {
    const firstStatus = getTaskDisplayStatus(firstTask, referenceDate);
    const secondStatus = getTaskDisplayStatus(secondTask, referenceDate);
    const statusDifference = statusRank[firstStatus] - statusRank[secondStatus];
    if (statusDifference !== 0) return statusDifference;

    const dueDifference = daysUntil(firstTask.dueDate, referenceDate) - daysUntil(secondTask.dueDate, referenceDate);
    if (dueDifference !== 0) return dueDifference;

    return priorityRank[firstTask.priority] - priorityRank[secondTask.priority];
  });
}

export function getTaskMetrics(tasks: Task[], referenceDate = new Date()) {
  const openTasks = tasks.filter((task) => getTaskDisplayStatus(task, referenceDate) !== 'Concluída');
  const completedTasks = tasks.filter((task) => getTaskDisplayStatus(task, referenceDate) === 'Concluída');
  const todayTasks = openTasks.filter((task) => daysUntil(task.dueDate, referenceDate) === 0);
  const overdueTasks = openTasks.filter((task) => getTaskDisplayStatus(task, referenceDate) === 'Atrasada');
  const upcomingTasks = openTasks.filter((task) => {
    const diff = daysUntil(task.dueDate, referenceDate);
    return diff >= 0 && diff <= 7;
  });
  const highPriorityTodayTasks = todayTasks.filter((task) => task.priority === 'Alta');

  return {
    totalCount: tasks.length,
    completedCount: completedTasks.length,
    todayCount: todayTasks.length,
    highPriorityTodayCount: highPriorityTodayTasks.length,
    overdueCount: overdueTasks.length,
    upcomingCount: upcomingTasks.length,
    closestUpcomingTask: sortTasksByUrgency(upcomingTasks, referenceDate)[0] ?? null,
    nextActionTask: sortTasksByUrgency(openTasks, referenceDate)[0] ?? null,
    progress: tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
  };
}

export function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

export function getSubjectSummaries(subjects: Subject[], tasks: Task[], referenceDate = new Date()): Subject[] {
  return subjects.map((subject) => {
    const subjectTasks = tasks.filter((task) => task.subject === subject.name);
    const pending = subjectTasks.filter((task) => getTaskDisplayStatus(task, referenceDate) !== 'Concluída').length;
    const completed = subjectTasks.length - pending;
    const progress = subjectTasks.length > 0 ? Math.round((completed / subjectTasks.length) * 100) : 100;

    return {
      ...subject,
      pending,
      progress,
    };
  });
}
