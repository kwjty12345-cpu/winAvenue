import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { wishlist } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProductCard } from "@/components/ui/product-card";
import { createClient } from "@/lib/supabase/server"; // ✅ 引入你的 Supabase 实例

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  // 1. 实例化服务端验证
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // 2. 严苛的鉴权拦截：未登录或 Token 失效，立刻踢回登录页
  // 架构师注：如果你的登录页路由不是 /login，请自行修改此路径（如 /auth/login）
  if (error || !user) {
    redirect("/login"); 
  }

  // 3. 提取极其安全的、经过 JWT 验证的真实 User ID
  const realUserId = user.id;

  // 4. 使用真实的 userId 执行数据库联表查询
  const userWishlist = await db.query.wishlist.findMany({
    where: eq(wishlist.userId, realUserId),
    with: {
      product: true, 
    },
    orderBy: (wishlist, { desc }) => [desc(wishlist.createdAt)],
  });

  // 5. 数据清洗
  const wishlistedProducts = userWishlist
    .map((w) => w.product)
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-3xl font-light tracking-widest uppercase text-zinc-900">
          My Wishlist
        </h1>
        <div className="h-[1px] w-16 bg-zinc-300 mx-auto"></div>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-4">
          <p className="text-lg font-light">Your wishlist is currently empty.</p>
          <a href="/shop" className="text-sm underline underline-offset-4 hover:text-zinc-900 transition-colors">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlistedProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              userId={realUserId} // ✅ 传递真实的 UID 给卡片内部的红心按钮
              initialFavorited={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}