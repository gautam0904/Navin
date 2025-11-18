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
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all font-semibold border border-blue-200 mb-5"
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
    <div className="pt-4 border-t-2 border-gray-200">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all font-semibold border border-blue-200"
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
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-xl border border-green-200">
                    <Check size={20} className="text-green-600" />
                  </div>
                  <h4 className="font-bold text-green-800 text-lg">Good Examples</h4>
                </div>
                <ul className="space-y-2">
                  {section.examples.good.map((ex, i) => (
                    <li key={i} className="font-mono text-sm text-green-700 bg-white/60 px-3 py-2 rounded-lg border border-green-200">
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-xl border border-red-200">
                    <X size={20} className="text-red-600" />
                  </div>
                  <h4 className="font-bold text-red-800 text-lg">Bad Examples</h4>
                </div>
                <ul className="space-y-2">
                  {section.examples.bad.map((ex, i) => (
                    <li key={i} className="font-mono text-sm text-red-700 bg-white/60 px-3 py-2 rounded-lg border border-red-200">
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {section.codeExamples && section.codeExamples.good.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-xl border border-blue-200 relative">
                  <Code2 size={20} className="text-blue-600" />
                  <Check size={14} className="text-green-600 absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
                </div>
                <h4 className="font-bold text-blue-800 text-lg">Good Code Examples</h4>
              </div>
              <div className="space-y-3">
                {section.codeExamples.good.map((codeEx, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
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
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-xl border border-orange-200 relative">
                  <Code2 size={20} className="text-orange-600" />
                  <X size={14} className="text-red-600 absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
                </div>
                <h4 className="font-bold text-orange-800 text-lg">Bad Code Examples</h4>
              </div>
              <div className="space-y-3">
                {section.codeExamples.bad.map((codeEx, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-semibold">
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
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 overflow-x-auto shadow-2xl border-2 border-gray-700">
              <pre className="text-sm font-mono text-gray-100 leading-relaxed">
                {section.codeExample}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

