FROM node:10.5.0-alpine

WORKDIR /go/src/gitlab.com/nchc-ai/AI-Eduational-Platform/frontend


COPY . .

ADD app/config/api-k8s.js /go/src/gitlab.com/nchc-ai/AI-Eduational-Platform/frontend/app/config/api.js

RUN yarn install


CMD ["yarn", "dev"]