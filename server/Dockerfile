FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY . ./

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]

#docker build -t unleashed-ai-chat-server .