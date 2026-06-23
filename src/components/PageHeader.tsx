import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <div className="page-header-heading-row">
          <h1>{title}</h1>
          {children && <div className="page-header-actions">{children}</div>}
        </div>
        <p>{description}</p>
      </div>
    </header>
  );
}
