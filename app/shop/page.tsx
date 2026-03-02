"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
// 【架构师注】使用绝对路径别名 @/，确保组件引用稳健
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuickView from "@/components/QuickView";
import MiniCart from "@/components/MiniCart";
import { supabase } from '@/lib/supabase';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // 【关键】确保你的 Supabase 表名大小写一致
        const { data, error } = await supabase
          .from('Products') 
          .select('*');
        
        if (error) {
          console.error('Supabase Error:', error.message);
          return;
        }
        if (data) setProducts(data);
      } catch (error) {
        console.error('Fetch Error:', error);
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
      {/* Navbar 现在的内部已经适配了 Zustand，不再依赖 Context */}
      <Navbar openCart={() => setIsCartOpen(true)} />

      <div className="pt-16 pb-12 text-center px-4">
        <h1 className="text-3xl font-medium tracking-widest text-[#333333] uppercase mb-4">
          Shop All Bags
        </h1>
        <p className="text-xs tracking-[0.1em] text-[#6A7B8C] max-w-xl mx-auto leading-relaxed">
          Explore our complete collection. Crafted with uncompromising attention to detail.
        </p>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-32">
        {isLoading ? (
          <div className="py-20 text-center text-xs tracking-widest uppercase text-brand-black/40">
            Loading Luxury...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-[#DCD7C9] divide-y lg:divide-y-0 lg:divide-x divide-[#DCD7C9]">
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
                      className="w-full bg-white/90 backdrop-blur-sm py-3 text-[10px] uppercase tracking-widest border border-[#DCD7C9] text-[#333333] hover:bg-black hover:text-white transition-all"
                    >
                      Quick View
                    </button>
                  </div>
                </div>

                <div className="w-full text-center">
                  <h3 className="text-sm tracking-widest text-[#333333] font-medium mb-3">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#7C8960] tracking-widest font-medium">
                    RM {product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* 确保这些组件内部引用的都是 useCartStore */}
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