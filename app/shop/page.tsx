"use client"; // 必须添加，因为使用了 useState 交互

import { useState, useEffect } from 'react'; // 修改：添加 useEffect Hook
import Link from 'next/link';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import QuickView from "../../components/QuickView";
import MiniCart from "../../components/MiniCart";
import { supabase } from '@/lib/supabase'; // 修改：引入你创建的 supabase 客户端

export default function ShopPage() {
  // 修改：初始化 products 为空数组，并添加加载状态
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 状态管理：控制预览侧边栏
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  
  // 2. 添加购物车侧边栏开关状态
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 修改：数据获取逻辑
  useEffect(() => {
    async function fetchProducts() {
      try {
        // 【关键修复 1】：数据库表名必须是大写 "Products"
        const { data, error } = await supabase
          .from('Products') 
          .select('*');
        
        if (error) throw error;
        if (data) setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const openQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] flex flex-col">
      {/* 3. 为 Navbar 传入 openCart 函数 */}
      <Navbar openCart={() => setIsCartOpen(true)} />

      {/* 头部区域 */}
      <div className="pt-16 pb-12 text-center px-4">
        <h1 className="text-3xl font-medium tracking-widest text-[#333333] uppercase mb-4">
          Shop All Bags
        </h1>
        <p className="text-xs tracking-[0.1em] text-[#6A7B8C] max-w-xl mx-auto leading-relaxed">
          Explore our complete collection. Crafted with uncompromising attention to detail in non-obtrusive gem tones.
        </p>
      </div>

      {/* 商品网格区 */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-32">
        
        {/* 修改：加载占位提示 */}
        {isLoading ? (
          <div className="py-20 text-center text-xs tracking-widest uppercase text-brand-black/40">
            Loading Luxury...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-[#DCD7C9] divide-y lg:divide-y-0 lg:divide-x divide-[#DCD7C9]">
            {/* 【关键修复 2】：使用小写的 products (与上面的 useState 一致) */}
            {products.map((product) => (
              <div key={product.id} className="group relative flex flex-col items-center p-8 bg-[#F9F8F4] hover:bg-white transition-colors duration-500">
                
                {product.tag && (
                  <div className="absolute top-4 left-4 z-20 bg-[#F9F8F4] px-2 py-1 border border-[#DCD7C9]">
                    <span className="text-[9px] uppercase tracking-widest text-[#6A7B8C] font-medium">
                      {product.tag}
                    </span>
                  </div>
                )}

                <div className="relative w-full aspect-[4/5] overflow-hidden mb-6 mix-blend-multiply group-hover:mix-blend-normal transition-all duration-500">
                  <Link href={`/product/${product.id}`}>
                    <img 
                      src={product.img} 
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                    />
                  </Link>

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

                <div className="w-full text-center flex flex-col items-center">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-sm tracking-widest text-[#333333] font-medium mb-3 hover:text-[#7C8960] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="flex space-x-2 mb-4">
                    {product.colors?.map((color: string, index: number) => (
                      <div 
                        key={index}
                        className="w-3 h-3 rounded-full border border-[#DCD7C9] cursor-pointer hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

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
        )}

        {/* Load More 按钮 */}
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

      <QuickView 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        product={selectedProduct} 
      />

      <MiniCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
}