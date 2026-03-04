// components/ui/wishlist-button.tsx
"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleWishlistAction } from "@/app/actions/wishlist";
import { useRouter } from "next/navigation";

export function WishlistButton({
  productSlug,
  initialFavorited = false,
}: {
  productSlug: string;
  initialFavorited?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const router = useRouter();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    startTransition(async () => {
      setIsFavorited(!isFavorited); 
      try {
        const result = await toggleWishlistAction(productSlug);
        setIsFavorited(result.isFavorited);
      } catch (error: any) {
        setIsFavorited(isFavorited); 
        if (error.message.includes("Unauthorized")) {
          router.push("/login");
        }
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      // ✅ 核心修复 1：如果已收藏，保持 100% 透明度常驻显示；如果未收藏，才使用悬停显示
      className={`p-2 transition-all duration-300 hover:scale-110 active:scale-95 ${
        isFavorited ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
      aria-label="Toggle Wishlist"
    >
      <Heart
        size={20}
        strokeWidth={1.5}
        // ✅ 核心修复 2：极光对比度。
        // 已收藏：黑色实心 (fill-zinc-900) + 白色描边 (text-white)。黑底显白边，白底显黑心！
        // 未收藏：全透明镂空 (fill-transparent) + 白色描边 (text-white) + 黑色阴影。
        className={`transition-all duration-300 ${
          isFavorited
            ? "fill-zinc-900 text-white drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]" 
            : "fill-transparent text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
        }`}
      />
    </button>
  );
}