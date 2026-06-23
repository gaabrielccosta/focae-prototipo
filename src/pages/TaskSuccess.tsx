import { CalendarPlus, Eye, RotateCcw } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import type { Route, Task } from '../types';

interface PageProps {
  lastCreatedTask: Task | null;
  onUndoCreateTask: () => void;
  onNavigate: (route: Route) => void;
}

export function TaskSuccess({ lastCreatedTask, onUndoCreateTask, onNavigate }: PageProps) {
  function handleUndoCreate() {
    onUndoCreateTask();
    onNavigate('/tarefas');
  }

  return (
    <div className="center-page">
      <Card className="success-card" as="section">
        <span className="success-icon" aria-hidden="true">✓</span>
        <p className="eyebrow">Feedback do sistema</p>
        <h1>Tarefa salva com sucesso.</h1>
        <p>{lastCreatedTask ? `${lastCreatedTask.title} foi adicionada à lista de tarefas e aparecerá no planejamento semanal.` : 'A tarefa foi adicionada à lista e aparecerá no planejamento semanal.'}</p>
        <div className="success-actions">
          <Button icon={Eye} variant="secondary" onClick={() => onNavigate('/tarefas')}>Ver tarefas</Button>
          <Button icon={CalendarPlus} onClick={() => onNavigate('/agenda/criar-plano')}>Criar plano semanal</Button>
        </div>
        {lastCreatedTask && (
          <button className="undo-link" type="button" onClick={handleUndoCreate}>
            <RotateCcw aria-hidden="true" className="undo-link-icon" />
            <span>Desfazer cadastro</span>
          </button>
        )}
      </Card>
    </div>
  );
}
