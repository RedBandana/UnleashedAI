FROM node:18-alpine

WORKDIR /src

ARG API_URL
ENV REACT_APP_API_URL=$API_URL
ENV GENERATE_SOURCEMAP=false

COPY package*.json ./
COPY . ./

RUN npm install
RUN npm run build

CMD ["npx", "serve", "-s", "build"]

#docker build --build-arg API_URL=value -t unleashed-ai-chat .
