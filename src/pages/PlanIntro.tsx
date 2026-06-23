import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { ProgressSteps } from '../components/ProgressSteps';
import type { Route } from '../types';

interface PageProps {
  onNavigate: (route: Route) => void;
}

export function PlanIntro({ onNavigate }: PageProps) {
  return (
    <div className="page-grid narrow-page">
      <PageHeader
        eyebrow="Fluxo crítico 2"
        title="Criar plano semanal"
        description="Monte sua semana em poucos passos, começando pelos horários em que você pode estudar."
      />

      <ProgressSteps current={1} />

      <Card className="intro-card" as="section">
        <h2>Vamos montar sua semana em poucos passos</h2>
        <p>O Focaê usa seus prazos, prioridades e horários disponíveis para sugerir blocos de estudo. Você poderá revisar e editar antes de salvar.</p>
        <ul className="check-list two-column-list">
          <li>Escolha dias e horários disponíveis.</li>
          <li>Revise tarefas e provas próximas.</li>
          <li>Veja uma sugestão automática.</li>
          <li>Edite e salve o plano final.</li>
        </ul>
        <div className="form-actions">
          <Button icon={ArrowLeft} variant="secondary" onClick={() => onNavigate('/agenda')}>Voltar</Button>
          <Button icon={ArrowRight} onClick={() => onNavigate('/agenda/disponibilidade')}>Começar</Button>
        </div>
      </Card>
    </div>
  );
}
