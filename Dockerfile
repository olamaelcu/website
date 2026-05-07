FROM node:22-bookworm-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile

COPY . .
COPY .yarn/releases ./docker-yarn-releases

ARG GIT_REV
RUN node -e "require('fs').writeFileSync('src/lib/commit.ts', 'export const COMMIT: string | undefined = \''+(process.env.GIT_REV||'')+'\';')"

RUN mkdir -p .yarn/releases && cp -r docker-yarn-releases/. .yarn/releases/
RUN yarn install && yarn svelte-kit sync
RUN yarn build

FROM node:22-bookworm-slim

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.yarnrc.yml ./
COPY --from=builder /app/Procfile ./
COPY --from=builder /app/.yarn/releases ./.yarn/releases

RUN corepack enable && yarn workspaces focus --production && yarn add @sentry/sveltekit

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "build"]