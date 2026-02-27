"use client"; // 必须添加，因为使用了 useCart Hook 和点击交互

import Link from 'next/link';
import { useCart } from "./CartContext";

// 这里的参数 { openCart } 是为了让点击 "CART" 时能打开侧边栏
export default function Navbar({ openCart }: { openCart?: () => void }) {
  // 从购物车大脑中提取当前的商品总数
  const { cartCount } = useCart();

  return (
    // sticky 效果让导航栏在滚动时吸顶，border-b 配合 brand-line 画出极细底线
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
            <nav className="hidden md:flex space-x-8 text-sm uppercase tracking-widest text-brand-black">
              <Link href="/shop" className="hover:text-gray-500 transition-colors">Shop</Link>
              <Link href="/collections" className="hover:text-gray-500 transition-colors">Collections</Link>
            </nav>
            {/* 修改这里：接入 cartCount 并绑定点击事件 */}
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