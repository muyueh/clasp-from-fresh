#!/usr/bin/env node
/**
 * Verify that `.github/workflows/deploy-gas.yml` contains
 * `strategy.matrix.project` entries for every `apps-script/gas-*`
 * directory and vice versa.
 */

const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const repoRoot = path.join(__dirname, '..');
const workflowPath = path.join(repoRoot, '.github/workflows/deploy-gas.yml');
const appsScriptRoot = path.join(repoRoot, 'apps-script');

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(workflowPath)) {
  fail(`::error title=Missing workflow::Cannot find ${workflowPath}`);
}

if (!fs.existsSync(appsScriptRoot)) {
  fail(`::error title=Missing apps-script directory::Cannot find ${appsScriptRoot}`);
}

const workflowContent = fs.readFileSync(workflowPath, 'utf8');
const workflow = YAML.parse(workflowContent);
const projects = workflow?.jobs?.deploy?.strategy?.matrix?.project;

if (!Array.isArray(projects) || projects.length === 0) {
  fail('::error title=Missing deploy matrix::strategy.matrix.project is empty or missing.');
}

const normalizedMatrix = projects
  .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
  .filter(Boolean);

const matrixSet = new Set(normalizedMatrix);

const matrixHasDuplicates = matrixSet.size !== normalizedMatrix.length;

const gasFolders = fs
  .readdirSync(appsScriptRoot, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory() && dirent.name.startsWith('gas-'))
  .map((dirent) => path.posix.join('apps-script', dirent.name))
  .sort();

const folderSet = new Set(gasFolders);

const missingInMatrix = gasFolders.filter((folder) => !matrixSet.has(folder));
const missingFolders = normalizedMatrix.filter((entry) => !folderSet.has(entry));

const errors = [];

if (missingInMatrix.length > 0) {
  errors.push(
    `::error title=Missing project entries::Add these folders to strategy.matrix.project: ${missingInMatrix.join(', ')}`
  );
}

if (missingFolders.length > 0) {
  errors.push(
    `::error title=Unknown matrix entries::These matrix entries do not have matching folders: ${missingFolders.join(', ')}`
  );
}

if (matrixHasDuplicates) {
  errors.push('::error title=Duplicate matrix entries::Each project must appear only once in strategy.matrix.project.');
}

if (errors.length > 0) {
  fail(errors.join('\n'));
}

console.log('✅ deploy-gas.yml matrix matches apps-script/gas-* directories.');
