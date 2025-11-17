# Single Google Apps Script repo

```mermaid
gitGraph
  commit id: "398b71a"
  commit id: "d39b2f8"
  commit id: "654be49"
  commit id: "7e1e4ee"
  commit id: "c0577ea"
  commit id: "2c6156a"
  commit id: "726044d"
  commit id: "e2e84a4"
  commit id: "f5cbe32"
  commit id: "12d9ad8"
  commit id: "7216458"
  commit id: "17e67ef"
  commit id: "c58257d"
  commit id: "3135a09"
  commit id: "1ea4e13"
  commit id: "7ae608c"
  branch work
  checkout work
  commit id: "d5d6157" tag: "work@HEAD"
```

```mermaid
stateDiagram-v2
    state "Local repo" as Repo
    state "clasp CLI" as Clasp
    state "GitHub Actions" as GHA
    state "Google Apps Script" as GAS
    state "Secrets (CLASPRC_JSON)" as Secrets
    Repo --> Clasp: clasp push/pull
    Repo --> GHA: git push main
    GHA --> Secrets: read ~/.clasprc.json
    Secrets --> GHA: restore credentials
    GHA --> GAS: clasp push -f
    Clasp --> GAS: deploy helloWorld()
    GAS --> Repo: execution logs + scriptId reference
```

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Repo as Git Repo
    participant CI as GitHub Actions
    participant Secret as Secret Store
    participant GAS as Apps Script Project
    Dev->>Repo: Update Code.js / manifest
    Dev->>Repo: Commit + push to main
    Repo-->>CI: Push event
    CI->>Secret: Request CLASPRC_JSON
    Secret-->>CI: ~/.clasprc.json contents
    CI->>CI: npm install -g @google/clasp
    CI->>CI: clasp login --status
    CI->>GAS: clasp push -f
    GAS-->>CI: Deployment logs
    CI-->>Dev: Workflow summary
```

```mermaid
flowchart LR
    Dev[Developer]
    Repo[(Single GAS repo)]
    Workflow[GitHub Actions deploy-gas.yml]
    Secret[CLASPRC_JSON Secret]
    Clasp[@google/clasp]
    GAS[Apps Script Project]
    Dev -->|edit + commit| Repo
    Repo -->|push main| Workflow
    Workflow -->|restore| Secret
    Workflow -->|install| Clasp
    Workflow -->|run clasp push -f| GAS
    GAS -->|Logger.log| Workflow
    Workflow -->|status| Dev
```

```mermaid
flowchart LR
    subgraph User
        Dev[Developer]
    end
    subgraph Frontend
        Editor[Apps Script Editor]
    end
    subgraph Backend
        Repo[(Git Repo)]
        CI[GitHub Actions]
        Secret[CLASPRC_JSON]
        GAS[Apps Script Runtime]
    end
    Dev -->|writes code| Editor -->|saves| Repo
    Repo -->|push main| CI -->|reads| Secret
    CI -->|clasp push| GAS -->|logs back to| Editor
```

## Overview

This repository now holds a single Google Apps Script project at the root so that local development, deployment, and CI/CD remain straightforward. The workflow mirrors a typical clasp-based setup: edit `Code.js`, commit changes, and push to `main` to trigger the deploy workflow.

## Repository layout

```text
.
├─ .clasp.json
├─ appsscript.json
├─ Code.js
├─ package.json
└─ .github/
   └─ workflows/
      └─ deploy-gas.yml
```

* **Code.js** – contains the `helloWorld` function that logs a message with `Logger.log`.
* **appsscript.json** – minimal manifest that enables the V8 runtime, STACKDRIVER exception logging, and sets the timezone to Asia/Taipei.
* **.clasp.json** – points clasp at this directory (`rootDir: "."`) and needs the real `scriptId` from your Apps Script project settings.
* **package.json** – optional helper that pins `@google/clasp@^3.1.0` and exposes an npm `deploy` script for local pushes.
* **.github/workflows/deploy-gas.yml** – GitHub Actions workflow that installs clasp, restores credentials from the `CLASPRC_JSON` secret, and runs `clasp push -f` whenever `main` updates (or via manual dispatch).

## Getting started

1. Install clasp locally: `npm install -g @google/clasp@^3.1.0`.
2. Create or clone an Apps Script project and copy its Script ID into `.clasp.json` (replacing `YOUR_SCRIPT_ID_HERE`).
3. Run `clasp login --no-localhost`, then copy the contents of `~/.clasprc.json` into a GitHub repository secret named `CLASPRC_JSON` so CI can authenticate.
4. Use `npm run deploy` locally, or push to `main` to let GitHub Actions run the exact same `clasp push -f` command for you.

## Workflow details

* **Trigger conditions** – pushes to `main` plus manual `workflow_dispatch` events.
* **Node runtime** – Node.js 20 with the latest 3.x clasp release.
* **Secrets** – only `CLASPRC_JSON` is required; it is written to `~/.clasprc.json` inside the workflow runner before `clasp login --status` and `clasp push -f` execute.
* **Output** – deployments log to the workflow summary and to the Apps Script execution transcript, so you can confirm `helloWorld()` ran successfully.

## Extending the project

* Add more `.gs` or `.js` files alongside `Code.js` and update `appsscript.json` scopes as needed.
* Expand the GitHub Actions workflow if you require linting, unit tests, or deployment gates.
* Replace the placeholder script ID before pushing secrets or expecting deployments to succeed.
