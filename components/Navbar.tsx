"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
// 【架构师注】引入 Zustand 引擎和 supabase
import { useCartStore } from '../src/stores/useCartStore';
import { supabase } from '@/lib/supabase';

export default function Navbar({ openCart }: { openCart?: () => void }) {
  const router = useRouter();

  // 【架构师注】核心魔法：直接从 Zustand 获取用户状态和购物车数量。
  // 不再需要 useEffect 和 useState，代码瞬间清爽。
  const user = useCartStore((state) => state.user);
  const cartCount = useCartStore((state) => 
    state.cartItems.reduce((total, item) => total + item.quantity, 0)
  );

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // 登出后 Zustand 会通过 AuthInit 自动更新状态，这里直接跳转即可
    router.push('/login'); 
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-white border-b border-brand-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 左侧：搜索 */}
          <div className="flex-1 flex justify-start">
            <button className="text-brand-black hover:text-gray-500 transition-colors text-sm uppercase tracking-widest">
              Search
            </button>
          </div>

          {/* 中间：品牌 Logo */}
          <Link href="/" className="flex-1 flex justify-center">
            <span className="text-2xl font-bold tracking-widest text-brand-black uppercase">
              LUXE PARADISE
            </span>
          </Link>

          {/* 右侧：导航链接与购物车 */}
          <div className="flex-1 flex justify-end items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest text-brand-black">
              <Link href="/shop" className="hover:text-gray-500 transition-colors">Shop</Link>
              
              {/* 用户状态判断区域 */}
              {user ? (
                <div className="group relative py-2">
                  <span className="cursor-pointer hover:text-gray-500 transition-colors">Account</span>
                  
                  {/* 悬浮菜单 */}
                  <div className="absolute right-1/2 translate-x-1/2 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out z-50">
                    <div className="bg-brand-white border border-brand-line p-5 min-w-[180px] shadow-[0_10px_30px_rgba(74,63,53,0.05)] flex flex-col gap-4 items-center">
                      <span className="text-[10px] text-brand-black/40 tracking-widest lowercase w-full text-center truncate pb-3 border-b border-brand-line">
                        {user.email}
                      </span>
                      <button 
                        onClick={handleSignOut} 
                        className="text-xs text-brand-black hover:text-[#7C8960] transition-colors uppercase tracking-widest"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="hover:text-gray-500 transition-colors">Sign In</Link>
              )}
            </nav>

            <button 
              onClick={openCart}
              className="text-brand-black hover:text-gray-500 transition-colors text-sm uppercase tracking-widest"
            >
              Cart ({cartCount})
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}