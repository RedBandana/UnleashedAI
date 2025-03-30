# Unleashed AI
Unleashed AI is a custom front-end interface for OpenAI's chat completion API.

## Getting started

1. Configure client `.env` files.
Client .env template
```
REACT_APP_API_URL='http://127.0.0.1:3000/api'
REACT_APP_ENCRYPTION_KEY=randomEncryptionKey
GENERATE_SOURCEMAP=false
PUBLIC_URL=.
PORT=4200
```
1. Configure server `.env` files.
Server .env template
```
DB_CONN_STRING="mongodb+srv://admin:string@random-cluster.string.mongodb.net/?retryWrites=true&w=majority"
DB_NAME="MongoDBName"
JWT_SECRET="randomJwtSecret"
API_KEY="openAIApiKey"
EMAIL_USERNAME="contact@email.com"
EMAIL_PASSWORD="randomPassword"
BASE_URL="http://localhost:4200"
SIGNING_KEY='randomSigningKey'
SIGNING_KEY_NAME='randomSigningKeyName'
```
1. Install required packages: `npm install`
2. Run the server and the client: `npm start`
