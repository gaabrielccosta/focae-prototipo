interface ProgressStepsProps {
  current: number;
}

const steps = ['Disponibilidade', 'Pendências', 'Sugestão', 'Confirmação'];

export function ProgressSteps({ current }: ProgressStepsProps) {
  return (
    <ol className="steps" aria-label="Etapas do plano semanal">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const state = stepNumber < current ? 'done' : stepNumber === current ? 'active' : 'upcoming';
        return (
          <li key={step} className={`step step-${state}`} aria-current={state === 'active' ? 'step' : undefined}>
            <span className="step-number">{stepNumber}</span>
            <span>{step}</span>
          </li>
        );
      })}
    </ol>
  );
}
