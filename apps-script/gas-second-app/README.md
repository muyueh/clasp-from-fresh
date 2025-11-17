# GAS Second App

This directory contains the secondary Apps Script project deployed by the
GitHub Actions matrix. The folder now mirrors a production-ready structure
with a manifest and starter source file so CI can push changes immediately.

## Included files

- `.clasp.json` – links to the remote Script ID with `rootDir` pinned to `.`
- `appsscript.json` – manifest that opts into the V8 runtime and Stackdriver
  logging
- `Code.js` – helper utilities for logging secondary app deployments

## Utility functions

### `logSecondaryAppStatus()`
Logs the deployment metadata (timestamp, time zone, and invoking user) so you
can confirm this project is wired up separately from `gas-main-app`.

### `recordSecondaryAppStatus(spreadsheetId, sheetName)`
Appends the same metadata to the specified Google Sheet and returns the row
number that received the entry. If the sheet name does not exist it will be
created on the fly, giving you an easy audit log of deployments.

## Local development

```bash
cd apps-script/gas-second-app
npx clasp pull --rootDir .
```

Use `clasp push -f` to deploy changes after authenticating locally or rely on
the GitHub Actions workflow once the `CLASPRC_JSON` secret is configured.
