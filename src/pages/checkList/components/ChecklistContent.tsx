import { useAppContext } from '@/app/providers/AppProvider';
import { useChecklist } from '../hooks/useChecklist';
import { ChecklistSection } from './ChecklistSection';
import { useAppHandlers } from '@hooks/useAppHandlers';
import { useProject } from '@contexts/ProjectContext';
import { ChecklistHeader } from './ChecklistHeader';
import { ProgressSection } from './ProgressSection';
import { AdminControls } from './AdminControls';
import { EmptyChecklistState } from './EmptyChecklistState';

export const ChecklistContent = () => {
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
      <ChecklistHeader
        currentProject={currentProject}
        isAdminMode={isAdminMode}
        hasUnsavedChanges={hasUnsavedChanges}
        onAdminClick={handleAdminClick}
        onExitAdminMode={exitAdminMode}
        onSave={handleSave}
        onCopyCode={handleCopyCode}
        onResetProgress={resetProgress}
        onExport={handleExport}
      />

      <div
        className="rounded-xl bg-bg-secondary dark:bg-bg-secondary shadow-sm"
        style={{ padding: 0, overflow: 'hidden' }}
      >
        <ProgressSection
          completedItems={completedItems}
          totalItems={totalItems}
          progressPercent={progressPercent}
        />

        <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
          {isAdminMode && (
            <AdminControls hasUnsavedChanges={hasUnsavedChanges} onAddNewSection={addNewSection} />
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
            <EmptyChecklistState isAdminMode={isAdminMode} />
          )}
        </div>
      </div>
    </div>
  );
};
