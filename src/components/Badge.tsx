import type { Priority, TaskStatus } from '../types';

type BadgeKind = Priority | TaskStatus | 'Prova' | 'Trabalho' | 'Leitura' | 'Exercício' | 'Revisão' | 'Info';

interface BadgeProps {
  children: BadgeKind | string;
}

export function Badge({ children }: BadgeProps) {
  const normalized = String(children)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');

  return <span className={`badge badge-${normalized}`}>{children}</span>;
}
