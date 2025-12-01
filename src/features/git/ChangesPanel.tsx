import React from 'react';
import {
  Plus,
  Minus,
  FileIcon,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { useGit } from '../../contexts/GitContext';
import type { FileStatus } from '../../types/git';

function getStatusTag(statusType: FileStatus['status']): string {
  return typeof statusType === 'string' ? statusType : Object.keys(statusType)[0];
}

function getStatusIcon(statusType: FileStatus['status']) {
  const tag = getStatusTag(statusType);
  if (tag === 'Added') return <Plus className="w-3.5 h-3.5 text-[var(--color-success)]" />;
  if (tag === 'Modified') return <FileIcon className="w-3.5 h-3.5 text-[var(--color-warning)]" />;
  if (tag === 'Deleted') return <Minus className="w-3.5 h-3.5 text-[var(--color-error)]" />;
  if (tag === 'Conflicted') return <X className="w-3.5 h-3.5 text-[var(--color-error)]" />;
  return <FileIcon className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />;
}

function getStatusColor(statusType: FileStatus['status']) {
  const tag = getStatusTag(statusType);
  if (tag === 'Added') return 'text-[var(--color-success)]';
  if (tag === 'Modified') return 'text-[var(--color-warning)]';
  if (tag === 'Deleted') return 'text-[var(--color-error)]';
  if (tag === 'Conflicted') return 'text-[var(--color-error)]';
  return 'text-[var(--color-text-tertiary)]';
}

function getStatusLabel(statusType: FileStatus['status']) {
  const tag = getStatusTag(statusType);
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-tertiary)] p-4 text-center">
      <FileIcon className="w-12 h-12 mb-3 opacity-20" />
      <p className="text-sm">Open a repository to see changes</p>
    </div>
  );
}

function CleanState() {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-[var(--color-text-tertiary)]">
      <Check className="w-8 h-8 mb-2 opacity-20" />
      <p className="text-xs">No changes detected</p>
    </div>
  );
}

interface FileSectionHeaderProps {
  title: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
  onAction: (e: React.MouseEvent) => void;
  actionLabel: string;
  isLoading: boolean;
  actionClassName?: string;
}

function FileSectionHeader({
  title,
  count,
  isExpanded,
  onToggle,
  onAction,
  actionLabel,
  isLoading,
  actionClassName,
}: FileSectionHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 bg-[var(--color-bg-surface-2)] cursor-pointer hover:bg-[var(--color-bg-surface-3)] transition-colors"
      onClick={onToggle}
    >
      <div className="flex items-center gap-2">
        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <h3 className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
          {title} ({count})
        </h3>
      </div>
      <button
        onClick={onAction}
        disabled={isLoading}
        className={`text-[10px] px-2 py-0.5 rounded transition-colors ${actionClassName || 'bg-[var(--color-bg-surface-3)] hover:bg-[var(--color-border-medium)] text-[var(--color-text-secondary)]'}`}
      >
        {actionLabel}
      </button>
    </div>
  );
}

interface FilesSectionProps {
  title: string;
  files: FileStatus[];
  isExpanded: boolean;
  onToggle: () => void;
  onActionAll: () => void;
  onActionFile: (path: string) => void;
  actionLabel: string;
  actionLabelAll: string;
  actionIcon: React.ReactNode;
  isLoading: boolean;
  hasBorder?: boolean;
  actionClassName?: string;
}

