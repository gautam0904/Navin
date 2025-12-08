import React, { useState, useEffect } from 'react';
import { X, GripVertical, Send, CheckSquare, Square } from 'lucide-react';
import { useGit } from '@/contexts/GitContext';
import { GitService } from '@/services/gitService';
import { createToast, type Toast } from './Toast';

interface CommitDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onToast?: (toast: Toast) => void;
}

export function CommitDrawer({ isOpen, onClose, onToast }: CommitDrawerProps) {
  const { status, commit, refreshStatus } = useGit();
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [isAmend, setIsAmend] = useState(false);
  const [isSignOff, setIsSignOff] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [height, setHeight] = useState(220);
  const [isDragging, setIsDragging] = useState(false);

  const stagedFiles = status?.staged || [];
  const canCommit = stagedFiles.length > 0 && message.trim().length > 0;

  useEffect(() => {
    if (!isOpen) {
      setMessage('');
      setDescription('');
      setIsAmend(false);
      setIsSignOff(false);
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startY = e.clientY;
    const startHeight = height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY;
      const newHeight = Math.max(150, Math.min(600, startHeight + deltaY));
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleCommit = async () => {
    if (!canCommit) return;

    setIsCommitting(true);
    try {
      const fullMessage = description.trim()
        ? `${message}\n\n${description}`
        : message;

      // Get git config for author
      const [authorName, authorEmail] = await GitService.getConfig();

      await commit(fullMessage, authorName, authorEmail);
      await refreshStatus();
      
      setMessage('');
      setDescription('');
      onToast?.(createToast('Changes committed successfully', 'success'));
      onClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to commit';
      onToast?.(createToast(`Commit failed: ${errorMsg}`, 'error'));
    } finally {
      setIsCommitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[--color-bg-primary] border-t border-[--git-panel-border] shadow-2xl">
      {/* Drag Handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`h-1 bg-[--git-panel-border] cursor-ns-resize hover:bg-[--color-primary] transition-colors ${isDragging ? 'bg-[--color-primary]' : ''}`}
      >
        <div className="flex items-center justify-center h-full">
          <GripVertical className="w-4 h-4 text-[--color-text-tertiary]" />
        </div>
      </div>

      <div style={{ height: `${height}px` }} className="flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[--git-panel-border]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[--color-text-primary]">
              Commit ({stagedFiles.length} {stagedFiles.length === 1 ? 'file' : 'files'})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[--color-bg-surface-2] transition-colors"
          >
            <X className="w-4 h-4 text-[--color-text-secondary]" />
          </button>
        </div>

        {/* Staged Files */}
        <div className="px-4 py-2 border-b border-[--git-panel-border] bg-[--git-panel-header] max-h-32 overflow-y-auto">
          <div className="space-y-1">
            {stagedFiles.map((file) => (
              <div key={file.path} className="flex items-center gap-2 text-xs text-[--color-text-secondary]">
                <span className="text-[--git-status-added]">+</span>
                <span className="truncate">{file.path}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Commit Message */}
        <div className="flex-1 flex flex-col p-4 space-y-3 overflow-hidden">
          <div className="flex-1 flex flex-col space-y-2">
            <label className="text-xs font-medium text-[--color-text-secondary]">Commit Message</label>
            <input
              type="text"
              placeholder="feat: add new feature"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="px-3 py-2 text-sm rounded-md border border-[--git-panel-border] bg-[--color-bg-primary] text-[--color-text-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
            />
            <textarea
              placeholder="Extended description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="px-3 py-2 text-sm rounded-md border border-[--git-panel-border] bg-[--color-bg-primary] text-[--color-text-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary] resize-none"
            />
          </div>

          {/* Options */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAmend}
                onChange={(e) => setIsAmend(e.target.checked)}
                className="w-4 h-4 rounded border-[--git-panel-border] text-[--color-primary] focus:ring-1 focus:ring-[--color-primary]"
              />
              <span className="text-xs text-[--color-text-secondary]">Amend previous commit</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSignOff}
                onChange={(e) => setIsSignOff(e.target.checked)}
                className="w-4 h-4 rounded border-[--git-panel-border] text-[--color-primary] focus:ring-1 focus:ring-[--color-primary]"
              />
              <span className="text-xs text-[--color-text-secondary]">Sign-off</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCommit}
              disabled={!canCommit || isCommitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-[--color-primary] text-white hover:bg-[--color-primary-dark] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Commit</span>
            </button>
            <button
              onClick={handleCommit}
              disabled={!canCommit || isCommitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md border border-[--git-panel-border] hover:bg-[--color-bg-surface-2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Commit & Push</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

