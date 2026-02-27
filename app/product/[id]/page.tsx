"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link"; // 【新增】用於跳轉推薦產品
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import MiniCart from "../../../components/MiniCart";
import { useCart } from "../../../components/CartContext";

const productDatabase: Record<string, any> = {
  "1": {
    id: 1,
    name: "Kira Quilted Satchel",
    price: "RM 1,250",
    description: "A triumph of modern minimalism. The Kira Satchel is crafted from buttery-soft quilted leather, featuring our signature hardware. Perfect for transitioning from day to evening with effortless grace.",
    images: ["https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1200&auto=format&fit=crop"],
    colors: [{ name: "Mocha Black", hex: "#4A3F35" }, { name: "Pearl White", hex: "#FCFAF8" }, { name: "Burgundy", hex: "#8B0000" }],
  },
  "2": {
    id: 2,
    name: "Fleming Soft Tote",
    price: "RM 1,580",
    description: "Spacious and incredibly chic. The Fleming Tote is your perfect daily companion, featuring intricate stitching and a spacious interior that easily fits your laptop and essentials.",
    images: ["https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1200&auto=format&fit=crop"],
    colors: [{ name: "Mocha Black", hex: "#4A3F35" }, { name: "Camel", hex: "#D2B48C" }],
  },
  "3": {
    id: 3,
    name: "Eleanor Crossbody",
    price: "RM 1,100",
    description: "Structured and elegant. The Eleanor Crossbody features clean lines and a bold sculptural hardware logo. The twisted rope chain adds a touch of vintage glamour.",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1200&auto=format&fit=crop"],
    colors: [{ name: "Mocha Black", hex: "#4A3F35" }],
  },
  "4": {
    id: 4,
    name: "Robinson Chain Wallet",
    price: "RM 850",
    description: "The ultimate evening essential. Compact, practical, and undeniably luxurious. Keep your cards, keys, and lipstick organized in this scratch-resistant leather masterpiece.",
    images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1200&auto=format&fit=crop"],
    colors: [{ name: "Rose Pink", hex: "#FFC0CB" }, { name: "Mocha Black", hex: "#4A3F35" }, { name: "Pearl White", hex: "#FCFAF8" }],
  }
};

const commonDetails = [
  "100% Premium Leather",
  "Signature polished hardware",
  "Dust bag included",
  "Imported"
];

export default function ProductDetail() {
  const params = useParams();
  const productId = params?.id as string;
  const productDetails = productDatabase[productId] || productDatabase["1"];

  const [selectedColor, setSelectedColor] = useState(productDetails.colors[0]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: productDetails.id,
      name: productDetails.name,
      price: productDetails.price,
      img: productDetails.images[activeImageIndex],
    });
    setIsCartOpen(true);
  };

  // 【新增】獲取推薦產品（過濾掉當前產品）
  const relatedProducts = Object.values(productDatabase)
    .filter((p: any) => p.id !== productDetails.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-brand-white flex flex-col">
      <Navbar openCart={() => setIsCartOpen(true)} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        {/* 產品主區塊 */}
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24 mb-32">
          
          <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-4">
            <div className="hidden md:flex flex-col gap-4 w-20 order-1">
              {productDetails.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`aspect-[4/5] bg-brand-gray overflow-hidden border transition-all duration-300 ${
                    activeImageIndex === index ? "border-brand-black" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                </button>
              ))}
            </div>

            <div className="flex-1 order-2">
              <div className="aspect-[4/5] bg-brand-gray overflow-hidden relative group">
                <img 
                  key={activeImageIndex}
                  src={productDetails.images[activeImageIndex]} 
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
              {productDetails.price}
            </p>

            <p className="text-sm text-brand-black/60 leading-relaxed tracking-wide mb-10">
              {productDetails.description}
            </p>

            <div className="mb-10">
              <span className="text-xs uppercase tracking-[0.2em] text-brand-black/60 block mb-4">
                Color: {selectedColor.name}
              </span>
              <div className="flex space-x-4">
                {productDetails.colors.map((color: any) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ease-out hover:scale-110 active:scale-95 ${
                      selectedColor.name === color.name 
                        ? "border-brand-black scale-110" 
                        : "border-transparent hover:border-brand-line shadow-sm"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Select ${color.name}`}
                  />
                ))}
              </div>
            </div>

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

        {/* 【新增】您可能也會喜歡區塊 */}
        <section className="border-t border-brand-line pt-20">
          <h2 className="text-center text-xs uppercase tracking-[0.3em] text-brand-black mb-16">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((product: any) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group">
                <div className="aspect-[4/5] bg-brand-gray overflow-hidden mb-6">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xs uppercase tracking-widest text-brand-black mb-2">{product.name}</h3>
                  <p className="text-xs text-brand-black/50">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <MiniCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
}