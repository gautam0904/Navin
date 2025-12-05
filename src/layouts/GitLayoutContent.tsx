import { DiffViewer } from '../features/git/components/DiffViewer';
import {
  ChangesPanel,
  CommitHistory,
  BranchPanel,
  StashPanel,
  RemotePanel,
  CommitComposer,
} from '../features/git';

type GitView = 'changes' | 'history' | 'branches' | 'stash' | 'remotes';

interface MainContentProps {
  activeView: GitView;
  selectedFile: string | null;
  onFileSelect: (path: string | null) => void;
}

export function MainContent({ activeView }: MainContentProps) {
  const handleSelectCommit = (sha: string) => {
    console.log('Selected commit:', sha);
  };

  switch (activeView) {
    case 'changes':
      return (
        <div className="flex flex-1 min-h-0">
          <div className="w-80 border-r border-[--git-panel-border] flex flex-col">
            <CommitComposer />
            <div className="flex-1 overflow-hidden">
              <ChangesPanel />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <DiffViewer diff={null} />
          </div>
        </div>
      );

    case 'history':
      return (
        <div className="flex flex-1 min-h-0">
          <div className="w-96 border-r border-[--git-panel-border]">
            <CommitHistory onSelectCommit={handleSelectCommit} />
          </div>
          <div className="flex-1 min-w-0">
            <DiffViewer diff={null} />
          </div>
        </div>
      );

    case 'branches':
      return <BranchPanel />;

    case 'stash':
      return <StashPanel />;

    case 'remotes':
      return <RemotePanel />;

    default:
      return null;
  }
}
