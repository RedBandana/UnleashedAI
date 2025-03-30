# Build Stage
FROM node:18-slim AS build

WORKDIR /src

ENV REACT_APP_API_URL=https://api.unleashedai.org/api
ENV GENERATE_SOURCEMAP=false

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Stage
FROM node:18-slim

RUN useradd -m appuser
USER appuser

WORKDIR /app

COPY --from=build /src/build ./build

EXPOSE 8080

CMD ["npx", "serve", "-l", "8080", "-s", "build"]

#docker build -t unleashed-ai-chat .