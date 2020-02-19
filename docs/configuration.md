---
id: configuration
sidebar_label: Configuration
title: Configuration
---

## Sample

```yaml
version: 1
timeout: 15000

services:
  - name: Website Example
    type: html
    uri: https://example.com
    expectations:
      - selector: h1
        method: text
        value: "Example Domain"

  - name: API Example
    type: json
    uri: https://jsonplaceholder.typicode.com/posts
    expectations:
      - selector: userId
        method: type
        value: "Number"
      - selector: title
        method: value
        value: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit"

webhooks:
  - url: https://example.com
    method: GET

  - url: https://example.com
    method: POST
    headers:
      Authorization: Bearer A_TOKEN
      Content-Type: application/json
    body:
      whatever:
        - data: structure
          you: need
```

## Reference

### `version` [number]

**Required.** Monitorer configuration format version. For now, it must be `1`.

```yaml
version: 1
```

### `timeout` [number]

**Required.** Maximum delay (in milliseconds) after which a service will be considered as down if it
didn't respond. This value must be an integer between `1` and `30000`.

```yaml
timeout: 15000
```

### `services` [array\<object>]

**Required.** List of the web services you wish to monitor.

```yaml
services:
  - …
  - …
```

A service **must** have a `name`, a `type`, a `uri` and at least one expectation (explained below).

The `type` can be `"html"` or `"json"` (`"ping"` type should become available in the following
weeks), should match

```yaml
services:
  - name: Website Example
    type: html
    uri: https://example.com
    expectations:
      - …
      - …
```

#### `expectations` [array\<object>]

**Required.** List of expectations to check in order to consider the related web service as being
"up".

```yaml
services:
  - …
    expectations:
      - …
      - …
```

### `webhooks` [array\<object>]

List of webhook URLs called each time a service goes down or goes up again. Only a service state
change (up or down) will trigger these hooks.

```yaml
webhooks:
  - …
  - …
```
