import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { neon } from '@neondatabase/serverless';
import pg from 'pg';
import * as schema from '../shared/schema';

const databaseUrl = process.env.DATABASE_URL!;

// Use Neon serverless for production (Vercel), regular pg for local Docker
const isNeon = databaseUrl.includes('neon.tech');

export const db = isNeon
  ? drizzleNeon(neon(databaseUrl), { schema })
  : drizzlePg(new pg.Pool({ connectionString: databaseUrl }), { schema });
