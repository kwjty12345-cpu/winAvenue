"use client";

import { useTransition, useState } from "react";
import { toggleWishlistAction } from "@/app/actions/wishlist";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface WishlistTextButtonProps {
  productSlug: string;
  initialFavorited?: boolean;
  defaultText?: string; // 允许传入自定义文案，如 "SAVE TO COLLECTION"
}

export function WishlistTextButton({
  productSlug,
  initialFavorited = false,
  defaultText = "SAVE TO WISHLIST",
}: WishlistTextButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      // 1. 乐观更新：瞬间变色，给用户极致体验
      setIsFavorited(!isFavorited);
      
      try {
        // 2. 触发安全的 Server Action (不需要传 userId，后端会自动拿)
        const result = await toggleWishlistAction(productSlug);
        setIsFavorited(result.isFavorited);
      } catch (error: any) {
        // 3. 容错回滚：如果后端报错（如未登录），回滚状态并提示
        setIsFavorited(isFavorited);
        
        if (error.message.includes("Unauthorized")) {
           // 如果未登录，引导去登录页 (根据你的实际路由调整)
           router.push("/login"); 
        } else {
           alert("Failed to update wishlist. Please try again.");
        }
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`
        w-full flex items-center justify-center gap-3 py-3.5 
        border text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300
        ${isFavorited 
          ? "border-zinc-900 bg-zinc-50 text-zinc-900" // 收藏后的状态
          : "border-zinc-200 bg-transparent text-zinc-800 hover:border-zinc-900" // 未收藏的状态
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <Heart
        size={16}
        strokeWidth={isFavorited ? 0 : 1.5}
        className={`transition-colors duration-300 ${
          isFavorited ? "fill-zinc-900 text-zinc-900" : "text-zinc-500"
        }`}
      />
      <span>
        {isPending ? "SAVING..." : (isFavorited ? "SAVED" : defaultText)}
      </span>
    </button>
  );
}