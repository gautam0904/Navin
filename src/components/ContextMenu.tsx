import { useEffect, useRef, ReactNode } from 'react';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    children: ReactNode;
}

export const ContextMenu = ({ x, y, onClose, children }: ContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            className="fixed bg-bg-secondary dark:bg-bg-secondary border border-border-light dark:border-border-medium rounded shadow-lg py-1 z-50 min-w-[160px]"
            style={{ left: `${x}px`, top: `${y}px` }}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );
};

interface ContextMenuItemProps {
    onClick: () => void;
    icon?: ReactNode;
    label: string;
    danger?: boolean;
}

export const ContextMenuItem = ({ onClick, icon, label, danger = false }: ContextMenuItemProps) => {
    return (
        <button
            onClick={onClick}
            className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-primary/5 dark:hover:bg-accent/10 transition-colors ${danger
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30'
                    : 'text-text-primary dark:text-text-primary'
                }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};

