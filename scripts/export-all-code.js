#!/usr/bin/env node
// Skript spojí všechny soubory projektu do jednoho textového souboru
// pro snadné sdílení např. s GPT-5.
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'all-code.txt');

// Složky/soubory, které ignorujeme při exportu
const IGNORE = new Set(['node_modules', '.git', 'all-code.txt']);

async function collect(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    if (IGNORE.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await collect(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

(async () => {
  const files = await collect(root);
  let out = '';
  for (const file of files) {
    const rel = path.relative(root, file);
    const data = await fs.readFile(file, 'utf8');
    out += `===== ${rel} =====\n${data}\n\n`;
  }
  await fs.writeFile(output, out);
  console.log(`Zapsáno ${files.length} souborů do ${output}`);
})();
