import { RepositoryPicker } from '../features/git';
import { ChangesPanel } from '../features/git';
import { CommitComposer } from '../features/git';
import { BranchPanel } from '../features/git';
import { GitPanel } from '../features/git/GitPanel';
import { useGit } from '../contexts/GitContext';

export function GitLayout() {
  const { repository } = useGit();

  if (!repository) {
    return <RepositoryPicker />;
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left Sidebar - Branches */}
      <div className="w-64 border-r border-gray-700 flex flex-col">
        <BranchPanel />
      </div>

      {/* Main Content - Changes */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Commit Composer - Now at the top */}
        <CommitComposer />

        {/* Changes Panel */}
        <div className="flex-1 overflow-hidden">
          <ChangesPanel />
        </div>
      </div>

      {/* Right Sidebar - History & Stashes */}
      <div className="w-80 border-l border-gray-700 flex flex-col">
        <GitPanel />
      </div>
    </div>
  );
}
