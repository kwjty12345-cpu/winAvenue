// components/home/trending-section.tsx
import { ProductCard } from "@/components/ui/product-card";

// 前端 Mock 数据驱动 UI 渲染 (未来将替换为 Supabase Drizzle 查询)
const MOCK_TRENDING_PRODUCTS = [
  { 
    slug: "kira-quilted-satchel", 
    name: "Kira Quilted Satchel", 
    price: "1,250", 
    // 使用 Unsplash 高清替代图
    imageUrl: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop", 
    badge: "NEW IN", 
    colors: ["#2d2d2d", "#8b0000"] 
  },
  { 
    slug: "fleming-soft-tote", 
    name: "Fleming Soft Tote", 
    price: "1,580", 
    imageUrl: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop", 
    colors: ["#d2b48c", "#556b2f"] 
  },
  { 
    slug: "eleanor-crossbody", 
    name: "Eleanor Crossbody", 
    price: "1,100", 
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop", 
    badge: "BEST SELLER", 
    colors: ["#000000"] 
  },
  { 
    slug: "robinson-chain-wallet", 
    name: "Robinson Chain Wallet", 
    price: "850", 
    imageUrl: "https://images.unsplash.com/photo-1614179689702-355944cd0918?q=80&w=1000&auto=format&fit=crop", 
    colors: ["#ff8c00", "#ffc0cb", "#ffffff"] 
  },
];

export const TrendingSection = () => {
  return (
    // py-24 到 py-32 的超大纵向留白，这是大牌设计的精髓
    <section className="w-full py-24 md:py-32 bg-brand-bg">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* 标题区域 */}
        <div className="flex flex-col items-center mb-16 gap-5">
          <h2 className="text-[var(--text-fluid-h2)] font-serif tracking-[0.15em] uppercase text-brand-primary">
            Trending Now
          </h2>
          {/* 极简分割线 */}
          <div className="w-10 h-[1px] bg-brand-primary/30" />
        </div>

        {/* 响应式便当盒网格 (Bento Grid)
            移动端 1列 -> 平板 2列 -> 桌面 4列。gap-x-8 和 gap-y-16 控制呼吸感 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          {MOCK_TRENDING_PRODUCTS.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        
        {/* 底部引导按钮 */}
        <div className="mt-20 flex justify-center">
          <button className="text-[10px] text-brand-primary/60 hover:text-brand-primary tracking-[0.2em] uppercase border-b border-transparent hover:border-brand-primary transition-all duration-300 pb-1">
            View All Bags
          </button>
        </div>

      </div>
    </section>
  );
};