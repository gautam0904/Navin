import React from 'react';
import { CheckCircle } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  type: 'save' | 'copied';
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, type }) => {
  if (!isOpen) return null;

  const isSave = type === 'save';
  const bgColor = isSave
    ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-300'
    : 'bg-gradient-to-r from-blue-500 to-indigo-500 border-blue-300';
  const textColor = isSave ? 'text-green-50' : 'text-blue-50';

  return (
    <div
      className={`fixed top-6 right-6 z-50 ${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl max-w-md animate-slide-in border`}
    >
      <div className="flex items-start gap-3">
        <CheckCircle size={24} className="shrink-0 mt-1" />
        <div>
          <p className="font-semibold text-lg mb-1">{isSave ? 'Ready to save!' : 'Code copied!'}</p>
          <p className={`text-sm ${textColor}`}>
            {isSave
              ? 'Click "Copy Code" then paste it into App.tsx to replace the defaultChecklistData array'
              : 'Now paste it into App.tsx to replace defaultChecklistData. Save the file to persist changes.'}
          </p>
        </div>
      </div>
    </div>
  );
};
