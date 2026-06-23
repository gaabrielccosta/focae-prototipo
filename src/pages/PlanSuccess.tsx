import { Eye, Home } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import type { Route, StudyBlock } from '../types';

interface PageProps {
  studyBlocks: StudyBlock[];
  onNavigate: (route: Route) => void;
}

export function PlanSuccess({ studyBlocks, onNavigate }: PageProps) {
  return (
    <div className="center-page">
      <Card className="success-card large-success" as="section">
        <span className="success-icon" aria-hidden="true">✓</span>
        <p className="eyebrow">Etapa 4 de 4</p>
        <h1>Plano semanal criado com sucesso.</h1>
        <p>Os blocos foram adicionados à agenda. Você pode editar ou reagendar depois se sua rotina mudar.</p>

        <div className="saved-plan" aria-label="Plano salvo">
          {studyBlocks.map((block) => (
            <div key={block.id}>
              <strong>{block.day}</strong>
              <span>{block.subject} • {block.time}</span>
            </div>
          ))}
          {studyBlocks.length === 0 && <span className="empty-slot">Nenhum bloco salvo.</span>}
        </div>

        <div className="success-actions">
          <Button icon={Eye} variant="secondary" onClick={() => onNavigate('/agenda')}>Ver agenda</Button>
          <Button icon={Home} onClick={() => onNavigate('/')}>Voltar ao início</Button>
        </div>
      </Card>
    </div>
  );
}
