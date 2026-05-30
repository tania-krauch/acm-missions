FROM node:22-alpine

WORKDIR /workspace

RUN corepack enable

COPY . .

RUN pnpm install

CMD ["pnpm", "dev"]
