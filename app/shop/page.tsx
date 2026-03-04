// app/shop/page.tsx
import { ProductCard } from "@/components/ui/product-card";
import { db } from "@/lib/db";
import { products, wishlist, categories, brands } from "@/lib/db/schema";
// 引入 and, inArray, eq, desc, asc 等
import { desc, asc, eq, and, inArray } from "drizzle-orm"; 
import { createClient } from "@/lib/supabase/server";
import { SortSelect } from "@/components/shop/sort-select";
import { ShopFilters } from "@/components/shop/shop-filters"; 

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  
  const sortParam = params.sort as string | undefined;
  const categorySlugs = params.category ? (params.category as string).split(',') : [];
  const brandSlugs = params.brand ? (params.brand as string).split(',') : [];

  const allCategories = await db.select().from(categories);
  const allBrands = await db.select().from(brands);

  const whereConditions = [];

  // 分类与品牌过滤
  if (categorySlugs.length > 0) {
    const matchedCategoryIds = allCategories.filter(c => categorySlugs.includes(c.slug)).map(c => c.id);
    if (matchedCategoryIds.length > 0) {
      whereConditions.push(inArray(products.categoryId, matchedCategoryIds));
    } else {
      whereConditions.push(eq(products.id, '00000000-0000-0000-0000-000000000000')); 
    }
  }

  if (brandSlugs.length > 0) {
    const matchedBrandIds = allBrands.filter(b => brandSlugs.includes(b.slug)).map(b => b.id);
    if (matchedBrandIds.length > 0) {
      whereConditions.push(inArray(products.brandId, matchedBrandIds));
    } else {
      whereConditions.push(eq(products.id, '00000000-0000-0000-0000-000000000000')); 
    }
  }

  // ✅ 核心修改：将特定 Sort 参数转化为 Where 过滤条件
  if (sortParam === "badge_new_in") whereConditions.push(eq(products.badge, "NEW IN"));
  if (sortParam === "badge_limited") whereConditions.push(eq(products.badge, "LIMITED"));
  if (sortParam === "badge_best_seller") whereConditions.push(eq(products.badge, "BEST SELLER"));

  // 排序规则 (如果是 badge，这里会默认走 desc(createdAt)，保持最新上架在前面)
  let orderClause = [desc(products.createdAt)];
  if (sortParam === "price_asc") orderClause = [asc(products.price)];
  if (sortParam === "price_desc") orderClause = [desc(products.price)];

  const finalWhere = whereConditions.length > 0 ? and(...whereConditions) : undefined;
  
  const realProducts = await db.query.products.findMany({
    where: finalWhere,
    orderBy: orderClause,
    with: { brand: true, category: true },
  });

  // 鉴权与收藏状态
  let userWishlistSlugs: string[] = [];
  let currentUserId: string | undefined = undefined;
  
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      currentUserId = user.id;
      const userWishlist = await db.query.wishlist.findMany({
        where: eq(wishlist.userId, user.id),
        columns: { productSlug: true },
      });
      userWishlistSlugs = userWishlist.map((w) => w.productSlug);
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="flex flex-col w-full min-h-screen pt-32 pb-24 bg-brand-bg">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="flex flex-col items-center justify-center text-center mb-12 gap-4">
          <h1 className="text-[var(--text-fluid-h2)] font-serif tracking-widest uppercase text-brand-primary">
            Shop All Bags
          </h1>
          <p className="text-xs tracking-widest text-neutral-500 uppercase">
            Discover our complete collection
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between py-5 border-y border-neutral-200/60 mb-12 gap-4">
          <ShopFilters categories={allCategories} brands={allBrands} />
          <span className="hidden md:block text-[10px] tracking-widest text-neutral-400 uppercase">
            {realProducts.length} Items
          </span>
          <SortSelect currentSort={sortParam} />
        </div>

        {realProducts.length === 0 ? (
          <div className="py-32 text-center text-zinc-500 tracking-widest uppercase text-sm">
            No products match your current filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
            {realProducts.map((product) => (
              <ProductCard 
                key={product.slug} 
                product={product} 
                userId={currentUserId}
                initialFavorited={userWishlistSlugs.includes(product.slug)} 
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}