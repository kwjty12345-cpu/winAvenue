// app/actions/admin.ts
"use server";

import { db } from "@/lib/db";
import { products, categories, brands,orders } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

// 1. 创建分类 (Category)
export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    if (!name || !slug) throw new Error("Name and Slug are required");

    // 写入数据库
    await db.insert(categories).values({ name, slug });

    // 🚀 架构师魔法：瞬间清除此页面的服务端缓存，让前端的下拉框立刻多出这个新分类！
    revalidatePath("/admin");
    revalidatePath("/shop"); // 同步更新商店页的侧边栏缓存
  } catch (error) {
    console.error("Failed to create category:", error);
    throw new Error("无法创建分类，请检查是否 Slug 重复");
  }
}

// 2. 创建品牌 (Brand)
export async function createBrand(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    if (!name || !slug) throw new Error("Name and Slug are required");

    await db.insert(brands).values({ name, slug });

    revalidatePath("/admin");
    revalidatePath("/shop");
  } catch (error) {
    console.error("Failed to create brand:", error);
    throw new Error("无法创建品牌，请检查是否 Slug 重复");
  }
}

// 3. 创建核心商品 (Product)
export async function createProduct(formData: FormData) {
  try {
    // 暴力解构表单数据
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const price = formData.get("price") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const badge = formData.get("badge") as string;
    const categoryId = formData.get("categoryId") as string;
    const brandId = formData.get("brandId") as string;

    // 后端绝对防线：哪怕前端绕过了 required，后端也会拦截
    if (!name || !slug || !price || !imageUrl || !categoryId || !brandId) {
      throw new Error("Missing required product fields");
    }

    // 写入商品主表
    await db.insert(products).values({
      name,
      slug,
      price,
      imageUrl,
      // 如果没有传，存 null 以保持数据库干净
      videoUrl: videoUrl || null,
      badge: badge || null,
      categoryId,
      brandId,
    });

    // 刷新全站相关的静态缓存
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath("/"); // 如果首页有新品推荐区，一并刷新
    
  } catch (error) {
    console.error("Failed to create product:", error);
    throw new Error("发布商品失败，请检查数据完整性或 Slug 是否重复");
  }
}

// 4. 🚀 更新订单状态 (发货、完成等)
export async function updateOrderStatus(orderId: string, newStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled") {
  try {
    await db.update(orders)
      .set({ status: newStatus })
      .where(eq(orders.id, orderId));

    // 瞬间刷新后台数据，让状态立刻变成已发货！
    revalidatePath("/admin");
    // 如果你有用户个人的订单列表页，也可以顺手刷新一下
    revalidatePath("/account/orders"); 
  } catch (error) {
    console.error("Failed to update order status:", error);
    throw new Error("更新订单状态失败");
  }
}

// 5. 💥 删除商品 (Delete Product)
export async function deleteProduct(productId: string) {
  try {
    // 架构师防线：因为我们的 order_items 存的是商品名称快照和文本 slug，
    // 所以直接删除商品绝对不会影响历史订单！
    await db.delete(products).where(eq(products.id, productId));

    // 瞬间刷新全站缓存，让这个包包从地球上消失
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw new Error("删除商品失败");
  }
}

// 6. ✏️ 快速编辑商品 (Update Product)
export async function updateProduct(
  productId: string, 
  data: { price: string; brandId: string; badge: string | null }
) {
  try {
    // 架构师指令：精准更新指定的三个字段
    await db.update(products)
      .set({
        price: data.price,
        brandId: data.brandId,
        badge: data.badge || null,
      })
      .where(eq(products.id, productId));

    // 瞬间刷新全站缓存，前台价格和标签立刻生效！
    revalidatePath("/admin");
    revalidatePath("/shop");
    revalidatePath(`/product`); 
  } catch (error) {
    console.error("Failed to update product:", error);
    throw new Error("更新商品失败");
  }
}