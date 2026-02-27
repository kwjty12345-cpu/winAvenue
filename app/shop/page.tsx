"use client"; // 必须添加，因为使用了 useState 交互

import { useState } from 'react'; // 添加 Hook 导入
import Link from 'next/link';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import QuickView from "../../components/QuickView";
import MiniCart from "../../components/MiniCart"; // 1. 添加 MiniCart 导入

const allProducts = [
  { id: 1, name: 'Kira Quilted Satchel', price: '1,250.00', img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop', colors: ['#696969', '#F5F5F5', '#800020'] },
  { id: 2, name: 'Fleming Soft Tote', price: '1,580.00', img: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop', colors: ['#8B7355', '#D2B48C'] },
  { id: 3, name: 'Eleanor Crossbody', price: '1,100.00', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop', tag: 'BEST SELLER', colors: ['#7C8960'] },
  { id: 4, name: 'Robinson Chain Wallet', price: '850.00', img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop', colors: ['#D8BFD8', '#FFFFFF'] },
];

export default function ShopPage() {
  // 状态管理：控制预览侧边栏
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  
  // 2. 添加购物车侧边栏开关状态
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] flex flex-col">
      {/* 3. 为 Navbar 传入 openCart 函数 */}
      <Navbar openCart={() => setIsCartOpen(true)} />

      {/* 头部区域：使用莫兰迪灰蓝色调 */}
      <div className="pt-16 pb-12 text-center px-4">
        <h1 className="text-3xl font-medium tracking-widest text-[#333333] uppercase mb-4">
          Shop All Bags
        </h1>
        <p className="text-xs tracking-[0.1em] text-[#6A7B8C] max-w-xl mx-auto leading-relaxed">
          Explore our complete collection. Crafted with uncompromising attention to detail in non-obtrusive gem tones.
        </p>
      </div>

      {/* 商品网格区：加入高级的线条分割，并增加底部超级大留白 (mb-32) */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-32">
        
        {/* 外边框与内部垂直分割线 (divide-x) 使用低饱和度的卡其灰线条 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-[#DCD7C9] divide-y lg:divide-y-0 lg:divide-x divide-[#DCD7C9]">
          {allProducts.map((product) => (
            <div key={product.id} className="group relative flex flex-col items-center p-8 bg-[#F9F8F4] hover:bg-white transition-colors duration-500">
              
              {/* 极简角标 */}
              {product.tag && (
                <div className="absolute top-4 left-4 z-20 bg-[#F9F8F4] px-2 py-1 border border-[#DCD7C9]">
                  <span className="text-[9px] uppercase tracking-widest text-[#6A7B8C] font-medium">
                    {product.tag}
                  </span>
                </div>
              )}

              {/* 图片展示部分 - 整合 Quick View 触发 */}
              <div className="relative w-full aspect-[4/5] overflow-hidden mb-6 mix-blend-multiply group-hover:mix-blend-normal transition-all duration-500">
                <Link href={`/product/${product.id}`}>
                  <img 
                    src={product.img} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                  />
                </Link>

                {/* 悬停时出现的 Quick View 按钮 - 已添加悬浮动效 */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={() => openQuickView(product)} 
                    className="w-full bg-white/90 backdrop-blur-sm py-3 text-[10px] uppercase tracking-widest border border-[#DCD7C9] text-[#333333] 
                               transition-all duration-300 ease-out
                               hover:bg-brand-black hover:text-brand-white hover:border-brand-black
                               active:scale-[0.98]"
                  >
                    Quick View
                  </button>
                </div>
              </div>

              {/* 商品信息与价格分割线 */}
              <div className="w-full text-center flex flex-col items-center">
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-sm tracking-widest text-[#333333] font-medium mb-3 hover:text-[#7C8960] transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                {/* 颜色圆点 */}
                <div className="flex space-x-2 mb-4">
                  {product.colors.map((color, index) => (
                    <div 
                      key={index}
                      className="w-3 h-3 rounded-full border border-[#DCD7C9] cursor-pointer hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* 价格上方的专属细线 */}
                <div className="w-full h-[1px] bg-[#DCD7C9] mb-3 relative">
                   <div className="absolute left-1/2 top-0 h-full bg-[#7C8960] w-0 group-hover:w-1/2 group-hover:-translate-x-1/2 transition-all duration-500"></div>
                </div>

                <p className="text-xs text-[#7C8960] tracking-widest font-medium">
                  RM {product.price}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Load More 按钮 - 已添加悬浮动效 */}
        <div className="mt-20 text-center flex justify-center">
          <button className="border border-[#DCD7C9] text-[#6A7B8C] bg-transparent px-16 py-3 text-xs uppercase tracking-widest 
                             transition-all duration-500 ease-in-out
                             hover:bg-[#DCD7C9] hover:text-[#333333] hover:shadow-lg
                             active:scale-[0.98]">
            Load More
          </button>
        </div>
      </main>

      <Footer />

      {/* 4. 预览侧边栏组件 */}
      <QuickView 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        product={selectedProduct} 
      />

      {/* 5. 购物车侧边栏组件 */}
      <MiniCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
}