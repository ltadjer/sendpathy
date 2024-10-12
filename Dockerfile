FROM node:20-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apt-get update -y && apt-get install -y openssl

RUN corepack enable; \
    corepack prepare pnpm@latest --activate; \
    pnpm add -g pnpm pm2 npm-check-updates @nestjs/cli;

USER node

WORKDIR /home/node/sendpathy