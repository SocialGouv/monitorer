#!/bin/bash
# https://github.com/docker-library/mongo/issues/329#issuecomment-460858099
# https://jira.mongodb.org/browse/SERVER-4895

set -e;

"${mongo[@]}" "$MONGO_INITDB_NON_ROOT_DATABASE" <<-EOJS
  db.createUser({
    user: $(_js_escape "$MONGO_INITDB_NON_ROOT_USERNAME"),
    pwd: $(_js_escape "$MONGO_INITDB_NON_ROOT_PASSWORD"),
    roles: [
      {
        role: "readWrite",
        db: $(_js_escape "$MONGO_INITDB_NON_ROOT_DATABASE")
      }
    ]
  })
EOJS
