---
id: configuration
sidebar_label: Configuration
title: Configuration
---

## Sample

```yaml
version: 1
timeout: 15000

webhooks:
  - https://example.com

services:
  - name: Website Example
    type: html
    uri: https://example.com
    expectations:
      - selector: h1
        method: text
        value: Example Domain

  - name: API Example
    type: json
    uri: https://jsonplaceholder.typicode.com/posts
    expectations:
      - selector: userId
        method: type
        value: Number
      - selector: title
        method: value
        value: sunt aut facere repellat provident occaecati excepturi optio reprehenderit
```

## Reference

### `version` [number]

This is the Monitorer configuration format version. For now, it must be `1`.

```yaml
version: 1
```

### `timeout` [number]

This is the maximum delay (in milliseconds) after which a service will be considered as down if it
didn't respond. This value must be an integer between `1` and `30000`.

```yaml
timeout: 15000
```

### `webhooks` [array\<string>]

List of webhook URLs called each time a service goes down or goes up again. Only a service state
change (up or down) will trigger these hooks.

```yaml
webhooks:
  - https://example.com/a-webhook
  - https://example.com/another-webhook
```

Each webhook URL is called via a `POST` request with a JSON body:

```json
{
  message: "[SERVICE_NAME] is down",
  uri: "[SERVICE_URI]",
}
```

or:

```json
{
  message: "[SERVICE_NAME] is up again",
  uri: "[SERVICE_URI]",
}
```

### `services` [array\<object>]

This is the list of the web services you want to

#### `expectations` [array\<object>]
