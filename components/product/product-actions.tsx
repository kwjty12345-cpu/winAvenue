// components/product/product-actions.tsx
"use client";

import { ShoppingBag } from "lucide-react"; // 移除了没用到的 Heart，因为它在 WishlistTextButton 里了
import { useCartStore } from "@/lib/store/use-cart-store"; 
import { WishlistTextButton } from "@/components/ui/wishlist-text-button"; // ✅ 新增：引入动态收藏按钮

// ✅ 新增：严谨的类型声明，彻底消灭 page.tsx 里的红线
interface ProductActionsProps {
  product: any;
  initialFavorited?: boolean; 
}

export function ProductActions({ product, initialFavorited }: ProductActionsProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (!product) return;
    
    // 触发全局购物车状态
    addItem({
      id: product.slug,
      name: product.name,
      // 确保价格格式化正确
      price: typeof product.price === 'string' 
        ? parseInt(product.price.replace(/,/g, ''), 10) 
        : product.price,
      // 提取第一张主图
      imageUrl: product.imageUrl.split(',')[0], 
      quantity: 1,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 核心加购按钮 */}
      <button 
        onClick={handleAddToCart}
        className="w-full py-4 bg-[#121212] text-white text-xs tracking-[0.2em] uppercase font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3 shadow-sm"
      >
        <ShoppingBag size={15} strokeWidth={1.5} /> 
        Add to Cart
      </button>
      
      {/* ✅ 新增：次级操作按钮，替换为具有真实全链路交互逻辑的组件 */}
      <WishlistTextButton 
        productSlug={product.slug}
        initialFavorited={initialFavorited}
        defaultText="SAVE TO COLLECTION"
      />
    </div>
  );
}