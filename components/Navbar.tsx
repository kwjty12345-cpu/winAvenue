"use client"; // 必须添加，因为使用了 Hook 和交互

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from "./CartContext";
import { supabase } from '@/lib/supabase'; // 引入 supabase 客户端

export default function Navbar({ openCart }: { openCart?: () => void }) {
  const { cartCount } = useCart();
  const router = useRouter();

  // 1. 新增：存储当前用户信息的状态
  const [user, setUser] = useState<any>(null);

  // 2. 新增：监听用户的登录状态
  useEffect(() => {
    // 页面加载时检查一次是否已登录
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    // 实时监听登录/登出事件
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 3. 新增：登出功能
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // 登出后自动跳回登录页
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
              
              {/* 4. 新增：用户状态判断区域 */}
              {user ? (
                <div className="group relative py-2">
                  <span className="cursor-pointer hover:text-gray-500 transition-colors">Account</span>
                  
                  {/* 悬浮菜单：高级感的淡入滑出 */}
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