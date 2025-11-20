import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { StatusBar } from './StatusBar';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  useKeyboardShortcuts();

  return (
    <div className="h-screen w-full bg-bg-primary dark:bg-bg-primary flex overflow-hidden transition-colors">
      <Navigation />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-bg-primary dark:bg-bg-primary">
          <div className="h-full w-full p-8 max-w-7xl mx-auto">{children}</div>
        </main>
        <StatusBar />
      </div>
    </div>
  );
};

