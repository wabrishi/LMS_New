import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const tempDir = path.join(rootDir, 'deploy_temp');
const zipFile = path.join(rootDir, 'onlineclass_source.zip');

if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
if (fs.existsSync(zipFile)) {
  fs.rmSync(zipFile, { force: true });
}

fs.mkdirSync(tempDir);

// Copy items to deploy_temp
const itemsToCopy = [
  'src',
  'prisma',
  'server',
  'docs',
  'public',
  'package.json',
  'package-lock.json',
  'index.html',
  'vite.config.ts',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'tailwind.config.js',
  'postcss.config.js',
  '.env.example',
  'README.md',
  'ecosystem.config.cjs',
];

for (const item of itemsToCopy) {
  const srcPath = path.join(rootDir, item);
  const destPath = path.join(tempDir, item);

  if (fs.existsSync(srcPath)) {
    fs.cpSync(srcPath, destPath, { recursive: true });
  }
}

console.log('📦 Copied source files into temporary staging directory.');

// Run PowerShell Compress-Archive from tempDir
execSync(`powershell -Command "Set-Location '${tempDir}'; Compress-Archive -Path * -DestinationPath '${zipFile}' -Force"`, { stdio: 'inherit' });

fs.rmSync(tempDir, { recursive: true, force: true });

console.log(`✅ Successfully created deployment archive: ${zipFile}`);
