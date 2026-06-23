import type { ReactNode } from 'react';
import type { Route } from '../types';

interface AppShellProps {
  route: Route;
  onNavigate: (route: Route) => void;
  children: ReactNode;
}

const navItems: Array<{ route: Route; icon: string; label: string }> = [
  { route: '/', icon: '⌂', label: 'Início' },
  { route: '/agenda', icon: '▦', label: 'Agenda' },
  { route: '/tarefas', icon: '✓', label: 'Tarefas' },
  { route: '/disciplinas', icon: '□', label: 'Disciplinas' },
  { route: '/configuracoes', icon: '⚙', label: 'Configurações' },
];

function isActive(route: Route, itemRoute: Route) {
  if (itemRoute === '/') return route === '/';
  return route.startsWith(itemRoute);
}

export function AppShell({ route, onNavigate, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegação principal">
        <div className="brand" onClick={() => onNavigate('/')} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && onNavigate('/')}>
          <span className="brand-mark" aria-hidden="true">F</span>
          <div>
            <strong>Focaê</strong>
            <small>Organização de estudos</small>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <button
              key={item.route}
              className={`nav-item ${isActive(route, item.route) ? 'nav-item-active' : ''}`}
              onClick={() => onNavigate(item.route)}
              aria-current={isActive(route, item.route) ? 'page' : undefined}
            >
              <span aria-hidden="true" className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content" id="conteudo-principal">
        {children}
      </main>
    </div>
  );
}
