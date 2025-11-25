import { useState, useEffect } from 'react';
import { useAppContext } from '../../app/providers/AppProvider';
import { AdminPasswordModal } from './AdminPasswordModal';
import { NotificationModal } from './NotificationModal';
import { ShareModal } from './ShareModal';
import { useAppHandlers } from '../../hooks/useAppHandlers';

export const Modals = () => {
  const {
    showPasswordModal,
    showSaveModal,
    showCopiedNotification,
    setShowPasswordModal,
    setShowSaveModal,
    setShowCopiedNotification,
  } = useAppContext();

  const [showShareModal, setShowShareModal] = useState(false);
  const { handlePasswordSuccess } = useAppHandlers();

  // Expose share modal globally via window for Settings page
  useEffect(() => {
    (window as Window & { openShareModal?: () => void }).openShareModal = () =>
      setShowShareModal(true);
    return () => {
      delete (window as Window & { openShareModal?: () => void }).openShareModal;
    };
  }, []);

  return (
    <>
      <AdminPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
      />

      <NotificationModal
        isOpen={showSaveModal}
        type="save"
        onClose={() => setShowSaveModal(false)}
      />

      <NotificationModal
        isOpen={showCopiedNotification}
        type="copied"
        onClose={() => setShowCopiedNotification(false)}
      />

      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
    </>
  );
};
