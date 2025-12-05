import { useState } from 'react';
import { User, Globe, Laptop, Check, Pencil } from 'lucide-react';

interface AuthorInfoProps {
  authorName: string;
  authorEmail: string;
  isGlobal: boolean;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onScopeChange: (global: boolean) => void;
  onSave: () => void;
}

export function AuthorInfo({
  authorName,
  authorEmail,
  isGlobal,
  onNameChange,
  onEmailChange,
  onScopeChange,
  onSave,
}: AuthorInfoProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    onSave();
  };

  if (isEditing) {
    return (
      <div className="p-3 bg-(--color-bg-surface-2) rounded-lg border border-(--color-border-light) animate-scale-in">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-(--color-text-secondary) uppercase tracking-wider">
            Edit Identity
          </span>
          <div className="flex bg-(--color-bg-primary) rounded-lg p-0.5 border border-(--color-border-light)">
            <button
              onClick={() => onScopeChange(false)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                !isGlobal
                  ? 'bg-(--color-primary) text-white shadow-sm'
                  : 'text-(--color-text-tertiary) hover:text-(--color-text-primary)'
              }`}
              title="Local Repository Config"
            >
              <Laptop className="w-3 h-3" />
              Local
            </button>
            <button
              onClick={() => onScopeChange(true)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all ${
                isGlobal
                  ? 'bg-(--color-primary) text-white shadow-sm'
                  : 'text-(--color-text-tertiary) hover:text-(--color-text-primary)'
              }`}
              title="Global User Config"
            >
              <Globe className="w-3 h-3" />
              Global
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={authorName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Your name"
            className="input-premium py-2"
          />
          <input
            type="email"
            value={authorEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="your@email.com"
            className="input-premium py-2"
          />
        </div>
        <div className="flex justify-end mt-3">
          <button onClick={handleSave} className="btn-premium btn-premium-primary btn-premium-sm">
            <Check className="w-3.5 h-3.5" />
            Save {isGlobal ? 'Global' : 'Local'} Config
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-(--color-bg-surface-2) group transition-all border border-transparent hover:border-(--color-border-light)">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-(--color-primary) to-(--color-primary-dark) flex items-center justify-center text-white shrink-0">
          <User className="w-4 h-4" />
        </div>
        <div className="flex flex-col truncate">
          <span className="text-sm font-medium text-(--color-text-primary) truncate">
            {authorName || 'Anonymous'}
          </span>
          <span className="text-xs text-(--color-text-tertiary) truncate">
            {authorEmail || 'No email configured'}
          </span>
        </div>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="p-2 hover:bg-(--color-bg-surface-3) rounded-lg text-(--color-text-tertiary) hover:text-(--color-text-primary) opacity-0 group-hover:opacity-100 transition-all"
        title="Edit Author Configuration"
      >
        <Pencil className="w-4 h-4" />
      </button>
    </div>
  );
}
