FROM node:16-alpine AS builder
RUN mkdir -p /home/node/dist && chown -R node:node /home/node/dist
USER node
WORKDIR /home/app

COPY --chown=node:node  package.json ./
COPY --chown=node:node yarn.lock ./
COPY --chown=node:node tsconfig.json ./

RUN yarn install --prod
COPY --chown=node:node  . .
ENV NODE_PATH=./build

RUN yarn run build

FROM node:16-alpine as prodution
ENV NODE_ENV production

WORKDIR /home/app

COPY --from=builder --chown=node:node /home/app/package*.json ./
COPY --from=builder --chown=node:node /home/app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/app/dist/ ./dist/

CMD ["yarn", "start:prod"]

