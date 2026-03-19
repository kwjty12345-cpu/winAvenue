// app/page.tsx
import { db } from "@/lib/db";
// 🚨 架构师修改：引入 brands 表进行精准 Left Join
import { products, brands } from "@/lib/db/schema"; 
import { eq, desc } from "drizzle-orm";
import { ProductCard } from "@/components/ui/product-card";
import Link from "next/link";
import Image from "next/image"; 

export default async function HomePage() {
  // ⚡️ 架构师手法：使用 Core API 规避 ORM Bug，保持 Promise.all 高并发
  const [newInRaw, limitedRaw] = await Promise.all([
    // 查询 1: NEW IN
    db.select({
      product: products,
      brand: brands,
    })
    .from(products)
    // 假设你在 products 表中的外键是 brandId，请根据实际 schema 调整
    .leftJoin(brands, eq(products.brandId, brands.id)) 
    .where(eq(products.badge, "NEW IN"))
    .orderBy(desc(products.createdAt))
    .limit(4),

    // 查询 2: LIMITED EDITION
    db.select({
      product: products,
      brand: brands,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .where(eq(products.badge, "LIMITED EDITION"))
    .orderBy(desc(products.createdAt))
    .limit(4)
  ]);

  // 🔄 数据重塑：将 SQL 的平铺结果还原为 UI 组件需要的嵌套结构
  const mapToNestedProduct = (row: any) => ({
    ...row.product,
    brand: row.brand, // 还原 with: { brand: true } 的效果
  });

  const newInProducts = newInRaw.map(mapToNestedProduct);
  const limitedProducts = limitedRaw.map(mapToNestedProduct);

  return (
    <main className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full h-screen bg-neutral-100 flex items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2000&auto=format&fit=crop"
          alt="Luxe Paradise - The Art of Elegance"
          fill
          priority 
          className="object-cover object-center"
        />
        <div className="absolute inset-0 z-10 bg-black/30"></div> 
        
        <div className="relative z-20 max-w-4xl px-4 space-y-6 text-center text-white">
          <h1 className="text-4xl md:text-7xl font-serif tracking-[0.2em] uppercase leading-tight">Luxe Paradise</h1>
          <p className="text-sm md:text-xl tracking-[0.3em] font-light uppercase">Discover the Art of Understated Elegance</p>
          <Link href="/shop" className="inline-block mt-10 bg-white text-black px-12 py-5 text-xs font-bold tracking-[0.3em] uppercase transition-all shadow-xl hover:bg-black hover:text-white">
            Shop Collection
          </Link>
        </div>
      </section>

      {/* 渲染层：New In 模块 */}
      {newInProducts.length > 0 && (
        <section className="w-full px-6 py-24 bg-gradient-to-b from-[#FFFFFF] via-[#F9F8F6] to-[#F0EFEA]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center mb-16 space-y-3">
              <h2 className="text-2xl font-serif tracking-widest uppercase md:text-3xl text-brand-primary">New In</h2>
              <p className="text-xs text-neutral-400 uppercase tracking-[0.2em]">最新上架系列</p>
            </div>
            
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {newInProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="flex justify-center mt-16">
              <Link href="/shop?badge=new-in" className="pb-1 text-xs font-semibold tracking-widest uppercase transition-colors border-b border-black hover:text-neutral-500 hover:border-neutral-500">
                View All New Arrivals
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 渲染层：Limited Edition 模块 */}
      {limitedProducts.length > 0 && (
        <section className="w-full px-6 py-24 bg-gradient-to-b from-[#F0EFEA] via-[#EBE9E4] to-[#E2DFD8]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center mb-16 space-y-3">
              <h2 className="text-2xl font-serif tracking-widest uppercase md:text-3xl text-brand-primary">Limited Edition</h2>
              <p className="text-xs text-neutral-400 uppercase tracking-[0.2em]">限量典藏系列</p>
            </div>
            
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {limitedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 渲染层：Brand Story 模块 */}
      <section className="relative w-full px-6 overflow-hidden py-28 bg-gradient-to-b from-[#E2DFD8] to-[#FFFFFF]">
        <div className="grid items-center grid-cols-1 gap-16 mx-auto max-w-7xl md:grid-cols-2">
          <div className="w-full aspect-[4/5] relative bg-neutral-100 rounded-sm overflow-hidden shadow-2xl shadow-[#D4D0C5]/50">
            <Image 
              src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2000&auto=format&fit=crop"
              alt="The LUXE PARADISE Atelier"
              fill
              className="object-cover object-center"
            />
          </div>

          <div className="flex flex-col items-start justify-center pl-0 space-y-8 md:pl-10">
            <h2 className="text-3xl font-serif tracking-widest uppercase md:text-4xl text-brand-primary">The Brand Story</h2>
            <div className="w-16 h-[1px] bg-brand-primary"></div>
            <p className="max-w-lg text-sm font-light leading-loose tracking-wide text-neutral-600">
              Born from a passion for minimalist elegance, LUXE PARADISE redefines modern luxury. 
              We believe in the power of understated beauty and exceptional craftsmanship. 
              Each piece is thoughtfully curated to empower the modern individual, blending timeless silhouettes with contemporary practicality. 
              Discover a paradise where luxury is not a statement, but an art.
            </p>
            <Link href="/about" className="pb-1 text-xs font-bold tracking-widest uppercase transition-colors border-b border-black hover:text-neutral-500 hover:border-neutral-500">
              Read Our Full Story
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}