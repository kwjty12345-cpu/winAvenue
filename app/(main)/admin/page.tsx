// app/admin/page.tsx
import { db } from "@/lib/db";
import { orders, products } from "@/lib/db/schema"; 
import { desc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminClient from "./admin-client"; 

export const dynamic = "force-dynamic"; 

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // 1. 拦截未登录游客
  if (error || !user) redirect("/login");

  // ⚡️ 架构师手法：从安全的环境变量中读取主理人邮箱
  const adminEmail = process.env.ADMIN_EMAIL;
  
  // 2. 拦截非管理员越权访问
  if (user.email !== adminEmail) {
    console.warn(`🚨 越权访问拦截: ${user.email} 试图访问 Admin Dashboard`);
    redirect("/");
  }

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