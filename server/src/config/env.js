import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';

// Load server/.env if running from workspace root, otherwise load .env
const serverEnvPath = path.resolve(process.cwd(), 'server/.env');
if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else {
  dotenv.config();
}

const envSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().default('mysql://flowem:Flowem@2026!@localhost:3306/flowem_db'),
  JWT_SECRET: z.string().default('flowem_jwt_super_secret_key_2026_brainovision'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  AWS_REGION: z.string().default('ap-south-1'),
  AWS_SES_FROM_EMAIL: z.string().default('noreply@mail.brainovision.in'),
  AWS_ACCESS_KEY_ID: z.string().optional().default(''),
  AWS_SECRET_ACCESS_KEY: z.string().optional().default(''),
  REDIS_HOST: z.string().default('127.0.0.1'),
  REDIS_PORT: z.string().default('6379'),
  REDIS_PASSWORD: z.string().optional().default('')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[FlowEM] Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

