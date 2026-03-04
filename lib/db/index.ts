// lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// 强制要求环境变量中提供 Supabase 的连接池 URL (Session 或 Transaction 模式)
const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error("SUPABASE_DB_URL is missing. Please check your .env.local file.");
}

// 建立连接：使用 Supabase 的连接池，我们可以在这里适当放宽 max connections
const client = postgres(connectionString, { prepare: false });

// 导出注入了 schema 的 Drizzle 实例
export const db = drizzle(client, { schema });