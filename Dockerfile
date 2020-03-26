FROM koumoul/webapp-base:1.10.2
MAINTAINER "contact@koumoul.com"

RUN apk add --no-cache mongodb-tools zip unzip bash openssh-client rsync sshpass

ARG VERSION
ENV VERSION=$VERSION
ENV DEBUG nuxt-build-cache
ENV NODE_ENV production
WORKDIR /webapp
ADD package.json .
ADD package-lock.json .
RUN npm install --production


# Adding UI
ADD nuxt.config.js .
ADD nodemon.json .
ADD public public
ADD config config
RUN npm run build

# Adding server files
ADD server server
ADD scripts scripts

ADD README.md .

VOLUME /webapp/data
EXPOSE 8080

CMD ["node", "server"]