function FilesSection({
  title,
  files,
  isExpanded,
  onToggle,
  onActionAll,
  onActionFile,
  actionLabel,
  actionLabelAll,
  actionIcon,
  isLoading,
  hasBorder,
  actionClassName,
}: FilesSectionProps) {
  if (files.length === 0) return null;
  const wrapperClass = hasBorder ? 'border-b border-[var(--color-border-light)]' : '';
  return (
    <div className={wrapperClass}>
      <FileSectionHeader
        title={title}
        count={files.length}
        isExpanded={isExpanded}
        onToggle={onToggle}
        onAction={(e) => {
          e.stopPropagation();
          onActionAll();
        }}
        actionLabel={actionLabelAll}
        isLoading={isLoading}
        actionClassName={actionClassName}
      />
      {isExpanded && (
        <div className="divide-y divide-[var(--color-border-light)]">
          {files.map((file) => {
            const statusIcon = getStatusIcon(file.status);
            const statusColor = getStatusColor(file.status);
            const statusLabel = getStatusLabel(file.status);
            return (
              <FileItem
                key={file.path}
                file={file}
                onAction={() => onActionFile(file.path)}
                actionLabel={actionLabel}
                actionIcon={actionIcon}
                isLoading={isLoading}
                statusIcon={statusIcon}
                statusColor={statusColor}
                statusLabel={statusLabel}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ConflictedFilesSectionProps {
  files: FileStatus[];
}

function ConflictedFilesSection({ files }: ConflictedFilesSectionProps) {
  if (files.length === 0) return null;
  return (
    <div className="border-t border-[var(--color-error)] mt-4">
      <div className="px-3 py-2 bg-red-50 dark:bg-red-900/20">
        <h3 className="text-xs font-medium text-[var(--color-error)] uppercase tracking-wider">
          Conflicted ({files.length})
        </h3>
      </div>
      <div className="divide-y divide-[var(--color-border-light)]">
        {files.map((file) => (
          <FileItem
            key={file.path}
            file={file}
            onAction={() => {}}
            actionLabel="Resolve"
            actionIcon={<FileIcon className="w-3 h-3" />}
            isLoading={false}
            statusIcon={getStatusIcon(file.status)}
            statusColor={getStatusColor(file.status)}
            statusLabel={getStatusLabel(file.status)}
          />
        ))}
      </div>
    </div>
  );
}

export function ChangesPanel() {
  const { status, stageFile, unstageFile, stageAll, unstageAll, isLoading } = useGit();
  const [isStagedExpanded, setIsStagedExpanded] = React.useState(true);
  const [isUnstagedExpanded, setIsUnstagedExpanded] = React.useState(true);

  if (!status) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-light)] bg-[var(--color-bg-secondary)]">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-[var(--color-text-secondary)]">
            Changes
          </h2>
          {isLoading && <RefreshCw className="w-3 h-3 animate-spin text-[var(--color-primary)]" />}
        </div>
        <div className="flex gap-1">{/* Actions could go here */}</div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {status.is_clean && <CleanState />}
        <FilesSection
          title="Staged"
          files={status.staged}
          isExpanded={isStagedExpanded}
          onToggle={() => setIsStagedExpanded(!isStagedExpanded)}
          onActionAll={unstageAll}
          onActionFile={unstageFile}
          actionLabel="Unstage"
          actionLabelAll="Unstage All"
          actionIcon={<Minus className="w-3 h-3" />}
          isLoading={isLoading}
          hasBorder
        />
        <FilesSection
          title="Changes"
          files={[...status.unstaged, ...status.untracked]}
          isExpanded={isUnstagedExpanded}
          onToggle={() => setIsUnstagedExpanded(!isUnstagedExpanded)}
          onActionAll={stageAll}
          onActionFile={stageFile}
          actionLabel="Stage"
          actionLabelAll="Stage All"
          actionIcon={<Plus className="w-3 h-3" />}
          isLoading={isLoading}
          actionClassName="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white shadow-sm"
        />
        <ConflictedFilesSection files={status.conflicted} />
      </div>
    </div>
  );
}

interface FileItemProps {
  file: FileStatus;
  onAction: () => void;
  actionLabel: string;
  actionIcon: React.ReactNode;
  isLoading: boolean;
  statusIcon: React.ReactNode;
  statusColor: string;
  statusLabel: string;
}

function FileItem({
  file,
  onAction,
  actionLabel,
  actionIcon,
  isLoading,
  statusIcon,
  statusColor,
  statusLabel,
}: FileItemProps) {
  return (
    <div className="group flex items-center gap-3 px-3 py-2 hover:bg-var(--color-bg-surface-2) transition-colors">
      <div className="shrink-0 opacity-80">{statusIcon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm text-[var(--color-text-primary)] truncate font-medium">
            {file.path}
          </p>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full bg-opacity-10 bg-current ${statusColor} font-medium`}
          >
            {statusLabel}
          </span>
        </div>
        {/* Optional: Add path directory hint if needed */}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAction();
        }}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-all duration-200 bg-[var(--color-bg-surface-3)] hover:bg-[var(--color-primary)] hover:text-white text-[var(--color-text-secondary)]"
        title={actionLabel}
      >
        {actionIcon}
        <span className="hidden sm:inline">{actionLabel}</span>
      </button>
    </div>
  );
}
