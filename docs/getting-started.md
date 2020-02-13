---
id: getting-started
sidebar_label: Getting Started
title: Getting Started
---

## How it works?

Monitorer runs two instances:

- A worker checking **each minute** the web services via their expectations.
- A web application rendering the dashboard as well as the administration part.

Once deployed, the worker is checking each web service listed in the
[configuration](configuration.md) and run their related expectations, which can be run against an
HTML source or a JSON response. If the web service is not able to respond or one of the expectations
is not met, the service will be considered as going down, which will trigger a call to the webhook
URLs.

## Setup

The administration username and password are provided via the following environment variables:

- `MONITORER_ADMIN_USER`
- `MONITORER_ADMIN_PASSWORD`

Once Monitorer is deployed on your favorite PaaS, you must log into the administration (via the web
application) in order to setup and manage the configuration: web services, settings, etc.

## Deployment

Monitorer can be deployed via a single click on:

- [Heroku](heroku.md)
