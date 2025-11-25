import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { ADMIN_PASSWORD } from '../../constants/admin';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onSuccess();
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setPasswordError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Lock className="text-blue-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Access</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Enter Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400"
              placeholder="Enter admin password"
              autoFocus
            />
            {passwordError && (
              <p className="text-red-600 text-sm mt-2 font-medium">{passwordError}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-semibold shadow-lg shadow-blue-200"
            >
              Enter Admin Mode
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
