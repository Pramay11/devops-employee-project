
FROM node:20-alpine

WORKDIR /app

# Update Alpine security packages
RUN apk update && apk upgrade --no-cache

COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# npm is only needed during image build, not application runtime
RUN rm -rf /usr/local/lib/node_modules/npm \
    /usr/local/bin/npm \
    /usr/local/bin/npx

COPY --chown=node:node . .

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Run the application as a non-root user
USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
