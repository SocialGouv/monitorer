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
[configuration](configuration.md) and run their related expectations, which can be run against HTML
and JSON responses.

Any of the following conditions will consider the web service as going down, triggering a call to
the webhook URLs:

- The web service URI is unreachable.
- The request exceeded the [timeout](configuration.md#timeout-number).
- One of the [web service expectations](configuration.md#expectations-arrayobject) is not met.

## Setup

The administration username and password are provided via the following environment variables:

- `MONITORER_ADMIN_USER`
- `MONITORER_ADMIN_PASSWORD`

Once Monitorer is deployed, you must log into the administration (via the web application) in order
to setup and manage the configuration: web services, settings, etc.

## Deployment

Monitorer can be deployed via a single click on:

- [Heroku](deployment-heroku.md)
