FROM node:14

ADD package.json /tmp/package.json

ADD package-lock.json /tmp/package-lock.json

RUN rm -rf build

RUN cd /tmp && npm install

ADD ./ /tmp

RUN rm -rf src/node_modules && cp -a /tmp/node_modules /src/

WORKDIR /tmp

RUN npm build

CMD npm run dev

