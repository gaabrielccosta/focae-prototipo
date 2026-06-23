import { ArrowLeft, Sparkles } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { ProgressSteps } from '../components/ProgressSteps';
import { getTaskDisplayStatus, getTaskDueText, sortTasksByUrgency } from '../utils/taskUtils';
import type { Route, Task } from '../types';

interface PageProps {
  tasks: Task[];
  onGeneratePlan: () => void;
  onNavigate: (route: Route) => void;
}

export function PlanReview({ tasks, onGeneratePlan, onNavigate }: PageProps) {
  const pendingTasks = sortTasksByUrgency(tasks).filter((task) => getTaskDisplayStatus(task) !== 'Concluída');

  function handleGenerateSuggestion() {
    onGeneratePlan();
    onNavigate('/agenda/sugestao');
  }

  return (
    <div className="page-grid narrow-page">
      <PageHeader
        eyebrow="Etapa 2 de 4"
        title="Revise suas pendências"
        description="Confira os prazos que serão considerados na sugestão do plano semanal."
      />
      <ProgressSteps current={2} />

      <Card as="section" className="table-card">
        <table className="data-table compact-table">
          <thead>
            <tr>
              <th>Pendência</th>
              <th>Prazo</th>
              <th>Prioridade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingTasks.map((task) => {
              const status = getTaskDisplayStatus(task);

              return (
                <tr key={task.id}>
                  <td><strong>{task.title}</strong><small>{task.subject} • {task.type}</small></td>
                  <td>{getTaskDueText(task)}</td>
                  <td><Badge>{task.priority}</Badge></td>
                  <td><Badge>{status}</Badge></td>
                </tr>
              );
            })}
            {pendingTasks.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-table-cell">Nenhuma pendência para planejar.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="decision-note" role="note">
          <strong>Critério usado:</strong> prazos mais próximos e prioridades altas aparecem antes na sugestão de estudos.
        </div>

        <div className="form-actions">
          <Button icon={ArrowLeft} variant="secondary" onClick={() => onNavigate('/agenda/disponibilidade')}>Voltar</Button>
          <Button icon={Sparkles} disabled={pendingTasks.length === 0} onClick={handleGenerateSuggestion}>Gerar sugestão</Button>
        </div>
      </Card>
    </div>
  );
}
