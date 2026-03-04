// components/layout/header.tsx
"use client"; 

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils"; 
import { useCartStore } from "@/lib/store/use-cart-store"; 
import { createClient } from "@/lib/supabase/client"; 
import { SearchModal } from "@/components/layout/search-modal"; // ✅ 1. 引入搜索舱组件

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [isSearchOpen, setIsSearchOpen] = useState(false); // ✅ 2. 新增：控制搜索舱的开关状态
  
  // 订阅 Zustand 购物车状态机
  const { items, openCart } = useCartStore();
  
  // 计算购物车内的总商品件数
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // 挂载时鉴权：只允许主理人看到 ADMIN 入口
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        // 🚨 你的专属邮箱防线
        if (user && user.email === "kwjty12345@gmail.com") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Admin check failed", error);
      }
    };
    checkAdminStatus();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    handleScroll(); 
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ 3. 使用 <></> (Fragment) 将 Header 和 Modal 包裹在一起
  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
          isScrolled 
            ? "h-16 bg-brand-bg/85 backdrop-blur-md border-b border-neutral-200/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)]" 
            : "h-24 bg-transparent border-b border-transparent"
        )}
      >
        <div className="container mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          
          {/* 左翼 */}
          <div className="flex-1 flex items-center justify-start">
            <button 
              onClick={() => setIsSearchOpen(true)} // ✅ 4. 绑定点击事件：打开搜索舱
              className="text-[10px] md:text-xs tracking-[0.2em] text-brand-primary/80 hover:text-brand-secondary transition-colors duration-300"
            >
              SEARCH
            </button>
          </div>

          {/* 中枢 */}
          <div className="flex-2 flex justify-center">
            <Link 
              href="/" 
              className="text-lg md:text-2xl font-serif font-medium tracking-[0.15em] text-brand-primary"
            >
              LUXE PARADISE
            </Link>
          </div>

          {/* 右翼 */}
          <div className="flex-1 flex items-center justify-end gap-6 md:gap-8">
            {["SHOP", "ACCOUNT"].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase()}`}
                className="hidden md:block text-xs tracking-[0.2em] text-brand-primary/80 hover:text-brand-secondary transition-colors duration-300"
              >
                {item}
              </Link>
            ))}
            
            {/* 🚨 架构师隐形门：主理人专属入口 */}
            {isAdmin && (
              <Link 
                href="/admin"
                className="hidden md:flex items-center gap-1.5 text-xs tracking-[0.2em] font-bold text-zinc-900 hover:text-brand-secondary transition-colors duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                ADMIN
              </Link>
            )}

            {/* 动态购物车入口：绑定打开抽屉事件，显示实时数量 */}
            <button 
              onClick={openCart}
              className="text-[10px] md:text-xs tracking-[0.2em] text-brand-primary font-medium hover:text-brand-secondary transition-colors duration-300"
            >
              CART ({totalItems})
            </button>
          </div>

        </div>
      </header>

      {/* ✅ 5. 挂载隐奢全屏搜索舱在全局的最顶层 */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};