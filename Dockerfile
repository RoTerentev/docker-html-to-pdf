# ---------------------------------------------------------------------------- #
#                                     BASE                                     #
# ---------------------------------------------------------------------------- #
FROM node:12-alpine3.11 as base

LABEL org.opencontainers.image.authors=roman.dv.93@gmail.com
LABEL org.opencontainers.image.title="HTML to PDF converter based on Puppeteer and Node.js"
LABEL org.opencontainers.image.licenses=MIT

# Version of Alpine linux see in https://github.com/nodejs/docker-node
#   E.g. `node:12-alpine` image based on `alpine:3.9`
#   https://github.com/nodejs/docker-node/blob/master/12/alpine3.11/Dockerfile

# ALPINE_VERSION used in `preinstall.sh`
ENV ALPINE_VERSION 3.11
ENV NODE_ENV=production
ENV CHROME_BIN=/usr/bin/chromium-browser

# Add user so we don't need --no-sandbox
RUN addgroup -S pptruser \
    && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser

# Add tini @see https://github.com/krallin/tini
RUN apk add --no-cache tini

# Install Chromium
COPY ./chromium_install.sh ./
RUN chmod +x ./chromium_install.sh && ./chromium_install.sh

# Install Puppeteer
# NOTE: Set correct version of Puppeteer (corresponded to installed chromium)
# https://github.com/GoogleChrome/puppeteer/releases
#
RUN CHROMIUM_VERSION=$(apk search chromium | sed 's/^chromium-\([0-9]*\).*$/\1/') \
    && PUPPETEER_PACKAGE=puppeteer-core@chrome-$CHROMIUM_VERSION \
    && npm install -g ${PUPPETEER_PACKAGE} \
    && npm cache clean --force

WORKDIR /node

COPY ./src/package*.json ./

RUN npm config list
# Install app dependencies
RUN npm ci \
    && npm cache clean --force

# Help Node.js to find global modules
ENV NODE_PATH /usr/local/lib/node_modules
# Help shell to find node utils
ENV PATH /node/node_modules/.bin/:$PATH

WORKDIR /node/app

# ---------------------------------------------------------------------------- #
#                                  PRODUCTION                                  #
# ---------------------------------------------------------------------------- #
FROM base as prod

ENV NODE_ENV=production

COPY ./src ./

# Run everything after as non-privileged user.
USER pptruser

RUN npm install --production

ENTRYPOINT [ "npm", "start" ]