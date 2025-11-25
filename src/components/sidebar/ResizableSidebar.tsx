import React, { useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange?: (width: number) => void;
}

export default function ResizableSidebar({
  children,
  minWidth = 60,
  maxWidth = 480,
  onWidthChange,
}: Props) {
  const [width, setWidth] = useState(260); // default VS Code width
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.min(Math.max(minWidth, e.clientX), maxWidth);
      setWidth(newWidth);
      onWidthChange?.(newWidth);
    };

    const stopResize = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopResize);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResize);
    };
  }, [isResizing, minWidth, maxWidth, onWidthChange]);

  return (
    <div
      style={{ width }}
      className="h-full shrink-0 bg-sidebar dark:bg-sidebar-dark border-r border-border/50 relative select-none transition-none overflow-hidden shadow-lg"
    >
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        {children}
      </div>

      {/* Resize handle */}
      <div
        className={`absolute top-0 right-0 w-1 h-full cursor-col-resize transition-all duration-200 ${
          isResizing ? 'bg-primary/70' : 'bg-transparent hover:bg-primary/30'
        }`}
        onMouseDown={() => setIsResizing(true)}
      >
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-1 h-12 rounded-l-full bg-primary/0 hover:bg-primary/50 transition-all duration-200" />
      </div>
    </div>
  );
}
