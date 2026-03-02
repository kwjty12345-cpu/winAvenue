"use client";

import Link from 'next/link';
// 【架构师注】统一使用别名路径，并确保引用的是 Zustand Store
import { useCartStore } from "@/src/stores/useCartStore"; 

export default function QuickView({ 
  isOpen, 
  onClose, 
  product 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  product: any;
}) {
  // 【关键修复】从 Zustand 提取 addToCart，不再调用已删除的 useCart()
  const addToCart = useCartStore((state) => state.addToCart);

  if (!product) return null;

  const handleAddToCart = () => {
    // 【架构师注】确保传入的数据包含 store 需要的 img 字段
    addToCart({
      ...product,
      img: product.imageUrl || product.img // 兼容不同组件传入的字段名
    });
    onClose(); 
  };

  return (
    <>
      {/* 黑色半透明背景遮罩 - 保持你的玻璃拟物化设计 */}
      <div 
        className={`fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-[60] transition-all duration-500 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* 右侧滑出的预览面板 */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-xl bg-brand-white z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] shadow-2xl flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-6">
          <button onClick={onClose} className="text-2xl font-light text-brand-black/40 hover:text-brand-black transition-colors">×</button>
        </div>

        <div className="flex-grow overflow-y-auto px-12 pb-12">
          {/* 大图展示 */}
          <div className="aspect-[4/5] bg-brand-gray mb-8 overflow-hidden">
            <img 
              src={product.imageUrl || product.img} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* 简短信息 */}
          <h2 className="text-2xl font-light tracking-widest text-brand-black uppercase mb-4">{product.name}</h2>
          <p className="text-sm text-brand-black/70 mb-6">{product.price}</p>
          <p className="text-xs text-brand-black/50 leading-relaxed mb-8 uppercase tracking-widest">
            Crafted in premium leather with our signature hardware. A timeless piece for your daily collection.
          </p>

          <Link 
            href={`/product/${product.id}`}
            className="block w-full text-center border border-brand-black py-4 text-[10px] uppercase tracking-[0.2em] mb-4 hover:bg-brand-black hover:text-brand-white transition-all"
          >
            View Full Details
          </Link>
          
          <button 
            onClick={handleAddToCart}
            className="w-full bg-brand-black text-brand-white py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-brand-black/90 transition-colors"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </>
  );
}