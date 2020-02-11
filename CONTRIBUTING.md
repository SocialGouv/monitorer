# Contributing

## Getting started

**Requirements**:

- Node `>=12`
- Yarn `>= 1.21`
- Docker `>= 19`
- Docker Compose `>= 1.24`

```bash
git clone https://github.com/SocialGouv/monitorer.git
cd monitorer
yarn
yarn setup
```

## Run locally

```bash
yarn dev
```

It should be accessible on http://localhost:3000.

## Test

### Deployment Tests

Examples:

- Heroku: https://heroku.com/deploy?template=https://github.com/SocialGouv/monitorer/tree/master

Replace the template URL by your Github branch.

## Recommended IDE Settings

### VS Code

`extensions.json`

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "editorconfig.editorconfig",
    "esbenp.prettier-vscode",
    "mikestead.dotenv",
    "ms-azuretools.vscode-docker",
    "redhat.vscode-yaml",
    "zihanli.at-helper"
  ]
}
```

`settings.json`

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnPaste": false,
  "editor.formatOnSave": true,
  "editor.rulers": [100],
  "eslint.enable": true,
  "javascript.format.enable": false,
  "typescript.format.enable": false
}
```
