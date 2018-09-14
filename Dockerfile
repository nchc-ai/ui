FROM node:10.5.0-alpine

WORKDIR /go/src/gitlab.com/nchc-ai/AI-Eduational-Platform/frontend

COPY . .

CMD ["sh", "-c","yarn install && yarn proxy"]