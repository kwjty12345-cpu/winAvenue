"use server";

import { db } from "@/lib/db";
import { wishlist } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server"; // ✅ 引入 Supabase 实例

/**
 * 切换商品收藏状态 (无感知的后台操作)
 * 架构师注：已升级为工业级安全标准。直接从服务端提取 JWT 校验后的 user.id，
 * 彻底杜绝越权漏洞 (IDOR)。
 */
export async function toggleWishlistAction(productSlug: string) { 
  // ✅ 移除了不安全的 userId 参数，由服务端自己去拿
  try {
    // 1. 强制服务端鉴权拦截
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized: 请先登录"); // 拒绝未授权访问
    }

    // 获取绝对安全的 UID
    const realUserId = user.id; 

    // 2. 查询当前是否已收藏
    const existing = await db.query.wishlist.findFirst({
      where: and(
        eq(wishlist.userId, realUserId),
        eq(wishlist.productSlug, productSlug)
      ),
    });

    if (existing) {
      // 3. 物理删除 (取消收藏)
      await db.delete(wishlist).where(
        and(
          eq(wishlist.userId, realUserId),
          eq(wishlist.productSlug, productSlug)
        )
      );
      
      // ✅ 架构师优化：不仅刷新商品页，也同时刷新收藏列表页的缓存
      revalidatePath(`/products/${productSlug}`);
      revalidatePath(`/account/wishlist`); 
      return { isFavorited: false };
      
    } else {
      // 4. 执行插入 (添加收藏)
      await db.insert(wishlist).values({
        userId: realUserId,
        productSlug,
      });
      
      revalidatePath(`/products/${productSlug}`);
      revalidatePath(`/account/wishlist`); 
      return { isFavorited: true };
    }
  } catch (error: any) {
    console.error("Wishlist Action Error:", error);
    // ✅ 架构师修正：如果是鉴权拦截，直接原样抛出，让前端可以捕捉到并重定向
    if (error.message.includes("Unauthorized")) {
      throw error; 
    }
    throw new Error("无法更新收藏状态");
  }
}