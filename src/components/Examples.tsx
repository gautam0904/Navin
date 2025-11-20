import React from 'react';
import { Check, X, ChevronDown, Code2 } from 'lucide-react';
import { ChecklistSection, CodeExamples } from '../types/checklist';
import { EditableExamples } from './EditableExamples';
import { CodeEditor } from './CodeEditor';

interface ExamplesProps {
  section: ChecklistSection;
  isExpanded: boolean;
  isAdminMode?: boolean;
  onToggle: () => void;
  onExamplesChange?: (examples: { good: string[]; bad: string[] }) => void;
  onCodeExamplesChange?: (codeExamples: CodeExamples) => void;
  onCodeExampleChange?: (codeExample: string) => void;
  onSave?: () => void;
}

export const Examples: React.FC<ExamplesProps> = ({
  section,
  isExpanded,
  isAdminMode = false,
  onToggle,
  onExamplesChange,
  onCodeExamplesChange,
  onCodeExampleChange,
  onSave,
}) => {
  if (!section.examples && !section.codeExample && !isAdminMode) return null;


  if (isAdminMode && isExpanded) {
    return (
      <div className="pt-4 border-t-2 border-gray-200">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/15 hover:bg-primary/20 dark:hover:bg-primary/25 text-primary dark:text-primary rounded-lg transition-all font-medium border border-primary/30 dark:border-primary/30 shadow-sm hover:shadow-md mb-5"
        >
          {isExpanded ? 'Hide' : 'Show'} Examples
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {isExpanded && onExamplesChange && onSave && (
          <EditableExamples
            examples={section.examples}
            codeExamples={section.codeExamples}
            codeExample={section.codeExample}
            onExamplesChange={onExamplesChange}
            onCodeExamplesChange={onCodeExamplesChange || (() => { })}
            onCodeExampleChange={onCodeExampleChange}
            onSave={onSave}
          />
        )}
      </div>
    );
  }

  const hasTextExamples = section.examples && (section.examples.good.length > 0 || section.examples.bad.length > 0);
  const hasCodeExamples = section.codeExamples && (section.codeExamples.good.length > 0 || section.codeExamples.bad.length > 0);
  const hasLegacyCode = section.codeExample;

  if (!hasTextExamples && !hasCodeExamples && !hasLegacyCode) return null;

  return (
    <div className="pt-4 border-t-2 border-border-medium dark:border-border-light">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/15 hover:bg-primary/20 dark:hover:bg-primary/25 text-primary dark:text-primary rounded-lg transition-all font-medium border border-primary/30 dark:border-primary/30 shadow-sm hover:shadow-md"
        style={{ height: 'var(--button-height)' }}
      >
        {isExpanded ? 'Hide' : 'Show'} Examples
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="mt-5 space-y-5 animate-fade-in">
          {section.examples && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-primary/10 dark:bg-primary/15 border border-primary/30 dark:border-primary/30 rounded-lg p-5 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/20 dark:bg-primary/30 rounded-lg border border-primary/30 dark:border-primary/30">
                    <Check size={20} className="text-primary dark:text-primary" />
                  </div>
                  <h4 className="font-bold text-primary dark:text-primary text-lg">Good Examples</h4>
                </div>
                <ul className="space-y-2">
                  {section.examples.good.map((ex, i) => (
                    <li key={i} className="font-mono text-sm text-text-secondary dark:text-text-secondary bg-bg-surface-2 dark:bg-bg-surface-2 px-3 py-2 rounded-md border border-border-medium dark:border-border-medium shadow-sm">
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg border border-red-200 dark:border-red-800">
                    <X size={20} className="text-red-600 dark:text-red-400" />
                  </div>
                  <h4 className="font-bold text-red-600 dark:text-red-400 text-lg">Bad Examples</h4>
                </div>
                <ul className="space-y-2">
                  {section.examples.bad.map((ex, i) => (
                    <li key={i} className="font-mono text-sm text-red-600 dark:text-red-400 bg-bg-secondary/60 dark:bg-bg-secondary/60 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {section.codeExamples && section.codeExamples.good.length > 0 && (
            <div className="bg-primary/10 dark:bg-primary/15 border border-primary/30 dark:border-primary/30 rounded-lg p-5 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/20 dark:bg-primary/30 rounded-xl border border-primary/30 dark:border-primary/40 relative">
                  <Code2 size={20} className="text-primary dark:text-primary" />
                  <Check size={14} className="text-primary dark:text-primary absolute -top-1 -right-1 bg-bg-secondary dark:bg-bg-secondary rounded-full p-0.5" />
                </div>
                <h4 className="font-bold text-primary dark:text-primary text-lg">Good Code Examples</h4>
              </div>
              <div className="space-y-3">
                {section.codeExamples.good.map((codeEx, i) => (
                  <div key={i} className="bg-bg-secondary dark:bg-bg-secondary rounded-lg p-3 border border-primary/30 dark:border-primary/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary rounded text-xs font-semibold">
                        {codeEx.language.toUpperCase()}
                      </span>
                    </div>
                    <CodeEditor
                      value={codeEx.code}
                      onChange={() => { }}
                      language={codeEx.language}
                      height="200px"
                      readOnly={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {section.codeExamples && section.codeExamples.bad.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-5 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl border border-red-200 dark:border-red-800 relative">
                  <Code2 size={20} className="text-red-600 dark:text-red-400" />
                  <X size={14} className="text-red-600 dark:text-red-400 absolute -top-1 -right-1 bg-bg-secondary dark:bg-bg-secondary rounded-full p-0.5" />
                </div>
                <h4 className="font-bold text-red-600 dark:text-red-400 text-lg">Bad Code Examples</h4>
              </div>
              <div className="space-y-3">
                {section.codeExamples.bad.map((codeEx, i) => (
                  <div key={i} className="bg-bg-secondary dark:bg-bg-secondary rounded-lg p-3 border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded text-xs font-semibold">
                        {codeEx.language.toUpperCase()}
                      </span>
                    </div>
                    <CodeEditor
                      value={codeEx.code}
                      onChange={() => { }}
                      language={codeEx.language}
                      height="200px"
                      readOnly={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legacy Single Code Example */}
          {section.codeExample && (
            <div className="bg-bg-secondary dark:bg-bg-secondary rounded-lg p-6 overflow-x-auto shadow-md border border-border-medium dark:border-border-medium">
              <pre className="text-sm font-mono text-wild-sand dark:text-loblolly leading-relaxed">
                {section.codeExample}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

