// app/product/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { products, wishlist } from "@/lib/db/schema"; 
import { eq, and } from "drizzle-orm"; 
import { ProductActions } from "@/components/product/product-actions"; 
import { createClient } from "@/lib/supabase/server"; 
import { ProductGallery } from "@/components/product/product-gallery"; // ✅ 引入我们刚写的顶级画廊组件

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: { brand: true, category: true }
  });

  if (!product) notFound();

  let initialFavorited = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const existingWishlist = await db.query.wishlist.findFirst({
        where: and(eq(wishlist.userId, user.id), eq(wishlist.productSlug, product.slug)),
      });
      initialFavorited = !!existingWishlist;
    }
  } catch (error) {
    console.error("Failed to fetch user wishlist status:", error);
  }

  // 提取首图与细节图
  const allImages = product.imageUrl.split(',').filter(Boolean);
  const coverImage = allImages[0]; 
  const detailImages = allImages.slice(1); // 剩下的交给画廊组件

  return (
    <div className="flex flex-col w-full min-h-screen pt-28 pb-24 bg-brand-bg">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* 面包屑 */}
        <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-10">
          <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-primary transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-brand-primary font-medium">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative items-start">
          
          {/* 👑 左翼：绝对干净的唯一首图 (Sticky) */}
          <div className="w-full lg:w-1/2 sticky top-32">
            {coverImage && (
              <div className="relative aspect-[4/5] w-full bg-brand-surface overflow-hidden">
                <Image 
                  src={coverImage} alt={`${product.name} - Cover`} fill priority
                  className="object-cover object-center hover:scale-105 transition-transform duration-[1.5s] ease-out"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            )}
          </div>

          {/* 📜 右翼：商品信息 + 画廊 */}
          <div className="w-full lg:w-1/2 flex flex-col justify-start pt-4 lg:pt-0">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 mb-2">
              {product.brand?.name || "Luxe Collection"}
            </h2>
            <h1 className="text-3xl md:text-4xl font-serif tracking-widest uppercase text-brand-primary mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <p className="text-lg font-medium tracking-widest text-neutral-700">
                RM {product.price}
              </p>
              {product.badge && (
                <span className="px-2 py-1 bg-neutral-100 text-[10px] font-bold tracking-[0.1em] uppercase">
                  {product.badge}
                </span>
              )}
            </div>

            {/* 描述文字直接外露，提升阅读体验 */}
            <p className="text-sm leading-loose tracking-wide text-neutral-600 mb-10">
              Elegance in every stitch. This iconic piece is crafted from the finest materials, featuring signature hardware and a timeless silhouette. Designed to transition seamlessly from day to night, it offers both refined style and everyday practicality.
            </p>

            <ProductActions product={product} initialFavorited={initialFavorited} />

            {/* ✅ 核心引擎：注入画廊组件 */}
            <ProductGallery images={detailImages} videoUrl={product.videoUrl} />

            {/* 只保留物流的折叠抽屉 */}
            <div className="mt-8 flex flex-col border-t border-neutral-200/60">
              <details className="group border-b border-neutral-200/60 [&_summary::-webkit-details-marker]:hidden">
                <summary className="py-6 flex justify-between items-center cursor-pointer list-none outline-none">
                  <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-brand-primary">Shipping & Returns</h3>
                  <Plus size={16} className="text-neutral-400 group-hover:text-brand-primary transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <div className="pb-8 group-open:animate-in group-open:fade-in group-open:slide-in-from-top-2 duration-500">
                  <p className="text-sm leading-loose tracking-wide text-neutral-600">
                    Complimentary express shipping on all orders. Returns are accepted within 14 days of delivery. Items must be in original condition with all tags attached.
                  </p>
                </div>
              </details>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}