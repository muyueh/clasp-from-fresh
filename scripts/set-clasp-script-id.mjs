#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function parseArgs(argv) {
  const args = [...argv];
  let providedScriptId;
  let projectPath = process.env.PROJECT_PATH || 'taipei-500-form';
  while (args.length > 0) {
    const arg = args.shift();
    if (arg === '--path' || arg === '--project' || arg === '--dir') {
      if (args.length === 0) {
        throw new Error(`Missing value after ${arg}`);
      }
      projectPath = args.shift();
      continue;
    }
    if (!providedScriptId) {
      providedScriptId = arg;
    }
  }
  return { providedScriptId, projectPath };
}

async function main() {
  const { providedScriptId, projectPath } = parseArgs(process.argv.slice(2));
  const scriptId = (process.env.CLASP_SCRIPT_ID || process.env.TAIPEI_500_FORM_SCRIPT_ID || providedScriptId || '').trim();
  if (!scriptId) {
    console.error('Error: Missing scriptId. Provide it via the CLASP_SCRIPT_ID env var or as the first argument.');
    process.exit(1);
  }

  const configPath = resolve(projectPath, '.clasp.json');
  let contents;
  try {
    contents = await readFile(configPath, 'utf8');
  } catch (err) {
    console.error(`Error: Unable to read ${configPath}:`, err.message);
    process.exit(1);
  }

  let config;
  try {
    config = JSON.parse(contents);
  } catch (err) {
    console.error(`Error: ${configPath} does not contain valid JSON:`, err.message);
    process.exit(1);
  }

  if (typeof config !== 'object' || config === null) {
    console.error(`Error: ${configPath} must contain a JSON object.`);
    process.exit(1);
  }

  if (config.scriptId === scriptId) {
    console.log(`scriptId in ${configPath} already matches the provided value.`);
    return;
  }

  config.scriptId = scriptId;
  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);
  console.log(`Updated scriptId in ${configPath}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
