# Ledger Sheet Apps Script

This Apps Script project provisions the `Ledger` worksheet, adds data-validation rules, and exposes helper menu actions via `Code.gs`. The project intentionally **does not** include a `.clasp.json` yet because we still need the real Script ID from you before we can bind the local source to a Apps Script project.

## Getting the Script ID
1. Create the Apps Script project in the Apps Script UI (bound to the Google Sheet you want to automate).
2. Copy its Script ID.
3. Share that ID in this task so we can create the `.clasp.json` through the onboarding flow described in `docs/AGENTS-onboarding-flows.md`.
4. After the `.clasp.json` exists, we can re-enable CI deployment for this folder.

Until step 3 happens, please do not expect the `.clasp.json` (or CI deploys) to exist—there is nothing to commit yet without the ID.
