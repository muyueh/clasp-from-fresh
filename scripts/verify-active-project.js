#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function fail(message) {
  console.error(`verify-active-project: ${message}`);
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, '..');
const activeProjectPath = path.join(repoRoot, 'apps-script', '.active-project');

if (!fs.existsSync(activeProjectPath)) {
  fail('Missing apps-script/.active-project. Run `echo "apps-script/<folder>/" > apps-script/.active-project` to set it.');
}

const rawContent = fs.readFileSync(activeProjectPath, 'utf8');
const nonEmptyLines = rawContent
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line.length > 0);

if (nonEmptyLines.length !== 1) {
  fail('apps-script/.active-project must contain exactly one non-empty line.');
}

const flagValue = nonEmptyLines[0];

if (!flagValue.endsWith('/')) {
  fail('Active project entry must end with a trailing slash (e.g., apps-script/gas-main-app/).');
}

const match = flagValue.match(/^apps-script\/[A-Za-z0-9_-]+\/$/);
if (!match) {
  fail('Active project entry must match the pattern apps-script/<folder>/.');
}

const folderName = flagValue.replace(/^apps-script\//, '').replace(/\/$/, '');
const folderPath = path.join(repoRoot, 'apps-script', folderName);

if (!fs.existsSync(folderPath)) {
  fail(`Referenced folder "${flagValue}" does not exist.`);
}

const stats = fs.statSync(folderPath);
if (!stats.isDirectory()) {
  fail(`Referenced path "${flagValue}" is not a directory.`);
}

console.log(`Active project flag OK: ${flagValue}`);
