FROM node:12.16.3-alpine

# MongoDB instance URI:
ENV MONGO_URI=
# Website administration password:
ENV MONITORER_ADMIN_PASSWORD=
# Website administration username:
ENV MONITORER_ADMIN_USER=admin
# Website title for Monitorer dashboard:
ENV MONITORER_TITLE=production
# Website port:
ENV PORT=3000

# You shouldn't overwrite this variable:
ENV NODE_ENV=production

WORKDIR /app
COPY ./src ./src
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn

ENTRYPOINT [ "yarn", "start" ]
