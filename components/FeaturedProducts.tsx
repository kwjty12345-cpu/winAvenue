"use client";

import Link from 'next/link';
import { motion } from 'framer-motion'; // 引入动效引擎
import { ShoppingBag, Eye } from 'lucide-react'; // 引入图标库
import { useCartStore } from '../src/stores/useCartStore';
import { toast } from 'sonner'; // 建议安装 sonner 以获得玻璃拟物化通知

const products = [
  {
    id: 1,
    name: 'Kira Quilted Satchel',
    price: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop',
    tag: 'New In',
    colors: ['#4A3F35', '#F5F5DC', '#8B0000'],
  },
  // ... 其他产品保持一致，注意价格建议统一为 number 以便计算
  {
    id: 2,
    name: 'Fleming Soft Tote',
    price: 1580,
    imageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop',
    colors: ['#4A3F35', '#D2B48C'],
  },
  {
    id: 3,
    name: 'Eleanor Crossbody',
    price: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
    tag: 'Best Seller',
    colors: ['#4A3F35'],
  },
  {
    id: 4,
    name: 'Robinson Chain Wallet',
    price: 850,
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
    colors: ['#FFC0CB', '#4A3F35', '#FCFAF8'],
  }
];

// 定义动画变体：实现错落有致的入场
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 } // 每个子元素间隔 0.15s
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: 'spring', stiffness: 60, damping: 20 } 
  }
};

export default function FeaturedProducts() {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleQuickAdd = (product: any) => {
    addToCart({ ...product, img: product.imageUrl });
    toast.success(`${product.name} added to bag`, {
      description: "Complimentary gift wrapping applied.",
      icon: <ShoppingBag className="w-4 h-4" />,
    });
  };

  return (
    <section className="relative py-24 bg-brand-gray overflow-hidden">
      {/* 2026 风格水印：随滚动产生微妙位移 (需配合视差逻辑，此处先做静态优化) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="absolute top-1/4 left-0 w-full flex justify-center pointer-events-none select-none z-0"
      >
        <span className="text-[20vw] font-bold text-brand-black/[0.03] tracking-tighter uppercase whitespace-nowrap">
          Luxe Paradise
        </span>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-clamp-lg font-light tracking-[0.3em] text-brand-black uppercase"
          >
            Trending Now
          </motion.h2>
          <div className="w-12 h-[1px] bg-brand-black mx-auto mt-6"></div>
        </div>

        {/* 动画容器 */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
        >
          {products.map((product) => (
            <motion.div 
              key={product.id} 
              variants={itemVariants}
              className="group relative"
            >
              {product.tag && (
                <div className="absolute top-3 left-3 z-20 bg-brand-white/90 backdrop-blur-md px-3 py-1 shadow-sm border border-white/20">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-brand-black font-semibold">
                    {product.tag}
                  </span>
                </div>
              )}

              {/* 核心卡片容器 */}
              <div className="relative aspect-[4/5] overflow-hidden bg-brand-white mb-6 cursor-pointer group shadow-subtle hover:shadow-hover transition-all duration-700">
                <Link href={`/product/${product.id}`} className="block h-full">
                  <motion.img 
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </Link>

                {/* 悬浮操作面板 - 玻璃拟物化设计 */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20 flex gap-2">
                  <button 
                    onClick={() => handleQuickAdd(product)}
                    className="flex-1 bg-brand-black text-brand-white py-3 text-[10px] uppercase tracking-widest font-medium flex items-center justify-center gap-2 hover:bg-brand-black/90 active:scale-95 transition-all"
                  >
                    <ShoppingBag className="w-3 h-3" /> Quick Add
                  </button>
                  <Link 
                    href={`/product/${product.id}`}
                    className="aspect-square bg-brand-white/90 backdrop-blur-md text-brand-black p-3 border border-brand-line hover:bg-brand-black hover:text-brand-white transition-all flex items-center justify-center"
                  >
                    <Eye className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* 文字信息区 */}
              <div className="text-center">
                <Link href={`/product/${product.id}`}>
                  <h3 className="text-[11px] tracking-[0.15em] text-brand-black uppercase font-medium hover:text-brand-black/60 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-[12px] text-brand-black/50 mt-1 font-light tracking-wide">
                  RM {product.price.toLocaleString()}
                </p>

                {/* 颜色选择器：带有微妙的环绕动效 */}
                <div className="flex justify-center space-x-2.5 mt-4">
                  {product.colors.map((color, index) => (
                    <motion.div 
                      key={index}
                      whileHover={{ scale: 1.3 }}
                      className="w-2.5 h-2.5 rounded-full border border-black/5 cursor-pointer shadow-inner"
                      style={{ backgroundColor: color }}
                    ></motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-24 text-center"
        >
          <Link 
            href="/shop"
            className="group relative inline-block text-[10px] uppercase tracking-[0.3em] text-brand-black pb-2 overflow-hidden"
          >
            View All Bags
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}