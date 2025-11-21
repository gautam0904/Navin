import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
}

export default function ResizableSidebar({
  children,
  minWidth = 160,
  maxWidth = 480,
}: Props) {
  const [width, setWidth] = useState(260); // default VS Code width
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.min(Math.max(minWidth, e.clientX), maxWidth);
      setWidth(newWidth);
    };

    const stopResize = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopResize);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing, minWidth, maxWidth]);

  return (
    <div
      style={{ width }}
      className="h-full flex-shrink-0 bg-sidebar dark:bg-sidebar-dark border-r border-border relative select-none transition-none overflow-hidden"
    >
      <div className="h-full overflow-y-auto">{children}</div>

      {/* Resize handle */}
      <div
        className="absolute top-0 right-0 w-[5px] h-full cursor-col-resize hover:bg-primary/40 active:bg-primary/70"
        onMouseDown={() => setIsResizing(true)}
      />
    </div>
  );
}
