// components/ui/wishlist-button.tsx
"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function WishlistButton({ productSlug }: { productSlug: string }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleWishlist = async () => {
    // 架构师思维：此处应调用 Server Action 或 tRPC
    // 1. 检查用户是否登录 (通过 supabase.auth.getSession())
    // 2. 切换本地状态 (乐观更新)
    setIsFavorite(!isFavorite);
    
    // 3. 后端同步逻辑...
  };

  return (
    <button 
      onClick={toggleWishlist}
      className="group flex items-center justify-center gap-2 p-3 transition-all active:scale-90"
    >
      <Heart 
        size={18} 
        className={cn(
          "transition-colors duration-300",
          isFavorite ? "fill-[#7A6A58] text-[#7A6A58]" : "text-neutral-400 group-hover:text-neutral-600"
        )} 
      />
    </button>
  );
}