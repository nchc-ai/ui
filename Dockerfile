FROM node:16.20.2-alpine

WORKDIR /src/github.com/nchc-ai/aitrain-ui

# COPY yarn.lock .
# COPY package-lock.json .
# COPY package.json .
# RUN yarn install

COPY . .

RUN if [ ! -d "/src/github.com/nchc-ai/aitrain-ui/node_modules" ]; then  yarn install; fi

CMD ["sh", "-c","yarn docker"]
