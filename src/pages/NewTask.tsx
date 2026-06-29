import { useState, type FormEvent } from 'react';
import { AlertCircle, Save, X } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { addDays, toDateInputValue } from '../utils/taskUtils';
import type { Priority, Route, Subject, TaskDraft, TaskType } from '../types';

interface PageProps {
  subjects: Subject[];
  onCreateTask: (draft: TaskDraft) => void;
  onNavigate: (route: Route) => void;
  forceError?: boolean;
}

export function NewTask({ subjects, onCreateTask, onNavigate, forceError = false }: PageProps) {
  const [title, setTitle] = useState(forceError ? '' : 'Trabalho de Psicologia');
  const [subject, setSubject] = useState(subjects[0]?.name ?? '');
  const [type, setType] = useState<TaskType>('Trabalho');
  const [dueDate, setDueDate] = useState(() => toDateInputValue(addDays(new Date(), 6)));
  const [dueTime, setDueTime] = useState('23:59');
  const [priority, setPriority] = useState<Priority>('Alta');
  const [reminder, setReminder] = useState('1 dia antes');
  const [showError, setShowError] = useState(forceError);
  const [showDateError, setShowDateError] = useState(false);
  const [showTimeError, setShowTimeError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const hasTitleError = !title.trim();
    const hasDateError = !dueDate;
    const hasTimeError = !dueTime;

    setShowError(hasTitleError);
    setShowDateError(hasDateError);
    setShowTimeError(hasTimeError);

    if (hasTitleError || hasDateError || hasTimeError) {
      return;
    }

    onCreateTask({
      title: title.trim(),
      subject,
      type,
      dueDate,
      dueTime,
      priority,
      reminder,
    });

    onNavigate('/tarefas/sucesso');
  }

  return (
    <div className="page-grid narrow-page">
      <PageHeader
        eyebrow="Fluxo crítico 1"
        title="Cadastrar tarefa acadêmica"
        description="Formulário curto, com rótulos visíveis e validação próxima ao campo para reduzir erro e esforço cognitivo."
      />

      <Card as="section" className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid two-columns">
            <label className="field field-full">
              <span>Título da tarefa <strong aria-hidden="true">*</strong></span>
              <input
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setShowError(false);
                }}
                aria-invalid={showError}
                aria-describedby={showError ? 'title-error' : undefined}
                placeholder="Ex.: Trabalho de Psicologia"
              />
              {showError && <small className="field-error" id="title-error">Digite um nome para a tarefa.</small>}
            </label>

            <label className="field">
              <span>Disciplina</span>
              <select value={subject} onChange={(event) => setSubject(event.target.value)}>
                {subjects.map((subjectOption) => (
                  <option key={subjectOption.id}>{subjectOption.name}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Tipo</span>
              <select value={type} onChange={(event) => setType(event.target.value as TaskType)}>
                <option>Prova</option>
                <option>Trabalho</option>
                <option>Leitura</option>
                <option>Exercício</option>
                <option>Revisão</option>
              </select>
            </label>

            <label className="field">
              <span>Data de entrega</span>
              <input
                type="date"
                value={dueDate}
                onChange={(event) => {
                  setDueDate(event.target.value);
                  setShowDateError(false);
                }}
                aria-invalid={showDateError}
                aria-describedby={showDateError ? 'date-error' : undefined}
              />
              {showDateError && <small className="field-error" id="date-error">Escolha uma data de entrega.</small>}
            </label>

            <label className="field">
              <span>Hora de entrega</span>
              <input
                type="time"
                value={dueTime}
                onChange={(event) => {
                  setDueTime(event.target.value);
                  setShowTimeError(false);
                }}
                aria-invalid={showTimeError}
                aria-describedby={showTimeError ? 'time-error' : undefined}
              />
              {showTimeError && <small className="field-error" id="time-error">Escolha uma hora de entrega.</small>}
            </label>

            <label className="field">
              <span>Prioridade</span>
              <select value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>
                <option>Alta</option>
                <option>Média</option>
                <option>Baixa</option>
              </select>
            </label>

            <label className="field field-full">
              <span>Lembrete</span>
              <select value={reminder} onChange={(event) => setReminder(event.target.value)}>
                <option>Sem lembrete</option>
                <option>No dia</option>
                <option>1 dia antes</option>
                <option>3 dias antes</option>
              </select>
            </label>
          </div>

          <div className="form-feedback" role="note">
            <strong>Antes de salvar:</strong> revise o prazo, a disciplina e o lembrete da tarefa.
          </div>

          <div className="form-actions">
            <Button icon={X} type="button" variant="secondary" onClick={() => onNavigate('/tarefas')}>Cancelar</Button>
            <Button icon={AlertCircle} type="button" variant="ghost" onClick={() => { setTitle(''); setShowError(true); }}>Simular erro</Button>
            <Button icon={Save} type="submit">Salvar tarefa</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
