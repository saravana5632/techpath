import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

let mongoServer: MongoMemoryServer | null = null;

export const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  try {
    // Use in-memory MongoDB if no URI is provided or if it is a local URI
    // since the containerized environment does not run a local MongoDB instance.
    if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
      console.log('Local MongoDB URI detected. Spinning up in-memory MongoDB...');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`Warning: Could not connect to primary MongoDB: ${error.message}`);
    console.warn('Falling back to in-memory MongoDB...');
    try {
      if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
      }
      uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`Fallback in-memory MongoDB Connected: ${conn.connection.host}`);
    } catch (fallbackError: any) {
      console.error(`Error connecting to fallback MongoDB: ${fallbackError.message}`);
      console.warn('Authentication will not work until MongoDB is properly configured.');
    }
  }
};

