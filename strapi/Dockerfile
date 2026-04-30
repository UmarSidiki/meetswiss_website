# ─── Stage 1: Build ──────────────────────────────────────────────
FROM node:20-alpine AS build

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json yarn.lock ./
# If using .yarn/releases (Yarn Berry), copy that too
COPY .yarn ./.yarn
COPY .yarnrc.yml* ./

RUN yarn install --immutable

COPY . .

ENV NODE_ENV=production
RUN yarn build

# Remove dev dependencies after build
RUN yarn workspaces focus --production 2>/dev/null || true

# ─── Stage 2: Production ────────────────────────────────────────
FROM node:20-alpine AS production

RUN apk add --no-cache vips-dev

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

# Copy built application
COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
COPY --from=build /app/.yarn ./.yarn
COPY --from=build /app/.yarnrc.yml* ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/config ./config
COPY --from=build /app/src ./src
COPY --from=build /app/database ./database
COPY --from=build /app/favicon.png ./favicon.png
COPY --from=build /app/tsconfig.json ./tsconfig.json

# Create uploads directory
RUN mkdir -p /app/public/uploads && chown -R node:node /app

USER node

EXPOSE 1337

CMD ["yarn", "start"]
