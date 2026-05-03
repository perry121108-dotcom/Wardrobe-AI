FROM node:20-bookworm-slim AS mobile-builder

WORKDIR /app/mobile
COPY mobile/package*.json ./
RUN npm ci
COPY mobile ./
RUN npm run build:web

FROM node:20-bookworm-slim AS app

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY api ./api
COPY engine ./engine
COPY server.js ./
COPY --from=mobile-builder /app/mobile/dist ./mobile/dist

EXPOSE 3000
CMD ["npm", "start"]
