// app/actions/search.ts
"use server";

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { ilike, or } from "drizzle-orm";

export async function liveSearchAction(query: string) {
  if (!query || query.trim() === "") return [];

  try {
    // 架构师引擎：使用 ilike 进行不区分大小写的模糊搜索
    // 同时匹配 商品名称 (name) 或 链接标识 (slug)
    const results = await db.query.products.findMany({
      where: or(
        ilike(products.name, `%${query}%`),
        ilike(products.slug, `%${query}%`)
      ),
      with: { brand: true },
      limit: 5, // 只取前5个，保持极简排版
    });

    return results;
  } catch (error) {
    console.error("Live search failed:", error);
    return [];
  }
}