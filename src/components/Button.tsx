import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'complete';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: LucideIcon | string;
}

export function Button({ children, variant = 'primary', icon, className = '', ...props }: ButtonProps) {
  const Icon = typeof icon === 'string' ? null : icon;

  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {Icon && <Icon aria-hidden="true" className="btn-icon" />}
      {typeof icon === 'string' && <span aria-hidden="true" className="btn-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
