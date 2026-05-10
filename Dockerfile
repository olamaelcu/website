# === BUILDER ===
FROM node:22-bookworm AS builder

WORKDIR /app

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        python3=3.11.2-6+deb12u3 \
        build-essential=12.9 && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable

COPY package.json yarn.lock ./

RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

COPY . .

RUN yarn build

# === PRODUCTION ===
FROM node:22-bookworm-slim

WORKDIR /app

RUN corepack enable && \
    yarn install --frozen-lockfile --omit=dev

COPY --from=builder /app/build ./build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "build/index.js"]