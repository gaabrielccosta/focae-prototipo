import { useState, type Dispatch, type SetStateAction } from 'react';
import { ArrowLeft, Clock, Pencil, Save, Trash2, X } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { ProgressSteps } from '../components/ProgressSteps';
import {
  buildTimeRange,
  findPlanConflict,
  shiftTimeRange,
  splitTimeRange,
} from '../utils/planning';
import type { Route, StudyBlock, StudyPreferences } from '../types';

interface PageProps {
  draftStudyBlocks: StudyBlock[];
  preferences: StudyPreferences;
  onChangeDraftStudyBlocks: Dispatch<SetStateAction<StudyBlock[]>>;
  onNavigate: (route: Route) => void;
  onSaveStudyBlocks: (blocks: StudyBlock[]) => void;
}

export function PlanSuggestion({
  draftStudyBlocks,
  preferences,
  onChangeDraftStudyBlocks,
  onNavigate,
  onSaveStudyBlocks,
}: PageProps) {
  const [conflictResolved, setConflictResolved] = useState(false);
  const [editingBlockId, setEditingBlockId] = useState<number | null>(null);
  const conflict = findPlanConflict(draftStudyBlocks);

  function updateBlock(blockId: number, changes: Partial<StudyBlock>) {
    onChangeDraftStudyBlocks((currentBlocks) =>
      currentBlocks.map((block) => (block.id === blockId ? { ...block, ...changes } : block)),
    );
    setConflictResolved(false);
  }

  function removeBlock(blockId: number) {
    onChangeDraftStudyBlocks((currentBlocks) => currentBlocks.filter((block) => block.id !== blockId));
    if (editingBlockId === blockId) setEditingBlockId(null);
    setConflictResolved(false);
  }

  function resolveConflict() {
    if (!conflict) return;

    onChangeDraftStudyBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === conflict.id ? { ...block, time: shiftTimeRange(block.time, 30) } : block,
      ),
    );
    setConflictResolved(true);
  }

  function savePlan() {
    onSaveStudyBlocks(draftStudyBlocks);
    onNavigate('/agenda/sucesso');
  }

  return (
    <div className="page-grid">
      <PageHeader
        eyebrow="Etapa 3 de 4"
        title="Sugestão de plano semanal"
        description="Revise a sugestão, ajuste blocos de estudo e salve quando estiver tudo certo."
      />
      <ProgressSteps current={3} />

      {conflict && (
        <div className="alert alert-warning" role="alert">
          <strong>Conflito encontrado:</strong> quarta-feira tem outro compromisso às 20:00. Reagende o bloco de {conflict.subject} para continuar.
          <Button icon={Clock} variant="secondary" onClick={resolveConflict}>Reagendar para 20:30</Button>
        </div>
      )}

      {conflictResolved && !conflict && (
        <div className="alert alert-success" role="status">
          <strong>Conflito resolvido:</strong> o bloco foi ajustado para um horário livre.
        </div>
      )}

      <section className="suggestion-grid" aria-label="Blocos sugeridos">
        {draftStudyBlocks.map((block) => {
          const isEditing = editingBlockId === block.id;
          const { start, end } = splitTimeRange(block.time);

          return (
            <Card key={block.id} className="study-suggestion">
              <span className="mini-label">{block.day}</span>
              <h2>{block.subject}</h2>
              <p className="suggestion-time">{block.time}</p>
              <p>{block.reason}</p>

              {isEditing && (
                <div className="block-editor" aria-label={`Editar bloco de ${block.subject}`}>
                  <label>
                    <span>Dia</span>
                    <select value={block.day} onChange={(event) => updateBlock(block.id, { day: event.target.value })}>
                      {preferences.availability.map((slot) => (
                        <option key={slot.day}>{slot.day}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Início</span>
                    <input
                      type="time"
                      value={start}
                      onChange={(event) => updateBlock(block.id, { time: buildTimeRange(event.target.value, end) })}
                    />
                  </label>
                  <label>
                    <span>Fim</span>
                    <input
                      type="time"
                      value={end}
                      onChange={(event) => updateBlock(block.id, { time: buildTimeRange(start, event.target.value) })}
                    />
                  </label>
                </div>
              )}

              <div className="task-actions">
                <Button icon={isEditing ? X : Pencil} variant="ghost" onClick={() => setEditingBlockId(isEditing ? null : block.id)}>
                  {isEditing ? 'Fechar edição' : 'Editar'}
                </Button>
                <Button icon={Trash2} variant="ghost" onClick={() => removeBlock(block.id)}>Remover</Button>
              </div>
            </Card>
          );
        })}
        {draftStudyBlocks.length === 0 && (
          <Card className="study-suggestion">
            <span className="mini-label">Plano vazio</span>
            <h2>Nenhum bloco sugerido</h2>
            <p>Volte para a disponibilidade ou revise as tarefas pendentes para gerar uma sugestão.</p>
          </Card>
        )}
      </section>

      <div className="form-actions sticky-actions">
        <Button icon={ArrowLeft} variant="secondary" onClick={() => onNavigate('/agenda/revisao')}>Voltar</Button>
        <Button icon={Save} disabled={Boolean(conflict) || draftStudyBlocks.length === 0} onClick={savePlan}>Salvar plano</Button>
      </div>
    </div>
  );
}
