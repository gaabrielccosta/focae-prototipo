import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { ProgressSteps } from '../components/ProgressSteps';
import { durationOptions } from '../utils/planning';
import type { AvailabilitySlot, Route, StudyPreferences } from '../types';

interface PageProps {
  preferences: StudyPreferences;
  onChangePreferences: (preferences: StudyPreferences) => void;
  onNavigate: (route: Route) => void;
}

export function PlanAvailability({ preferences, onChangePreferences, onNavigate }: PageProps) {
  function updateSlot(index: number, changes: Partial<AvailabilitySlot>) {
    const availability = preferences.availability.map((slot, slotIndex) => {
      if (slotIndex !== index) return slot;

      const nextSlot = { ...slot, ...changes };
      if (nextSlot.enabled && (!nextSlot.start || !nextSlot.end)) {
        return { ...nextSlot, start: nextSlot.start || '19:00', end: nextSlot.end || '21:00' };
      }

      return nextSlot;
    });

    onChangePreferences({ ...preferences, availability });
  }

  return (
    <div className="page-grid narrow-page">
      <PageHeader
        eyebrow="Etapa 1 de 4"
        title="Quando você pode estudar?"
        description="Informe seus horários livres para que o Focaê sugira um plano realista para a semana."
      />
      <ProgressSteps current={1} />

      <Card as="section" className="form-card">
        <div className="availability-grid" aria-label="Disponibilidade semanal">
          {preferences.availability.map((slot, index) => (
            <div className="availability-row" key={slot.day}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={slot.enabled}
                  onChange={(event) => updateSlot(index, { enabled: event.target.checked })}
                />
                <span>{slot.day}</span>
              </label>
              <label>
                <span>Início</span>
                <input
                  type="time"
                  value={slot.start}
                  disabled={!slot.enabled}
                  onChange={(event) => updateSlot(index, { start: event.target.value })}
                />
              </label>
              <label>
                <span>Fim</span>
                <input
                  type="time"
                  value={slot.end}
                  disabled={!slot.enabled}
                  onChange={(event) => updateSlot(index, { end: event.target.value })}
                />
              </label>
            </div>
          ))}
        </div>

        <label className="field compact-field">
          <span>Duração média de cada bloco</span>
          <select
            value={preferences.durationMinutes}
            onChange={(event) => onChangePreferences({ ...preferences, durationMinutes: Number(event.target.value) })}
          >
            {durationOptions.map((duration) => (
              <option key={duration} value={duration}>{duration} minutos</option>
            ))}
          </select>
        </label>

        <div className="form-actions">
          <Button icon={ArrowLeft} variant="secondary" onClick={() => onNavigate('/agenda/criar-plano')}>Voltar</Button>
          <Button icon={ArrowRight} onClick={() => onNavigate('/agenda/revisao')}>Continuar</Button>
        </div>
      </Card>
    </div>
  );
}
