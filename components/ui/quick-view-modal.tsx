// components/ui/quick-view-modal.tsx
"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react"; // ✅ 移除了 Heart，因为它在组件内部了
import { useQuickViewStore } from "@/lib/store/use-quick-view-store";
import { useCartStore } from "@/lib/store/use-cart-store";
import { BrandLogo } from "@/components/ui/brand-logo";
import { WishlistTextButton } from "@/components/ui/wishlist-text-button"; // ✅ 新增：引入动态收藏按钮

export const QuickViewModal = () => {
  const { isOpen, activeProduct, closeQuickView } = useQuickViewStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const mainImageUrl = useMemo(() => {
    if (!activeProduct?.imageUrl) return "";
    return activeProduct.imageUrl.includes(",") 
      ? activeProduct.imageUrl.split(",")[0].trim() 
      : activeProduct.imageUrl;
  }, [activeProduct?.imageUrl]);

  const handleAddToCart = () => {
    if (!activeProduct) return;
    addItem({
      id: activeProduct.slug,
      name: activeProduct.name,
      price: parseInt(activeProduct.price.replace(/,/g, ''), 10), 
      imageUrl: mainImageUrl, 
      quantity: 1,
    });
    closeQuickView();
  };

  return (
    <AnimatePresence>
      {isOpen && activeProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#09090b]/60 backdrop-blur-md"
            onClick={closeQuickView}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative w-full max-w-5xl bg-[#FAF9F6] shadow-2xl flex flex-col md:flex-row max-h-[85vh] overflow-hidden"
          >
            <button 
              onClick={closeQuickView} 
              className="absolute top-6 right-6 z-50 p-2 text-neutral-400 hover:text-black hover:rotate-90 transition-all duration-300"
            >
              <X size={20} strokeWidth={1} />
            </button>

            <div className="relative w-full md:w-1/2 aspect-[4/5] md:aspect-auto bg-neutral-100">
              {mainImageUrl ? (
                <Image 
                  src={mainImageUrl} 
                  alt={activeProduct.name} 
                  fill 
                  priority 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300 font-serif">
                  Image Unavailable
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center overflow-y-auto bg-white">
              
              <BrandLogo showIcon={false} className="mb-6 text-neutral-400 text-xs" />

              <h2 className="text-3xl font-serif text-black mb-4 leading-tight">
                {activeProduct.name}
              </h2>
              
              <p className="text-base font-medium tracking-[0.15em] text-black/80 mb-10">
                RM {activeProduct.price}
              </p>

              <div className="w-12 h-[1px] bg-black/10 mb-10"></div> 

              <p className="text-sm leading-loose tracking-wide text-neutral-500 mb-12 font-light">
                Signature craftsmanship meets modern elegance. This piece is designed to be the perfect companion for your daily essentials, crafted with uncompromising attention to detail and premium materials.
              </p>

              {/* 🎯 核心操作区修改 */}
              <div className="flex flex-col gap-3 mt-auto">
                <button 
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3"
                >
                  <ShoppingBag size={14} /> Add to Cart
                </button>
                
                {/* ✅ 替换为真实的 Server Action 联动物理组件 */}
                <WishlistTextButton 
                  productSlug={activeProduct.slug} 
                  defaultText="SAVE TO WISHLIST" 
                />
              </div>

              <div className="mt-8 text-center">
                <a href={`/product/${activeProduct.slug}`} className="text-[10px] font-medium tracking-[0.2em] uppercase text-neutral-400 hover:text-black transition-colors underline-offset-4 hover:underline">
                  View Full Details
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};