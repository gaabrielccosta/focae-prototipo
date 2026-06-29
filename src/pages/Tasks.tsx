import { useMemo, useState } from 'react';
import { Circle, Plus, RotateCcw } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { formatTaskDueDateTime, getTaskDisplayStatus } from '../utils/taskUtils';
import type { Priority, Route, Task, TaskStatus } from '../types';

interface PageProps {
  tasks: Task[];
  onCompleteTask: (taskId: number) => void;
  onMarkTaskAsNotCompleted: (taskId: number) => void;
  onNavigate: (route: Route) => void;
}

function compareTasksByDueDate(firstTask: Task, secondTask: Task) {
  const dateDifference = firstTask.dueDate.localeCompare(secondTask.dueDate);
  if (dateDifference !== 0) return dateDifference;

  return firstTask.dueTime.localeCompare(secondTask.dueTime);
}

export function Tasks({
  tasks,
  onCompleteTask,
  onMarkTaskAsNotCompleted,
  onNavigate,
}: PageProps) {
  const [subjectFilter, setSubjectFilter] = useState('Todas');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'Todas'>('Todas');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'Todos'>('Todos');

  const subjects = useMemo(() => Array.from(new Set(tasks.map((task) => task.subject))).sort(), [tasks]);
  const filteredTasks = useMemo(() => (
    tasks.filter((task) => {
      const status = getTaskDisplayStatus(task);
      const matchesSubject = subjectFilter === 'Todas' || task.subject === subjectFilter;
      const matchesPriority = priorityFilter === 'Todas' || task.priority === priorityFilter;
      const matchesStatus = statusFilter === 'Todos' || status === statusFilter;
      return matchesSubject && matchesPriority && matchesStatus;
    }).sort(compareTasksByDueDate)
  ), [priorityFilter, statusFilter, subjectFilter, tasks]);

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Tarefas"
        title="Tarefas acadêmicas"
        description="Organize suas atividades por prazo, status e prioridade para escolher o próximo passo com mais clareza."
      >
        <Button icon={Plus} onClick={() => onNavigate('/tarefas/nova')}>Nova tarefa</Button>
      </PageHeader>

      <Card className="filters-card" as="section">
        <label>
          <span>Disciplina</span>
          <select value={subjectFilter} aria-label="Filtrar por disciplina" onChange={(event) => setSubjectFilter(event.target.value)}>
            <option>Todas</option>
            {subjects.map((subject) => (
              <option key={subject}>{subject}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Prioridade</span>
          <select value={priorityFilter} aria-label="Filtrar por prioridade" onChange={(event) => setPriorityFilter(event.target.value as Priority | 'Todas')}>
            <option>Todas</option>
            <option>Alta</option>
            <option>Média</option>
            <option>Baixa</option>
          </select>
        </label>
        <label>
          <span>Status</span>
          <select value={statusFilter} aria-label="Filtrar por status" onChange={(event) => setStatusFilter(event.target.value as TaskStatus | 'Todos')}>
            <option>Todos</option>
            <option>Pendente</option>
            <option>Atrasada</option>
            <option>Concluída</option>
          </select>
        </label>
      </Card>

      <Card className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Disciplina</th>
              <th>Tipo</th>
              <th>Prazo</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => {
              const status = getTaskDisplayStatus(task);

              return (
                <tr key={task.id}>
                  <td><strong>{task.title}</strong><small>Lembrete: {task.reminder}</small></td>
                  <td>{task.subject}</td>
                  <td>{task.type}</td>
                  <td>{formatTaskDueDateTime(task)}</td>
                  <td><Badge>{task.priority}</Badge></td>
                  <td><Badge>{status}</Badge></td>
                  <td>
                    {status === 'Concluída' ? (
                      <Button
                        className="task-row-action"
                        icon={RotateCcw}
                        variant="secondary"
                        onClick={() => onMarkTaskAsNotCompleted(task.id)}
                      >
                        <>
                          Marcar não
                          <br />
                          concluída
                        </>
                      </Button>
                    ) : (
                      <Button className="task-row-action" icon={Circle} variant="complete" onClick={() => onCompleteTask(task.id)}>
                        <>
                          Marcar
                          <br />
                          concluída
                        </>
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-table-cell">Nenhuma tarefa encontrada com esses filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
