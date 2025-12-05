import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const MAX_LINES = 300;
const projectRoot = process.cwd();
const srcPath = join(projectRoot, 'src');

function findCssFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('dist')) {
      findCssFiles(filePath, fileList);
    } else if (file.endsWith('.css')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

let hasErrors = false;
const errors = [];

const cssFiles = findCssFiles(srcPath);

console.log(`\nChecking ${cssFiles.length} CSS files for max ${MAX_LINES} lines...\n`);

cssFiles.forEach((filePath) => {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').length;
  const relativePath = relative(projectRoot, filePath).replace(/\\/g, '/');

  if (lines > MAX_LINES) {
    errors.push({ file: relativePath, lines });
    hasErrors = true;
    console.error(`❌ ${relativePath}: ${lines} lines (exceeds ${MAX_LINES})`);
  } else {
    console.log(`✓ ${relativePath}: ${lines} lines`);
  }
});

if (hasErrors) {
  console.error(`\n❌ Found ${errors.length} CSS file(s) exceeding ${MAX_LINES} lines:\n`);
  errors.forEach(({ file, lines }) => {
    console.error(`  - ${file}: ${lines} lines`);
  });
  process.exit(1);
} else {
  console.log(`\n✅ All CSS files are under ${MAX_LINES} lines!\n`);
  process.exit(0);
}
