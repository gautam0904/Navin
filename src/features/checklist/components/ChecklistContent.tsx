import React from 'react';
import { ClipboardList, Plus, AlertTriangle } from 'lucide-react';
import { useChecklist } from '../hooks/useChecklist';
import { useAppContext } from '../../../app/providers/AppProvider';
import { useAppHandlers } from '../../../hooks/useAppHandlers';
import { useProject } from '../../../app/providers/ProjectProvider';
import { ChecklistSection } from './ChecklistSection';
import { ChecklistHeader } from './ChecklistHeader';
import { ProgressSection } from './ProgressSection';
import { AdminActionButtons } from './AdminActionButtons';

export const ChecklistContent: React.FC = () => {
  const { isAdminMode, editingSection, editingItem } = useAppContext();

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

  const { exitAdminMode, handleExport, handleSave, handleCopyCode, handleAdminClick } =
    useAppHandlers();

  const { setEditingSection, setEditingItem } = useAppContext();
  const { currentProject } = useProject();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
          <ChecklistHeader currentProject={currentProject} />
          <AdminActionButtons
            isAdminMode={isAdminMode}
            hasUnsavedChanges={hasUnsavedChanges}
            onSave={handleSave}
            onCopyCode={handleCopyCode}
            onExitAdmin={exitAdminMode}
            onAdminClick={handleAdminClick}
            onReset={resetProgress}
            onExport={handleExport}
          />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary dark:text-text-primary mb-2 tracking-tight leading-tight">
            {currentProject
              ? `${currentProject.name} Checklist`
              : 'Frontend Implementation Checklist'}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-text-secondary dark:text-text-secondary leading-relaxed font-medium">
            {currentProject
              ? `Project-specific criteria for ${currentProject.name}. Each project has its own checklist.`
              : 'Follow every item before committing your code'}
          </p>
        </div>
      </div>

      <div
        className="rounded-xl bg-bg-secondary dark:bg-bg-secondary shadow-sm"
        style={{ padding: 0, overflow: 'hidden' }}
      >
        <ProgressSection
          completedItems={completedItems}
          totalItems={totalItems}
          progressPercent={progressPercent}
        />

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
                      <span className="hidden sm:inline">
                        Click &quot;Copy Code&quot; to save permanently
                      </span>
                      <span className="sm:hidden">Click &quot;Copy Code&quot; to save</span>
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
              <h3 className="text-xl font-bold text-text-primary dark:text-text-primary mb-2">
                No Checklist Items Yet
              </h3>
              <p className="text-text-secondary dark:text-text-secondary mb-6">
                {isAdminMode
                  ? 'Click &quot;Add New Section&quot; to create your first checklist section.'
                  : 'Enable Admin Mode to add checklist items.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
