import { FileEntry } from '../contexts/FileExplorerContext';

const fileExtensions: Record<string, string> = {
  ts: 'typescript',
  tsx: 'react_ts',
  js: 'javascript',
  jsx: 'react',
  mjs: 'javascript',
  cjs: 'javascript',

  html: 'html',
  css: 'css',
  scss: 'sass',
  sass: 'sass',
  less: 'less',
  json: 'json',
  json5: 'json',
  jsonc: 'json',
  xml: 'xml',
  svg: 'svg',

  toml: 'toml',
  yaml: 'yaml',
  yml: 'yaml',

  md: 'markdown',
  mdx: 'mdx',
  txt: 'document',
  pdf: 'pdf',

  py: 'python',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  h: 'c',
  hpp: 'cpp',
  cs: 'csharp',
  go: 'go',
  rs: 'rust',
  php: 'php',
  rb: 'ruby',
  swift: 'swift',
  kt: 'kotlin',
  dart: 'dart',
  lua: 'lua',
  r: 'r',
  sql: 'database',
  sh: 'console',
  bash: 'console',
  zsh: 'console',

  csv: 'table',
  xlsx: 'table',
  xls: 'table',

  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  webp: 'image',
  ico: 'favicon',

  zip: 'zip',
  tar: 'zip',
  gz: 'zip',
  rar: 'zip',
  '7z': 'zip',

  lock: 'lock',
  gitignore: 'git',

  vue: 'vue',
  svelte: 'svelte',
};

const fileNames: Record<string, string> = {
  'package.json': 'nodejs',
  'package-lock.json': 'nodejs',
  'yarn.lock': 'yarn',
  'pnpm-lock.yaml': 'pnpm',
  'bun.lockb': 'bun',

  'tsconfig.json': 'tsconfig',
  'jsconfig.json': 'jsconfig',
  'next.config.js': 'next',
  'next.config.ts': 'next',
  'tailwind.config.js': 'tailwindcss',
  'tailwind.config.ts': 'tailwindcss',
  'vite.config.js': 'vite',
  'vite.config.ts': 'vite',
  'vitest.config.js': 'vitest',
  'vitest.config.ts': 'vitest',
  'webpack.config.js': 'webpack',
  'rollup.config.js': 'rollup',
  'svelte.config.js': 'svelte',
  'nuxt.config.js': 'nuxt',
  'vue.config.js': 'vue-config',
  'astro.config.js': 'astro-config',
  'remix.config.js': 'remix',
  'gatsby.config.js': 'gatsby',

  'jest.config.js': 'jest',
  'jest.config.ts': 'jest',
  'karma.conf.js': 'karma',
  'playwright.config.js': 'playwright',
  'playwright.config.ts': 'playwright',
  'cypress.config.js': 'cypress',
  'cypress.config.ts': 'cypress',

  '.eslintrc': 'eslint',
  '.eslintrc.js': 'eslint',
  '.eslintrc.json': 'eslint',
  'eslint.config.js': 'eslint',
  '.prettierrc': 'prettier',
  '.prettierrc.js': 'prettier',
  '.prettierrc.json': 'prettier',
  'prettier.config.js': 'prettier',
  '.stylelintrc': 'stylelint',
  'stylelint.config.js': 'stylelint',

  '.gitignore': 'git',
  '.gitattributes': 'git',
  '.gitmodules': 'git',

  Dockerfile: 'docker',
  'docker-compose.yml': 'docker',
  'docker-compose.yaml': 'docker',
  '.dockerignore': 'docker',

  '.travis.yml': 'travis',
  '.gitlab-ci.yml': 'gitlab',
  'azure-pipelines.yml': 'azure-pipelines',

  'README.md': 'readme',
  'readme.md': 'readme',
  'CHANGELOG.md': 'changelog',
  'changelog.md': 'changelog',
  LICENSE: 'license',
  license: 'license',
  'CONTRIBUTING.md': 'contributing',
  'contributing.md': 'contributing',

  Makefile: 'makefile',
  makefile: 'makefile',
  'Cargo.toml': 'rust',
  'Cargo.lock': 'rust',
  'go.mod': 'go-mod',
  'go.sum': 'go-mod',
  'pom.xml': 'maven',
  'build.gradle': 'gradle',
  'requirements.txt': 'python-misc',
  'pyproject.toml': 'python-misc',
  Gemfile: 'gemfile',
  'composer.json': 'php',

  'tauri.conf.json': 'tauri',
  'tauri.config.json': 'tauri',

  '.env': 'tune',
  '.env.local': 'tune',
  '.env.development': 'tune',
  '.env.production': 'tune',

  '.editorconfig': 'editorconfig',
  '.vscode': 'folder-vscode',
  '.cursor': 'cursor',
  '.cursorrules': 'cursor',

  'vercel.json': 'vercel',
  'netlify.toml': 'netlify',
};

