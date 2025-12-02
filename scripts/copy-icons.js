import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '../node_modules/material-icon-theme/icons');
const destDir = path.resolve(__dirname, '../public/icons');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

fs.readdir(sourceDir, (err, files) => {
    if (err) {
        console.error('Could not list the directory.', err);
        process.exit(1);
    }

    files.forEach((file, index) => {
        const fromPath = path.join(sourceDir, file);
        const toPath = path.join(destDir, file);

        fs.copyFile(fromPath, toPath, (err) => {
            if (err) {
                console.error(`Error copying file ${file}`, err);
            }
        });
    });

    console.log(`Copied ${files.length} icons to ${destDir}`);
});
