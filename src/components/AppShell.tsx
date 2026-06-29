import { useMemo, useState, type ReactNode } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from './Badge';
import { formatTaskDueDateTime, getTaskDisplayStatus } from '../utils/taskUtils';
import type { Route, Task } from '../types';

interface AppShellProps {
  route: Route;
  tasks: Task[];
  remindersEnabled: boolean;
  onNavigate: (route: Route) => void;
  children: ReactNode;
}

const navItems: Array<{ route: Route; icon: string; label: string }> = [
  { route: '/', icon: '⌂', label: 'Início' },
  { route: '/agenda', icon: '▦', label: 'Agenda' },
  { route: '/tarefas', icon: '✓', label: 'Tarefas' },
  { route: '/disciplinas', icon: '□', label: 'Disciplinas' },
  { route: '/configuracoes', icon: '⚙', label: 'Configurações' },
];

function isActive(route: Route, itemRoute: Route) {
  if (itemRoute === '/') return route === '/';
  return route.startsWith(itemRoute);
}

const reminderDaysBefore: Record<string, number | null> = {
  'Sem lembrete': null,
  'No dia': 0,
  '1 dia antes': 1,
  '3 dias antes': 3,
};

function getTaskDueDateTime(task: Task) {
  const [year, month, day] = task.dueDate.split('-').map(Number);
  const [hours, minutes] = task.dueTime.split(':').map(Number);

  return new Date(year, month - 1, day, hours, minutes);
}

function getReminderStartDate(task: Task) {
  const daysBefore = reminderDaysBefore[task.reminder] ?? null;
  if (daysBefore === null) return null;

  const dueDateTime = getTaskDueDateTime(task);
  const reminderStart = new Date(dueDateTime);

  if (daysBefore === 0) {
    reminderStart.setHours(0, 0, 0, 0);
    return reminderStart;
  }

  reminderStart.setDate(reminderStart.getDate() - daysBefore);
  return reminderStart;
}

function getTasksInsideReminderWindow(tasks: Task[]) {
  const now = new Date();

  return tasks
    .filter((task) => {
      if (getTaskDisplayStatus(task) === 'Concluída') return false;

      const reminderStart = getReminderStartDate(task);
      return Boolean(reminderStart && now >= reminderStart);
    })
    .sort((firstTask, secondTask) => getTaskDueDateTime(firstTask).getTime() - getTaskDueDateTime(secondTask).getTime());
}

export function AppShell({ route, tasks, remindersEnabled, onNavigate, children }: AppShellProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dismissedReminderTaskIds, setDismissedReminderTaskIds] = useState<Set<number>>(() => new Set());
  const allReminderTasks = useMemo(() => (
    remindersEnabled ? getTasksInsideReminderWindow(tasks) : []
  ), [remindersEnabled, tasks]);
  const reminderTasks = useMemo(() => (
    allReminderTasks.filter((task) => !dismissedReminderTaskIds.has(task.id))
  ), [allReminderTasks, dismissedReminderTaskIds]);

  function navigate(nextRoute: Route) {
    setNotificationsOpen(false);
    onNavigate(nextRoute);
  }

  function clearReminders() {
    setDismissedReminderTaskIds((currentIds) => {
      const nextIds = new Set(currentIds);
      reminderTasks.forEach((task) => nextIds.add(task.id));
      return nextIds;
    });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegação principal">
        <div className="brand" onClick={() => navigate('/')} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/')}>
          <span className="brand-mark" aria-hidden="true">F</span>
          <div>
            <strong>Focaê</strong>
            <small>Organização de estudos</small>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <button
              key={item.route}
              className={`nav-item ${isActive(route, item.route) ? 'nav-item-active' : ''}`}
              onClick={() => navigate(item.route)}
              aria-current={isActive(route, item.route) ? 'page' : undefined}
            >
              <span aria-hidden="true" className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content" id="conteudo-principal">
        <header className="app-topbar" aria-label="Barra superior">
          <div className="notification-menu">
            <button
              className={`notification-button ${notificationsOpen ? 'notification-button-active' : ''}`}
              type="button"
              aria-label={`${reminderTasks.length} lembretes de tarefas`}
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen((isOpen) => !isOpen)}
            >
              <Bell aria-hidden="true" />
              {reminderTasks.length > 0 && <span className="notification-count">{reminderTasks.length}</span>}
            </button>

            {notificationsOpen && (
              <div className="notification-popover" role="dialog" aria-label="Lembretes de tarefas">
                <div className="notification-popover-header">
                  <div>
                    <h2>Lembretes</h2>
                    <span>{reminderTasks.length} {reminderTasks.length === 1 ? 'tarefa' : 'tarefas'}</span>
                  </div>
                  {reminderTasks.length > 0 && (
                    <button className="notification-clear" type="button" onClick={clearReminders}>
                      Limpar lembretes
                    </button>
                  )}
                </div>

                {!remindersEnabled ? (
                  <p className="notification-empty">Os lembretes estão desativados nas configurações.</p>
                ) : reminderTasks.length > 0 ? (
                  <div className="notification-list">
                    {reminderTasks.map((task) => {
                      const status = getTaskDisplayStatus(task);

                      return (
                        <article key={task.id} className="notification-item">
                          <div>
                            <strong>{task.title}</strong>
                            <small>{task.subject} • Prazo: {formatTaskDueDateTime(task)}</small>
                            <span>{task.reminder}</span>
                          </div>
                          <Badge>{status}</Badge>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <p className="notification-empty">Nenhuma tarefa dentro do prazo de lembrete.</p>
                )}
              </div>
            )}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
