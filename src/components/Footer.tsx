import React from 'react';

interface FooterProps {
  completedItems: number;
  totalItems: number;
  isAdminMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  completedItems,
  totalItems,
  isAdminMode
}) => {
  const isComplete = completedItems === totalItems && totalItems > 0;

  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
      {isComplete ? (
        <div className="space-y-4">
          <div className="inline-flex p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border border-green-200">
            <span className="text-6xl">🎉</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Congratulations!
            </h3>
            <p className="text-xl text-gray-600 font-medium">
              All items completed. Ready for PR!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
            <span className="text-2xl">💪</span>
            <span className="text-lg font-semibold text-gray-800">
              {totalItems - completedItems} items remaining
            </span>
          </div>
          <p className="text-gray-700 font-medium">Keep going! You're doing great.</p>
        </div>
      )}

      {isAdminMode && (
        <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-xl border border-blue-200">
            <span className="text-blue-700 font-bold">🔧 Admin Mode Active</span>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            <p className="text-sm text-gray-700 font-medium">
              <strong>How to save your changes permanently:</strong>
            </p>
            <ol className="text-sm text-gray-700 space-y-2 text-left">
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">1.</span>
                <span>Make your changes (add/edit/delete sections or items)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">2.</span>
                <span>Click the <strong>"Copy Code"</strong> button above</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">3.</span>
                <span>Open <code className="bg-gray-100 px-2 py-0.5 rounded border border-gray-300">src/data/defaultChecklist.ts</code> in your editor</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">4.</span>
                <span>Find the <code className="bg-gray-100 px-2 py-0.5 rounded border border-gray-300">defaultChecklistData</code> array</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">5.</span>
                <span>Replace it with the copied code and save the file</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">6.</span>
                <span>Refresh the app to see your changes!</span>
              </li>
            </ol>
            <p className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
              💡 <strong>Note:</strong> This saves changes to your actual source code, making them permanent across all users and deploys!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

