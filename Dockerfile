FROM node:14.11.0-alpine3.10

RUN mkdir /srv/bbsays && chown node:node /srv/bbsays

USER node

WORKDIR /srv/bbsays

COPY --chown=node:node package.json package-lock.json ./

RUN npm ci

FROM node:14.11.0-alpine3.10

USER node

WORKDIR /srv/bbsays

COPY --from=development --chown=root:root /srv/chat/node_modules ./node_modules

COPY . .

CMD ["node", "dist/server.js"]
