import { Db, MongoClient } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
import mongoose from 'mongoose';

const DATABASE_URI = process.env.DB_CONN_STRING || '';
const DATABASE_NAME = process.env.DB_NAME || '';

@Service()
export class DatabaseService {
    private dataBase: Db;
    private client: MongoClient;

    async start(): Promise<MongoClient | null> {
        try {
            const client = new MongoClient(DATABASE_URI);
            await client.connect();
            // Establish and verify connection
            await client.db(DATABASE_NAME).command({ ping: 1 });

            this.client = client;
            this.dataBase = client.db(DATABASE_NAME);
            await mongoose.connect(DATABASE_URI, { dbName: DATABASE_NAME });
            console.info('Successfully connected to mongoDB database');
        } catch (error) {
            throw new Error('Database connection error' + error.message + error.stack);
        }
        return this.client;
    }

    async closeConnection(): Promise<void> {
        await this.client.close();
        console.info('Successfully closed connection to mongoDB database');
    }

    get database(): Db {
        return this.dataBase;
    }
}
