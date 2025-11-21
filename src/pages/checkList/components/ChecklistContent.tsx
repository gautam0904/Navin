import { useAppContext } from '@contexts/AppContext';
import { useChecklist } from '../hooks/useChecklist';
import { ChecklistSection } from './ChecklistSection';
import { useAppHandlers } from '@hooks/useAppHandlers';
import { useProject } from '@contexts/ProjectContext';
import { Download, RotateCcw, Settings, Save, Copy, XCircle, Plus, FolderOpen, ClipboardList, TrendingUp, AlertTriangle } from 'lucide-react';

export const ChecklistContent = () => {
  const {
    isAdminMode,
    editingSection,
    editingItem,
  } = useAppContext();

  const {
    expandedSections,
    checkedItems,
    showExamples,
    checklistData,
    hasUnsavedChanges,
    totalItems,
    completedItems,
    progressPercent,
    toggleSection,
    toggleItem,
    toggleExamples,
    resetProgress,
    addNewSection,
    deleteSection,
    updateSectionTitle,
    addItemToSection,
    deleteItem,
    updateItemText,
    updateExamples,
    updateCodeExamples,
    updateCodeExample,
    saveExamples,
    updateItemExamples,
    updateItemCodeExamples,
    updateItemCodeExample,
    saveItemExamples,
  } = useChecklist();

  const {
    exitAdminMode,
    handleExport,
    handleSave,
    handleCopyCode,
    handleAdminClick,
  } = useAppHandlers();

  const { setEditingSection, setEditingItem } = useAppContext();
  const { currentProject } = useProject();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header - Separate from unified container */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary dark:bg-primary text-white dark:text-white rounded-lg shadow-md">
              <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">PRE-COMMIT CHECKLIST</span>
            </div>
            {currentProject && (
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 dark:bg-primary/15 rounded-lg border border-primary/30 dark:border-primary/30 shadow-sm">
                <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary dark:text-primary shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-primary dark:text-primary truncate max-w-[150px] sm:max-w-none">{currentProject.name}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            {isAdminMode ? (
              <>
                <button
                  onClick={handleSave}
                  className={`button-primary flex items-center gap-2 text-xs sm:text-sm ${hasUnsavedChanges ? '' : 'opacity-50 cursor-not-allowed'}`}
                  disabled={!hasUnsavedChanges}
                >
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="hidden sm:inline">{hasUnsavedChanges ? 'Ready to Save' : 'No Changes'}</span>
                  <span className="sm:hidden">{hasUnsavedChanges ? 'Save' : 'None'}</span>
                </button>
                <button
                  onClick={handleCopyCode}
                  className="button-primary flex items-center gap-2 text-xs sm:text-sm"
                >
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="hidden sm:inline">Copy Code</span>
                  <span className="sm:hidden">Copy</span>
                </button>
                <button
                  onClick={exitAdminMode}
                  className="h-9 sm:h-10 px-3 sm:px-4 rounded-md bg-bg-surface-2 dark:bg-bg-surface-2 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-300 dark:border-red-800 transition-all duration-150 text-red-600 dark:text-red-400 font-medium text-xs sm:text-sm flex items-center gap-2 hover:shadow-md active:scale-95"
                >
                  <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  Exit
                </button>
              </>
            ) : (
              <button
                onClick={handleAdminClick}
                className="h-9 sm:h-10 px-3 sm:px-4 rounded-md bg-bg-surface-2 dark:bg-bg-surface-2 hover:bg-bg-surface-3 dark:hover:bg-bg-surface-3 border border-border-medium dark:border-border-medium text-primary dark:text-primary font-medium text-xs sm:text-sm transition-all duration-150 active:scale-95 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                Admin
              </button>
            )}
            <button
              onClick={resetProgress}
              className="h-9 sm:h-10 px-3 sm:px-4 rounded-md bg-bg-surface-2 dark:bg-bg-surface-2 hover:bg-bg-surface-3 dark:hover:bg-bg-surface-3 border border-border-medium dark:border-border-medium text-text-secondary dark:text-text-secondary font-medium text-xs sm:text-sm transition-all duration-150 active:scale-95 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              Reset
            </button>
            <button
              onClick={handleExport}
              className="button-primary flex items-center gap-2 text-xs sm:text-sm"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary dark:text-text-primary mb-2 tracking-tight leading-tight">
            {currentProject ? `${currentProject.name} Checklist` : 'Frontend Implementation Checklist'}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-text-secondary dark:text-text-secondary leading-relaxed font-medium">
            {currentProject
              ? `Project-specific criteria for ${currentProject.name}. Each project has its own checklist.`
              : 'Follow every item before committing your code'}
          </p>
        </div>
      </div>

      {/* Unified Container - Progress + Checklist Items */}
      <div
        className="rounded-xl bg-bg-secondary dark:bg-bg-secondary shadow-sm"
        style={{ padding: 0, overflow: 'hidden' }}
      >
        {/* Progress Header Section - Inside Unified Container */}
        <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-5 bg-bg-surface-2/50 dark:bg-bg-surface-2/30 border-b border-border-light dark:border-border-medium">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-sm sm:text-base font-semibold text-text-primary dark:text-text-primary " />
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-text-primary dark:text-text-primary mb-0.5">Overall Progress</h2>
                <p className="text-xs sm:text-sm text-text-secondary dark:text-text-secondary">
                  {completedItems} of {totalItems} items completed
                </p>
              </div>
            </div>
            {/* Fixed-width right-side counters */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary leading-none">
                  {progressPercent}%
                </div>
                <div className="text-xs font-medium text-text-tertiary dark:text-text-tertiary mt-0.5">Complete</div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border-light dark:border-border-medium"></div>
              <div
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-bg-secondary dark:bg-bg-surface-3 rounded-lg shadow-sm"
                style={{ minWidth: '60px' }}
              >
                <div className="text-lg sm:text-xl font-bold text-text-primary dark:text-text-primary">{completedItems}</div>
                <div className="text-xs font-medium text-text-tertiary dark:text-text-tertiary">Completed</div>
              </div>
              <div
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-bg-secondary dark:bg-bg-surface-3 rounded-lg shadow-sm"
                style={{ minWidth: '60px' }}
              >
                <div className="text-lg sm:text-xl font-bold text-text-primary dark:text-text-primary">{totalItems}</div>
                <div className="text-xs font-medium text-text-tertiary dark:text-text-tertiary">Total</div>
              </div>
            </div>
          </div>

          {/* Progress Bar - Inside Unified Container */}
          <div className="mt-4">
            <div className="progress-container relative" style={{ height: '10px' }}>
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
              {progressPercent > 10 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white drop-shadow-lg z-10">
                    {progressPercent}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Stats */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mt-3 text-xs sm:text-sm">
            <span className="font-medium text-text-secondary dark:text-text-secondary">
              {totalItems - completedItems} items remaining
            </span>
            <span className="font-semibold text-primary dark:text-primary">
              {completedItems}/{totalItems} tasks
            </span>
          </div>
        </div>

        {/* Checklist Sections - Inside Unified Container */}
        <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
          {isAdminMode && (
            <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border-light dark:border-border-medium">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  onClick={addNewSection}
                  className="button-primary flex items-center justify-center gap-2 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="hidden sm:inline">Add New Section</span>
                  <span className="sm:hidden">Add Section</span>
                </button>
                {hasUnsavedChanges && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-xs sm:text-sm shadow-sm w-full sm:w-auto justify-center sm:justify-start">
                    <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-700 dark:text-yellow-400 flex-shrink-0" />
                    <span className="text-yellow-700 dark:text-yellow-400 font-medium text-center sm:text-left">
                      <span className="hidden sm:inline">Click "Copy Code" to save permanently</span>
                      <span className="sm:hidden">Click "Copy Code" to save</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {checklistData.length > 0 ? (
            <div className="space-y-4">
              {checklistData.map((section) => (
                <ChecklistSection
                  key={section.id}
                  section={section}
                  checkedItems={checkedItems}
                  isExpanded={expandedSections[section.id] || false}
                  isAdminMode={isAdminMode}
                  editingSection={editingSection}
                  editingItem={editingItem}
                  showExamples={showExamples[section.id] || false}
                  onToggle={() => toggleSection(section.id)}
                  onItemToggle={toggleItem}
                  onSectionEdit={() => setEditingSection(section.id)}
                  onSectionDelete={() => deleteSection(section.id)}
                  onSectionTitleChange={(title) => updateSectionTitle(section.id, title)}
                  onItemEdit={(itemId) => setEditingItem(itemId)}
                  onItemDelete={(itemId) => deleteItem(section.id, itemId)}
                  onItemTextChange={(itemId, text) => updateItemText(section.id, itemId, text)}
                  onItemAdd={() => addItemToSection(section.id)}
                  onExamplesToggle={() => toggleExamples(section.id)}
                  onEditingSectionBlur={() => setEditingSection(null)}
                  onEditingItemBlur={() => setEditingItem(null)}
                  onExamplesChange={updateExamples}
                  onCodeExamplesChange={updateCodeExamples}
                  onCodeExampleChange={updateCodeExample}
                  onExamplesSave={saveExamples}
                  onItemExamplesChange={updateItemExamples}
                  onItemCodeExamplesChange={updateItemCodeExamples}
                  onItemCodeExampleChange={updateItemCodeExample}
                  onItemExamplesSave={saveItemExamples}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 dark:bg-primary/15 flex items-center justify-center">
                <ClipboardList className="w-8 h-8 text-primary dark:text-primary" />
              </div>
              <h3 className="text-xl font-bold text-text-primary dark:text-text-primary mb-2">No Checklist Items Yet</h3>
              <p className="text-text-secondary dark:text-text-secondary mb-6">
                {isAdminMode
                  ? 'Click "Add New Section" to create your first checklist section.'
                  : 'Enable Admin Mode to add checklist items.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
