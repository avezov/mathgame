FROM node:alpine as frontend
WORKDIR /app

COPY --chown=node:node frontend/package*.json /app
RUN npm install
COPY --chown=node:node frontend/src /app/src
COPY --chown=node:node frontend/public /app/public
RUN npm run build

FROM node:alpine as backend
WORKDIR /app
COPY --chown=node:node backend/package*.json /app
RUN npm install
COPY --chown=node:node backend /app
RUN npx prisma db push && npm run build

FROM node:alpine
WORKDIR /app/backend
COPY --from=frontend /app/build /app/frontend/build
COPY --from=backend /app /app/backend

CMD [ "dist/index.js" ]