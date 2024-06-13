import { config } from 'dotenv';
config();

export const settings = {
  MONGO_URI: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
  JWT_SECRET: process.env.JWT_SECRET || '123',
};

export const jwtConstants = {
  secret: process.env.JWT_SECRET || '123',
};
