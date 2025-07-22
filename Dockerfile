FROM node:22

RUN apt-get update && apt-get install -y \
    osmium-tool \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

ENTRYPOINT ["/app/docker-entrypoint.sh"]
