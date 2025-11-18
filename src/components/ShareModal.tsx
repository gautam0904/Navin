import React, { useState, useEffect } from 'react';
import { X, Wifi, WifiOff, Share2, QrCode, Copy, Check, AlertCircle } from 'lucide-react';
import { ShareService, ShareProgress } from '../services/share.service';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShareComplete?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onShareComplete,
}) => {
  const [mode, setMode] = useState<'select' | 'send' | 'receive'>('select');
  const [shareCode, setShareCode] = useState<string>('');
  const [connectionCode, setConnectionCode] = useState<string>('');
  const [isHosting, setIsHosting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [progress, setProgress] = useState<ShareProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setMode('select');
      setShareCode('');
      setConnectionCode('');
      setIsHosting(false);
      setIsConnecting(false);
      setProgress(null);
      setError(null);
      ShareService.stopSharing();
    }
  }, [isOpen]);

  const handleStartHosting = async () => {
    try {
      setIsHosting(true);
      setError(null);
      const code = ShareService.generateShareCode();
      setShareCode(code);

      await ShareService.startHosting(
        (deviceInfo) => {
          console.log('Device found:', deviceInfo);
        },
        (err) => {
          setError(err);
          setIsHosting(false);
        }
      );
    } catch (error) {
      console.error('Failed to start hosting:', error);
      setError(error instanceof Error ? error.message : 'Failed to start sharing');
      setIsHosting(false);
    }
  };

  const handleJoinShare = async () => {
    if (!connectionCode.trim()) {
      setError('Please enter a connection code');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // TODO: Implement actual WebRTC connection
      // For now, show a placeholder
      setError('WebRTC sharing is under development. Please use Export/Import for now.');
      setIsConnecting(false);
    } catch (error) {
      console.error('Failed to join share:', error);
      setError(error instanceof Error ? error.message : 'Failed to join share');
      setIsConnecting(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Share2 className="text-blue-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Share Data</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {mode === 'select' && (
          <div className="space-y-4">
            <p className="text-gray-600 mb-6">
              Share your checklist data directly between devices without internet connection.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setMode('send')}
                className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
              >
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Wifi className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">Send Data</h3>
                  <p className="text-sm text-gray-600">Make this device discoverable</p>
                </div>
              </button>
              <button
                onClick={() => setMode('receive')}
                className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
              >
                <div className="p-3 bg-green-500 rounded-lg">
                  <WifiOff className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">Receive Data</h3>
                  <p className="text-sm text-gray-600">Connect to another device</p>
                </div>
              </button>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Note: Offline P2P sharing is under active development. For now, please use Export/Import feature in Settings.
              </p>
            </div>
          </div>
        )}

        {mode === 'send' && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('select')}
              className="text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              ← Back
            </button>
            <div className="text-center space-y-4">
              {!isHosting ? (
                <>
                  <p className="text-gray-600">
                    Start sharing to generate a connection code that other devices can use to receive your data.
                  </p>
                  <button
                    onClick={handleStartHosting}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all font-semibold shadow-lg"
                  >
                    Start Sharing
                  </button>
                </>
              ) : (
                <>
                  <div className="p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                    <QrCode className="w-24 h-24 mx-auto text-gray-400 mb-4" />
                    <p className="text-2xl font-bold text-gray-900 mb-2 font-mono tracking-wider">
                      {shareCode}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">Share this code with the receiving device</p>
                    <button
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsHosting(false);
                        setShareCode('');
                        ShareService.stopSharing();
                      }}
                      className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      Stop Sharing
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {mode === 'receive' && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('select')}
              className="text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              ← Back
            </button>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Connection Code
                </label>
                <input
                  type="text"
                  value={connectionCode}
                  onChange={(e) => setConnectionCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400 text-center text-2xl font-mono tracking-wider"
                />
              </div>
              <button
                onClick={handleJoinShare}
                disabled={isConnecting || !connectionCode.trim()}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {progress && progress.stage === 'transferring' && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{progress.stage}</span>
              <span>{progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

