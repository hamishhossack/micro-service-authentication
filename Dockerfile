FROM node:4-onbuild

ENV NODE_ENV $env

RUN npm install -g forever

VOLUME ["/opt/applications/auth-app"]

WORKDIR /opt/applications/auth-app

EXPOSE 3009

CMD forever --uid auth -a -o out.log -e err.log --minUptime 2000 --spinSleepTime 1000 authServer.js
