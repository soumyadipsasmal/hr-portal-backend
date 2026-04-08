FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY default-state.js ./
COPY server.js ./
COPY data ./data

EXPOSE 5000

CMD ["node", "server.js"]

# FROM node:20-alpine
# WORKDIR /app
# COPY package.json ./
# RUN npm install
# COPY . .
# EXPOSE 3000
# CMD ["node", "start"]