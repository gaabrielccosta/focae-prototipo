import { useState, type FormEvent } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import type { Route, Subject, SubjectDraft } from '../types';

interface PageProps {
  subjects: Subject[];
  onCreateSubject: (subject: SubjectDraft) => void;
  onNavigate: (route: Route) => void;
}

const subjectColorOptions = ['#7c3aed', '#2563eb', '#b45309', '#15803d', '#b91c1c'];

export function NewSubject({ subjects, onCreateSubject, onNavigate }: PageProps) {
  const [subjectName, setSubjectName] = useState('');
  const [subjectProfessor, setSubjectProfessor] = useState('');
  const [subjectColor, setSubjectColor] = useState(subjectColorOptions[0]);
  const [subjectNameError, setSubjectNameError] = useState('');
  const [subjectProfessorError, setSubjectProfessorError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = subjectName.trim();
    const trimmedProfessor = subjectProfessor.trim();
    const duplicatedSubject = subjects.some((subject) => subject.name.toLowerCase() === trimmedName.toLowerCase());

    setSubjectNameError('');
    setSubjectProfessorError('');

    if (!trimmedName) {
      setSubjectNameError('Digite o nome da disciplina.');
      return;
    }

    if (duplicatedSubject) {
      setSubjectNameError('Essa disciplina já está cadastrada.');
      return;
    }

    if (!trimmedProfessor) {
      setSubjectProfessorError('Digite o nome do professor ou professora.');
      return;
    }

    onCreateSubject({
      name: trimmedName,
      professor: trimmedProfessor,
      color: subjectColor,
    });

    onNavigate('/disciplinas');
  }

  return (
    <div className="page-grid narrow-page">
      <PageHeader
        eyebrow="Disciplinas"
        title="Cadastrar disciplina"
        description="Adicione uma matéria para acompanhar pendências e usar no cadastro de tarefas acadêmicas."
      />

      <Card className="form-card" as="section">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid two-columns">
            <label className="field">
              <span>Nome da disciplina <strong aria-hidden="true">*</strong></span>
              <input
                value={subjectName}
                onChange={(event) => {
                  setSubjectName(event.target.value);
                  setSubjectNameError('');
                }}
                aria-invalid={Boolean(subjectNameError)}
                aria-describedby={subjectNameError ? 'subject-name-error' : undefined}
                placeholder="Ex.: História"
              />
              {subjectNameError && <small className="field-error" id="subject-name-error">{subjectNameError}</small>}
            </label>

            <label className="field">
              <span>Professor(a) <strong aria-hidden="true">*</strong></span>
              <input
                value={subjectProfessor}
                onChange={(event) => {
                  setSubjectProfessor(event.target.value);
                  setSubjectProfessorError('');
                }}
                aria-invalid={Boolean(subjectProfessorError)}
                aria-describedby={subjectProfessorError ? 'subject-professor-error' : undefined}
                placeholder="Ex.: Profª Ana"
              />
              {subjectProfessorError && <small className="field-error" id="subject-professor-error">{subjectProfessorError}</small>}
            </label>

            <label className="field field-full">
              <span>Cor da disciplina</span>
              <div className="color-picker-row compact-color-picker">
                <input
                  className="color-input"
                  type="color"
                  value={subjectColor}
                  onChange={(event) => setSubjectColor(event.target.value)}
                  aria-label="Escolher cor da disciplina"
                />
                <select value={subjectColor} onChange={(event) => setSubjectColor(event.target.value)}>
                  {subjectColorOptions.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          <div className="form-actions">
            <Button icon={X} type="button" variant="secondary" onClick={() => onNavigate('/disciplinas')}>
              Cancelar
            </Button>
            <Button icon={Save} type="submit">
              Salvar disciplina
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
