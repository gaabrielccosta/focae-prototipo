import { CheckCircle2, X } from 'lucide-react';
import type { Toast } from 'react-hot-toast';
import toast from 'react-hot-toast';
import type { Task } from '../types';

interface TaskCompletedToastProps {
  task: Task;
  toastInstance: Toast;
}

export function TaskCompletedToast({ task, toastInstance }: TaskCompletedToastProps) {
  return (
    <div className={`completion-toast ${toastInstance.visible ? 'completion-toast-visible' : ''}`}>
      <div className="completion-toast-icon" aria-hidden="true">
        <CheckCircle2 />
      </div>
      <div className="completion-toast-content">
        <strong>Tarefa concluída: {task.title}</strong>
        <p>Você pode desfazer essa ação na aba das tarefas.</p>
      </div>
      <button
        className="completion-toast-close"
        type="button"
        aria-label="Fechar notificação"
        onClick={() => toast.dismiss(toastInstance.id)}
      >
        <X aria-hidden="true" />
      </button>
    </div>
  );
}
