ARG NODE_IMAGE=node:18.17.1-alpine

FROM $NODE_IMAGE AS base
RUN apk --no-cache add dumb-init supervisor
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base AS dependencies
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node . .

FROM dependencies AS build
RUN node ace build --production --ignore-ts-errors

FROM base AS production
USER root
COPY /docker/worker.conf /etc/supervisor.d/worker.ini
ENV NODE_ENV=production
ENV PORT=$PORT
ENV HOST=0.0.0.0
COPY --chown=node:node ./package*.json ./
RUN npm ci --production
COPY --chown=node:node --from=build /home/node/app/build .
COPY --chown=node:node ./docker/ .

RUN chmod +x /home/node/app/entrypoint.sh

EXPOSE $PORT

CMD [ "sh", "entrypoint.sh" ]
# ENTRYPOINT ["./docker/entrypoint.sh"]
