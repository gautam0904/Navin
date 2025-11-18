import { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      <Navigation />
      <div className="flex-1 overflow-y-auto">
        <div className="h-full w-full p-6">{children}</div>
      </div>
    </div>
  );
};

