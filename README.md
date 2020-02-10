# Monitorer

[![Apache 2.0 License][img-license]][link-license]
[![Latest Version][img-version]][link-version]
[![Build Status][img-travis]][link-travis]
[![Code Coverage][img-codecov]][link-codecov]

A deploy-in-one-click web services uptime monitorer. In pure JS.

## Example

You can see it live at: https://socialgouv-monitor.herokuapp.com.

## Screenshots

### Dashboard

![Dashboard Screenshot][img-screenshot-dashboard]

### Administration

![Administration Screenshot][img-screenshot-admin]

## Features

- YAML configuration
- Custom Expectations (i.e.: HTML tag text, JSON property value)
- JSON and HTML response support
- Cutomizable interval (via a cron)
- Deployable in one click on:
  - Heroku

## Roadmap

- Better documentation
- Ping IPs (with custom ports)
- Digital Ocean deployment
- Netlify deployment
- Linode deployment

## Deployment

### Heroku

In one click:


[![Deploy to Heroku][img-heroku]][link-heroku]

## Contribute

### Getting started

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

### Run locally

```bash
yarn dev
```

It should be accessible on http://localhost:3000.

### Test

#### Deployment Tests

Examples:

- Heroku: https://heroku.com/deploy?template=https://github.com/SocialGouv/monitorer/tree/master

Replace the template URL by your Github branch.

### Recommended IDE Settings

#### VS Code

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

## License

This repository source code is distributed under an [Apache 2.0 license][link-license].

---

[img-screenshot-admin]: https://raw.githubusercontent.com/SocialGouv/monitorer/master/.github/screenshot-admin.png
[img-screenshot-dashboard]: https://raw.githubusercontent.com/SocialGouv/monitorer/master/.github/screenshot-dashboard.png

[img-codecov]: https://img.shields.io/codecov/c/github/SocialGouv/monitorer?style=flat-square
[img-heroku]: https://img.shields.io/badge/-Deploy%20to%20Heroku-7056bf?style=for-the-badge&logo=heroku
[img-license]: https://img.shields.io/github/license/SocialGouv/monitorer?style=flat-square
[img-travis]: https://img.shields.io/travis/com/SocialGouv/monitorer/master.svg?style=flat-square
[img-version]: https://img.shields.io/github/v/release/SocialGouv/monitorer?include_prereleases&style=flat-square

[link-codecov]: https://codecov.io/gh/SocialGouv/monitorer
[link-heroku]: https://heroku.com/deploy?template=https://github.com/SocialGouv/monitorer/tree/master
[link-license]: https://github.com/SocialGouv/monitorer/blob/master/LICENSE
[link-travis]: https://travis-ci.com/SocialGouv/monitorer
[link-version]: https://github.com/SocialGouv/monitorer/releases
