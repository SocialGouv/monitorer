---
id: webhook-sendgrid
sidebar_label: Link to SendGrid
title: Link to SendGrid
---

Here is an example of a SendGrid webhook:

```yaml
webhooks:
  - url: https://api.sendgrid.com/v3/mail/send
    method: POST
    headers:
      Authorization: Bearer REPLACE_BY_A_SENDGRID_API_KEY
      Content-Type: application/json
    body:
      personalizations:
        - to:
            - email: REPLACE_BY_YOUR_EMAIL
          subject: "{MESSAGE}"
      from:
        email: monitorer@social.gouv.fr
        name: Monitorer
      content:
        - type: text/html
          value: |
            <h1>{IS_DOWN}Damn…{/IS_DOWN}{IS_UP}Yeah!{/IS_UP}</h1>
            <p>Please check <strong>{NAME}</strong>: <code>{URI}</code>.</p>
```
