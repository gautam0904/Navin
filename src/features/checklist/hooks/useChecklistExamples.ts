import React, { useCallback } from 'react';
import { ChecklistSection, ChecklistItem, CodeExamples } from '../../../types/checklist';
import { ChecklistService } from '../../../services/checklist.service';

interface UseChecklistExamplesParams {
  checklistData: ChecklistSection[];
  setChecklistData: React.Dispatch<React.SetStateAction<ChecklistSection[]>>;
  setHasUnsavedChanges: (value: boolean) => void;
}

export const useChecklistExamples = ({
  checklistData,
  setChecklistData,
  setHasUnsavedChanges,
}: UseChecklistExamplesParams) => {
  const updateExamples = useCallback(
    (sectionId: string, examples: { good: string[]; bad: string[] }) => {
      setChecklistData((prev) => prev.map((s) => (s.id === sectionId ? { ...s, examples } : s)));
      setHasUnsavedChanges(true);
    },
    [setChecklistData, setHasUnsavedChanges]
  );

  const updateCodeExample = useCallback(
    (sectionId: string, codeExample: string) => {
      setChecklistData((prev) => prev.map((s) => (s.id === sectionId ? { ...s, codeExample } : s)));
      setHasUnsavedChanges(true);
    },
    [setChecklistData, setHasUnsavedChanges]
  );

  const updateCodeExamples = useCallback(
    (sectionId: string, codeExamples: CodeExamples) => {
      setChecklistData((prev) =>
        prev.map((s) => (s.id === sectionId ? { ...s, codeExamples } : s))
      );
      setHasUnsavedChanges(true);
    },
    [setChecklistData, setHasUnsavedChanges]
  );

  const saveExamples = useCallback(
    async (sectionId: string) => {
      try {
        const section = checklistData.find((s) => s.id === sectionId);
        if (!section) return;

        await ChecklistService.updateExamples(sectionId, section.examples);
        await ChecklistService.updateCodeExamples(sectionId, section.codeExamples);
        if (section.codeExample) {
          await ChecklistService.updateCodeExample(sectionId, section.codeExample);
        }

        setHasUnsavedChanges(true);
      } catch (err) {
        console.error('Failed to save examples:', err);
        alert('Failed to save examples. Please try again.');
      }
    },
    [checklistData, setHasUnsavedChanges]
  );

  const updateItemExamples = useCallback(
    (itemId: string, examples: { good: string[]; bad: string[] }) => {
      setChecklistData((prev) =>
        prev.map((s) => ({
          ...s,
          items: s.items.map((i) => (i.id === itemId ? { ...i, examples } : i)),
        }))
      );
      setHasUnsavedChanges(true);
    },
    [setChecklistData, setHasUnsavedChanges]
  );

  const updateItemCodeExamples = useCallback(
    (itemId: string, codeExamples: CodeExamples) => {
      setChecklistData((prev) =>
        prev.map((s) => ({
          ...s,
          items: s.items.map((i) => (i.id === itemId ? { ...i, codeExamples } : i)),
        }))
      );
      setHasUnsavedChanges(true);
    },
    [setChecklistData, setHasUnsavedChanges]
  );

  const updateItemCodeExample = useCallback(
    (itemId: string, codeExample: string) => {
      setChecklistData((prev) =>
        prev.map((s) => ({
          ...s,
          items: s.items.map((i) => (i.id === itemId ? { ...i, codeExample } : i)),
        }))
      );
      setHasUnsavedChanges(true);
    },
    [setChecklistData, setHasUnsavedChanges]
  );

  const saveItemExamples = useCallback(
    async (itemId: string) => {
      try {
        let foundItem: ChecklistItem | null = null;
        for (const section of checklistData) {
          const item = section.items.find((i) => i.id === itemId);
          if (item) {
            foundItem = item;
            break;
          }
        }

        if (!foundItem) return;

        await ChecklistService.updateItemExamples(itemId, foundItem.examples);
        await ChecklistService.updateItemCodeExamples(itemId, foundItem.codeExamples);
        if (foundItem.codeExample) {
          await ChecklistService.updateItemCodeExample(itemId, foundItem.codeExample);
        }

        setHasUnsavedChanges(true);
      } catch (err) {
        console.error('Failed to save item examples:', err);
        alert('Failed to save item examples. Please try again.');
      }
    },
    [checklistData, setHasUnsavedChanges]
  );

  return {
    updateExamples,
    updateCodeExample,
    updateCodeExamples,
    saveExamples,
    updateItemExamples,
    updateItemCodeExamples,
    updateItemCodeExample,
    saveItemExamples,
  };
};
