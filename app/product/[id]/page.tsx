"use client";

import { useState, useEffect } from "react"; // 【修改】引入 useEffect
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MiniCart from "../../../components/MiniCart";
import { useCart } from "../../../components/CartContext";
import { supabase } from "@/lib/supabase"; // 【修改】引入 supabase 客户端

const commonDetails = [
  "100% Premium Leather",
  "Signature polished hardware",
  "Dust bag included",
  "Imported"
];

export default function ProductDetail() {
  const params = useParams();
  const productId = params?.id as string;

  // 【新增状态】
  const [productDetails, setProductDetails] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { addToCart } = useCart();

  // 【核心逻辑】从 Supabase 动态抓取商品详情
  useEffect(() => {
    async function fetchPageData() {
      try {
        // 1. 获取当前商品详情
        const { data: currentProduct, error: pError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (pError) throw pError;

        // 2. 获取推荐商品（排除当前商品）
        const { data: related, error: rError } = await supabase
          .from('products')
          .select('*')
          .neq('id', productId)
          .limit(3);

        if (currentProduct) {
          setProductDetails(currentProduct);
          // 这里的 colors 假设在数据库里存的是 JSONB 数组 ['#4A3F35', ...]
          // 如果数据库里存的是对象数组，逻辑保持不变
          setSelectedColor(currentProduct.colors ? currentProduct.colors[0] : null);
        }
        if (related) setRelatedProducts(related);
      } catch (err) {
        console.error("Error fetching detail data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPageData();
  }, [productId]);

  const handleAddToCart = () => {
    if (!productDetails) return;
    addToCart({
      id: productDetails.id,
      name: productDetails.name,
      price: productDetails.price,
      img: productDetails.img, // 注意数据库列名是 img
    });
    setIsCartOpen(true);
  };

  // 加载中状态显示
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-white flex items-center justify-center text-xs tracking-widest uppercase">
        Loading Luxury...
      </div>
    );
  }

  // 如果找不到产品
  if (!productDetails) {
    return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-brand-white flex flex-col">
      <Navbar openCart={() => setIsCartOpen(true)} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24 mb-32">
          
          <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-4">
            {/* 这里如果有多个图片，数据库可以存一个图片数组，目前假设存的是单图 */}
            <div className="flex-1 order-2">
              <div className="aspect-[4/5] bg-brand-gray overflow-hidden relative group">
                <img 
                  src={productDetails.img} 
                  alt={productDetails.name}
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-[2s] ease-out animate-in fade-in duration-700"
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <nav className="text-[10px] tracking-[0.2em] text-brand-black/40 uppercase mb-8">
              Home / Shop / {productDetails.name}
            </nav>

            <h1 className="text-3xl font-light tracking-widest text-brand-black uppercase mb-4">
              {productDetails.name}
            </h1>
            <p className="text-lg text-brand-black/70 tracking-wider mb-8">
              RM {productDetails.price}
            </p>

            <p className="text-sm text-brand-black/60 leading-relaxed tracking-wide mb-10">
              {productDetails.description || "No description available."}
            </p>

            {/* 颜色选择逻辑 */}
            {productDetails.colors && (
              <div className="mb-10">
                <span className="text-xs uppercase tracking-[0.2em] text-brand-black/60 block mb-4">
                  Available Colors
                </span>
                <div className="flex space-x-4">
                  {productDetails.colors.map((colorHex: string, index: number) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border border-brand-line shadow-sm"
                      style={{ backgroundColor: colorHex }}
                    />
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={handleAddToCart}
              className="w-full bg-brand-black text-brand-white py-5 text-sm uppercase tracking-[0.2em] mb-12
                         transition-all duration-500 ease-in-out
                         hover:bg-[#5D5044] hover:shadow-[0_15px_30px_rgba(74,63,53,0.2)]
                         active:scale-[0.98]"
            >
              Add To Cart
            </button>

            <div className="border-t border-brand-line pt-8">
              <h3 className="text-xs uppercase tracking-[0.2em] text-brand-black mb-4 font-bold">
                The Details
              </h3>
              <ul className="space-y-2 text-sm text-brand-black/60 tracking-wide list-inside">
                {commonDetails.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-brand-black/40">-</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 推薦區塊 */}
        <section className="border-t border-brand-line pt-20">
          <h2 className="text-center text-xs uppercase tracking-[0.3em] text-brand-black mb-16">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((product: any) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                <div className="aspect-[4/5] bg-brand-gray overflow-hidden mb-6">
                  <img 
                    src={product.img} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xs uppercase tracking-widest text-brand-black mb-2">{product.name}</h3>
                  <p className="text-xs text-brand-black/50">RM {product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}