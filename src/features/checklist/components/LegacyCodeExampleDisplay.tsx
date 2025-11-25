import React from 'react';

interface LegacyCodeExampleDisplayProps {
  codeExample: string;
}

export const LegacyCodeExampleDisplay: React.FC<LegacyCodeExampleDisplayProps> = ({
  codeExample,
}) => {
  return (
    <div className="bg-bg-secondary dark:bg-bg-secondary rounded-lg p-6 overflow-x-auto shadow-md border border-border-medium dark:border-border-medium">
      <pre className="text-sm font-mono text-wild-sand dark:text-loblolly leading-relaxed">
        {codeExample}
      </pre>
    </div>
  );
};
