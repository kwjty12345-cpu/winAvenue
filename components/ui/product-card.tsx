// components/ui/product-card.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { Eye } from "lucide-react";
import { useQuickViewStore } from "@/lib/store/use-quick-view-store";
import { WishlistButton } from "@/components/ui/wishlist-button";

export function ProductCard({ 
  product, 
  showQuickView = true,
  userId, 
  initialFavorited,
}: { 
  product: any; 
  showQuickView?: boolean; 
  userId?: string; 
  initialFavorited?: boolean; 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { openQuickView } = useQuickViewStore();

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {}); 
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();   
    e.stopPropagation();  
    openQuickView(product);
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group flex flex-col gap-4 w-full relative"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-[#F9F8F6] to-[#EBE9E4] rounded-sm shadow-sm">
        
        {/* 全局点击跳转链接 (z-10) */}
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10" />

        <Image
          src={product.imageUrl.split(',')[0]}
          alt={product.name}
          fill
          className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            isHovered && product.videoUrl ? "opacity-0" : "opacity-100"
          }`}
        />

        {product.videoUrl && (
          <video
            ref={videoRef}
            src={product.videoUrl}
            loop
            muted
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* 🚨 架构师修改：高对比度显眼标签，抛弃透明与圆角 */}
        {product.badge && (
          <div className="absolute top-4 left-4 bg-[#09090b] px-3 py-1 z-20 pointer-events-none shadow-md">
            <span className="text-[11px] tracking-[0.15em] uppercase font-bold text-white">
              {product.badge}
            </span>
          </div>
        )}

        {/* ✅ 修改：隐奢化收藏按钮，平时完全隐藏 (opacity-0)，鼠标悬停卡片时才丝滑浮现 (group-hover:opacity-100) */}
        {userId && (
          <div className="absolute top-3 right-3 z-30">
            <WishlistButton 
              productSlug={product.slug} 
              initialFavorited={!!initialFavorited} 
            />
          </div>
        )}

        {/* 💫 底部抽屉式 Quick View */}
        {showQuickView && (
          <div className="absolute inset-x-0 bottom-0 z-30 overflow-hidden">
            <button
              onClick={handleQuickViewClick}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-white/95 backdrop-blur-md text-[#222] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-white border-t border-white/50"
            >
              <Eye size={14} strokeWidth={1.5} className="text-[#7A6A58]" />
              <span>Quick View</span>
            </button>
          </div>
        )}
      </div>

      {/* 底部文字信息 */}
      <Link href={`/product/${product.slug}`} className="flex flex-col gap-1 px-1 z-10 relative">
        <h3 className="text-[11px] tracking-[0.15em] uppercase font-medium text-[#7A6A58]">
          {product.brand?.name || "Luxury Collection"}
        </h3>
        
        {/* 🚨 架构师修改：移除 font-serif 和 italic，使用默认的无衬线体，并增加 font-medium 提升辨识度 */}
        <p className="text-sm tracking-wide text-[#1A1A1A] font-medium">
          {product.name}
        </p>
        
        <p className="text-sm mt-1 font-light text-[#555]">RM {product.price}</p>
      </Link>
    </div>
  );
}