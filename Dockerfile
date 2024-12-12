FROM node:22

WORKDIR /app

COPY .output /app

CMD ["node", "/app/server/index.mjs"]
