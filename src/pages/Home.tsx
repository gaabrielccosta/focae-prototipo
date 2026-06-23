import { useState } from "react";
import { CalendarPlus, Circle, Eye, Plus, RotateCcw } from "lucide-react";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import {
  formatTaskDueDateTime,
  getTaskDisplayStatus,
  getTaskDueText,
  getTaskMetrics,
  pluralize,
  sortTasksByUrgency,
} from "../utils/taskUtils";
import type { Route, Task } from "../types";

interface PageProps {
  tasks: Task[];
  onCompleteTask: (taskId: number) => void;
  onMarkTaskAsNotCompleted: (taskId: number) => void;
  onNavigate: (route: Route) => void;
}

export function Home({
  tasks,
  onCompleteTask,
  onMarkTaskAsNotCompleted,
  onNavigate,
}: PageProps) {
  const metrics = getTaskMetrics(tasks);
  const [visibleTaskIds] = useState(() =>
    sortTasksByUrgency(tasks)
      .filter((task) => getTaskDisplayStatus(task) !== "Concluída")
      .slice(0, 3)
      .map((task) => task.id),
  );
  const priorityTasks = visibleTaskIds
    .map((taskId) => tasks.find((task) => task.id === taskId))
    .filter((task): task is Task => Boolean(task));
  const highPriorityHint =
    metrics.highPriorityTodayCount > 0
      ? `${metrics.highPriorityTodayCount} ${pluralize(metrics.highPriorityTodayCount, "alta prioridade", "altas prioridades")}`
      : "nenhuma alta prioridade";
  const nextDeadlineHint = metrics.closestUpcomingTask
    ? `próximo: ${metrics.closestUpcomingTask.title}`
    : "sem prazos nos próximos 7 dias";
  const overdueHint = `${pluralize(metrics.overdueCount, "tarefa atrasada", "tarefas atrasadas")}`;

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Painel inicial"
        title="Boa noite. Vamos focar no que importa?"
        description="Veja rapidamente o que exige atenção hoje e escolha a próxima tarefa sem precisar procurar em várias telas."
      >
        <Button icon={Plus} onClick={() => onNavigate("/tarefas/nova")}>
          Nova tarefa
        </Button>
      </PageHeader>

      <section className="stats-grid" aria-label="Resumo da semana">
        <StatCard
          icon="!"
          label="Tarefas para hoje"
          value={String(metrics.todayCount)}
          hint={highPriorityHint}
        />
        <StatCard
          icon="↗"
          label="Próximos prazos"
          value={String(metrics.upcomingCount)}
          hint={nextDeadlineHint}
        />
        <StatCard
          icon="✓"
          label="Progresso semanal"
          value={`${metrics.progress}%`}
          hint={`${metrics.completedCount} de ${metrics.totalCount} tarefas`}
        />
        <StatCard
          icon="⚠"
          label="Atenção"
          value={String(metrics.overdueCount)}
          hint={overdueHint}
        />
      </section>

      <div className="content-layout">
        <section className="stack" aria-labelledby="prioridades-title">
          <div className="section-title-row">
            <h2 id="prioridades-title">Tarefas pendentes</h2>
            <Button
              icon={Eye}
              variant="ghost"
              onClick={() => onNavigate("/tarefas")}
            >
              Ver todas
            </Button>
          </div>

          {priorityTasks.length > 0 ? (
            priorityTasks.map((task) => {
              const status = getTaskDisplayStatus(task);

              return (
                <Card key={task.id} className="task-card">
                  <div className="task-main">
                    <div>
                      <div className="task-title-row">
                        <h3>{task.title}</h3>
                        <Badge>{status}</Badge>
                      </div>
                      <p>
                        {task.subject} • {task.type} • Prazo:{" "}
                        {formatTaskDueDateTime(task)}
                      </p>
                    </div>
                    <div
                      className="priority-tag"
                      aria-label={`Prioridade ${task.priority}`}
                    >
                      <strong>Prioridade</strong>
                      <Badge>{task.priority}</Badge>
                    </div>
                  </div>
                  <div className="task-actions">
                    <Button
                      icon={CalendarPlus}
                      variant="secondary"
                      onClick={() => onNavigate("/agenda/criar-plano")}
                    >
                      Planejar estudo
                    </Button>
                    {status === "Concluída" ? (
                      <Button
                        icon={RotateCcw}
                        variant="secondary"
                        onClick={() => onMarkTaskAsNotCompleted(task.id)}
                      >
                        Marcar não concluída
                      </Button>
                    ) : (
                      <Button
                        icon={Circle}
                        variant="complete"
                        onClick={() => onCompleteTask(task.id)}
                      >
                        Marcar concluída
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="empty-pending-card">
              <p>Não há tarefas pendentes no momento</p>
            </Card>
          )}
        </section>

        <aside className="side-panel" aria-labelledby="resumo-title">
          <Card>
            <h2 id="resumo-title">Resumo da semana</h2>
            <ul className="check-list">
              <li>
                <strong>{metrics.todayCount}</strong>{" "}
                {pluralize(metrics.todayCount, "tarefa", "tarefas")} para hoje.
              </li>
              <li>
                <strong>{metrics.upcomingCount}</strong>{" "}
                {pluralize(metrics.upcomingCount, "prazo", "prazos")} nos
                próximos 7 dias.
              </li>
              <li>
                <strong>{metrics.progress}%</strong> das tarefas concluídas.
              </li>
            </ul>
          </Card>
          <Card className="highlight-card">
            <span className="mini-label">Próxima ação sugerida</span>
            {metrics.nextActionTask ? (
              <>
                <h3>Estudar {metrics.nextActionTask.subject}</h3>
                <p>
                  {metrics.nextActionTask.title}: prazo{" "}
                  {getTaskDueText(metrics.nextActionTask).toLowerCase()}.
                  Recomendamos reservar 90 minutos.
                </p>
              </>
            ) : (
              <>
                <h3>Sem pendências</h3>
                <p>Todas as tarefas cadastradas estão concluídas no momento.</p>
              </>
            )}
            <Button
              icon={CalendarPlus}
              onClick={() => onNavigate("/agenda/criar-plano")}
            >
              Criar plano
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
