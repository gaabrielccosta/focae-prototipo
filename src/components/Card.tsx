import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: 'article' | 'section' | 'div';
}

export function Card({ children, className = '', as: Component = 'article' }: CardProps) {
  return <Component className={`card ${className}`}>{children}</Component>;
}
