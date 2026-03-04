// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL!,
  },
  // 👇 [关键修复] 给引擎戴上眼罩，防止它扫描 Supabase 内部的 auth/storage 复杂表而崩溃
  schemaFilter: ["public"], 
});