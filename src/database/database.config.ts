import { registerAs } from '@nestjs/config';

export const DatabaseConfig = registerAs('database', () => ({
  host: process.env.POSTGRES_HOST,

  database: process.env.POSTGRES_DATABASE,

  username: process.env.POSTGRES_USERNAME,

  password: process.env.POSTGRES_PASSWORD,

  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
}));
