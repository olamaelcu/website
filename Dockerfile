FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:20-alpine

WORKDIR /app
RUN corepack enable && yarn add -g serve

COPY --from=builder /app/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]