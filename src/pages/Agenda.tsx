import { useMemo, useState } from 'react';
import { CalendarDays, CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { weekDays } from '../utils/planning';
import {
  addDays,
  formatTaskDueDateTime,
  getTaskDisplayStatus,
  getTaskDueText,
  sortTasksByUrgency,
  toDateInputValue,
} from '../utils/taskUtils';
import type { Route, StudyBlock, Task } from '../types';

interface PageProps {
  studyBlocks: StudyBlock[];
  tasks: Task[];
  onNavigate: (route: Route) => void;
}

function getShortDay(day: string) {
  return day.slice(0, 3);
}

function getStartOfWeek(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const day = start.getDay();
  const distanceToMonday = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + distanceToMonday);

  return start;
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(date);
}

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function normalizeClassName(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
}

export function Agenda({ studyBlocks, tasks, onNavigate }: PageProps) {
  const [weekStart, setWeekStart] = useState(() => getStartOfWeek(new Date()));
  const weekDates = useMemo(
    () => weekDays.map((_, index) => addDays(weekStart, index)),
    [weekStart],
  );
  const weekDateKeys = useMemo(
    () => weekDates.map((date) => toDateInputValue(date)),
    [weekDates],
  );
  const todayKey = toDateInputValue(new Date());
  const upcomingTasks = sortTasksByUrgency(tasks).filter((task) => getTaskDisplayStatus(task) !== 'Concluída').slice(0, 3);
  const tasksByDate = useMemo(() => {
    const dateKeys = new Set(weekDateKeys);
    const groupedTasks = new Map<string, Task[]>();

    tasks.forEach((task) => {
      if (!dateKeys.has(task.dueDate)) return;

      const tasksForDate = groupedTasks.get(task.dueDate) ?? [];
      groupedTasks.set(task.dueDate, [...tasksForDate, task]);
    });

    groupedTasks.forEach((tasksForDate) => {
      tasksForDate.sort((firstTask, secondTask) => firstTask.dueTime.localeCompare(secondTask.dueTime));
    });

    return groupedTasks;
  }, [tasks, weekDateKeys]);
  const studyBlocksByDay = useMemo(() => {
    const groupedBlocks = new Map<number, StudyBlock[]>();

    studyBlocks.forEach((block) => {
      const dayIndex = weekDays.findIndex((day) => day === getShortDay(block.day));
      if (dayIndex === -1) return;

      const blocksForDay = groupedBlocks.get(dayIndex) ?? [];
      groupedBlocks.set(dayIndex, [...blocksForDay, block]);
    });

    groupedBlocks.forEach((blocksForDay) => {
      blocksForDay.sort((firstBlock, secondBlock) => firstBlock.time.localeCompare(secondBlock.time));
    });

    return groupedBlocks;
  }, [studyBlocks]);

  const weekRangeLabel = `${formatShortDate(weekDates[0])} a ${formatShortDate(weekDates[6])}`;

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Agenda"
        title="Agenda semanal"
        description="Veja seus blocos de estudo, prazos próximos e ações de planejamento em uma única tela."
      >
        <Button icon={CalendarPlus} onClick={() => onNavigate('/agenda/criar-plano')}>Criar plano semanal</Button>
      </PageHeader>

      <div className="content-layout wide-left">
        <Card className="calendar-card" as="section">
          <div className="calendar-toolbar">
            <div>
              <span className="mini-label">Semana selecionada</span>
              <h2>{weekRangeLabel}</h2>
            </div>
            <div className="calendar-actions">
              <Button icon={ChevronLeft} variant="secondary" onClick={() => setWeekStart((currentWeek) => addDays(currentWeek, -7))}>
                Semana anterior
              </Button>
              <Button icon={CalendarDays} variant="ghost" onClick={() => setWeekStart(getStartOfWeek(new Date()))}>
                Hoje
              </Button>
              <Button icon={ChevronRight} variant="secondary" onClick={() => setWeekStart((currentWeek) => addDays(currentWeek, 7))}>
                Próxima semana
              </Button>
            </div>
          </div>

          <div className="week-grid" role="table" aria-label="Agenda da semana">
            {weekDates.map((date, index) => (
              <div
                key={weekDateKeys[index]}
                className={`week-day ${weekDateKeys[index] === todayKey ? 'week-day-today' : ''}`}
                role="columnheader"
              >
                <span>{weekDays[index]}</span>
                <strong>{formatShortDate(date)}</strong>
                <small>{weekDateKeys[index] === todayKey ? 'Hoje' : '\u00a0'}</small>
              </div>
            ))}
            {weekDates.map((date, index) => {
              const dateKey = weekDateKeys[index];
              const dayTasks = tasksByDate.get(dateKey) ?? [];
              const dayBlocks = studyBlocksByDay.get(index) ?? [];
              const hasItems = dayTasks.length > 0 || dayBlocks.length > 0;

              return (
                <div key={`${dateKey}-slot`} className="week-cell" role="cell" aria-label={`${weekDays[index]}, ${formatLongDate(date)}`}>
                  {hasItems ? (
                    <div className="calendar-cell-list">
                      {dayTasks.map((task) => {
                        const status = getTaskDisplayStatus(task);

                        return (
                          <article
                            key={`task-${task.id}`}
                            className={`agenda-task agenda-task-${normalizeClassName(status)}`}
                            aria-label={`${task.title}, prazo ${formatTaskDueDateTime(task)}`}
                          >
                            <span className="agenda-item-label">Prazo {task.dueTime}</span>
                            <strong>{task.title}</strong>
                            <small>{task.subject} • {task.type}</small>
                            <Badge>{status}</Badge>
                          </article>
                        );
                      })}

                      {dayBlocks.map((block) => (
                        <article key={`block-${block.id}`} className="study-block">
                          <span className="agenda-item-label">Estudo planejado</span>
                          <strong>{block.subject}</strong>
                          <span>{block.time}</span>
                          <small>{block.reason}</small>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <span className="empty-slot">Sem tarefa ou estudo planejado</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <aside className="side-panel">
          <Card>
            <h2>Próximos prazos</h2>
            <div className="mini-list">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="mini-list-item">
                  <div>
                    <strong>{task.title}</strong>
                    <small>{getTaskDueText(task)}</small>
                  </div>
                  <Badge>{task.priority}</Badge>
                </div>
              ))}
              {upcomingTasks.length === 0 && <span className="empty-slot">Nenhum prazo pendente.</span>}
            </div>
          </Card>
          <Card className="highlight-card">
            <span className="mini-label">Dica de organização</span>
            <p>Use a agenda para reservar horários antes dos prazos mais próximos.</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
