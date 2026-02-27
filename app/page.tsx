"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import FeaturedProducts from "../components/FeaturedProducts";
import BrandStory from "../components/BrandStory";
import Footer from "../components/Footer";
import MiniCart from "../components/MiniCart"; // 引入购物车

export default function Home() {
  // 控制购物车侧边栏开关的状态
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <main className="min-h-screen bg-brand-white">
      {/* 1. 同步 Navbar：传入开启购物车的函数 */}
      <Navbar openCart={() => setIsCartOpen(true)} />
      
      <HeroBanner />
      
      {/* 2. FeaturedProducts：原本内部已有加购逻辑，确保其状态与全局同步 */}
      <FeaturedProducts />
      
      <BrandStory />
      
      <Footer />

      {/* 3. 挂载 MiniCart：确保首页也能呼出购物车 */}
      <MiniCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </main>
  );
}