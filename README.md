# Monitorer

[![Apache 2.0 License][img-license]][link-license]
[![Latest Version][img-version]][link-version]
[![Build Status][img-travis]][link-travis]
[![Code Coverage][img-codecov]][link-codecov]

A highly customizable deploy-in-one-click application to monitor your web services uptime and
latency. In pure JS.

## Example

You can check a live example at: https://socialgouv-monitor.herokuapp.com.

## Features

- All-in-one YAML configuration
- Custom expectations _(i.e.: HTML tag text, JSON property value)_
- Supports JSON and HTML services
- Deployable in one click on:
  - Heroku

## Roadmap

- Better documentation
- Ping service (with custom ports)
- Linode deployment

## Deployment

### Heroku

In one click:

[![Deploy to Heroku][img-heroku]][link-heroku]

## Contribute

Please check the [contributing documentation][link-contributing].

## License

This repository source code is distributed under an [Apache 2.0 license][link-license].



[img-codecov]: https://img.shields.io/codecov/c/github/SocialGouv/monitorer?style=flat-square
[img-heroku]: https://img.shields.io/badge/-Deploy%20to%20Heroku-7056bf?style=for-the-badge&logo=heroku
[img-license]: https://img.shields.io/github/license/SocialGouv/monitorer?style=flat-square
[img-travis]: https://img.shields.io/travis/com/SocialGouv/monitorer/master.svg?style=flat-square
[img-version]: https://img.shields.io/github/v/release/SocialGouv/monitorer?include_prereleases&style=flat-square

[link-codecov]: https://codecov.io/gh/SocialGouv/monitorer
[link-contributing]: https://github.com/SocialGouv/monitorer/blob/master/CONTRIBUTING.md
[link-license]: https://github.com/SocialGouv/monitorer/blob/master/LICENSE
[link-travis]: https://travis-ci.com/SocialGouv/monitorer
[link-version]: https://github.com/SocialGouv/monitorer/releases

<!-- This part SHOULD NOT be touched since it is CI-generated: -->
<!-- CI_START -->

[link-heroku]: https://heroku.com/deploy?template=https://github.com/SocialGouv/monitorer/tree/v1.0.0-alpha.11

<!-- CI_END -->
