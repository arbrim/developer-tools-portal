FROM node:20-alpine AS deps
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app/frontend
ARG VITE_API_URL=/api
ARG VITE_APP_ENV=
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_ENV=$VITE_APP_ENV
COPY --from=deps /app/frontend/node_modules ./node_modules
COPY frontend ./
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app/frontend
ENV NODE_ENV=production
COPY --from=deps /app/frontend/node_modules ./node_modules
COPY --from=build /app/frontend/dist ./dist
COPY --from=build /app/frontend/vite.config.ts ./vite.config.ts
COPY frontend/package.json ./package.json
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]