import { CalendarPlus } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { weekDays } from '../utils/planning';
import { getTaskDisplayStatus, getTaskDueText, sortTasksByUrgency } from '../utils/taskUtils';
import type { Route, StudyBlock, Task } from '../types';

interface PageProps {
  studyBlocks: StudyBlock[];
  tasks: Task[];
  onNavigate: (route: Route) => void;
}

function getShortDay(day: string) {
  return day.slice(0, 3);
}

export function Agenda({ studyBlocks, tasks, onNavigate }: PageProps) {
  const upcomingTasks = sortTasksByUrgency(tasks).filter((task) => getTaskDisplayStatus(task) !== 'Concluída').slice(0, 3);

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
          <div className="week-grid" role="table" aria-label="Agenda da semana">
            {weekDays.map((day) => (
              <div key={day} className="week-day" role="columnheader">{day}</div>
            ))}
            {weekDays.map((day) => {
              const dayBlocks = studyBlocks.filter((block) => getShortDay(block.day) === day);

              return (
                <div key={`${day}-slot`} className="week-cell" role="cell">
                  {dayBlocks.length > 0 ? (
                    dayBlocks.map((block) => (
                      <article key={block.id} className="study-block">
                        <strong>{block.subject}</strong>
                        <span>{block.time}</span>
                      </article>
                    ))
                  ) : (
                    <span className="empty-slot">Sem estudo planejado</span>
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
