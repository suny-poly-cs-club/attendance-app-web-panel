FROM node:lts-alpine AS builder

WORKDIR /usr/src/app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
ARG VITE_API_BASE_URL
RUN pnpm build

FROM nginx:1.25-alpine AS runtime
EXPOSE 80
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