const folderNames: Record<string, string> = {
  node_modules: 'folder-node',
  '.git': 'folder-git',
  '.github': 'folder-github',
  '.vscode': 'folder-vscode',
  '.cursor': 'folder-cursor',
  dist: 'folder-dist',
  build: 'folder-dist',
  out: 'folder-dist',
  public: 'folder-public',
  src: 'folder-src',
  test: 'folder-test',
  tests: 'folder-test',
  __tests__: 'folder-test',
  docs: 'folder-docs',
  doc: 'folder-docs',
  documentation: 'folder-docs',
  components: 'folder-components',
  pages: 'folder-routes',
  routes: 'folder-routes',
  api: 'folder-api',
  assets: 'folder-images',
  images: 'folder-images',
  img: 'folder-images',
  icons: 'folder-images',
  styles: 'folder-css',
  css: 'folder-css',
  scss: 'folder-sass',
  sass: 'folder-sass',
  lib: 'folder-lib',
  libs: 'folder-lib',
  utils: 'folder-utils',
  helpers: 'folder-helper',
  hooks: 'folder-hook',
  config: 'folder-config',
  configs: 'folder-config',
  scripts: 'folder-scripts',
  '.husky': 'folder-husky',
  models: 'folder-model',
  controllers: 'folder-controller',
  services: 'folder-services',
  middlewares: 'folder-middleware',
  middleware: 'folder-middleware',
  views: 'folder-views',
  layouts: 'folder-layout',
  types: 'folder-typescript',
  interfaces: 'folder-interface',
  context: 'folder-context',
  contexts: 'folder-context',
  store: 'folder-store',
  redux: 'folder-redux',
  database: 'folder-database',
  db: 'folder-database',
  prisma: 'folder-prisma',
  supabase: 'folder-supabase',
  graphql: 'folder-graphql',
  animations: 'folder-animations',
  fonts: 'folder-fonts',
  i18n: 'folder-i18n',
  locale: 'folder-locale',
  locales: 'folder-locale',
  translations: 'folder-locale',
  temp: 'folder-temp',
  tmp: 'folder-temp',
  cache: 'folder-temp',
  logs: 'folder-log',
  log: 'folder-log',
};

const DEFAULT_FILE_ICON = 'file';
const DEFAULT_FOLDER_ICON = 'folder';
const DEFAULT_FOLDER_OPEN_ICON = 'folder-open';

function getFolderIconName(entry: FileEntry, isExpanded: boolean): string {
  const folderName = entry.name.toLowerCase();
  const specificIcon = folderNames[folderName] || folderNames[entry.name];

  if (specificIcon) {
    const needsOpen = isExpanded && !specificIcon.includes('-open');
    return needsOpen ? `${specificIcon}-open` : specificIcon;
  }

  return isExpanded ? DEFAULT_FOLDER_OPEN_ICON : DEFAULT_FOLDER_ICON;
}

function getFileIconName(entry: FileEntry): string {
  const exactMatch = fileNames[entry.name.toLowerCase()] || fileNames[entry.name];
  if (exactMatch) {
    return exactMatch;
  }

  if (entry.extension) {
    const ext = entry.extension.toLowerCase();
    const extensionMatch = fileExtensions[ext];
    if (extensionMatch) {
      return extensionMatch;
    }
  }

  return DEFAULT_FILE_ICON;
}

export function getIconName(entry: FileEntry, isExpanded = false): string {
  return entry.is_dir ? getFolderIconName(entry, isExpanded) : getFileIconName(entry);
}

export function getIconPath(entry: FileEntry, isExpanded = false): string {
  const iconName = getIconName(entry, isExpanded);
  return `/icons/${iconName}.svg`;
}

export function getFallbackIcon(entry: FileEntry): string {
  if (entry.is_dir) {
    return `/icons/${DEFAULT_FOLDER_ICON}.svg`;
  }
  return `/icons/${DEFAULT_FILE_ICON}.svg`;
}
