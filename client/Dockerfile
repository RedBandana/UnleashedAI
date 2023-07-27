FROM node:18-alpine

WORKDIR /src

ENV REACT_APP_API_URL=https://chatserver-ap4k6fpb2q-uc.a.run.app/api
ENV GENERATE_SOURCEMAP=false

COPY package*.json ./
COPY . ./

RUN npm install
RUN npm run build

EXPOSE 8080

CMD ["npx", "serve", "-l", "8080", "-s", "build"]

#docker build -t unleashed-ai-chat .