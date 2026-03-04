// app/admin/page.tsx
import { db } from "@/lib/db";
import { orders, products } from "@/lib/db/schema"; // ✅ 新增：引入 products 表
import { desc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminClient from "./admin-client"; 

export const dynamic = "force-dynamic"; 

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const ADMIN_EMAIL = "kwjty12345@gmail.com"; // 你的专属主理人邮箱
  if (user.email !== ADMIN_EMAIL) redirect("/");

  const allCategories = await db.query.categories.findMany();
  const allBrands = await db.query.brands.findMany();

  const allOrders = await db.query.orders.findMany({
    with: { address: true, items: true },
    orderBy: [desc(orders.createdAt)],
  });

  // ✅ 新增：级联查询拉取所有商品库存，带上品牌和分类名称
  const allProducts = await db.query.products.findMany({
    with: { brand: true, category: true },
    orderBy: [desc(products.createdAt)], 
  });

  // ✅ 注入数据：新增 allProducts
  return (
    <AdminClient 
      allCategories={allCategories} 
      allBrands={allBrands} 
      allOrders={allOrders} 
      allProducts={allProducts}
    />
  );
}