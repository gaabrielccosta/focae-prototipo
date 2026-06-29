import type { StudyBlock, StudyPreferences, Subject, Task } from '../types';
import { formatDueLabel, getTaskDisplayStatus, sortTasksByUrgency } from './taskUtils';

export const defaultStudyPreferences: StudyPreferences = {
  availability: [
    { day: 'Segunda-feira', enabled: true, start: '19:00', end: '21:00' },
    { day: 'Terça-feira', enabled: false, start: '', end: '' },
    { day: 'Quarta-feira', enabled: true, start: '20:00', end: '22:00' },
    { day: 'Quinta-feira', enabled: false, start: '', end: '' },
    { day: 'Sexta-feira', enabled: false, start: '', end: '' },
    { day: 'Sábado', enabled: true, start: '09:00', end: '11:00' },
    { day: 'Domingo', enabled: false, start: '', end: '' },
  ],
  durationMinutes: 90,
};

export const durationOptions = [45, 60, 90, 120];

export const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function parseTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function buildReason(task: Task) {
  if (getTaskDisplayStatus(task) === 'Atrasada') return `${task.type} atrasada`;
  return `Vence ${formatDueLabel(task.dueDate).toLowerCase()}`;
}

interface GenerateStudyBlocksOptions {
  taskIds?: number[];
  extraSubjects?: Subject[];
}

interface StudyPlanEntry {
  id: number;
  subject: string;
  reason: string;
  taskId?: number;
  subjectId?: number;
}

export function splitTimeRange(timeRange: string) {
  const [start = '', end = ''] = timeRange.split(' - ');
  return { start, end };
}

export function buildTimeRange(start: string, end: string) {
  return `${start} - ${end}`;
}

export function shiftTimeRange(timeRange: string, minutes: number) {
  const { start, end } = splitTimeRange(timeRange);
  return buildTimeRange(formatTime(parseTime(start) + minutes), formatTime(parseTime(end) + minutes));
}

export function generateStudyBlocks(
  tasks: Task[],
  preferences: StudyPreferences,
  options: GenerateStudyBlocksOptions = {},
): StudyBlock[] {
  const slots = preferences.availability.filter((slot) => slot.enabled && slot.start && slot.end);
  if (slots.length === 0) return [];

  const openTasks = sortTasksByUrgency(tasks).filter((task) => getTaskDisplayStatus(task) !== 'Concluída');
  const selectedTaskIds = options.taskIds ? new Set(options.taskIds) : null;
  const selectedTasks = selectedTaskIds ? openTasks.filter((task) => selectedTaskIds.has(task.id)) : openTasks;
  const taskEntries: StudyPlanEntry[] = selectedTasks.map((task) => ({
    id: task.id,
    taskId: task.id,
    subject: task.subject,
    reason: buildReason(task),
  }));
  const subjectEntries: StudyPlanEntry[] = (options.extraSubjects ?? []).map((subject) => ({
    id: 100000 + subject.id,
    subjectId: subject.id,
    subject: subject.name,
    reason: 'Revisão avulsa selecionada',
  }));
  const planEntries = [...taskEntries, ...subjectEntries];
  if (planEntries.length === 0) return [];

  return planEntries.map((entry, index) => {
    const slot = slots[index % slots.length];
    const startMinutes = parseTime(slot.start);
    const slotEndMinutes = parseTime(slot.end);
    const endMinutes = Math.min(startMinutes + preferences.durationMinutes, slotEndMinutes);

    return {
      id: entry.id,
      taskId: entry.taskId,
      subjectId: entry.subjectId,
      day: slot.day,
      time: buildTimeRange(formatTime(startMinutes), formatTime(endMinutes)),
      subject: entry.subject,
      reason: entry.reason,
    };
  });
}

export function findPlanConflict(blocks: StudyBlock[]) {
  return blocks.find((block) => {
    const { start } = splitTimeRange(block.time);
    return block.day === 'Quarta-feira' && start === '20:00';
  }) ?? null;
}
