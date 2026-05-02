FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile

COPY . .
ARG GIT_REV
RUN <<'EOF'
cat > src/lib/commit.ts <<EOFCOMMIT
export const COMMIT: string | undefined = '${GIT_REV}';
EOFCOMMIT
EOF
RUN yarn build

FROM node:20-alpine

RUN npm install -g serve

WORKDIR /app
COPY --from=builder /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]