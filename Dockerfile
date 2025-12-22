# --- Build stage ---
FROM node:22-alpine AS builder

WORKDIR /app

# Build-time args (set from CI; provide defaults only if desired)
ARG PUBLIC_URL="/user"
ARG REACT_APP_HAS_DEPOSIT_WITH_ID="1"
ARG REACT_APP_HOME
ARG REACT_APP_BASE_URL
ARG REACT_APP_BASE_URL_V2
ARG REACT_APP_SOCKET_URL

# Map build args to ENV so CRA picks them at build time
#ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV PUBLIC_URL=${PUBLIC_URL}
ENV REACT_APP_HAS_DEPOSIT_WITH_ID=${REACT_APP_HAS_DEPOSIT_WITH_ID}
ENV REACT_APP_HOME=${REACT_APP_HOME}
ENV REACT_APP_BASE_URL=${REACT_APP_BASE_URL}
ENV REACT_APP_BASE_URL_V2=${REACT_APP_BASE_URL_V2}
ENV REACT_APP_SOCKET_URL=${REACT_APP_SOCKET_URL}

COPY package*.json ./
RUN npm ci --legacy-peer-deps \
    && npm install twin.macro --save-dev


COPY . .
RUN npm run build

# --- Runtime stage ---
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/build /usr/share/nginx/html

# NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]