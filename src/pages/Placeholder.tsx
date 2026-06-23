import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { subjects } from '../data/mockData';
import { getSubjectSummaries } from '../utils/taskUtils';
import type { AppSettings, Task } from '../types';

interface PlaceholderProps {
  type: 'disciplinas' | 'configuracoes';
  tasks?: Task[];
  settings?: AppSettings;
  onChangeSettings?: (settings: AppSettings) => void;
}

const defaultSettings: AppSettings = {
  showTextLabels: true,
  confirmations: true,
  reminders: true,
};

export function Placeholder({ type, tasks = [], settings = defaultSettings, onChangeSettings }: PlaceholderProps) {
  function updateSettings(changes: Partial<AppSettings>) {
    onChangeSettings?.({ ...settings, ...changes });
  }

  if (type === 'disciplinas') {
    const subjectSummaries = getSubjectSummaries(subjects, tasks);

    return (
      <div className="page-grid">
        <PageHeader
          eyebrow="Estrutura prevista"
          title="Disciplinas"
          description="Tela de apoio para demonstrar a estrutura da informação, mesmo sem fluxo completo na apresentação."
        />
        <section className="subject-grid" aria-label="Disciplinas cadastradas">
          {subjectSummaries.map((subject) => (
            <Card key={subject.id} className="subject-card">
              <span className="subject-dot" style={{ backgroundColor: subject.color }} aria-hidden="true" />
              <h2>{subject.name}</h2>
              <p>{subject.professor}</p>
              <div className="progress-bar" aria-label={`Progresso ${subject.progress}%`}>
                <span style={{ width: `${subject.progress}%` }} />
              </div>
              <div className="subject-footer">
                <Badge>{subject.pending ? `${subject.pending} pendentes` : 'Em dia'}</Badge>
                <strong>{subject.progress}%</strong>
              </div>
            </Card>
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className="page-grid narrow-page">
      <PageHeader
        eyebrow="Estrutura prevista"
        title="Configurações"
        description="Preferências de lembretes, acessibilidade e notificações ficariam nesta área."
      />
      <Card className="form-card">
        <label className="checkbox-label large-check">
          <input
            type="checkbox"
            checked={settings.showTextLabels}
            onChange={(event) => updateSettings({ showTextLabels: event.target.checked })}
          />
          <span>Mostrar rótulos de texto ao lado dos ícones</span>
        </label>
        <label className="checkbox-label large-check">
          <input
            type="checkbox"
            checked={settings.confirmations}
            onChange={(event) => updateSettings({ confirmations: event.target.checked })}
          />
          <span>Usar mensagens de confirmação após ações importantes</span>
        </label>
        <label className="checkbox-label large-check">
          <input
            type="checkbox"
            checked={settings.reminders}
            onChange={(event) => updateSettings({ reminders: event.target.checked })}
          />
          <span>Receber lembretes de prazos próximos</span>
        </label>
      </Card>
    </div>
  );
}
