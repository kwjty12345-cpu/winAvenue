// server/actions/admin.ts
"use server";

import { db } from "@/lib/db";
import { categories, brands, products } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

// 商家添加分类 (保持不变)
export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  if (!name || !slug) return;

  await db.insert(categories).values({ name, slug });
  revalidatePath("/admin"); // 刷新管理页以显示新分类
}

// 商家添加品牌 (保持不变)
export async function createBrand(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  if (!name || !slug) return;

  await db.insert(brands).values({ name, slug });
  revalidatePath("/admin");
}

// 商家添加商品 (👈 这里新增了接收视频的逻辑)
export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const price = formData.get("price") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const videoUrl = formData.get("videoUrl") as string; // 👈 1. 从表单中提取视频链接
  const badge = formData.get("badge") as string;
  const categoryId = formData.get("categoryId") as string;
  const brandId = formData.get("brandId") as string;

  await db.insert(products).values({
    name,
    slug,
    price,
    imageUrl,
    videoUrl: videoUrl || null, // 👈 2. 存入数据库。如果商家没传视频，就存为 null
    badge: badge || null,
    categoryId,
    brandId,
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
}