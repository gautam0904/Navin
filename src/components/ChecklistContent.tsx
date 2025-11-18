import { useAppContext } from '../contexts/AppContext';
import { useChecklist } from '../hooks/useChecklist';
import { Header } from './Header';
import { ChecklistSection } from './ChecklistSection';
import { Footer } from './Footer';
import { useAppHandlers } from '../hooks/useAppHandlers';

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

  return (
    <>
      <Header
        progressPercent={progressPercent}
        completedItems={completedItems}
        totalItems={totalItems}
        isAdminMode={isAdminMode}
        hasUnsavedChanges={hasUnsavedChanges}
        onAdminClick={handleAdminClick}
        onReset={resetProgress}
        onExport={handleExport}
        onSave={handleSave}
        onCopyCode={handleCopyCode}
        onExitAdmin={exitAdminMode}
        onAddSection={addNewSection}
      />

      <div className="max-w-5xl mx-auto space-y-4">
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

      <Footer
        completedItems={completedItems}
        totalItems={totalItems}
        isAdminMode={isAdminMode}
      />
    </>
  );
};

