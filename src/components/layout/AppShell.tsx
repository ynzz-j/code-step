import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { ErrorBoundary } from '../ErrorBoundary';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Header />
      <main key={location.pathname} className="flex-1 overflow-auto animate-page-in">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
}
