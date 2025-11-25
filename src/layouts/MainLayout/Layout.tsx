import { ReactNode, useState } from 'react';
import ResizableSidebar from './Sidebar';
import Sidebar from '../../components/sidebar/Sidebar';
import { StatusBar } from './StatusBar';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  useKeyboardShortcuts();

  const [width, setWidth] = useState(260);

  return (
    <div className="h-screen w-full flex bg-bg-primary dark:bg-bg-primary overflow-hidden">
      {/* Resizable VS Code Sidebar */}
      <ResizableSidebar onWidthChange={(w: number) => setWidth(w)}>
        {/* Add your sidebar content here */}
        <Sidebar width={width} />
      </ResizableSidebar>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="h-full w-full p-8 max-w-7xl mx-auto">{children}</div>
        </main>

        <StatusBar />
      </div>
    </div>
  );
};
