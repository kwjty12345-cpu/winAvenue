// app/page.tsx
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ProductCard } from "@/components/ui/product-card";
import Link from "next/link";
import Image from "next/image"; 

export default async function HomePage() {
  const newInProducts = await db.query.products.findMany({
    where: eq(products.badge, "NEW IN"),
    orderBy: [desc(products.createdAt)], 
    limit: 4,
    with: { brand: true } 
  });

  const limitedProducts = await db.query.products.findMany({
    where: eq(products.badge, "LIMITED EDITION"),
    orderBy: [desc(products.createdAt)],
    limit: 4,
    with: { brand: true }
  });

  return (
    <main className="min-h-screen pt-20 flex flex-col">
      
      <section className="relative w-full h-[70vh] md:h-[90vh] bg-neutral-100 flex items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2000&auto=format&fit=crop"
          alt="Luxe Paradise - The Art of Elegance"
          fill
          priority 
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30 z-10"></div> 
        
        <div className="relative z-20 text-center text-white space-y-6 px-4 max-w-4xl">
          <h1 className="text-4xl md:text-7xl font-serif tracking-[0.2em] uppercase leading-tight">Luxe Paradise</h1>
          <p className="text-sm md:text-xl tracking-[0.3em] font-light uppercase">Discover the Art of Understated Elegance</p>
          <Link href="/shop" className="inline-block mt-10 bg-white text-black px-12 py-5 text-xs font-bold tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all shadow-xl">
            Shop Collection
          </Link>
        </div>
      </section>

      {newInProducts.length > 0 && (
        <section className="py-24 px-6 w-full bg-gradient-to-b from-[#FFFFFF] via-[#F9F8F6] to-[#F0EFEA]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center mb-16 space-y-3">
              <h2 className="text-2xl md:text-3xl font-serif uppercase tracking-widest text-brand-primary">New In</h2>
              <p className="text-xs text-neutral-400 uppercase tracking-[0.2em]">最新上架系列</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {newInProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-16 flex justify-center">
              <Link href="/shop?badge=new-in" className="border-b border-black pb-1 text-xs tracking-widest uppercase font-semibold hover:text-neutral-500 hover:border-neutral-500 transition-colors">
                View All New Arrivals
              </Link>
            </div>
          </div>
        </section>
      )}

      {limitedProducts.length > 0 && (
        <section className="py-24 px-6 w-full bg-gradient-to-b from-[#F0EFEA] via-[#EBE9E4] to-[#E2DFD8]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center mb-16 space-y-3">
              <h2 className="text-2xl md:text-3xl font-serif uppercase tracking-widest text-brand-primary">Limited Edition</h2>
              <p className="text-xs text-neutral-400 uppercase tracking-[0.2em]">限量典藏系列</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {limitedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-28 px-6 w-full bg-gradient-to-b from-[#E2DFD8] to-[#FFFFFF] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div className="w-full aspect-[4/5] relative bg-neutral-100 rounded-sm overflow-hidden shadow-2xl shadow-[#D4D0C5]/50">
            <Image 
              src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2000&auto=format&fit=crop"
              alt="The LUXE PARADISE Atelier"
              fill
              className="object-cover object-center"
            />
          </div>

          <div className="flex flex-col items-start justify-center space-y-8 pl-0 md:pl-10">
            <h2 className="text-3xl md:text-4xl font-serif uppercase tracking-widest text-brand-primary">The Brand Story</h2>
            <div className="w-16 h-[1px] bg-brand-primary"></div>
            <p className="text-sm leading-loose tracking-wide text-neutral-600 font-light max-w-lg">
              Born from a passion for minimalist elegance, LUXE PARADISE redefines modern luxury. 
              We believe in the power of understated beauty and exceptional craftsmanship. 
              Each piece is thoughtfully curated to empower the modern individual, blending timeless silhouettes with contemporary practicality. 
              Discover a paradise where luxury is not a statement, but an art.
            </p>
            <Link href="/about" className="text-xs tracking-widest uppercase font-bold border-b border-black pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-colors">
              Read Our Full Story
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}