# Monitorer

> ⚠️ This is a work in progress.

[![Latest Version][img-version]][link-version] [![Build Status][img-travis]][link-travis]
[![Code Coverage][img-coveralls]][link-coveralls]

Check, watch and monitor web-services uptime. Written in full JS.

## Features

- Cheack each minute
- Uptime validation via endpoint sources:
  - HTML (via [cheerio](https://github.com/cheeriojs/cheerio))
  - JSON (type checking)

## Roadmap

- Ping IPs (with custom ports)

## Deploy

### Heroku

_In progress…_

## Contribute

### Getting started

Copy `/.env.example` to `/.env`.

```bash
yarn
docker-compose up -d db
```

### Run locally

```bash
docker-compose start db
yarn dev
```

### VSCode Settings

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnPaste": false,
  "editor.formatOnSave": true,
  "editor.rulers": [100],
  "javascript.format.enable": true,
  "javascript.suggestionActions.enabled": false,
  "typescript.format.enable": false,
  "typescript.suggestionActions.enabled": false
}
```

## License

This repository source code is distributed under [Apache 2.0 license][link-license].

---

[img-coveralls]: https://img.shields.io/coveralls/github/SocialGouv/monitorer?style=flat-square
[img-travis]: https://img.shields.io/travis/SocialGouv/monitorer/dev.svg?style=flat-square
[link-codacy]: https://app.codacy.com/project/SocialGouv/monitorer/dashboard
[link-coveralls]: https://coveralls.io/github/SocialGouv/monitorer
[link-license]: https://github.com/SocialGouv/monitorer/blob/master/LICENSE
[link-travis]: https://travis-ci.com/SocialGouv/monitorer
