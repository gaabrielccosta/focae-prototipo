import { useMemo, useState } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { ProgressSteps } from '../components/ProgressSteps';
import { getSubjectSummaries, getTaskDisplayStatus, getTaskDueText, sortTasksByUrgency } from '../utils/taskUtils';
import type { Route, Subject, Task } from '../types';

interface PageProps {
  subjects: Subject[];
  tasks: Task[];
  onGeneratePlan: (taskIds: number[], subjectIds: number[]) => void;
  onNavigate: (route: Route) => void;
}

export function PlanReview({ subjects, tasks, onGeneratePlan, onNavigate }: PageProps) {
  const pendingTasks = useMemo(
    () => sortTasksByUrgency(tasks).filter((task) => getTaskDisplayStatus(task) !== 'Concluída'),
    [tasks],
  );
  const subjectSummaries = useMemo(() => getSubjectSummaries(subjects, tasks), [subjects, tasks]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>(() => pendingTasks.map((task) => task.id));
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const selectedCount = selectedTaskIds.length + selectedSubjectIds.length;

  function toggleTask(taskId: number) {
    setSelectedTaskIds((currentIds) =>
      currentIds.includes(taskId)
        ? currentIds.filter((currentId) => currentId !== taskId)
        : [...currentIds, taskId],
    );
  }

  function toggleSubject(subjectId: number) {
    setSelectedSubjectIds((currentIds) =>
      currentIds.includes(subjectId)
        ? currentIds.filter((currentId) => currentId !== subjectId)
        : [...currentIds, subjectId],
    );
  }

  function selectAllTasks() {
    setSelectedTaskIds(pendingTasks.map((task) => task.id));
  }

  function clearTaskSelection() {
    setSelectedTaskIds([]);
  }

  function clearSubjectSelection() {
    setSelectedSubjectIds([]);
  }

  function handleGenerateSuggestion() {
    onGeneratePlan(selectedTaskIds, selectedSubjectIds);
    onNavigate('/agenda/sugestao');
  }

  return (
    <div className="page-grid narrow-page">
      <PageHeader
        eyebrow="Etapa 2 de 4"
        title="Escolha o que entra no plano"
        description="Selecione tarefas com prazo e disciplinas avulsas para montar uma sugestão de estudos mais fiel à sua semana."
      />
      <ProgressSteps current={2} />

      <div className="plan-selection-stack">
        <Card as="section" className="selection-card" aria-labelledby="tasks-selection-title">
          <div className="selection-header">
            <div>
              <span className="mini-label">Tarefas com prazo</span>
              <h2 id="tasks-selection-title">Pendências selecionáveis</h2>
              <p>Use esta seção para incluir entregas, provas e leituras que precisam entrar no planejamento.</p>
            </div>
            <div className="selection-header-actions">
              <button type="button" onClick={selectAllTasks}>Selecionar todas</button>
              <button type="button" onClick={clearTaskSelection}>Limpar tarefas</button>
            </div>
          </div>

          <div className="selection-list" role="group" aria-labelledby="tasks-selection-title">
            {pendingTasks.map((task) => {
              const status = getTaskDisplayStatus(task);
              const selected = selectedTaskIds.includes(task.id);

              return (
                <label key={task.id} className={`selection-row ${selected ? 'selection-row-active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span className="selection-row-main">
                    <strong>{task.title}</strong>
                    <small>{task.subject} • {task.type} • Prazo: {getTaskDueText(task).toLowerCase()}</small>
                  </span>
                  <span className="selection-badges">
                    <Badge>{task.priority}</Badge>
                    <Badge>{status}</Badge>
                  </span>
                </label>
              );
            })}
            {pendingTasks.length === 0 && (
              <p className="selection-empty">Nenhuma tarefa pendente para selecionar.</p>
            )}
          </div>
        </Card>

        <Card as="section" className="selection-card" aria-labelledby="subjects-selection-title">
          <div className="selection-header">
            <div>
              <span className="mini-label">Disciplinas avulsas</span>
              <h2 id="subjects-selection-title">Revisões e reforços</h2>
              <p>Marque matérias que você quer estudar mesmo sem uma tarefa específica vinculada.</p>
            </div>
            <div className="selection-header-actions">
              <button type="button" onClick={clearSubjectSelection}>Limpar disciplinas</button>
            </div>
          </div>

          <div className="selection-list subject-selection-list" role="group" aria-labelledby="subjects-selection-title">
            {subjectSummaries.map((subject) => {
              const selected = selectedSubjectIds.includes(subject.id);

              return (
                <label key={subject.id} className={`selection-row subject-selection-row ${selected ? 'selection-row-active' : ''}`}>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleSubject(subject.id)}
                  />
                  <span className="subject-selection-dot" style={{ backgroundColor: subject.color }} aria-hidden="true" />
                  <span className="selection-row-main">
                    <strong>{subject.name}</strong>
                    <small>{subject.professor} • revisão avulsa</small>
                  </span>
                  <Badge>{subject.pending ? `${subject.pending} pendentes` : 'Em dia'}</Badge>
                </label>
              );
            })}
            {subjectSummaries.length === 0 && (
              <p className="selection-empty">Cadastre disciplinas para adicionar revisões avulsas ao plano.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="decision-note selection-summary" role="note">
        <strong>Critério usado:</strong> tarefas selecionadas são priorizadas por prazo e prioridade. Disciplinas avulsas entram como blocos de revisão depois das pendências escolhidas.
        <span>{selectedTaskIds.length} tarefas e {selectedSubjectIds.length} disciplinas selecionadas.</span>
      </div>

      <div className="form-actions plan-step-actions">
        <Button icon={ArrowLeft} variant="secondary" onClick={() => onNavigate('/agenda/disponibilidade')}>Voltar</Button>
        <Button icon={Sparkles} disabled={selectedCount === 0} onClick={handleGenerateSuggestion}>Gerar sugestão</Button>
      </div>
    </div>
  );
}
