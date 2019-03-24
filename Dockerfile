FROM node:10-alpine 

# Version for alpine version see in https://github.com/nodejs/docker-node

# E.g. `node:10-alpine` image based on `alpine:3.9`
# https://github.com/nodejs/docker-node/blob/master/10/alpine/Dockerfile
#
# using in `puppeteer_install.sh`
ENV ALPINE_VERSION 3.9

WORKDIR /app

COPY . .
RUN chmod +x ./puppeteer_install.sh && ./puppeteer_install.sh

ENV CHROME_BIN=/usr/bin/chromium-browser

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser 

RUN npm install --production

ENTRYPOINT [ "npm", "start" ]