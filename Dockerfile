FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY default-state.js ./
COPY server.js ./
COPY data ./data

EXPOSE 3000

CMD ["node", "server.js"]
