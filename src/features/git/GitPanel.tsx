import React, { useState } from 'react';
import { CommitHistory } from './CommitHistory';
import { RemotePanel } from './RemotePanel';
import { StashPanel } from './StashPanel';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, children, defaultOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col border-b border-[#333]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 p-2 hover:bg-[#2a2d2e] transition-colors text-xs font-bold text-gray-400 uppercase tracking-wider"
      >
        {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        {title}
      </button>
      {isOpen && <div className="flex-1 overflow-hidden">{children}</div>}
    </div>
  );
}

export function GitPanel() {
  const handleSelectCommit = (sha: string) => {
    // TODO: Implement commit selection logic, possibly opening a detail view in the main area
    console.log('Selected commit:', sha);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <Section title="Commits" defaultOpen={true}>
        <div className="h-64 sm:h-80 lg:h-96">
          <CommitHistory onSelectCommit={handleSelectCommit} />
        </div>
      </Section>

      <Section title="Remotes">
        <div className="h-48">
          <RemotePanel />
        </div>
      </Section>

      <Section title="Stashes">
        <div className="h-48">
          <StashPanel />
        </div>
      </Section>
    </div>
  );
}
