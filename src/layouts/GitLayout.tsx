import { RepositoryPicker } from '../features/git';
import { ChangesPanel } from '../features/git';
import { CommitComposer } from '../features/git';
import { BranchPanel } from '../features/git';
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
      <div className="flex-1 flex flex-col">
        {/* Changes Panel */}
        <div className="flex-1 overflow-hidden">
          <ChangesPanel />
        </div>

        {/* Commit Composer */}
        <CommitComposer />
      </div>
    </div>
  );
}
