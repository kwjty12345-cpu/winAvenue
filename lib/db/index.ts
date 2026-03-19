// lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error("SUPABASE_DB_URL is missing. Please check your .env.local file.");
}

// 🛡️ 架构师防线 1：为全局对象注入类型，防止 TypeScript 报错
declare global {
  var postgresClient: postgres.Sql | undefined;
}

// 🛡️ 架构师防线 2：严格限制最大连接数
// 在 Serverless 环境中，扩展是靠实例数量，而不是单个实例的连接数。
// max: 1 确保每个 Lambda 函数/页面渲染只占用 1 个宝贵的连接。
const connectionOptions = {
  prepare: false, // 搭配 Supabase PgBouncer 必须为 false
  max: 1,         // 核心修复：防止单个实例抽干连接池
};

// 🛡️ 架构师防线 3：全局单例模式 (Singleton)
// 确保在 Next.js 的开发环境中，无论你保存多少次代码，永远复用同一个物理连接
const client = globalThis.postgresClient ?? postgres(connectionString, connectionOptions);

if (process.env.NODE_ENV !== 'production') {
  globalThis.postgresClient = client;
}

// 导出注入了 schema 的 Drizzle 实例
export const db = drizzle(client, { schema });