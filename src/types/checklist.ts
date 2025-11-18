export interface CodeExample {
  language: string;
  code: string;
}

export interface Examples {
  good: string[];
  bad: string[];
}

export interface CodeExamples {
  good: CodeExample[];
  bad: CodeExample[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  examples?: Examples;
  codeExamples?: CodeExamples;
  // Keep old codeExample for backward compatibility
  codeExample?: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
  examples?: Examples;
  codeExamples?: CodeExamples;
  // Keep old codeExample for backward compatibility
  codeExample?: string;
}

export const LANGUAGES = [
  'typescript',
  'javascript',
  'python',
  'java',
  'cpp',
  'c',
  'rust',
  'go',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'sql',
  'html',
  'css',
  'json',
  'yaml',
  'markdown',
  'bash',
  'shell',
  'plaintext',
];

