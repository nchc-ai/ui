FROM node:10.5.0-alpine

WORKDIR /src/gitlab.com/nchc-ai/aitrain-ui

# COPY yarn.lock .
# COPY package-lock.json .
# COPY package.json .
# RUN yarn install

COPY . .

RUN if [  -d "/src/gitlab.com/nchc-ai/aitrain-ui/node_modules" ]; then  yarn install; fi

CMD ["sh", "-c","yarn docker"]
