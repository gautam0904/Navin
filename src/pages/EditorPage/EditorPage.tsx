import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { CodeEditor } from '@/components/ui/editor/CodeEditor';
import { getLanguageFromPath } from '@/features/git/utils/diffEditorUtils';
import { useGit } from '@/contexts/GitContext';

function isAbsolutePath(p: string): boolean {
  return /^[a-zA-Z]:\\/.test(p) || /^\\\\/.test(p) || p.startsWith('/');
}

function joinRepoPath(repoPath: string, relPath: string): string {
  const sep = repoPath.includes('\\') ? '\\' : '/';
  const normalizedRel = relPath.split(/[\\/]/).join(sep);
  if (repoPath.endsWith(sep)) return repoPath + normalizedRel;
  return repoPath + sep + normalizedRel;
}

function useFileLoader(fullPath: string) {
  const [content, setContent] = useState<string>('');
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [baseline, setBaseline] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (!fullPath) throw new Error('Missing file path');
        const text = await invoke<string>('read_file_content', { path: fullPath });
        if (!mounted) return;
        setContent(text);
        setBaseline(text);
        setLoaded(true);
      } catch (e) {
        if (!mounted) return;
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg || 'Failed to read file');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [fullPath]);

  return { content, setContent, loaded, loading, error, baseline, setBaseline };
}

function useFileSaver(
  fullPath: string,
  content: string,
  loaded: boolean,
  setBaseline: (value: string) => void,
  refreshStatus: () => Promise<void>
) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    if (!fullPath || !loaded) return;
    setSaving(true);
    setError(null);
    try {
      await invoke('write_file_content', { path: fullPath, content });
      setBaseline(content);
      await refreshStatus();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || 'Failed to save file');
    } finally {
      setSaving(false);
    }
  }, [content, fullPath, loaded, refreshStatus, setBaseline]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void handleSave();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSave]);

  return { saving, error, handleSave };
}

function EditorHeader({
  fileName,
  fullPath,
  rawPath,
  error,
  isDirty,
  saving,
  onSave,
}: {
  fileName: string;
  fullPath: string;
  rawPath: string;
  error: string | null;
  isDirty: boolean;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-[--color-bg-secondary]">
      <div className="min-w-0">
        <div className="text-sm font-medium text-[--color-text-primary] truncate">{fileName}</div>
        <div className="text-xs text-[--color-text-tertiary] truncate" title={fullPath || rawPath}>
          {fullPath || rawPath}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {error && (
          <div className="flex items-center gap-1 text-xs text-[--color-error]" title={error}>
            <AlertCircle className="w-4 h-4" />
            <span className="hidden sm:block max-w-[260px] truncate">{error}</span>
          </div>
        )}
        <button
          onClick={onSave}
          disabled={!isDirty || saving}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium border transition-colors
            ${
              !isDirty || saving
                ? 'opacity-60 cursor-not-allowed border-[--color-border] text-[--color-text-secondary]'
                : 'bg-[--color-primary] text-white border-[--color-primary] hover:opacity-90'
            }
          `}
          title="Save (Ctrl/Cmd + S)"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}

function EditorContent({
  loading,
  language,
  content,
  onContentChange,
}: {
  loading: boolean;
  language: string;
  content: string;
  onContentChange: (value: string | undefined) => void;
}) {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[--color-primary]" />
      </div>
    );
  }
  return (
    <CodeEditor
      language={language}
      value={content}
      onChange={onContentChange}
      options={{ readOnly: false }}
    />
  );
}

export const EditorPage: React.FC = () => {
  const [params] = useSearchParams();
  const rawPath = params.get('path') || '';
  const { repository, refreshStatus } = useGit();

  const fullPath = useMemo(() => {
    if (!rawPath) return '';
    if (isAbsolutePath(rawPath)) return rawPath;
    const repoPath = repository?.path;
    if (repoPath) return joinRepoPath(repoPath, rawPath);
    return '';
  }, [rawPath, repository]);

  const fileName = useMemo(() => {
    const parts = (rawPath || fullPath).split(/[\\/]/);
    return parts[parts.length - 1] || rawPath || fullPath;
  }, [rawPath, fullPath]);

  const language = useMemo(() => getLanguageFromPath(fileName), [fileName]);

  const {
    content,
    setContent,
    loaded,
    loading,
    error: loadError,
    baseline,
    setBaseline,
  } = useFileLoader(fullPath);
  const {
    saving,
    error: saveError,
    handleSave,
  } = useFileSaver(fullPath, content, loaded, setBaseline, refreshStatus);

  const isDirty = content !== baseline;
  const error = loadError || saveError;

  if (!rawPath) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-[--color-text-secondary]">
        No file selected
      </div>
    );
  }

  if (!fullPath && !isAbsolutePath(rawPath)) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-[--color-text-secondary]">
        Repository not found to resolve relative path: {rawPath}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <EditorHeader
        fileName={fileName}
        fullPath={fullPath}
        rawPath={rawPath}
        error={error}
        isDirty={isDirty}
        saving={saving}
        onSave={handleSave}
      />
      <div className="flex-1 min-h-0">
        <EditorContent
          loading={loading}
          language={language}
          content={content}
          onContentChange={(v) => setContent(v ?? '')}
        />
      </div>
    </div>
  );
};
