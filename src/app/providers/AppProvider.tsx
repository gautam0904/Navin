import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  // Admin state
  isAdminMode: boolean;
  setIsAdminMode: (value: boolean) => void;

  // Modal states
  showPasswordModal: boolean;
  setShowPasswordModal: (value: boolean) => void;
  showSaveModal: boolean;
  setShowSaveModal: (value: boolean) => void;
  showCopiedNotification: boolean;
  setShowCopiedNotification: (value: boolean) => void;

  // Editing states
  editingSection: string | null;
  setEditingSection: (value: string | null) => void;
  editingItem: string | null;
  setEditingItem: (value: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showCopiedNotification, setShowCopiedNotification] = useState<boolean>(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        isAdminMode,
        setIsAdminMode,
        showPasswordModal,
        setShowPasswordModal,
        showSaveModal,
        setShowSaveModal,
        showCopiedNotification,
        setShowCopiedNotification,
        editingSection,
        setEditingSection,
        editingItem,
        setEditingItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
