import { useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useChecklist } from './useChecklist';
import { exportProgress } from '../utils/exportProgress';

/**
 * Custom hook for app-level event handlers
 * Separates business logic from component rendering
 */
export const useAppHandlers = () => {
  const {
    isAdminMode,
    setIsAdminMode,
    setShowPasswordModal,
    setShowSaveModal,
    setShowCopiedNotification,
    setEditingSection,
    setEditingItem,
  } = useAppContext();

  const {
    checklistData,
    checkedItems,
    hasUnsavedChanges,
    copyCodeToClipboard,
    resetToDefault,
  } = useChecklist();

  const handlePasswordSuccess = useCallback(() => {
    setIsAdminMode(true);
    setShowPasswordModal(false);
  }, [setIsAdminMode, setShowPasswordModal]);

  const exitAdminMode = useCallback(() => {
    if (hasUnsavedChanges) {
      const shouldExit = confirm(
        'You have unsaved changes. Remember to click "Copy Code" and update defaultChecklist.ts to save permanently. Exit anyway?'
      );
      if (!shouldExit) return;
    }
    setIsAdminMode(false);
    setEditingSection(null);
    setEditingItem(null);
    resetToDefault();
  }, [hasUnsavedChanges, setIsAdminMode, setEditingSection, setEditingItem, resetToDefault]);

  const handleSave = useCallback(() => {
    setShowSaveModal(true);
    setTimeout(() => setShowSaveModal(false), 3000);
  }, [setShowSaveModal]);

  const handleCopyCode = useCallback(() => {
    copyCodeToClipboard();
    setShowCopiedNotification(true);
    setTimeout(() => setShowCopiedNotification(false), 3000);
  }, [copyCodeToClipboard, setShowCopiedNotification]);

  const handleExport = useCallback(() => {
    exportProgress(checklistData, checkedItems);
  }, [checklistData, checkedItems]);

  const handleAdminClick = useCallback(() => {
    setShowPasswordModal(true);
  }, [setShowPasswordModal]);

  return {
    handlePasswordSuccess,
    exitAdminMode,
    handleSave,
    handleCopyCode,
    handleExport,
    handleAdminClick,
  };
};

