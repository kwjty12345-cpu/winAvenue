// components/layout/header.tsx
"use client"; 

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { cn } from "@/lib/utils"; 
import { useCartStore } from "@/lib/store/use-cart-store"; 
import { SearchModal } from "@/components/layout/search-modal";

// 🚨 架构师修改：接收来自 layout 的 isAdmin prop
export const Header = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const pathname = usePathname(); 
  const { items, openCart } = useCartStore();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // 🗑️ 删除了原本这里的 useEffect (checkAdminStatus) 逻辑，因为服务端已经做好了

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll(); 
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparentMode = pathname === "/" && !isScrolled;
  const textColorClass = isTransparentMode ? "text-white" : "text-brand-primary";
  const hoverColorClass = isTransparentMode ? "hover:text-neutral-300" : "hover:text-brand-secondary";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
          isScrolled 
            ? "h-16 bg-brand-bg/90 backdrop-blur-md border-b border-neutral-200/40 shadow-sm"
            : "h-24 bg-transparent border-transparent"
        )}
      >
        <div className="container flex items-center justify-between h-full px-6 mx-auto md:px-12">
          
          <div className="flex items-center justify-start flex-1">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={cn("text-[10px] md:text-xs tracking-[0.2em] transition-colors duration-300", textColorClass, hoverColorClass)}
            >
              SEARCH
            </button>
          </div>

          <div className="flex justify-center flex-2">
            <Link href="/" className={cn("text-lg md:text-2xl font-serif font-medium tracking-[0.15em] transition-colors duration-300", textColorClass)}>
              LUXE PARADISE
            </Link>
          </div>

          <div className="flex items-center justify-end flex-1 gap-6 md:gap-8">
            {["SHOP", "ACCOUNT"].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase()}`} 
                className={cn("hidden md:block text-xs tracking-[0.2em] transition-colors duration-300", textColorClass, hoverColorClass)}
              >
                {item}
              </Link>
            ))}
            
            {/* 这里的 isAdmin 现在是由服务端直接提供的，绝对准确且无延迟 */}
            {isAdmin && (
              <Link 
                href="/admin"
                className={cn(
                  "hidden md:flex items-center gap-1.5 text-xs tracking-[0.2em] font-bold transition-colors duration-300",
                  textColorClass, hoverColorClass
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                ADMIN
              </Link>
            )}

            <button 
              onClick={openCart}
              className={cn("text-[10px] md:text-xs tracking-[0.2em] font-medium transition-colors duration-300", textColorClass, hoverColorClass)}
            >
              CART ({totalItems})
            </button>
          </div>
        </div>
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};