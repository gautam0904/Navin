import React, { useState } from 'react';
import { FileCode, Bug, Book, Wrench, TestTube, Settings, ChevronDown } from 'lucide-react';

export interface CommitTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  template: string;
  description: string;
}

export const COMMIT_TEMPLATES: CommitTemplate[] = [
  {
    id: 'bug-fix',
    name: 'Bug Fix',
    icon: <Bug className="w-4 h-4" />,
    template:
      'fix: resolve issue with [component/feature]\n\n- Fixed [specific issue]\n- Added error handling\n- Updated tests',
    description: 'Template for fixing bugs',
  },
  {
    id: 'new-feature',
    name: 'New Feature',
    icon: <FileCode className="w-4 h-4" />,
    template:
      'feat: add [feature name]\n\n- Implemented [feature description]\n- Added [related components]\n- Updated documentation',
    description: 'Template for new features',
  },
  {
    id: 'documentation',
    name: 'Documentation',
    icon: <Book className="w-4 h-4" />,
    template:
      'docs: update [section]\n\n- Updated [documentation section]\n- Added examples\n- Fixed typos',
    description: 'Template for documentation updates',
  },
  {
    id: 'refactor',
    name: 'Refactor',
    icon: <Wrench className="w-4 h-4" />,
    template:
      'refactor: improve [component/module]\n\n- Extracted [functionality]\n- Improved [aspect]\n- Updated tests',
    description: 'Template for code refactoring',
  },
  {
    id: 'test',
    name: 'Tests',
    icon: <TestTube className="w-4 h-4" />,
    template:
      'test: add tests for [component]\n\n- Added unit tests\n- Added integration tests\n- Updated test coverage',
    description: 'Template for test additions',
  },
  {
    id: 'chore',
    name: 'Chore',
    icon: <Settings className="w-4 h-4" />,
    template:
      'chore: update [dependencies/config]\n\n- Updated [dependency]\n- Fixed [configuration]\n- Improved [tooling]',
    description: 'Template for maintenance tasks',
  },
];

interface CommitTemplatesProps {
  onSelectTemplate: (template: string) => void;
}

export function CommitTemplates({ onSelectTemplate }: CommitTemplatesProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-[--color-text-tertiary] hover:text-[--color-text-secondary] transition-colors"
      >
        <span>Templates</span>
        <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-2 z-50 bg-[black] border border-[--git-panel-border] rounded-md shadow-lg max-h-64 overflow-y-auto min-w-max w-auto">
          <div className="space-y-1">
            {COMMIT_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template.template);
                  setIsOpen(false);
                }}
                className="w-full flex items-start gap-2 p-1.5 text-left rounded hover:bg-[--color-bg-surface-2] transition-colors group"
                title={template.description}
              >
                <span className="text-[--color-text-tertiary] group-hover:text-[--color-primary] transition-colors mt-0.5 shrink-0">
                  {template.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-[--color-text-primary]">
                    {template.name}
                  </div>
                  <div className="text-[10px] text-[--color-text-tertiary]">
                    {template.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
