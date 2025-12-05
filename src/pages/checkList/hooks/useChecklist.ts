import { useState, useEffect, useCallback } from 'react';
import { ChecklistSection, ChecklistItem } from '../../../types/checklist';
import { ChecklistService, ProgressService } from '../../../services';
import { useProject } from '@contexts/ProjectContext';
import { useChecklistExamples } from './useChecklistExamples';

export const useChecklist = () => {
  const { currentProject } = useProject();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showExamples, setShowExamples] = useState<Record<string, boolean>>({});
  const [checklistData, setChecklistData] = useState<ChecklistSection[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!currentProject) {
        setIsLoading(false);
        setChecklistData([]);
        setCheckedItems({});
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const projectId = currentProject.id;

        // Load sections from database for current project
        const sections = await ChecklistService.getAllSections(projectId);
        setChecklistData(sections);

        // Load checked items from database for current project
        const checkedItemIds = await ProgressService.getCheckedItems(projectId);
        const checkedMap: Record<string, boolean> = {};
        checkedItemIds.forEach((id) => {
          checkedMap[id] = true;
        });
        setCheckedItems(checkedMap);
      } catch (err) {
        console.error('Failed to load checklist data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentProject]);

  // const updateChecklistData = (data: ChecklistSection[]) => {
  //   setChecklistData(data);
  //   setHasUnsavedChanges(true);
  // };

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  const toggleItem = useCallback(
    async (itemId: string) => {
      if (!currentProject) return;

      try {
        const newChecked = await ProgressService.toggleItem(itemId, currentProject.id);
        setCheckedItems((prev) => ({
          ...prev,
          [itemId]: newChecked,
        }));
      } catch (err) {
        console.error('Failed to toggle item:', err);
        // Revert on error
        setCheckedItems((prev) => ({
          ...prev,
          [itemId]: !prev[itemId],
        }));
      }
    },
    [currentProject]
  );

  const toggleExamples = useCallback((sectionId: string) => {
    setShowExamples((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }, []);

  const resetProgress = useCallback(async () => {
    if (!currentProject) return;

    if (confirm('Are you sure you want to reset all progress?')) {
      try {
        await ProgressService.resetProgress(currentProject.id);
        setCheckedItems({});
      } catch (err) {
        console.error('Failed to reset progress:', err);
        alert('Failed to reset progress. Please try again.');
      }
    }
  }, [currentProject]);

  const addNewSection = useCallback(async () => {
    if (!currentProject) return;

    const newSection: ChecklistSection = {
      id: `section-${Date.now()}`,
      title: '📝 New Section',
      items: [],
    };

    try {
      const displayOrder = checklistData.length;
      await ChecklistService.addSection(newSection, displayOrder, currentProject.id);
      setChecklistData((prev) => [...prev, newSection]);
      setHasUnsavedChanges(true);
    } catch (err) {
      console.error('Failed to add section:', err);
      alert('Failed to add section. Please try again.');
    }
  }, [checklistData.length, currentProject]);

  const deleteSection = useCallback(async (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      try {
        await ChecklistService.deleteSection(sectionId);
        setChecklistData((prev) => prev.filter((s) => s.id !== sectionId));
        setHasUnsavedChanges(true);
      } catch (err) {
        console.error('Failed to delete section:', err);
        alert('Failed to delete section. Please try again.');
      }
    }
  }, []);

  const updateSectionTitle = useCallback(async (sectionId: string, newTitle: string) => {
    try {
      await ChecklistService.updateSectionTitle(sectionId, newTitle);
      setChecklistData((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, title: newTitle } : s))
      );
      setHasUnsavedChanges(true);
    } catch (err) {
      console.error('Failed to update section title:', err);
      alert('Failed to update section title. Please try again.');
    }
  }, []);

  const addItemToSection = useCallback(async (sectionId: string) => {
    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      text: 'New checklist item',
    };

    try {
      await ChecklistService.addItem(sectionId, newItem);
      setChecklistData((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s))
      );
      setHasUnsavedChanges(true);
    } catch (err) {
      console.error('Failed to add item:', err);
      alert('Failed to add item. Please try again.');
    }
  }, []);

  const deleteItem = useCallback(async (sectionId: string, itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await ChecklistService.deleteItem(itemId);
        setChecklistData((prev) =>
          prev.map((s) =>
            s.id === sectionId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s
          )
        );
        setHasUnsavedChanges(true);
      } catch (err) {
        console.error('Failed to delete item:', err);
        alert('Failed to delete item. Please try again.');
      }
    }
  }, []);

  const updateItemText = useCallback(async (sectionId: string, itemId: string, newText: string) => {
    try {
      await ChecklistService.updateItem(itemId, newText);
      setChecklistData((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? { ...s, items: s.items.map((i) => (i.id === itemId ? { ...i, text: newText } : i)) }
            : s
        )
      );
      setHasUnsavedChanges(true);
    } catch (err) {
      console.error('Failed to update item:', err);
      alert('Failed to update item. Please try again.');
    }
  }, []);

  const resetToDefault = useCallback(async () => {
    if (!currentProject) return;

    try {
      const sections = await ChecklistService.getAllSections(currentProject.id);
      setChecklistData(sections);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Failed to reset to default:', err);
      alert('Failed to reset. Please try again.');
    }
  }, [currentProject]);

  const exampleHooks = useChecklistExamples(checklistData, setChecklistData, setHasUnsavedChanges);

  const copyCodeToClipboard = useCallback(() => {
    const codeSnippet = `const defaultChecklistData: ChecklistSection[] = ${JSON.stringify(checklistData, null, 2)};`;
    navigator.clipboard.writeText(codeSnippet);
  }, [checklistData]);

  const totalItems = checklistData.reduce((sum, section) => sum + section.items.length, 0);
  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return {
    expandedSections,
    checkedItems,
    showExamples,
    checklistData,
    hasUnsavedChanges,
    totalItems,
    completedItems,
    progressPercent,
    isLoading,
    error,
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
    ...exampleHooks,
    resetToDefault,
    copyCodeToClipboard,
  };
};
