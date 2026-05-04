FROM node:20-bookworm AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN npm install --frozen-lockfile 2>/dev/null || npm install

COPY . .
ARG GIT_REV
RUN node -e "require('fs').writeFileSync('src/lib/commit.ts', 'export const COMMIT: string | undefined = \\x27'+(process.env.GIT_REV||'')+'\\x27;')"
RUN npm run build

FROM node:20-bookworm

WORKDIR /app
COPY --from=builder /app/build ./build

EXPOSE 3000
ENV PORT=3000
CMD ["node", "build"]
